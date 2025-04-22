/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupStorage, ILookupViewData } from '../model/interfaces/lookup-storage.interface';

@Injectable({
	providedIn: 'root',
})
export class LookupLocalStorageService implements ILookupStorage {
	public async getViewData(uuid: string): Promise<ILookupViewData | null> {
		const item = localStorage.getItem(uuid);
		return item ? JSON.parse(item) : null;
	}

	public async setViewData(uuid: string, data: ILookupViewData): Promise<void> {
		localStorage.setItem(uuid, JSON.stringify(data));
	}
}
