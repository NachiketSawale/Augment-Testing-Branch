/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ConstructionSystemMasterParameterGroupDataService } from '../construction-system-master-parameter-group-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICosParameterGroupEntity } from '@libs/constructionsystem/shared';

/**
 * Parameter Group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterGroupValidationService extends BaseValidationService<ICosParameterGroupEntity> {
	private readonly dataService = inject(ConstructionSystemMasterParameterGroupDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosParameterGroupEntity> {
		return {
			IsDefault: this.validateIsDefault,
			Sorting: this.validateSorting,
			DescriptionInfo: this.validateDescriptionInfo,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosParameterGroupEntity> {
		return this.dataService;
	}

	private async validateIsDefault(info: ValidationInfo<ICosParameterGroupEntity>) {
		const result = new ValidationResult();
		if (info.entity.Version === 0) {
			return result;
		}

		const list = this.dataService.getList();

		const otherDefaultItems = [];
		for (const item of list) {
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

	public validateSorting(info: ValidationInfo<ICosParameterGroupEntity>) {
		return this.validationUtils.isMandatory(info);
	}

	public validateDescriptionInfo(info: ValidationInfo<ICosParameterGroupEntity>) {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}
}
