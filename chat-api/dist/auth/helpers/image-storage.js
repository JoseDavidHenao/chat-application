"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.isFileExtensionSafe = exports.saveImageToStorage = void 0;
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const fs = require('fs');
const FileType = require('file-type');
const path = require("path");
const rxjs_1 = require("rxjs");
const validFileExtensions = ['png', 'jpg', 'jpeg'];
const validMimeTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg'
];
exports.saveImageToStorage = {
    storage: (0, multer_1.diskStorage)({
        destination: './images',
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname);
            const fileName = (0, uuid_1.v4)() + fileExtension;
            cb(null, fileName);
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = validMimeTypes;
        allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    },
};
const isFileExtensionSafe = (fullFilePath) => {
    return (0, rxjs_1.from)(FileType.fromFile(fullFilePath)).pipe((0, rxjs_1.switchMap)((fileExtensionAndMimeType) => {
        if (!fileExtensionAndMimeType)
            return (0, rxjs_1.of)(false);
        const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext);
        const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime);
        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
        return (0, rxjs_1.of)(isFileLegit);
    }));
};
exports.isFileExtensionSafe = isFileExtensionSafe;
const removeFile = (fullFilePath) => {
    try {
        fs.unlinkSync(fullFilePath);
    }
    catch (err) {
        console.error(err);
    }
};
exports.removeFile = removeFile;
//# sourceMappingURL=image-storage.js.map