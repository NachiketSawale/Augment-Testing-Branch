/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IBasicsClerkAbsenceProxyEntity } from '@libs/basics/interfaces';
import { BasicsClerkAbsenceProxyDataService } from './basics-clerk-absence-proxy-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsClerkAbsenceProxyValidationService extends BaseValidationService<IBasicsClerkAbsenceProxyEntity>{
	private dataService = inject(BasicsClerkAbsenceProxyDataService);

	protected generateValidationFunctions(): IValidationFunctions<IBasicsClerkAbsenceProxyEntity> {
		return {
			ClerkFk: this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsClerkAbsenceProxyEntity> {
		return this.dataService;
	}
}