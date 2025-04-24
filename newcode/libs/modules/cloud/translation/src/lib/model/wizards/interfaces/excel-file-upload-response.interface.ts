/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { IFileInfo } from './file-info.interface';
/**
* Interface representing a response from an upload operation.
*/
export interface IExcelFileUploadResponse {
    /**
     * Information about the uploaded file.
     */
    fileInfo: IFileInfo;

    /**
     * uuid.
     */
    uuid: Translatable ;

    /**
     * Execution time of the upload operation.
     */
    executionTime: Translatable ;
}