/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { LogisticSundryServiceGroupAccountDataService } from './logistic-sundry-service-group-account-data.service';
import { ILogisticSundryServiceGroupAccountEntity } from '@libs/logistic/interfaces';


@Injectable({
	providedIn: 'root'
})
export class LogisticSundryGroupAccountValidationService extends BaseValidationService<ILogisticSundryServiceGroupAccountEntity> {
	private  accountDataService = inject(LogisticSundryServiceGroupAccountDataService);

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ILogisticSundryServiceGroupAccountEntity>): ILogisticSundryServiceGroupAccountEntity[] => {
		const itemList = this.accountDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected generateValidationFunctions(): IValidationFunctions<ILogisticSundryServiceGroupAccountEntity> {
		return {
			LedgerContextFk: this.validateAdditionalLedgerContextFk
		};
	}

	private validateAdditionalLedgerContextFk(info: ValidationInfo<ILogisticSundryServiceGroupAccountEntity>): ValidationResult {
		const result = new ValidationResult();
		if(info.entity.LedgerContextFk !== info.value){
			info.entity.Account01Fk = undefined;
			info.entity.Account02Fk = undefined;
			info.entity.Account03Fk = undefined;
			info.entity.Account04Fk = undefined;
			info.entity.Account05Fk = undefined;
			info.entity.Account06Fk = undefined;
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticSundryServiceGroupAccountEntity> {
		return this.accountDataService;
	}

}