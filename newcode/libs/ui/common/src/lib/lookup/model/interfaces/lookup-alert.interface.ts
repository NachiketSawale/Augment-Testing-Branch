/*
 * Copyright(c) RIB Software GmbH
 */

import {Translatable} from '@libs/platform/common';

/**
 * Lookup alert model used in lookup dialog
 */
export interface ILookupAlert {
    /**
     * Theme
     */
    theme: LookupAlertTheme;
    /**
     * Message
     */
    message: Translatable;
    /**
     * Title
     */
    title?: Translatable,
    /**
     * Style
     */
    cssClass?: string
}

/**
 * Lookup alert theme
 */
export enum LookupAlertTheme {
    Info = 'info',
    Error = 'error',
    Success = 'success',
    Warning = 'warning'
}

/**
 * Default lookup alert configuration
 */
export const lookupAlertDefaultConfig = {
    info: {title: {text: 'Note', key: 'basics.common.alert.info'}, cssClass: 'alert-info'},
    error: {title: {text: 'Error', key: 'basics.common.alert.danger'}, cssClass: 'alert-danger'},
    success: {title: {text: 'Success', key: 'basics.common.alert.success'}, cssClass: 'alert-success'},
    warning: {title: {text: 'Warning', key: 'basics.common.alert.warning'}, cssClass: 'alert-warning'}
};