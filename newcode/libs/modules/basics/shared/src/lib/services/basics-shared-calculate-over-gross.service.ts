/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';

/**
 * Calculate over gross service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCalculateOverGrossService {
	private http = inject(PlatformHttpService);
	private configurationService = inject(PlatformConfigurationService);
	private _hasLoadedOrLoading: boolean = false;
	private _isOverGross: boolean = false;

	/**
	 * Get whether calculate over gross
	 */
	public get isOverGross(): boolean {
		return this._isOverGross;
	}

	/**
	 * Load IsCalculateOverGross of the login company
	 */
	//TODO update it after company logic ok
	public loadIsCalculateOverGross(): Promise<void>  {
		return new Promise((resolve, reject) => {
			if (this._hasLoadedOrLoading) {
				resolve();
			} else {
				this._hasLoadedOrLoading = true;
				this.http.get('basics/lookupdata/master/getitembykey?lookup=company&id=' + this.configurationService.clientId).then((response) => {
					const data = response as {
						Id: number,
						IsCalculateOverGross: boolean
					};
					this._isOverGross = data.IsCalculateOverGross;
					resolve();
				}, () => {
					this._hasLoadedOrLoading = false;
					reject();
				});
			}
		});
	}
}