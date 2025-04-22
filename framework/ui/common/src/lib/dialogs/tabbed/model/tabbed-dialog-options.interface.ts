/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialog, IDialogOptions } from '../../base';
import { ITabbedDialogTabConfig } from './tabbed-dialog-tab-config.interface';
import { InjectionToken } from '@angular/core';

/**
 * Tabbed dialog options interface
 */
export interface ITabbedDialogOptions extends IDialogOptions<IDialog<void>>{
	/**
	 * Tab configurations
	 */
	tabs: ITabbedDialogTabConfig[];
}

const TABBED_DIALOG_OPTIONS = new InjectionToken<ITabbedDialogOptions>('tabbed-dialog-options');

/**
 * gets the tabbed dialog options injection token
 */
export function getTabbedDialogOptionsToken() : InjectionToken<ITabbedDialogOptions> {
	return TABBED_DIALOG_OPTIONS;
}

