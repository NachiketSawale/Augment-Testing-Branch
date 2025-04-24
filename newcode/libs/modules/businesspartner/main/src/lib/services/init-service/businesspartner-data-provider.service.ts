/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BasicsCompanyLookupService, BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SupplierInitService {
	private readonly basicsSharedNumberGenerationService = inject(BasicsSharedNumberGenerationService);
	protected readonly configurationService = inject(PlatformConfigurationService);

	private readonly basicsCompanyLookupService = inject(BasicsCompanyLookupService);
	private subledgerContextFk?: number | null = null;

	public async init() {
		// rubric
		await this.basicsSharedNumberGenerationService.getNumberGenerateConfig('businesspartner/main/supplier/numberlist');
		// SubledgerContextFk
		const dataCompany = await this.getLoginCompanyData();
		if (dataCompany) {
			this.subledgerContextFk = dataCompany.SubledgerContextFk;
		} else {
			throw new Error('in supplier module company can not find!');
		}
	}

	public get currentSubledgerContextFk(): number | null | undefined {
		return this.subledgerContextFk;
	}

	private async getLoginCompanyData(): Promise<ICompanyEntity | null> {
		const loginCompanyId = this.configurationService.getContext().clientId;
		if (loginCompanyId) {
			const dataLoginCompany = await firstValueFrom(this.basicsCompanyLookupService.getItemByKey({ id: loginCompanyId }));
			return dataLoginCompany;
		}
		return null;
	}
}
