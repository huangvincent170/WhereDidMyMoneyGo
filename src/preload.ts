import { contextBridge, ipcRenderer } from "electron/renderer";
import { Source } from "./classes/source";

contextBridge.exposeInMainWorld('electronAPI', {
    onAppLoaded: (callback: Function) => ipcRenderer.on('appLoaded', (_event, value) => callback(value)),
    openSelectDirDialog: () => ipcRenderer.invoke('openSelectDirDialog'),
    readDataFromDir: (dirPath: string, readSingleFile: boolean, hasHeader: boolean,) => ipcRenderer.invoke('readDataFromDir', dirPath, readSingleFile, hasHeader),
    readDataFromSources: (sourceData: Source[]) => ipcRenderer.invoke('readDataFromSources', sourceData),
    readUserData: (filePath: string) => ipcRenderer.invoke('readUserData', filePath),
    writeUserData: (filePath: string, data: string) => ipcRenderer.invoke('writeUserData', filePath, data),
})