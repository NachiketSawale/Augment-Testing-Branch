/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { ESTIMATE_MAIN_RESOURCE_PROCESSOR_TOKEN } from '@libs/estimate/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ConstructionSystemMasterResourceDataService } from '../construction-system-master-resource-data.service';
import { ConstructionSystemMasterLineItemDataService } from '../construction-system-master-line-item-data.service';

/**
 * Construction system master resource validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterResourceValidationService extends BaseValidationService<IEstResourceEntity> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly dataService = inject(ConstructionSystemMasterResourceDataService);
	private readonly constructionSystemMasterLineItemDataService = inject(ConstructionSystemMasterLineItemDataService);

	protected generateValidationFunctions(): IValidationFunctions<IEstResourceEntity> {
		return {
			IsDisabled: this.validateIsDisabled,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstResourceEntity> {
		return this.dataService;
	}

	private async validateIsDisabled(info: ValidationInfo<IEstResourceEntity>) {
		const traverseResource = (resources: IEstResourceEntity[], disabled: boolean) => {
			resources.forEach((resource) => {
				const isDisabled = considerDisabledDirect ? (resource.IsDisabledDirect && resource.Id !== info.entity.Id ? resource.IsDisabled : disabled) : disabled;
				resource.IsDisabled = isDisabled;

				this.dataService.setModified(resource);

				if (resource.HasChildren) {
					traverseResource(resource.EstResources ?? [], isDisabled);
				}
			});
		};

		const considerDisabledDirect = this.constructionSystemMasterLineItemDataService.getConsiderDisabledDirect();
		info.entity.IsDisabledDirect = considerDisabledDirect ? (info.value as boolean) : false;
		traverseResource([info.entity], info.value as boolean);

		const resourceProcessorProvider = await this.lazyInjector.inject(ESTIMATE_MAIN_RESOURCE_PROCESSOR_TOKEN);
		resourceProcessorProvider.setDisabledChildrenReadOnly(this.dataService.getList());
		// constructionSystemMasterResourceDataService.gridRefresh(); // todo-allen gridRefresh
		return new ValidationResult();
	}
}
