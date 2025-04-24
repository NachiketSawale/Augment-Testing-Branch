/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMainBillToEntity } from '@libs/project/interfaces';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ProjectMainBillToDataService } from './project-main-bill-to-data.service';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainBillToValidationService extends BaseValidationService<IProjectMainBillToEntity> {

	private projectMainBillToDataService = inject(ProjectMainBillToDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private readonly bpValidator = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.projectMainBillToDataService, // Required. Determine the data service relates to the validation service
		businessPartnerField: 'BusinessPartnerFk', // Optional. Determine the field name of BusinessPartnerFk of the entity modified if the name is not the same with BusinessPartnerFk.
		subsidiaryField: 'SubsidiaryFk', // Optional. Determine the field name of SubsidiaryFk of the entity modified if the name is not the same with SubsidiaryFk.
		customerField: 'CustomerFk', // Optional. Determine the field name of CustomerFk of the entity modified if the name is not the same with CustomerFk.
		needLoadDefaultSupplier: false, // Optional. Whether to load default Supplier or not. Default is true.
		needLoadDefaultCustomer: true,  // Optional. Whether to load default Customer or not. Default is false.
		customerSearchRequest: { // Optional. Search request for Customer. The request values are sent to server side for query. if needed, user can define their own special search cases. Properties additionalParameters and filterKey are provided.
			searchFields: [], searchText: '',
			// explain:The following functions are no longer available in angularjs
			// additionalParameters: <IAdditionalParameters<IProjectMainBillToEntity>> { // Optional. The default paramters are BusinessPartnerFk and SubsidiaryFk, if user want to change the request value of BusinessPartner or SubsidiaryFk, or add more parameters like SubledgerContextFk, user can provide additionalParameters as below:
			// 	SubledgerContextFk: function (entity) { // Key is the name of the parameter. Value is the function in which the value is returned.
			// 		return entity.SubledgerContextFk;
			// 	}
			// },
			filterKey: 'project-main-project-customer-filter' // Optional. the filterKey is the serverKey of the filter definition. Default is null.
		}
	});


	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IProjectMainBillToEntity>): IProjectMainBillToEntity[] => {
		const itemList = this.projectMainBillToDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};
	protected generateValidationFunctions(): IValidationFunctions<IProjectMainBillToEntity> {
		return {
			Code: this.validateCode,
			TotalPercentage: this.validateTotalPercentage,
			QuantityPortion: this.validateQuantityPortion,
		   BusinessPartnerFk: this.validateBusinessPartnerFk,
		};
	}

	private validateCode(info: ValidationInfo<IProjectMainBillToEntity>): ValidationResult {
		let result = this.validateIsMandatory(info);
		if(result.valid){
			result = this.validateIsUnique(info);
		}

		return result;
	}

	private async validateBusinessPartnerFk(info: ValidationInfo<IProjectMainBillToEntity>): Promise<ValidationResult> {
		info.entity.BusinessPartnerFk = -1;
		const response = await firstValueFrom(this.http.post<IProjectMainBillToEntity>(this.configService.webApiBaseUrl + 'project/main/billto/validate', info.entity));
		const result= new ValidationResult();
		if(response){
			info.entity.CustomerFk = response.CustomerFk;
		}
		await this.bpValidator.businessPartnerValidator({entity: info.entity, value: info.value as number, needAttach: false, notNeedLoadDefaultSubsidiary: false});
		return result;
	}

	private validateQuantityPortion(info:  ValidationInfo<IProjectMainBillToEntity>): ValidationResult {
		const result = new ValidationResult();
		const items = this.projectMainBillToDataService.getList();
		if (typeof info.value !== 'number') {
			result.apply = true;
			result.valid = false;
			// TODO: add an error message
			result.error = '';
			return result;
		}
		if(info.value && info.value > 100.0){

			result.apply = true;
			result.valid = false;
			result.error = 'logistic.dispatching.errSerialPlantRecordWrongQuantity';
		}else{
			let sumOfQuantityPortion = info.value;
			items.forEach(item => {
				if(item.Id !== info.entity.Id){
					sumOfQuantityPortion += item.QuantityPortion;
				}
			});
			items.forEach(item => {
				if(item.Id != info.entity.Id) {
					this.projectMainBillToDataService.setModified(item);
				}
			});
			if(sumOfQuantityPortion > 100.0) {
				//TODO: check the prop IsMarkedForTotalQuantityGreaterAsHundred?
				return result;
			}
		}

		items.forEach(item => {
			result.apply = true;
			result.valid = true;
			this.projectMainBillToDataService.setModified(item);
		});

		return result;
	}
	private validateTotalPercentage(info: ValidationInfo<IProjectMainBillToEntity>): ValidationResult {
		const result = new ValidationResult();
		if (typeof info.value !== 'number') {
			result.apply = true;
			result.valid = false;
			// TODO: add an error message
			result.error = '';
			return result;
		}
		if(info.value && info.value > 100.0){
			result.apply = true;
			result.valid = false;
			result.error = 'logistic.dispatching.errSerialPlantRecordWrongQuantity';
		}
		return result;
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainBillToEntity> {
		return this.projectMainBillToDataService;
	}

}