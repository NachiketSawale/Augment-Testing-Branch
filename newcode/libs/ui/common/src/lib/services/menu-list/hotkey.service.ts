/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IShortcuts } from '../../model/menu-list/interface/shortcut.interface';

/**
 * provides tooltip
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonHotkeyService {
	/**
	 * Collection of shortcuts for actions
	 */
	
	//TODO: refered as any as shortcuts are not registered currently.
	public shortcuts :IShortcuts= {};

	/**
	 * Method returns tooltip
	 * @param {string | undefined} callbackId  
	 * @returns {string |undefined}
	 */
	public getTooltip(callbackId: string | undefined): string | undefined {
		if (typeof this.shortcuts[callbackId as string] !== 'undefined') {
			return this.shortcuts[callbackId as string]['tooltip'];
		} else {
			return undefined;
		}
	}
}
