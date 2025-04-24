/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IProjectStockLocationEntity } from '@libs/project/interfaces';
import { ProjectStockLocationDataService } from './project-stock-location-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectStockLocationValidationService extends BaseValidationService<IProjectStockLocationEntity> {

	private projectStockLocationDataService = inject(ProjectStockLocationDataService);
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IProjectStockLocationEntity>): IProjectStockLocationEntity[] => {
		const itemList = this.projectStockLocationDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};


	protected generateValidationFunctions(): IValidationFunctions<IProjectStockLocationEntity> {
		return {
			Code: [this.validateIsMandatory, this.validateIsUnique]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectStockLocationEntity> {
		return this.projectStockLocationDataService;
	}

}