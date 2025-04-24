/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ResourceTypeDataService } from '../data/resource-type-data.service';
import { IResourceTypeEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ResourceTypeValidationService extends BaseValidationService<IResourceTypeEntity>{

	private resourceTypeDataService = inject(ResourceTypeDataService);


	protected generateValidationFunctions(): IValidationFunctions<IResourceTypeEntity> {
		return {
			Code: [this.validateIsMandatory, this.validateIsUnique]
		};
	}
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IResourceTypeEntity>): IResourceTypeEntity[] => {
		const itemList = this.resourceTypeDataService.getList();
		return itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
	};

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceTypeEntity> {
		return this.resourceTypeDataService;
	}

}