/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ISaleEntity, ITenderResultEntity } from '@libs/project/interfaces';
import { PlatformConfigurationService, PlatformTranslateService, PropertyPath } from '@libs/platform/common';
import { ProjectMainTenderResultDataService } from './project-main-tender-result-data.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectMainDataService } from '@libs/project/shared';
import * as _ from 'lodash';
import { isNumber } from 'lodash';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainTenderResultValidationService extends BaseValidationService<ITenderResultEntity> {

	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	protected translateService = inject(PlatformTranslateService);
	private projectMainTenderResultDataService = inject(ProjectMainTenderResultDataService);
	private projectMainDataService = inject(ProjectMainDataService);

	protected generateValidationFunctions(): IValidationFunctions<ITenderResultEntity> {
		return {
			BusinessPartner: this.validateBusinessPartner,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SaleFk: this.asyncValidateSaleFk,
			Quotation: this.validateQuotation,
			GlobalPercentage: this.validateGlobalPercentage,
			Discount: this.validateDiscount,
			OtherDiscount: this.validateOtherDiscount
		};
	}

	private validateOneOfBusinessPartnerIsSet(info1: ValidationInfo<ITenderResultEntity>, info2: ValidationInfo<ITenderResultEntity>): ValidationResult{

		const result1 = this.validateIsMandatory(info1);
		const result2 = this.validateIsMandatory(info2);

		if(!result1.valid && !result2.valid){
			result1.valid = false;
			result1.error = this.translateService.instant('project.main.tenderResultBusinessPartnerMandatory').text;

			result2.valid = false;
			result2.error = this.translateService.instant('project.main.tenderResultBusinessPartnerMandatory').text;

			this.getEntityRuntimeData().addInvalid(info1.entity, { result: result1, field: info1.field as PropertyPath<ITenderResultEntity>});
			this.getEntityRuntimeData().addInvalid(info2.entity, { result: result2, field: info2.field as PropertyPath<ITenderResultEntity>});
			// TODO: Both fields should refresh and show error message
		}else {
			result1.valid = true;
			result1.apply = true;
			result1.error = '';

			this.getEntityRuntimeData().removeInvalid(info1.entity, { result: result1, field: info1.field });
			this.getEntityRuntimeData().removeInvalid(info2.entity, { result: result1, field: info2.field });
		}
		return result1;
	}

	private validateBusinessPartner(info: ValidationInfo<ITenderResultEntity>): ValidationResult{
		const info1 = info;
		const info2 = new ValidationInfo(info.entity, info.entity.BusinessPartnerFk ?? undefined, 'BusinessPartnerFk');
		return this.validateOneOfBusinessPartnerIsSet(info1, info2);
	}

	private validateBusinessPartnerFk(info: ValidationInfo<ITenderResultEntity>): ValidationResult{
		const info1 = info;
		const info2 = new ValidationInfo(info.entity, info.entity.BusinessPartner ?? undefined, 'BusinessPartner');
		return this.validateOneOfBusinessPartnerIsSet(info1, info2);
	}

	private async asyncValidateSaleFk(info: ValidationInfo<ITenderResultEntity>): Promise<ValidationResult>{
		const result= { valid: true, apply: true } as ValidationResult;
		if(info.entity && info.entity.ProjectFk){
			const url = this.config.webApiBaseUrl + 'project/main/sale/list?projectId=' + info.entity.ProjectFk;
			const response = await lastValueFrom(this.http.get(url)) as ISaleEntity[];

			if(response && response.length > 0){
				const saleEntity = _.find(response, (item) => {
					return info.value === item.Id;
				});
				info.entity.BasCurrencyFk = saleEntity?.BasCurrencyFk;
			}
		} else {
			info.entity.BasCurrencyFk = this.projectMainDataService.getSelectedEntity()?.CurrencyFk;
		}

		return result;
	}

	private calculateFinalQuotation(quotation: number, globalPerc: number, discount: number, otherDiscount: number) {
		return (quotation - (quotation * globalPerc / 100) - (quotation - (quotation * globalPerc / 100)) * discount / 100) - otherDiscount;
	}

	private validateQuotation(info: ValidationInfo<ITenderResultEntity>): ValidationResult{
		const result= { valid: true, apply: true } as ValidationResult;
		if(isNumber(info.value)){
			info.entity.FinalQuotation = this.calculateFinalQuotation(info.value, info.entity.GlobalPercentage, info.entity.Discount, info.entity.OtherDiscount);
		}
		return result;
	}

	private validateGlobalPercentage(info: ValidationInfo<ITenderResultEntity>): ValidationResult{
		const result= { valid: true, apply: true } as ValidationResult;
		if(isNumber(info.value)){
			info.entity.FinalQuotation = this.calculateFinalQuotation(info.entity.Quotation, info.value, info.entity.Discount, info.entity.OtherDiscount);
		}
		return result;
	}

	private validateDiscount(info: ValidationInfo<ITenderResultEntity>): ValidationResult{
		const result= { valid: true, apply: true } as ValidationResult;
		if(isNumber(info.value)){
			info.entity.FinalQuotation = this.calculateFinalQuotation(info.entity.Quotation, info.entity.GlobalPercentage, info.value, info.entity.OtherDiscount);
		}
		return result;
	}

	private validateOtherDiscount(info: ValidationInfo<ITenderResultEntity>): ValidationResult{
		const result= { valid: true, apply: true } as ValidationResult;
		if(isNumber(info.value)){
			info.entity.FinalQuotation = this.calculateFinalQuotation(info.entity.Quotation, info.entity.GlobalPercentage, info.entity.Discount, info.value);
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITenderResultEntity> {
		return this.projectMainTenderResultDataService;
	}
}