/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ILogisticSundryServiceGroupEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServiceGroupDataService } from './logistic-sundry-service-group-data.service';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class LogisticSundryGroupValidationService extends BaseValidationService<ILogisticSundryServiceGroupEntity> {
	private groupDataService = inject(LogisticSundryServiceGroupDataService);

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ILogisticSundryServiceGroupEntity>): ILogisticSundryServiceGroupEntity[] => {
		const itemList = this.groupDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected generateValidationFunctions(): IValidationFunctions<ILogisticSundryServiceGroupEntity> {
		return {
			IsDefault: this.validateIsDefault
		};
	}

	private validateIsDefault(info: ValidationInfo<ILogisticSundryServiceGroupEntity>): ValidationResult {
		const result = new ValidationResult();
		const dataService = this.groupDataService;
		if(info.value){
			_.filter(dataService.getList(), (g) => g.IsDefault)
				.forEach(function (item){
					item.IsDefault = false;
					dataService.setModified(item);
				});
			this.groupDataService.setModified(info.entity);
			this.groupDataService.refreshAll().then();
			}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticSundryServiceGroupEntity> {
		return this.groupDataService;
	}

}