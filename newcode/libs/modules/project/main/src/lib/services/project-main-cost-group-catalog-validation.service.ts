
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {  Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import {ProjectMainCostGroupCatalogDataService} from './project-main-cost-group-catalog-data.service';
import { ProjectMainCostGroupCatalogEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainCostGroupCatalogValidationService extends BaseValidationService<ProjectMainCostGroupCatalogEntity> {

	public constructor(private projectMainCostGroupCatalogDataService: ProjectMainCostGroupCatalogDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ProjectMainCostGroupCatalogEntity> {
		return {
			Code: [this.validateIsMandatory, this.validateIsUnique]
		};
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ProjectMainCostGroupCatalogEntity>): ProjectMainCostGroupCatalogEntity[] => {
		const itemList = this.projectMainCostGroupCatalogDataService.getList();
		return itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
	};

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ProjectMainCostGroupCatalogEntity> {
		return this.projectMainCostGroupCatalogDataService;
	}

}