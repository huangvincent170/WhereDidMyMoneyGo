import { contextBridge, ipcRenderer } from "electron/renderer";
import { Source } from "./classes/source";

contextBridge.exposeInMainWorld('electronAPI', {
    handleReadDataFromSources: (sourceData: Source[]) => ipcRenderer.invoke('handleReadDataFromSources', sourceData),
    // handleOpenDialogReadCsvs: () => ipcRenderer.invoke('handleOpenDialogReadCsvs'),
    // openDialogSelectDir: () => ipcRenderer.invoke('dialog:openDialogSelectDir'),
    // readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    // readDir: (path: string) => ipcRenderer.invoke('fs:readDir', path),
})