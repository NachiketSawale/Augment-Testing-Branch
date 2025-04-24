/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemMasterParameterDataService } from '../construction-system-master-parameter-data.service';
import { ConstructionSystemMasterParameterValueDataService } from '../construction-system-master-parameter-value-data.service';
import { ConstructionSystemMasterValidationHelperService } from '../construction-system-master-validation-helper.service';
import { ICosParameterValueEntity } from '@libs/constructionsystem/shared';

/**
 * Construction system master parameter value validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterValueValidationService extends BaseValidationService<ICosParameterValueEntity> {
	private readonly dataService = inject(ConstructionSystemMasterParameterValueDataService);
	private readonly parentService = inject(ConstructionSystemMasterParameterDataService);
	private readonly validationHelperService = inject(ConstructionSystemMasterValidationHelperService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosParameterValueEntity> {
		return {
			IsDefault: this.validateIsDefault,
			Sorting: this.validateSorting,
			DescriptionInfo: this.validateDescriptionInfo,
			QuantityQuery: this.validateQuantityQuery,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosParameterValueEntity> {
		return this.dataService;
	}

	private handleDefaultItem(entity: ICosParameterValueEntity) {
		const entities = this.dataService.getList().filter((item) => item.Id !== entity.Id && item.IsDefault);
		entities.forEach((item) => {
			item.IsDefault = false;
			this.dataService.setModified(item);
		});
		this.dataService.entitiesUpdated(entities);
		// this.dataService.gridRefresh(); todo-allen
	}

	private validateIsDefault(info: ValidationInfo<ICosParameterValueEntity>) {
		this.handleDefaultItem(info.entity);
		this.dataService.setModified(info.entity);
		const currentItem = this.dataService.getSelectedEntity();
		if (currentItem && currentItem.Id !== info.entity.Id) {
			this.dataService.select(info.entity);
		}
		this.parentService.defaultValueChanged.next({ defaultValueEntity: info.entity, isDefault: info.value as boolean });

		return this.validationUtils.createSuccessObject();
	}

	private validateSorting(info: ValidationInfo<ICosParameterValueEntity>) {
		return this.validationHelperService.validateSorting(info);
	}

	private validateDescriptionInfo(info: ValidationInfo<ICosParameterValueEntity>) {
		return this.validationHelperService.validateDescriptionInfo(this.dataService, info, this.dataService.getList());
	}

	private validateQuantityQuery(info: ValidationInfo<ICosParameterValueEntity>) {
		return this.validationUtils.createSuccessObject();
	}
}
