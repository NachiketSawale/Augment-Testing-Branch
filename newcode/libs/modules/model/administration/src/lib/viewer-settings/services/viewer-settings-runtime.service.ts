/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

/**
 * Provides information about viewer settings to be used at runtime of the 3D viewer.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationViewerSettingsRuntimeService {

	/**
	 * Returns the ID of the activated viewer settings profile.
	 *
	 * @returns The viewer settings profile ID.
	 */
	public getActiveProfileId(): number | undefined {
		// TODO: implement
		return undefined;
	}

	public markSettingsProfileAsActive(profileId?: number) {
		// TODO: implement
		/*
		const key = getStorageKey();
		const cfg = {
			profileId: _.isInteger(profileId) ? profileId : undefined
		};
		localStorage.setItem(key, JSON.stringify(cfg));*/
	}
}
