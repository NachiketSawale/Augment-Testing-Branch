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
import { PpsProductTemplateParameterDataService } from './pps-product-template-parameter-data.service';
import { IPpsParameterEntity } from '../model/models';
import { firstValueFrom } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateParamValidationService extends BaseValidationService<IPpsParameterEntity> {

	private translateService = inject(PlatformTranslateService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private configurationService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	public constructor(private productTemplateParamDateService: PpsProductTemplateParameterDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPpsParameterEntity> {
		return {
			PpsFormulaVersionFk: this.validatePpsFormulaVersionFk,
			BasDisplayDomainFk: this.validateBasDisplayDomainFk,
			VariableName: [this.validateVariableName, this.asyncValidateVariableName]
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsParameterEntity> {
		return this.productTemplateParamDateService;
	}

	private validatePpsFormulaVersionFk(info: ValidationInfo<IPpsParameterEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateBasDisplayDomainFk(info: ValidationInfo<IPpsParameterEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as string;
		if (entity.BasDisplayDomainFk === 0 && value === null) {
			return this.validationUtils.createSuccessObject();
		}
		return this.validationUtils.isMandatory(info);
	}

	private validateVariableName(info: ValidationInfo<IPpsParameterEntity>): ValidationResult {
		const itemList = this.productTemplateParamDateService.getList();
		return this.validationUtils.isUniqueAndMandatory(info, itemList);
	}

	private async asyncValidateVariableName(info: ValidationInfo<IPpsParameterEntity>): Promise<ValidationResult> {
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