/*
 * Copyright(c) RIB Software GmbH
 */


import Toolbar from 'quill/modules/toolbar';

/**
 * Used to stored custom toolbar item data to create custom item
 */
export interface ICustomToolbarItem<T> {
    /**
     * options 
     */
    options: T;

    /**
     * editor element format
     */
    editorFormatsEl: HTMLSpanElement;

    /**
     * id
     */
    id: string;

    /**
     * button element
     */
    editorButton?: HTMLButtonElement;

    /**
     * editor toolbar instance
     */
    toolbar?: Toolbar;

    /**
     * toolbar element 
     */
    toolbarEl?: HTMLElement;

    /**
     * dropdown element
     */
    dropDownEl?: HTMLSpanElement;

    /**
     * dropdown picker element
     */
    dropDownPickerEl?: Element | null;

    /**
     * dropdown picker label element
     */
    dropDownPickerLabelEl?: Element | null;
}