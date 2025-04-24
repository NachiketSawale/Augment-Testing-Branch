/*
 * Copyright(c) RIB Software GmbH
 */

import { ICheckboxItem } from './checkbox-item.interface';

/**
 * Interface representing information about a file.
 */
export interface IFileInfo {
    /**
     * Indicates whether the file upload was successful.
     */
    success: boolean;

    /**
     * resourceCount.
     */
    resourceCount: string;

    /**
     * Array of static column names.
     */
    staticColumns: string[];

    /**
     * Array of languages associated with the file.
     */
    languages: ICheckboxItem[];
}