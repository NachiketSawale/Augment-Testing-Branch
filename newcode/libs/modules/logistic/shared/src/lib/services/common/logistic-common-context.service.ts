/*
 * Copyright(c) RIB Software GmbH
 */

import { ContextService, PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LogisticCommonContextService {
	private company? : ICompanyEntity;

	public constructor(context: ContextService,
	                   http: HttpClient,
	                   configuration: PlatformConfigurationService) {

		const companyId = context.getContext().clientId;
		lastValueFrom(http.get<ICompanyEntity>(configuration.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId))
			.then((data) => {
				this.company = data;
			});
	}

	public getCompany(): ICompanyEntity | null{
		return this.company ?? null;
	}

	public getLogisticContextFk(): number | null {
		if(this.company){
			return this.company.LogisticContextFk ?? null;
		}
		return null;
	}

}