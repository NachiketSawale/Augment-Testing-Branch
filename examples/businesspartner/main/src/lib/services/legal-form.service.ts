/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedLegalFormLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { IBasicsCustomizeLegalFormEntity } from '@libs/basics/interfaces';
import { LegalFormEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class LegalFormService {

	public async getDefaultId(countryFk?: number | null, legalFormFk?: number | null) {
		if (!countryFk) {
			return Promise.resolve(legalFormFk);
		}
		let needGetDefaultLegalForm = true;
		let originalLegalForm: IBasicsCustomizeLegalFormEntity | null = null;
		if (legalFormFk) {
			const legalFormLookupService = ServiceLocator.injector.get(BasicsSharedLegalFormLookupService);
			originalLegalForm = await firstValueFrom(legalFormLookupService.getItemByKey({id: legalFormFk}));
			if (originalLegalForm && originalLegalForm.CountryFk === countryFk) {
				needGetDefaultLegalForm = false;
			}
		}
		if (needGetDefaultLegalForm) {
			const legalForm = await this.getDefaultAsync(countryFk);
			if (legalForm) {
				if (originalLegalForm) {
					legalForm.BasCountryFk = legalForm.BasCountryFk ?? null;
					if (originalLegalForm.CountryFk === legalForm.BasCountryFk) {
						return legalFormFk;
					}
				}
				return legalForm.Id;
			}
			return null;
		} else {
			return Promise.resolve(legalFormFk);
		}
	}

	private async getDefaultAsync(countryFk: number) {
		const http = ServiceLocator.injector.get(PlatformHttpService);
		return await http.get<LegalFormEntity>('businesspartner/main/legalform/getdefaultbycountryfk?countryfk=' + countryFk);
	}
}