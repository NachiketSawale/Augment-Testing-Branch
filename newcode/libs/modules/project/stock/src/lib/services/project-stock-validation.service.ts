/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IProjectStockEntity } from '@libs/project/interfaces';
import { ProjectStockDataService } from './project-stock-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectStockValidationService extends BaseValidationService<IProjectStockEntity> {

	private projectStockDataService = inject(ProjectStockDataService);
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IProjectStockEntity>): IProjectStockEntity[] => {
		const itemList = this.projectStockDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected generateValidationFunctions(): IValidationFunctions<IProjectStockEntity> {
		return {
			Code: [this.validateIsMandatory, this.validateIsUnique]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectStockEntity> {
		return this.projectStockDataService;
	}

}