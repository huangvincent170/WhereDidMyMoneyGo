import { contextBridge, ipcRenderer } from "electron/renderer";
import { Source } from "./classes/source";

contextBridge.exposeInMainWorld('electronAPI', {
    onAppLoaded: (callback: Function) => ipcRenderer.on('appLoaded', (_event, value) => callback(value)),
    readDataFromDir: (dirPath: string, readSingleFile: boolean, hasHeader: boolean,) => ipcRenderer.invoke('readDataFromDir', dirPath, readSingleFile, hasHeader),
    readDataFromSources: (sourceData: Source[]) => ipcRenderer.invoke('readDataFromSources', sourceData),
    openSelectDirDialog: () => ipcRenderer.invoke('openSelectDirDialog'),
    // handleOpenDialogReadCsvs: () => ipcRenderer.invoke('handleOpenDialogReadCsvs'),
    // openDialogSelectDir: () => ipcRenderer.invoke('dialog:openDialogSelectDir'),
    // readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    // readDir: (path: string) => ipcRenderer.invoke('fs:readDir', path),
})