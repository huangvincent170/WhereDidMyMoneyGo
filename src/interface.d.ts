import { Dirent } from "original-fs";
import { Transaction } from "./classes/transaction";
import { Source } from "./classes/source";

export interface IElectronAPI {
    onAppLoaded: (callback: Function) => void,
    openSelectDirDialog: () => Promise<string>,
    readDataFromDir: (dirPath: string, readSingleFile: boolean, hasHeader: boolean,) => Promise<string[][]>,
    readDataFromSources: (sourceData: Source[]) => Promise<Transaction[]>,
    readUserData: (filePath: string) => Promise<string>,
    writeUserData: (filePath: string, data: string) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}