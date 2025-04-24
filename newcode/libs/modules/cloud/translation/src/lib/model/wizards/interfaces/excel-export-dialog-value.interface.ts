/*
 * Copyright(c) RIB Software GmbH
 */

import { ICheckboxItem } from './checkbox-item.interface';
import { ICheckBoxCategories } from './checkbox-categories.interface';

/**
 * Interface representing the value of an Excel export dialog.
 */
export interface IExcelExportDialogValue {
    /**
     * Indicates whether the export button is active or not.
     */
    isButtonActive: boolean,

    /**
     * The default language for the export.
     */
    defaultLanguage: string;

    /**
     * The title for the selected languages section.
     */
    selectedLanguagesTitle: string;

    /**
     * The file name for the download file.
     */
    downloadFile: string;

    /**
     * The title for the checkbox section.
     */
    checkboxTitle: string;

    /**
     * Text displayed on success.
     */
    successText: string;

    /**
     * Text displayed on failure.
     */
    failedText: string;

    /**
     * Array of checkbox items.
     */
    checkboxItems: ICheckboxItem[];

    /**
     * Options for the checkboxes.
     */
    checkboxOptions: {
        isFlatDesign: boolean
    };

    /**
     * Indicates whether the export includes untranslated items.
     */
    isUntranslated: boolean;

    /**
     * The title for  untranslated items..
     */
    untranslatedTitle: string;

    /**
     * Indicates whether the export includes changed items.
     */
    isExportChanged: boolean;

    /**
     * The title for the new or changed section.
     */
    newOrChangedTitle: string;

    /**
     *  Indicates whether resource remarks are added to the export.
     */
    isResourceRemarkAdded: boolean;

    /**
     *  The title for ResourceRemark.
     */
    addResourceRemarkTitle: string;

    /**
     * Indicates whether the translation reamrk added
     */
    isTranslationRemarkAdded: boolean;

    /**
     *  The title for adding paths.
     */
    addPathTitle: string;

    /**
     * Indicates whether paths are added to the export.
     */
    isPathAdded: boolean;

    /**
     * The title for adding parameter information.
     */
    addParameterInfoTitle: string;

    /**
     * Indicates whether parameter information is added to the export.
     */
    isParameterInfoAdded: boolean;

    /**
     * The title for the Translation remark.
     */
    addTranslationRemarkTitle: string;

    /**
     * The title for exporting by category.
     */
    exportByCategoryTitle: string;

    /**
     * Array of checkbox categories.
     */
    checkBoxCategories: ICheckBoxCategories[];

    /**
     * Indicates whether categories are added to the export.
     */
    isCategoryAdded: boolean;

    /**
     * The title for adding categories.
     */
    addCategoryTitle: string;
}






