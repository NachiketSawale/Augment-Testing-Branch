import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IEngDrawingComponentEntityGenerated } from '@libs/productionplanning/shared';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { HttpClient } from '@angular/common/http';
import { PpsItemProductTemplateComponentDataService } from './pps-item-product-template-component-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateComponentValidationService extends BaseValidationService<IEngDrawingComponentEntityGenerated> {

	private translateService = inject(PlatformTranslateService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private configurationService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);
	private productTemplateComponentDateService = PpsItemProductTemplateComponentDataService.getInstance('a6293dfb6d944ae3a2c5a7ff3c55ed07');

	protected generateValidationFunctions(): IValidationFunctions<IEngDrawingComponentEntityGenerated> {
		return {
			EngDrwCompStatusFk: this.validateEngDrwCompStatusFk,
			EngDrwCompTypeFk: this.validateEngDrwCompTypeFk,
			BasUomFk: this.validateBasUomFk,
			Quantity: this.validateQuantity,
			MdcMaterialCostCodeFk: this.validateMdcMaterialCostCodeFk
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEngDrawingComponentEntityGenerated> {
		return this.productTemplateComponentDateService!;
	}

	private validateEngDrwCompStatusFk(info: ValidationInfo<IEngDrawingComponentEntityGenerated>): ValidationResult {
		const entity = info.entity;
		const value = info.value as string;
		if (entity.EngDrwCompStatusFk === 0 && value === null) {
			return this.validationUtils.createSuccessObject();
		}
		return this.validationUtils.isMandatory(info);
	}

	private validateEngDrwCompTypeFk(info: ValidationInfo<IEngDrawingComponentEntityGenerated>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		if (entity.EngDrwCompTypeFk === 0 && value === null) {
			return this.validationUtils.createSuccessObject();
		}
		return this.validationUtils.isMandatory(info);
	}

	private validateBasUomFk(info: ValidationInfo<IEngDrawingComponentEntityGenerated>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		if (entity.BasUomFk === 0 && value === null) {
			return this.validationUtils.createSuccessObject();
		}
		return this.validationUtils.isMandatory(info);
	}

	private validateQuantity(info: ValidationInfo<IEngDrawingComponentEntityGenerated>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		if (entity.Quantity === 0 && value === null) {
			return this.validationUtils.createSuccessObject();
		}
		return this.validationUtils.isMandatory(info);
	}

	private validateMdcMaterialCostCodeFk(info: ValidationInfo<IEngDrawingComponentEntityGenerated>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		let fieldName = '';
		if(entity.EngDrwCompTypeFk === 1 && (value === null || undefined)){
			fieldName = 'MdcMaterialFk';
		} else if(entity.EngDrwCompTypeFk === 2 && (value === null || undefined)){
			fieldName = 'CostCodeFk';
		}

		return fieldName === ''
			? this.validationUtils.createSuccessObject()
			: this.validationUtils.createErrorObject({
			key: 'cloud.common.emptyOrNullValueErrorMessage',
			params: {fieldName: fieldName ? this.translateService.instant(fieldName).text : info.field.toLowerCase()},
		});
	}

}