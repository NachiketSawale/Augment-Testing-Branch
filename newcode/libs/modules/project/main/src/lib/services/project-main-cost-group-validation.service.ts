
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {  Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import {ProjectMainCostGroupDataService} from './project-main-cost-group-data.service';
import { ProjectMainCostGroupEntityGenerated } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainCostGroupValidationService extends BaseValidationService<ProjectMainCostGroupEntityGenerated> {

	public constructor(private projectMainCostGroupDataService: ProjectMainCostGroupDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ProjectMainCostGroupEntityGenerated> {
		return {
			Code: [this.validateIsMandatory, this.validateIsUnique]
		};
	}


	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ProjectMainCostGroupEntityGenerated>): ProjectMainCostGroupEntityGenerated[] => {
		const itemList = this.projectMainCostGroupDataService.getList();
		return itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
	};

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ProjectMainCostGroupEntityGenerated> {
		return this.projectMainCostGroupDataService;
	}

}