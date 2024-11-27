import { Dirent } from "original-fs";
import { Transaction } from "./class/transaction";

export interface IElectronAPI {
    // openDialogSelectDir: () => Promise<string>,
    // readFile: (path: string) => Promise<string>,
    // readDir: (path: string) => Promise<Dirent[]>,
    handleOpenDialogReadCsvs: () => Promise<Transaction[]>
}
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}