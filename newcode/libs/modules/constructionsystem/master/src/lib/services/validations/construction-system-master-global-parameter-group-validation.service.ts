/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ConstructionSystemMasterGlobalParameterGroupDataService } from '../construction-system-master-global-parameter-group-data.service';
import { ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';

/**
 * Global Parameter Group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterGroupValidationService extends BaseValidationService<ICosGlobalParamGroupEntity> {
	private readonly dataService = inject(ConstructionSystemMasterGlobalParameterGroupDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosGlobalParamGroupEntity> {
		return {
			Code: this.validateCode,
			IsDefault: this.validateIsDefault,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosGlobalParamGroupEntity> {
		return this.dataService;
	}

	public validateCode(info: ValidationInfo<ICosGlobalParamGroupEntity>) {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}

	private async validateIsDefault(info: ValidationInfo<ICosGlobalParamGroupEntity>) {
		const result = new ValidationResult();
		if (info.entity.Version === 0) {
			return result;
		}

		const flatList = this.dataService.flatList();
		const otherDefaultItems = [];
		for (const item of flatList) {
			if (item.IsDefault && item.Id !== info.entity.Id) {
				otherDefaultItems.push(item);
			}
		}

		if (info.value) {
			for (const item of otherDefaultItems) {
				item.IsDefault = false;
				this.dataService.entitiesUpdated(item);
			}
			info.entity.IsDefault = info.value as boolean;
			const groupChildren = cloneDeep(info.entity.CosGlobalParamGroupChildren);
			const updatedEntity = await this.dataService.update(info.entity);
			if (groupChildren) {
				updatedEntity.HasChildren = true;
				updatedEntity.CosGlobalParamGroupChildren = groupChildren;
				this.dataService.entitiesUpdated(updatedEntity);
			}
		} else {
			if (otherDefaultItems.length === 0) {
				setTimeout(() => {
					info.entity.IsDefault = true;
					this.dataService.entitiesUpdated(info.entity);
				});
			}
		}
		this.dataService.clearModifications();
		return result;
	}
}
