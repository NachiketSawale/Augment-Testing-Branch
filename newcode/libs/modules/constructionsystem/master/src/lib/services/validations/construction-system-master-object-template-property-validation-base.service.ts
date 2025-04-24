/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BaseValidationService, DataServiceBase, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemSharedPropertyKeyLookupService, CosObjectTemplatePropertyEntityBase, PropertyValueType } from '@libs/constructionsystem/shared';
import { ServiceLocator } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';

/**
 * Construction system master object template property validation base service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplatePropertyValidationBaseService<T extends CosObjectTemplatePropertyEntityBase> extends BaseValidationService<T> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private readonly dataService: DataServiceBase<T>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			MdlPropertyKeyFk: this.validateMdlPropertyKeyFk,
			Value: this.validateValue,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService as IEntityRuntimeDataRegistry<T>;
	}

	private resetValues(entity: T) {
		entity.PropertyValueLong = 0;
		entity.PropertyValueNumber = 0.0;
		entity.PropertyValueText = null;
		entity.PropertyValueDate = null;
		entity.PropertyValueBool = false;
	}

	private async validateMdlPropertyKeyFk(info: ValidationInfo<T>) {
		//		// todo-allen: wait for the modelMainPropertyDataService to be implemented.
		//var dataService = $injector.get('modelMainPropertyDataService');
		// var items = dataService.getList();
		//
		// // entity.idString = entity.ModelFk.toString()/* + '-' + entity.ObjectFk.toString()*/ + '-' + value + '-' + entity.Id.toString();
		// var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'MdlPropertyKeyFk', items, service, dataService);
		const propertyKeyLookupService = ServiceLocator.injector.get(ConstructionSystemSharedPropertyKeyLookupService);
		const item = await firstValueFrom(propertyKeyLookupService.getItemByKey({ id: (info.value as number) ?? 0 }));
		if (item) {
			info.entity.ValueType = item.ValueType;
			return this.validationUtils.createSuccessObject();
		} else {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } });
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateValue(info: ValidationInfo<T>) {
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
