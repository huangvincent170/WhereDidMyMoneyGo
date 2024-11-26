import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld('electronAPI', {
    handleOpenDialogReadCsvs: () => ipcRenderer.invoke('handleOpenDialogReadCsvs'),
    // openDialogSelectDir: () => ipcRenderer.invoke('dialog:openDialogSelectDir'),
    // readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    // readDir: (path: string) => ipcRenderer.invoke('fs:readDir', path),
})