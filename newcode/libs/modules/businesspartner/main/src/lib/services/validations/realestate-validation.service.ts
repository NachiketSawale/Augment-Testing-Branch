import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BusinessPartnerMainRealestateDataService } from '../realestate-data.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { IRealEstateEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class RealestateValidationService extends BaseValidationService<IRealEstateEntity> {
	private realestateDataService = inject(BusinessPartnerMainRealestateDataService);
	private translate = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IRealEstateEntity> {
		return {
			RealestateTypeFk: this.validateRealestateTypeFk,
			Potential: this.validatePotential,
			TelephoneNumber: this.validateTelephoneNumber,
			Address: this.validateAddress,
			SubsidiaryFk: this.validateSubsidiaryFk,
			TelephoneNumberTeleFax: this.validateTelephoneNumberTeleFax
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRealEstateEntity> {
		return this.realestateDataService;
	}

	protected validateRealestateTypeFk(info:ValidationInfo<IRealEstateEntity>):ValidationResult {
		return this.requiredValidator(info);
	}

	protected validatePotential(info:ValidationInfo<IRealEstateEntity>):ValidationResult {
		return this.requiredValidator(info);
	}

	protected validateTelephoneNumber(info:ValidationInfo<IRealEstateEntity>):ValidationResult {
		this.updatePattern(info);
		return new ValidationResult();
	}

	protected validateAddress():ValidationResult {
		return new ValidationResult();
	}

	protected validateSubsidiaryFk(info:ValidationInfo<IRealEstateEntity>):ValidationResult {
		if(info.entity){
			// TODO:lius
			// var subsidiaries = basicsLookupdataLookupDescriptorService.getData('Subsidiary') || {};
			// entity.SubsidiaryDescriptor = subsidiaries[value];
		}
		return new ValidationResult();
	}

	protected validateTelephoneNumberTeleFax(info:ValidationInfo<IRealEstateEntity>):ValidationResult {
		return this.validateTelephoneNumber(info);
	}

	private requiredValidator(info: ValidationInfo<IRealEstateEntity>) {
		const result = new ValidationResult();
		result.apply = true;
		if(_.isUndefined(info.value) || _.isNull(info.value) || info.value === -1 || _.isEmpty(info.value)) {
			result.valid = false;
			result.error = this.translate.instant({key : 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field }}).text;
		}
		return result;
	}

	private updatePattern(info:ValidationInfo<IRealEstateEntity>) {
		if(!info.entity){
			return;
		}
		if(info.field === 'TelephoneNumber') {
			const phone = !_.isNull(info.value) ? info.entity.TelephonePattern : '';
			if(info.entity.TelephonePattern){
				info.entity.TelephonePattern = this.generatePhonePattern(phone);
			}
		}
		if(info.field === 'TelephoneNumberTeleFax'){
			const telefax = !_.isNull(info.value) ? info.entity.TelefaxPattern : '';
			if(info.entity.TelefaxPattern){
				info.entity.TelefaxPattern = this.generatePhonePattern(telefax);
			}
		}
	}

	public generatePhonePattern(phone: string | undefined | null):string {
		if(_.isUndefined(phone) || _.isNull(phone)){
			return '';
		}
		return phone.replace(/\s/g, '').replace('(', '').replace(')', '').replace('-', '');
	}

}