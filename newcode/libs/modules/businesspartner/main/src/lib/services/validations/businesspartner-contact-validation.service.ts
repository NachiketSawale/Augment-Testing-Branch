/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { IContactEntity, ISubsidiaryPhoneEntity } from '@libs/businesspartner/interfaces';
import { BasicsSharedDataValidationService, TelephoneEntity } from '@libs/basics/shared';
import { BusinesspartnerContactDataService } from '../businesspartner-contact-data.service';
import * as _ from 'lodash';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';


@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerContactValidationService extends BaseValidationService<IContactEntity> {

	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly dataService: BusinesspartnerContactDataService = inject(BusinesspartnerContactDataService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly http = inject(HttpClient);
	protected readonly businesspartnerSharedSubsidiaryLookupService=inject(BusinesspartnerSharedSubsidiaryLookupService);
	protected readonly configService = inject(PlatformConfigurationService);
	protected override generateValidationFunctions(): IValidationFunctions<IContactEntity> {
		return {
			TelephoneNumberDescriptor: this.genericValidateTelephone,
			TelephoneNumber2Descriptor:this.genericValidateTelephone,
			TeleFaxDescriptor:this.genericValidateTelephone,
			MobileDescriptor:this.genericValidateTelephone,
			PrivateTelephoneNumberDescriptor:this.genericValidateTelephone,
			SubsidiaryFk:this.validateSubsidiaryFk,
			CompanyFk:this.validateCompanyFk,
			IsDefault:this.validateIsDefault,
			IsDefaultBaselineL:this.validateIsDefaultBaseline
		};
	}
	// region validateTelephone
	private dictionaryTelephone:{[key:string]:string}={
		TelephoneNumberDescriptor:'TelephonePattern',
		TelephoneNumber2Descriptor: 'Telephone2Pattern',
		TeleFaxDescriptor: 'TelefaxPattern',
		MobileDescriptor: 'MobilePattern',
		PrivateTelephoneNumberDescriptor: 'TelephonePrivatPattern'
	};


	protected genericValidateTelephone(info: ValidationInfo<IContactEntity>): ValidationResult {
		this.updatePattern(info);
		return new ValidationResult();
	}
	private generatePhonePattern(phone: string) {
		return phone.replace(/\s/g, '').replace('(', '').replace(')', '').replace('-', '');
	}

	private updatePattern(info: ValidationInfo<IContactEntity>) {
		if (!info.entity) {
			return;
		}
		const telephoneEntity= info.value as unknown as TelephoneEntity;
		let nowTelephone='';
		 if (telephoneEntity?.Telephone) {
			 nowTelephone=this.generatePhonePattern(telephoneEntity.Telephone);
		 }else {
			 nowTelephone=this.generatePhonePattern('');
		 }
		 const nowPattern=this.dictionaryTelephone[info.field];
		 _.set(info.entity,nowPattern,nowTelephone);
	}
	// region only contact module not bp contact
	// endregion


	// region bp contact
	public validateCompanyFk(info: ValidationInfo<IContactEntity>): ValidationResult {
		const validationResult:ValidationResult = {apply: true, valid: true};
		if (!info.value||info.value === -1 || info.value === 0) {
			validationResult.valid = false;
			validationResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: info.field}).text;
		}
		return validationResult;
	}
	public applyValidationCompanyFk(item: IContactEntity): void {
		const info: ValidationInfo<IContactEntity> = new ValidationInfo<IContactEntity>(item, item.CompanyFk, 'CompanyFk');
		const result = this.validateCompanyFk(info);
		if (result.valid){
			this.validationUtils.applyValidationResult(this.dataService, {
				entity: info.entity,
				field: 'CompanyFk',
				result: result,
			});
		}

	}
	protected async validateSubsidiaryFk(info: ValidationInfo<IContactEntity>): Promise<ValidationResult> {
		const validationResult:ValidationResult = {apply: true, valid: true};
		if (info.entity&&info.entity.Version === 0) {
			const url='businesspartner/main/businesspartner/getphonebysubsidiary?id=' + info.value;
			const dataTelephone = await firstValueFrom(this.http.get<ISubsidiaryPhoneEntity>(this.configService.webApiBaseUrl + url));
			if(dataTelephone) {
				info.entity.TeleFaxDescriptor=dataTelephone.TeleFaxDescriptor;
				info.entity.TelephoneNumberDescriptor=dataTelephone.TelephoneNumberDescriptor;
			}
			const arraySubsidiary = await firstValueFrom(this.businesspartnerSharedSubsidiaryLookupService.getList());
			if (arraySubsidiary) {
				const dataSubsidiary=_.find(arraySubsidiary,e=>e.Id===info.value);
				if (dataSubsidiary) {
					info.entity.SubsidiaryDescriptor = dataSubsidiary;
				}
			}
		}
		return validationResult;
	}
	protected validateIsDefault (info: ValidationInfo<IContactEntity>): ValidationResult {
		const validationResult:ValidationResult = {apply: true, valid: true};
		if (info.value === true || info.value === 1) {
			const allContacts = this.dataService.getList();
			const foundItem = _.find(allContacts, e=>e.Id!==info.entity.Id&& info.entity.IsDefault);
			if (foundItem) {
				foundItem.IsDefault = false;
				this.dataService.setModified(foundItem);
			}
		}
		return validationResult;
	}
	protected validateIsDefaultBaseline (info: ValidationInfo<IContactEntity>): ValidationResult {
		const validationResult:ValidationResult = {apply: true, valid: true};
		if (info.value === true || info.value === 1) {
			const allContacts = this.dataService.getList();
			const foundItem = _.find(allContacts, e=>e.Id!==info.entity.Id&& info.entity.IsDefaultBaseline);
			if (foundItem) {
				foundItem.IsDefaultBaseline = false;
				this.dataService.setModified(foundItem);
			}
		}
		return validationResult;
	}
	// endregion
	// endregion
	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IContactEntity> {
		return this.dataService;
	}
}