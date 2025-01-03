import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { Dirent, readdirSync, readFileSync } from 'original-fs';
import { Transaction } from './classes/transaction';
import { parse } from 'csv-parse/sync';
import { Source } from './classes/source';
import { CalendarDate } from 'calendar-date';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): BrowserWindow => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    mainWindow.removeMenu();
    mainWindow.maximize();
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.webContents.openDevTools();

    mainWindow.addListener('ready-to-show', () => {
        mainWindow.webContents.send('appLoaded');
    });

    return mainWindow;
};

async function handleOpenSelectDirDialog(): Promise<string> {
    const filePaths: string[] = await dialog.showOpenDialogSync({
        properties: [
            'openDirectory'
        ]
    })
    return filePaths != null && filePaths.length > 0 ? filePaths[0] : null;
}

async function handleReadDataFromDir(
    dirPath: string,
    readSingleFile: boolean,
    hasHeader: boolean,
): Promise<string[][]> {
    const dirEntries: Dirent[] = readdirSync(dirPath, {withFileTypes: true})
        .filter((dirEnt: Dirent) => dirEnt.isFile())
        .filter((dirEnt: Dirent, i: number) => !readSingleFile || i != 0);
    const fileData: string[] = dirEntries
        .map(dirEnt => readFileSync(`${dirEnt.parentPath}/${dirEnt.name}`, 'utf-8'));
    const records: string[][] = fileData
        .map(data => parse(data, {bom: true, relax_quotes: true, relax_column_count: true, skip_empty_lines: true}))
        .map(parsedData => parsedData.slice(hasHeader ? 1 : 0))
        .reduce((acc, val) => acc.concat(val), []);
    return records;
}

function handleReadDataFromSources(sources: Source[]): Transaction[] {
    if (sources == null) {
        return [];
    }

    let transactions: Transaction[] = [];
    for (var i = 0; i < sources.length; i++) {
        const source = sources[i];
        const dirEntries: Dirent[] = readdirSync(source.path, {withFileTypes: true})
            .filter((dirEnt: Dirent) => dirEnt.isFile());
        const fileData: string[] = dirEntries
            .map(dirEnt => readFileSync(`${dirEnt.parentPath}/${dirEnt.name}`, 'utf-8'));
        const records: string[][] = fileData
            .map(data => parse(data, {bom: true, relax_quotes: true, relax_column_count: true, skip_empty_lines: true}))
            .map(parsedData => parsedData.slice(source.hasHeader ? 1 : 0))
            .reduce((acc, val) => acc.concat(val), []);
        const sourceTransactions: Transaction[] = records.map(record => new Transaction(
            source.name,
            Number(source.isDebt ? -1 : 1) * Number(record[source.amountIdx]),
            CalendarDate.fromDateLocal(new Date(record[source.dateIdx])).toString(),
            record[source.descriptionIdx]
        ));
        transactions = transactions.concat(sourceTransactions);
    }
    transactions.sort((a: Transaction, b: Transaction) => a.date < b.date ? -1 : 1)
    return transactions;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    const mainWindow: BrowserWindow = createWindow();
    ipcMain.handle('readDataFromDir', (_event, dirPath: string, readSingleFile: boolean, hasHeader: boolean) => handleReadDataFromDir(dirPath, readSingleFile, hasHeader));
    ipcMain.handle('readDataFromSources', (_event, sources: Source[]) => handleReadDataFromSources(sources));
    ipcMain.handle('openSelectDirDialog', handleOpenSelectDirDialog)
    // ipcMain.handle('handleOpenDialogReadCsvs', handleOpenDialogReadCsvs);
    // ipcMain.handle('dialog:openDialogSelectDir', handleOpenDialogSelectDir);
    // ipcMain.handle('fs:readFile', (_event, path: string) => handleReadFile(path));
    // ipcMain.handle('fs:readDir', (_event, path: string) => handleReadDir(path));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
