/*
 * Copyright(c) RIB Software GmbH
 */


import { IDataLanguage } from '@libs/platform/common';


/**
 * Used to stored language dropdown options
 */
export interface ILanguageOptions {
    /**
     * current language list
     */
    current: IDataLanguage;

    /**
     * is editable
     */
    editable: boolean;

    /**
     * language list
     */
    list: IDataLanguage[];

    /**
     * on changed function
     * @param {number | null} languageId  language id
     */
    onChanged?: (languageId: number | null) => void;

    /**
     * is visible
     */
    visible: boolean;
}




