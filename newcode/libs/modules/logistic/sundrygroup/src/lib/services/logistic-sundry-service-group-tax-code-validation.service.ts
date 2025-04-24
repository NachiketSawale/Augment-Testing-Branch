/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ILogisticSundryGroupTaxCodeEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServiceGroupTaxCodeDataService } from './logistic-sundry-service-group-tax-code-data.service';

@Injectable({
	providedIn: 'root'
})
export class LogisticSundryGroupTaxCodeValidationService extends BaseValidationService<ILogisticSundryGroupTaxCodeEntity> {
	private taxCodeDataService = inject(LogisticSundryServiceGroupTaxCodeDataService);

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ILogisticSundryGroupTaxCodeEntity>): ILogisticSundryGroupTaxCodeEntity[] => {
		const itemList = this.taxCodeDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected generateValidationFunctions(): IValidationFunctions<ILogisticSundryGroupTaxCodeEntity> {
		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticSundryGroupTaxCodeEntity> {
		return this.taxCodeDataService;
	}

}