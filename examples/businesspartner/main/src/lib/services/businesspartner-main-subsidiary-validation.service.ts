import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map} from 'rxjs';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { ISubsidiaryEntity, IBusinessPartnerEntity, IValidateVatNoOrTaxNoHttpResponse } from '@libs/businesspartner/interfaces';
import { BusinessPartnerMainSubsidiaryDataService } from './subsidiary-data.service';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { isUndefined } from 'lodash';


@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerSubsidiaryValidationService extends BaseValidationService<ISubsidiaryEntity>{
	private dataService = inject(BusinessPartnerMainSubsidiaryDataService);
	private translate = inject(PlatformTranslateService);
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	protected generateValidationFunctions(): IValidationFunctions<ISubsidiaryEntity> {
		return {
			Email: this.validateEmail,
			Description: this.validate,
			Remark: this.validate,
			BedirektNo: this.validate,
			Innno: this.validate,
			UserDefined1: this.validate,
			UserDefined2: this.validate,
			UserDefined3: this.validate,
			UserDefined4: this.validate,
			VatNo: this.validateVatNo,
			TaxNo: this.validateTaxNo,
			AddressDto: this.validateDuplicateRecord,
			AddressTypeFk: this.validateDuplicateRecord,
			TelephoneNumber1Dto: this.validateDuplicateTelephone,
			TelephoneNumberTelefaxDto: this.validateDuplicateTelephone,
			IsMainAddress: this.validateIsMainAddress
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ISubsidiaryEntity> {
		return this.dataService;
	}

	private createSuccessObject(): ValidationResult {
		const result = new ValidationResult();
		result.apply = true;
		return result;
	}

	protected validate(info: ValidationInfo<ISubsidiaryEntity>) : ValidationResult{
		if(info.field === 'AddressDto' && !info.entity.IsMainAddress){
			this.validateVatNo(info);
			this.validateTaxNo(info);
		}
		return this.createSuccessObject();
	}

	protected validateDuplicateTelephone(info: ValidationInfo<ISubsidiaryEntity>) : ValidationResult{
		const checkData = {
			MainItemId: info.entity.BusinessPartnerFk,
			TelephoneDto: info.value,
			Pattern: (!_.isNull(info.value) && !_.isUndefined(info.value)) ? info.value : null,
			IsCheckDuplicate: true
		};
		if(!isUndefined(info.value) || info.value !== null || info.value === ''){
			return this.createSuccessObject();
		}
		const queryPath = this.configurationService.webApiBaseUrl + 'businesspartner/main/businesspartner/duplicatelistbytelephonenumber';
		this.http.post(queryPath, checkData).pipe(map((response)=>{
			const res = response as Array<IBusinessPartnerEntity>;
			if(_.isNull(res) || res.length === 0){
				// return this.createSuccessObject();
			}
			// show duplicate bps

		}));
		return this.createSuccessObject();
	}

	protected async validateDuplicateRecord(info: ValidationInfo<ISubsidiaryEntity>) : Promise<ValidationResult>{
		const tempEntity = _.cloneDeep(info.entity);
		if(tempEntity.AddressDto){
			const foundItem = _.find(this.dataService.getList(), (item)=>{
				return item.Id !== tempEntity.Id && item.Description === tempEntity.Description && item.AddressTypeFk === tempEntity.AddressTypeFk
					&& item.AddressDto?.Address === tempEntity.AddressDto?.Address;
			});
			if(foundItem){
				this.messageBoxService.showMsgBox(this.translate.instant({key: 'businesspartner.main.subsidiaryDuplicateWarning'}).text, this.translate.instant({key: 'businesspartner.main.subsidiaryDuplicateTitle'}).text, 'warning');
			}
		}else{
			const foundItem = _.find(this.dataService.getList(), (item)=>{
				return item.Id !== tempEntity.Id && item.Description === tempEntity.Description && item.AddressTypeFk === tempEntity.AddressTypeFk
					&& (_.isUndefined(item.AddressDto) || item.AddressDto === null);
			});
			if(foundItem){
				this.messageBoxService.showMsgBox(this.translate.instant({key: 'businesspartner.main.subsidiaryDuplicateWarning'}).text, this.translate.instant({key: 'businesspartner.main.subsidiaryDuplicateTitle'}).text, 'warning');
			}
		}
		return this.createSuccessObject();
	}

	protected async validateTaxNo(info: ValidationInfo<ISubsidiaryEntity>) : Promise<ValidationResult>{
		if(!info.entity.TaxNo || !info.entity.AddressDto || info.entity.AddressDto.CountryFk < 0){
			return this.createSuccessObject();
		}else{
			const checkData = {
				MainItemId: info.entity.Id,
				Value: info.value,
				IsFromBp: false,
				IsVatNoField: false,
				CountryFk: info.entity.AddressDto.CountryFk,
				IsEu: false
			};
			const result = new ValidationResult();
			result.apply = true;
			result.valid = false;
			const queryPath = this.configurationService.webApiBaseUrl + 'businesspartner/main/businesspartner/validatevatnoortaxno';
			this.http.post(queryPath, checkData).pipe(map((response)=>{
				const res = response as IValidateVatNoOrTaxNoHttpResponse;
				if(res){
					if(checkData.IsFromBp && res.checkRegex){
						if (res.duplicateBPs && res.duplicateBPs.length > 0 && !checkData.IsEu){
							// show duplicate bps
						}
						if(!res.checkRegex){
							result.error = res.validExample ? this.translate.instant({key: 'businesspartner.main.invalidTaxNoOrVatNoWithExample', params: {fieldName:info.field, example: res.validExample}}).text : this.translate.instant({key: 'businesspartner.main.invalidTaxNoOrVatNo'}, {fieldName: info.field}).text;
						}
					}
				}
			}));
			return result;
		}
	}

	protected async validateVatNo(info: ValidationInfo<ISubsidiaryEntity>) : Promise<ValidationResult>{
		if(!info.entity.VatNo || !info.entity.AddressDto || info.entity.AddressDto.CountryFk < 0){
			return this.createSuccessObject();
		}else{
			const checkData = {
				MainItemId: info.entity.Id,
				Value: info.value,
				IsFromBp: false,
				IsVatNoField: true,
				CountryFk: info.entity.AddressDto.CountryFk,
				IsEu: false
			};
			const result = new ValidationResult();
			result.apply = true;
			result.valid = false;
			const queryPath = this.configurationService.webApiBaseUrl + 'businesspartner/main/businesspartner/validatevatnoortaxno';
			this.http.post(queryPath, checkData).pipe(map((response)=>{
				const res = response as IValidateVatNoOrTaxNoHttpResponse;
				if(res){
					if(checkData.IsFromBp && res.checkRegex){
						if (res.duplicateBPs && res.duplicateBPs.length > 0 && !checkData.IsEu){
							// show duplicate bps
						}
						if(!res.checkRegex){
							result.error = res.validExample ? this.translate.instant({key: 'businesspartner.main.invalidTaxNoOrVatNoWithExample', params: {fieldName:info.field, example: res.validExample}}).text : this.translate.instant({key: 'businesspartner.main.invalidTaxNoOrVatNo'}, {fieldName: info.field}).text;
						}
					}
				}
			}));
			return result;
		}
	}

	protected validateIsMainAddress() : ValidationResult{
		return this.createSuccessObject();
	}

	protected validateEmail(info: ValidationInfo<ISubsidiaryEntity>) : ValidationResult{
		if(this.isEmailValid(info.entity.Email)){
			const result = new ValidationResult();
			result.apply = true;
			return result;
		}else {
			const translated = this.translate.instant({
				key: 'platform.errorMessage.email',
				params: {fieldName:info.field}
			});
			const result = new ValidationResult(translated.text);
			result.apply = true;
			return result;
		}
	}

	private isEmailValid(value:string|null|undefined) {
		const regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
		const regex2 = /@[\s\S]*@/;
		return _.isNil(value) || _.isEmpty(value) || regex1.test(value) && !regex2.test(value);
	}

}
