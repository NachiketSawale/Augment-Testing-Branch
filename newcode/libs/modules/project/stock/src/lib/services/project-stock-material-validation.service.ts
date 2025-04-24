/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo
} from '@libs/platform/data-access';
import { IProjectStock2MaterialEntity } from '@libs/project/interfaces';
import { ProjectStockMaterialDataService } from './project-stock-material-data.service';

/**
 * Project stock material validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectStockMaterialValidationService extends BaseValidationService<IProjectStock2MaterialEntity> {
	private projectStock2MaterialDataService = inject(ProjectStockMaterialDataService);

	protected generateValidationFunctions(): IValidationFunctions<IProjectStock2MaterialEntity> {
		return {
			MaterialFk: [this.validateIsMandatory, this.validateIsUnique]
		};
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IProjectStock2MaterialEntity>): IProjectStock2MaterialEntity[] => {
		const itemList = this.projectStock2MaterialDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectStock2MaterialEntity> {
		return this.projectStock2MaterialDataService;
	}
}