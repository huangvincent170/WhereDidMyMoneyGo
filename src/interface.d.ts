import { Dirent } from "original-fs";
import { Transaction } from "./classes/transaction";
import { Source } from "./classes/source";

export interface IElectronAPI {
    // openDialogSelectDir: () => Promise<string>,
    // readFile: (path: string) => Promise<string>,
    // readDir: (path: string) => Promise<Dirent[]>,
    // handleOpenDialogReadCsvs: () => Promise<Transaction[]>
    readDataFromSources: (sourceData: Source[]) => Promise<Transaction[]>,
    openSelectDirDialog: () => Promise<string>,
    onAppLoaded: (callback: Function) => void,
}
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}