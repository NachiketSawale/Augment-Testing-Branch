/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemSharedPropertyKeyLookupService, PropertyValueType, ICosInsObjectTemplatePropertyEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainObjectTemplatePropertyDataService } from '../construction-system-main-object-template-property-data.service';
import { ServiceLocator } from '@libs/platform/common';

/**
 * Construction system main object template property validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectTemplatePropertyValidationService extends BaseValidationService<ICosInsObjectTemplatePropertyEntity> {
	private readonly dataService = inject(ConstructionSystemMainObjectTemplatePropertyDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosInsObjectTemplatePropertyEntity> {
		return {
			MdlPropertyKeyFk: this.validateMdlPropertyKeyFk,
			Value: this.validateValue,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosInsObjectTemplatePropertyEntity> {
		return this.dataService;
	}

	private resetValues(entity: ICosInsObjectTemplatePropertyEntity) {
		entity.PropertyValueLong = 0;
		entity.PropertyValueNumber = 0.0;
		entity.PropertyValueText = null;
		entity.PropertyValueDate = null;
		entity.PropertyValueBool = false;
	}

	private async validateMdlPropertyKeyFk(info: ValidationInfo<ICosInsObjectTemplatePropertyEntity>) {
		const propertyKeyLookup = ServiceLocator.injector.get(ConstructionSystemSharedPropertyKeyLookupService);
		const items = propertyKeyLookup.cache.getList();
		const item = items.find((e) => e.Id == (info.value as number));
		if (item) {
			info.entity.ValueType = item.ValueType;
		}

		return this.validationUtils.createSuccessObject();
	}

	private validateValue(info: ValidationInfo<ICosInsObjectTemplatePropertyEntity>) {
		this.resetValues(info.entity);
		switch (info.entity.ValueType) {
			case PropertyValueType.Text:
				info.entity.PropertyValueText = info.value as string;
				break;
			case PropertyValueType.Decimal:
				info.entity.PropertyValueNumber = info.value as number;
				break;
			case PropertyValueType.Long:
				info.entity.PropertyValueLong = info.value as number;
				break;
			case PropertyValueType.Boolean:
				info.entity.PropertyValueBool = info.value as boolean;
				break;
			case PropertyValueType.Date:
				info.entity.PropertyValueDate = info.value as Date;
				break;
		}
		return this.validationUtils.createSuccessObject();
	}
}
