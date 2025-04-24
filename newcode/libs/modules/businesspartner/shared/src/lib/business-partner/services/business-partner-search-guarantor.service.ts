/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { IGuarantorEntity } from '@libs/businesspartner/interfaces';

/**
 * Business Partner Guarantor search Service
 */

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerSearchGuarantorService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * get Search
	 */
	public async search(bpId: number): Promise<IGuarantorEntity[]> {
		return await firstValueFrom(this.http.get<IGuarantorEntity[]>(this.configService + 'businesspartner/main/guarantor/list?mainItemId=' + bpId));
	}
}
