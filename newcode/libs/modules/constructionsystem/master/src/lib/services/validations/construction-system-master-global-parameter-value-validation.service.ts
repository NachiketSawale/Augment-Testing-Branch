/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ICosGlobalParamValueEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterValidationHelperService } from '../construction-system-master-validation-helper.service';
import { ConstructionSystemMasterGlobalParameterValueDataService } from '../construction-system-master-global-parameter-value-data.service';

/**
 * Construction system master global parameter value validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterValueValidationService extends BaseValidationService<ICosGlobalParamValueEntity> {
	private readonly dataService = inject(ConstructionSystemMasterGlobalParameterValueDataService);
	private readonly validationHelperService = inject(ConstructionSystemMasterValidationHelperService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosGlobalParamValueEntity> {
		return {
			IsDefault: this.validateIsDefault,
			Sorting: this.validateSorting,
			DescriptionInfo: this.validateDescriptionInfo,
			QuantityQuery: this.validateQuantityQuery,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosGlobalParamValueEntity> {
		return this.dataService;
	}

	private handleDefaultItem(entity: ICosGlobalParamValueEntity) {
		const entities = this.dataService.getList().filter((item) => item.Id !== entity.Id && item.IsDefault);
		entities.forEach((item) => {
			item.IsDefault = false;
			this.dataService.setModified(item);
		});
		// this.dataService.gridRefresh(); todo-allen
	}

	private validateIsDefault(info: ValidationInfo<ICosGlobalParamValueEntity>) {
		this.handleDefaultItem(info.entity);
		this.dataService.setModified(info.entity);
		const currentItem = this.dataService.getSelectedEntity();
		if (currentItem && currentItem.Id !== info.entity.Id) {
			this.dataService.select(info.entity).then();
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateSorting(info: ValidationInfo<ICosGlobalParamValueEntity>) {
		return this.validationHelperService.validateSorting(info);
	}

	private validateDescriptionInfo(info: ValidationInfo<ICosGlobalParamValueEntity>) {
		return this.validationHelperService.validateDescriptionInfo(this.dataService, info, this.dataService.getList());
	}

	private validateQuantityQuery(info: ValidationInfo<ICosGlobalParamValueEntity>) {
		return this.validationUtils.createSuccessObject();
	}
}
