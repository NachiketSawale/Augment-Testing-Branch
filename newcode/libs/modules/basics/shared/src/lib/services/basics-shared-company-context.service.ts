/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsCompanyLookupService} from '../lookup-services/company-lookup.service';
import {firstValueFrom} from 'rxjs';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCompanyContextService {

	private readonly companyLookup = inject(BasicsCompanyLookupService);
	private readonly configurationService = inject(PlatformConfigurationService);

	private _loginCompanyEntity?: ICompanyEntity;

	public get loginCompanyEntity() {
		if (this._loginCompanyEntity) {
			return this._loginCompanyEntity;
		}
		throw new Error('prepareLoginCompany should be called and finished before using it!');
	}

	/**
	 * Prepare login company before entering entity container
	 */
	public async prepareLoginCompany(reload?: boolean) {
		const loginCompanyId = this.configurationService.clientId!;

		if (reload) {
			this.clear();
		}

		if (!this._loginCompanyEntity || this._loginCompanyEntity.Id !== loginCompanyId) {
			this._loginCompanyEntity = await firstValueFrom(this.companyLookup.getItemByKey({
				id: loginCompanyId
			}));
		}
	}

	/**
	 * Clear login company cache if necessary
	 */
	public clear() {
		this._loginCompanyEntity = undefined;
	}
}