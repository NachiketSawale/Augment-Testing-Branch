/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * used to represent select dropdown options
 */
export interface ISelectOptions {
    id: number;
    displayName: string;
}


/**
 * Token for dropdown options 
 */
const SELECT_DROPDOWN_DIALOG_DATA_TOKEN = new InjectionToken('ddlg-dropdown-data');

/**
 * Function returns Token for select dropdown options.
 *
 * @returns {InjectionToken<ISelectOptions>} Token for select dropdown options.
 */
export function getSelectDropdownOptionsToken(): InjectionToken<ISelectOptions[]> {
    return SELECT_DROPDOWN_DIALOG_DATA_TOKEN;
}