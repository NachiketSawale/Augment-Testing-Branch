/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * Lookup view data interface
 */
export interface ILookupViewData {
	/**
	 * Popup
	 */
	popup: {
		/**
		 * width
		 */
		width: number;
		/**
		 * height
		 */
		height: number;
	}
}

/**
 * Lookup storage interface
 */
export interface ILookupStorage {
	/**
	 * Get view data by lookup uuid
	 * @param uuid
	 */
	getViewData(uuid: string): Promise<ILookupViewData | null>;

	/**
	 * Set view data by lookup uuid
	 * @param uuid
	 * @param data
	 */
	setViewData(uuid: string, data: ILookupViewData): Promise<void>;
}

/**
 * Lookup storage injection token
 */
export const LOOKUP_STORAGE_TOKEN = new InjectionToken<ILookupStorage>('LOOKUP_STORAGE_TOKEN');