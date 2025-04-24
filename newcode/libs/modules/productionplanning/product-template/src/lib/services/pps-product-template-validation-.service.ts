import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

import { PpsProductTemplateDataService } from './pps-product-template-data.service';
import { IPpsProductTemplateEntity } from '../model/entities/pps-product-template-entity.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateValidationService extends BaseValidationService<IPpsProductTemplateEntity> {

	private translateService = inject(PlatformTranslateService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private configurationService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	public constructor(private productTemplateDateService: PpsProductTemplateDataService) {
		super();
	}

	protected override generateValidationFunctions(): IValidationFunctions<IPpsProductTemplateEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			MaterialFk: this.validateMaterialFk
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsProductTemplateEntity> {
		return this.productTemplateDateService;
	}

	private validateCode(info: ValidationInfo<IPpsProductTemplateEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private async asyncValidateCode(info: ValidationInfo<IPpsProductTemplateEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as string;
		let isUnique = true;
		if (entity.EngDrawingFk) {
			entity.Code = value;
			const url = this.configurationService.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/isuniquecode?id=' + entity.Id + '&&parentid=' + entity.EngDrawingFk + '&&code=' + value;
			isUnique = await firstValueFrom(this.http.get(url)) as boolean;
		}
		return isUnique
			? this.validationUtils.createSuccessObject()
			: this.validationUtils.createErrorObject('productionplanning.producttemplate.errors.uniqProductDescriptionCode');
	}

	private validateMaterialFk(info: ValidationInfo<IPpsProductTemplateEntity>, invalidValues?: Array<number>): ValidationResult {
		const value = info.value as number;
		let invalidValueArray = [0];
		if (invalidValues) {
			invalidValueArray = invalidValues;
		}
		if (invalidValueArray.indexOf(value) > -1) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { fieldName: info.field.toLowerCase() }
			});
		}
		return this.validationUtils.createSuccessObject();
	}
}