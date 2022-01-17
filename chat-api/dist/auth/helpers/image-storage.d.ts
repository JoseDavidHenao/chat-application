/// <reference types="multer" />
import { Observable } from "rxjs";
export declare const saveImageToStorage: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: any, cb: any) => void;
};
export declare const isFileExtensionSafe: (fullFilePath: string) => Observable<boolean>;
export declare const removeFile: (fullFilePath: string) => void;
