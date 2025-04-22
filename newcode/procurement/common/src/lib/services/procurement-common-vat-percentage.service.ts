/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BasicsSharedTaxCodeLookupService, ITaxCodeEntity } from '@libs/basics/shared';

/**
 * Procurement common get vat percentage service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonVatPercentageService {
	private _taxCodes: ITaxCodeEntity[] = [];
	private _taxCodeMatrices: IMdcTaxCodeMatrixEntity[] = [];

	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly mdcTaxCodeService = inject(BasicsSharedTaxCodeLookupService);

	/**
	 * Get tax code and tax code matrix data
	 */
	public async getTaxCodeNMatrixData() {
		this._taxCodes = await firstValueFrom(this.mdcTaxCodeService.getList());
		this._taxCodeMatrices = await this.getTaxCodeMatrices();
	}

	private async getTaxCodeMatrices() {
		return firstValueFrom(this.http.get<IMdcTaxCodeMatrixEntity[]>(this.configService.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/gettaxcodematrixes'));
	}

	/**
	 * Get vat percent by taxCodeFk and vatGroupFk
	 * @param taxCodeFk
	 * @param vatGroupFk
	 */
	public getVatPercent(taxCodeFk?: number | null, vatGroupFk?: number): number {
		if (!taxCodeFk) {
			return 0;
		}

		if (taxCodeFk && vatGroupFk) {
			const matrix = this._taxCodeMatrices.find(e => (e.MdcTaxCodeFk === taxCodeFk && e.BpdVatgroupFk === vatGroupFk));
			if (matrix) {
				return matrix.VatPercent;
			}
		}

		const taxCode = this._taxCodes.find(e => e.Id === taxCodeFk);
		return taxCode?.VatPercent ?? 0;
	}
}