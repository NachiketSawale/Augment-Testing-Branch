/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonContextService {
	protected readonly http = inject(PlatformHttpService);
	private _isPortalUser: boolean = false;

	public get isPortalUser() {
		return this._isPortalUser;
	}

	/**
	 * Prepare context before entering entity container
	 */
	public async preparePrcCommonContext(reload?: boolean) {

		if (reload) {
			this.reset();
		}

		this._isPortalUser = await this.isUserAuthenticatedThroughPortal();
	}

	/**
	 * Clear procurement context cache if necessary
	 */
	public reset() {
		this._isPortalUser = false;
	}

	/**
	 * Check whether the user is authenticated by the portal.
	 */
	public async isUserAuthenticatedThroughPortal(){
		return await this.http.post<boolean>('procurement/common/common/isportaluser', { params: {} });
	}

}
