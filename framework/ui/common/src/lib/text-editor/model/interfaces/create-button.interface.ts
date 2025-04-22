/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import { ICreateButtonOptions } from './create-button-options.interface';
import { ICreateDropdownItemOptionInterface } from './create-dropdown-item-option.interface';
import { ICustomToolbarItem } from './custom-toolbar-item.interface';

/**
 * Used to stored data for creating custom button with button options
 */
export interface ICreateButton extends ICustomToolbarItem<ICreateButtonOptions> { }


/**
 * Used to stored data for creating custom dropdown button with dropdown options
 */
export interface IDropdownItem extends ICustomToolbarItem<ICreateDropdownItemOptionInterface> {
    onSelect: (lable: string, value: string, editor?: Quill) => void;
    setLabel: (label: string) => void;
}

