import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IGuarantorEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerMainGuarantorDataService } from '../guarantor-data.service';
import { PlatformTranslateService } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})
export class GuarantorValidationService extends BaseValidationService<IGuarantorEntity> {
	private guarantorDataService: BusinessPartnerMainGuarantorDataService = inject(BusinessPartnerMainGuarantorDataService);
	private translate = inject(PlatformTranslateService);

	protected override generateValidationFunctions(): IValidationFunctions<IGuarantorEntity> {
		return {
			BusinessPartnerFk: this.createRequireValidator,
			GuarantorTypeFk: this.createRequireValidator,
			CreditLine: this.createRequireAndPositiveValidator,
			GuaranteeFee: this.createRequireAndPositiveValidator,
			GuaranteeFeeMinimum: this.createRequireAndPositiveValidator,
			GuaranteePercent: this.createRequireAndPositiveValidator,
			RhythmFk: this.createRequireValidator,
			AmountMaximum: this.validateAmountMaximum,
			GuaranteeStartDate: this.validateGuaranteeStartDate,
			GuaranteeEndDate: this.validateGuaranteeStartDate,
			Validfrom: this.validateValidFrom,
			Validto: this.validateValidFrom
		};
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IGuarantorEntity> {
		return this.guarantorDataService;
	}

	protected createRequireAndPositiveValidator(info: ValidationInfo<IGuarantorEntity>): ValidationResult{
		const res = this.createRequireValidator(info);
		const result = new ValidationResult();
		result.apply = true;
		result.valid = true;
		if(res.valid){
			const value = info.value as number;
			if(value < 0){
				result.valid = false;
				result.error = this.translate.instant({key: 'businesspartner.main.entityGreaterThanZero', params:{ fieldName: info.field}}).text;
			}
		}
		return result;
	}

	protected createRequireValidator(info: ValidationInfo<IGuarantorEntity>): ValidationResult{
		const result = new ValidationResult();
		result.apply = true;
		result.valid = true;
		let isValid = false;
		switch (info.field) {
			case 'BusinessPartnerFk':
				isValid = _.isUndefined(info.value) || _.isNull(info.value) || info.value === -1;
				break;
			case  'CreditLine':
			case  'GuaranteeFee':
			case  'GuaranteeFeeMinimum':
			case  'GuaranteePercent':
				isValid = _.isUndefined(info.value) || _.isNull(info.value);
				break;
			default:
				isValid = _.isUndefined(info.value) || _.isNull(info.value) || info.value === 0 || _.isEmpty(info.value);
				break;
		}
		if(isValid){
			result.error = this.translate.instant({key: 'cloud.common.emptyOrNullValueErrorMessage', params:{fieldName: info.field }}).text;
		}
		return result;
	}

	protected validateAmountMaximum(info: ValidationInfo<IGuarantorEntity>): ValidationResult{
		const result = new ValidationResult();
		result.apply = true;
		result.valid = true;
		if(info.entity.AmountMaximum !== info.value){
			const value = info.value as number;
			const calledOff = info.entity.AmountCalledOff as number;
			if(value < calledOff){
				result.valid = false;
				result.error = this.translate.instant({key: 'businesspartner.main.entityAmountMaxLargeAmountCount'}).text;
			}
		}
		return result;
	}

	protected validateGuaranteeStartDate(info: ValidationInfo<IGuarantorEntity>): ValidationResult{
		const result = new ValidationResult();
		result.apply = true;
		result.valid = true;
		if(!_.isUndefined(info.value) || !_.isNull(info.value) || info.value !== 0 || !_.isEmpty(info.value)){
			const start = info.entity.GuaranteeStartDate as Date;
			const end = info.entity.GuaranteeEndDate as Date;
			const value = info.value as Date;
			if((info.field === 'GuaranteeStartDate' && value > end) || (info.field === 'GuaranteeEndDate' && value < start)){
				result.valid = false;
				result.error = this.translate.instant({key: 'businesspartner.main.entityGuaranteeStartDateLargeEndDate', params:{enddate: 'GuaranteeEndDate', startdate: 'GuaranteeStartDate'}}).text;
			}
		}
		return result;
	}

	protected validateValidFrom(info: ValidationInfo<IGuarantorEntity>): ValidationResult{
		const result = new ValidationResult();
		result.apply = true;
		result.valid = true;
		if(!_.isUndefined(info.value) || !_.isNull(info.value) || info.value !== 0 || !_.isEmpty(info.value)){
			const from = info.entity.Validfrom as Date;
			const to = info.entity.Validto as Date;
			const value = info.value as Date;
			if((info.field === 'Validto' && value < from) || (info.field === 'Validfrom' && value > to)){
				result.valid = false;
				result.error = this.translate.instant({key: 'businesspartner.main.entityGuaranteeValidFromLargeValidTo', params:{validto: 'ValidTo', validfrom: 'ValidFrom'}}).text;
			}
		}
		return result;
	}
}