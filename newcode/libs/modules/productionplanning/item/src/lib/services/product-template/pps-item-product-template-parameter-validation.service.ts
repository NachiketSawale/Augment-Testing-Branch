import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { IPpsParameterEntityGenerated } from '@libs/productionplanning/shared';
import { PpsItemProductTemplateParameterDataService } from './pps-item-product-template-parameter-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateParamValidationService extends BaseValidationService<IPpsParameterEntityGenerated> {

	private translateService = inject(PlatformTranslateService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private configurationService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	public constructor(private productTemplateParamDateService: PpsItemProductTemplateParameterDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPpsParameterEntityGenerated> {
		return {
			PpsFormulaVersionFk: this.validatePpsFormulaVersionFk,
			BasDisplayDomainFk: this.validateBasDisplayDomainFk,
			VariableName: [this.validateVariableName, this.asyncValidateVariableName]
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsParameterEntityGenerated> {
		return this.productTemplateParamDateService;
	}

	private validatePpsFormulaVersionFk(info: ValidationInfo<IPpsParameterEntityGenerated>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateBasDisplayDomainFk(info: ValidationInfo<IPpsParameterEntityGenerated>): ValidationResult {
		const entity = info.entity;
		const value = info.value as string;
		if (entity.BasDisplayDomainFk === 0 && value === null) {
			return this.validationUtils.createSuccessObject();
		}
		return this.validationUtils.isMandatory(info);
	}

	private validateVariableName(info: ValidationInfo<IPpsParameterEntityGenerated>): ValidationResult {
		const itemList = this.productTemplateParamDateService.getList();
		return this.validationUtils.isUniqueAndMandatory(info, itemList);
	}

	private async asyncValidateVariableName(info: ValidationInfo<IPpsParameterEntityGenerated>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as string;
		const postData = { FormulaVersionId: entity.Id, Name: value };
		const url = this.configurationService.webApiBaseUrl + 'productionplanning/formulaconfiguration/parameter/validatevariablename';
		const isUnique = await firstValueFrom(this.http.post(url, postData)) as boolean;

		return isUnique
			? this.validationUtils.createSuccessObject()
			: this.validationUtils.createErrorObject('productionplanning.common.errors.uniqName');

	}

}