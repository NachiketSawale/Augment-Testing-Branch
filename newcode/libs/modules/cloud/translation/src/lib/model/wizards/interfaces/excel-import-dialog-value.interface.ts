/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { ICheckboxOption } from './checkbox-option.interface';
import { ICheckboxItem } from './checkbox-item.interface';
import { IInfoListItem } from './info-list-item.interface';

/**
 * Interface representing the value of an Excel import dialog.
 */
export interface IExcelImportDialogValue {
    /**
     * Array of checkbox items.
     */
    checkboxItem?: ICheckboxItem[];

    /**
     * Title for the checkbox.
     */
    checkboxTitle?: Translatable ;

    /**
     * Options for checkbox design.
     */
    checkboxOptions?: ICheckboxOption;

    /**
     * infoList.
     */
    infoList?: IInfoListItem[];

    /**
     * Title for file information.
     */
    fileInfoTitle?: Translatable ;

    /**
     * Introduction text for the dialog.
     */
    introText?: Translatable ;

    /**
     * Message to display while loading.
     */
    spinnermsg?: Translatable ;

    /**
     * Selected file for import.
     */
    selectedFile?: File;

    /**
     * Indicates whether loading is in progress.
     */
    isLoading?: boolean;

    /**
     * Indicates whether language selection is enabled.
     */
    isLanguageSelection?: boolean;

    /**
     * Default language for import.
     */
    defaultLanguage?: Translatable ;

    /**
     * Title for reset changed.
     */
    resetChangedTitle?: Translatable;

    /**
     * Indicates whether changes should be reset.
     */
    isResetChanged?: boolean;

    /**
     * UUID for import.
     */
    uuidImport?: Translatable ;

    /**
     * Array of selected cultures.
     */
    selectedCultures?: Translatable [];

    /**
     * Indicates whether it's a preview operation.
     */
    isPreview?: boolean;
}







