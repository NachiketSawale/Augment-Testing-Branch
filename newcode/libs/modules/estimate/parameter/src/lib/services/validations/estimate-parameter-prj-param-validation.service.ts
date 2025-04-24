/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';

import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, Translatable } from '@libs/platform/common';
import { EstimateParameterPrjParamDataService } from '../estimate-parameter-prj-param-data.service';
import { IEstimateParameterPrjEntity } from '../../model/models';

/**
 * Estimate Parameter validation service
 */

@Injectable({
	providedIn: 'root'
})
export class EstimateParameterPrjParamValidationService extends BaseValidationService<IEstimateParameterPrjEntity> {
	private dataService = inject(EstimateParameterPrjParamDataService);
	private validationService = inject(BasicsSharedDataValidationService);
	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);

	// TODO
	// private estimateRuleCommonService = inject('estimateRuleCommonService');
	// private valueTypes = inject('estimateRuleParameterConstant');
	// private estimateMainCommonCalculationService = inject('estimateMainCommonCalculationService');

	protected generateValidationFunctions(): IValidationFunctions<IEstimateParameterPrjEntity> {
		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstimateParameterPrjEntity> {
		return this.dataService;
	}

	/**
	 * Validates Code
	 * @param entity
	 * @param value
	 * @param field
	 */
	public validateCode(entity: IEstimateParameterPrjEntity, value: string, field: string) {
		const validateResult: ValidationResult = { valid: true };

		if (value && value !== '') {
			const matchReg = /^[a-zA-Z_]+([a-zA-Z0-9_]{0,14})?$/g;

			if (!matchReg.test(value)) {
				validateResult.valid = false;
				validateResult.apply = true;
				validateResult.error = 'The parameter code only support letters,numeric digits or symbol "_". It should start with letter or symbol "_".';
			} else {
				if (value) {
					value = value.toUpperCase();
				}

				this.http.post(this.config.webApiBaseUrl + 'basics/customize/estparameter/list', {}).subscribe((res) => {
					const list = res as Array<IEstimateParameterPrjEntity>;

					if (list) {
						const item = list.filter((x: IEstimateParameterPrjEntity) => {
							return x.Code === value;
						});

						if (!!item && item.length > 0) {
							entity.EstParameterGroupFk = item[0].ParametergroupFk;
							entity.ParameterValue = item[0].DefaultValue;
							entity.ValueDetail = item[0].DefaultValue.toString();
							entity.UoMFk = item[0].UomFk;
							entity.DescriptionInfo = item[0].DescriptionInfo;
							entity.DefaultValue = item[0].DefaultValue;

							// TODO
							// if(item[0].ParamvaluetypeFk===1){
							//   entity.ValueType  = Inject('estimateRuleParameterConstant').Decimal2;

							// }else if(item[0].ParamvaluetypeFk=== 2){
							//   entity.ValueType  = Inject('estimateRuleParameterConstant').Boolean;

							// }else if(item[0].ParamvaluetypeFk=== 3){
							//   entity.ValueType  = Inject('estimateRuleParameterConstant').Text;
							//   entity.ValueDetail  = entity.ParameterText =entity.ValueText = item[0].ValueText;

							// }else if(item[0].ParamvaluetypeFk=== 4){
							//   entity.ValueType  = Inject('estimateRuleParameterConstant').TextFormula;

							// }else{
							//   entity.ValueType  = Inject('estimateRuleParameterConstant').Decimal2;
							// }
						}
					}
					// TOODO
					// estimateParameterPrjParamService.gridRefresh();
				});

				// validateResult = this.validationService.isUniqueAndMandatory({entity, value, field},this.dataService.getSelection(),validateResult);
			}
		} else {
			// validateResult = this.validationService.isUniqueAndMandatory({entity, value, field},this.dataService.getSelection(),validateResult);
		}
		// TODO
		// return platformDataValidationService.finishValidation(res, entity, value, field, service, estimateParameterPrjParamService);
	}

	/**
	 * Validates Parameter value field
	 * @param entity
	 * @param value
	 * @param field
	 */
	public validateParameterValue(entity: IEstimateParameterPrjEntity, value: string, field: string) {
		if (field === 'ParameterText') {
			// TODO
			//let estimateMainParameterValueLookupService = Inject('estimateMainParameterValueLookupService');
			//let paramValueList = estimateMainParameterValueLookupService.getList();
			// return estimateRuleCommonService.validateParameterValue(service, entity, value,field, paramValueList);
		} else {
			// let res = estimateMainCommonCalculationService.mapCultureValidation(entity, value, entity.ValueDetail, service, estimateParameterPrjParamService);
			// if(res && res.valid) {
			//   platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
			//   Inject('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, estimateParameterPrjParamService);
			// }
			// return res;
		}
	}

	/**
	 * Validates Value Detail field
	 * @param entity
	 * @param value
	 * @param field
	 */
	public validateValueDetail(entity: IEstimateParameterPrjEntity, value: string, field: string) {
		// TODO - Readonly fields can not be overwrite
		// entity[field as keyof IEstimateParameterPrjEntity] = value;
		// const isMapCulture = true;
		// const paramReference = { isLoop: false, linkReference: '' };
		// const result = { apply: true, valid: true };
		// TODO
		// estimateRuleCommonService.checkLoopReference(entity, estimateParameterPrjParamService, paramReference);
		// if (paramReference.isLoop) {
		//   result = {
		//     apply: true,
		//     valid: false,
		//     error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
		//   };

		//   platformRuntimeDataService.applyValidationResult(result, entity, field);
		//   return result;
		// }

		// const parameterReference = {};
		// TODO
		// if( entity.ValueType !== valueTypes.Text  ){
		//   isMapCulture = estimateMainCommonCalculationService.getIsMapCulture(value);
		//   parameterReference = estimateRuleCommonService.checkParameterReference(entity, estimateParameterPrjParamService.getList(), value);
		// }
		// if (!isMapCulture) {
		//   return estimateMainCommonCalculationService.mapCultureValidation(entity, value, field, service, estimateParameterPrjParamService);
		// } else {
		//   if (parameterReference.invalidParam) {
		//     result.error = parameterReference.error;
		//     result.entity = entity;
		//     result.value = value;
		//     result.model = field;
		//     result.valideSrv = service;
		//     result.dataSrv = estimateParameterPrjParamService;
		//     result.valid = false;
		//     entity.nonVallid = true;
		//   }
		//   return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateParameterPrjParamService);
		// }
	}

	/**
	 * Validates Validate Value Detail field
	 * @param entity
	 * @param value
	 * @param model
	 */
	public asyncValidateValueDetail(entity: IEstimateParameterPrjEntity, value: string, model: string) {
		// TODO
		// let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateParameterPrjParamService);
		// asyncMarker.myPromise =estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, estimateParameterPrjParamService, service);
		// return asyncMarker.myPromise;
	}

	/**
	 * Validates default value field
	 * @param entity
	 * @param value
	 * @param field
	 * @returns
	 */
	public validateDefaultValue(entity: IEstimateParameterPrjEntity, value: ValidationInfo<string>, field: Translatable) {
		return this.validationService.isMandatory(value, field);
	}

	/**
	 * Validates parameter value field
	 * @param entity
	 */
	// public validateParameterValue(entity:IEstimateParameterPrjEntity) {
	//   TODO
	//   if (entity.__rt$data && entity.__rt$data.errors) {
	//     let error = entity.__rt$data.errors.ValueDetail;
	//     if(error){
	//       removeFieldError(entity, 'ValueDetail');
	//     }
	//   }
	// }

	/**
	 * Validates value type field
	 * @param entity
	 */
	public validateValueType = function (entity: IEstimateParameterPrjEntity) {
		// TODO
		// if (entity.__rt$data && entity.__rt$data.errors) {
		//   let error = entity.__rt$data.errors.ValueDetail;
		//   if(error){
		//     entity.ValueDetail = '';
		//     removeFieldError(entity, 'ValueDetail');
		//   }
		// }
	};

	/**
	 * Validates islookup field
	 * @param entity
	 * @param value
	 */
	public validateIsLookup(entity: IEstimateParameterPrjEntity, value: number) {
		// TODO
		// if(value){
		//   if (entity.__rt$data && entity.__rt$data.errors) {
		//     let error = entity.__rt$data.errors.ValueDetail;
		//     if(error){
		//       entity.ValueDetail = '';
		//       removeFieldError(entity, 'ValueDetail');
		//     }
		//   }
		// }
	}

	/**
	 * Removes field error
	 * @param entity
	 * @param field
	 */
	private removeFieldError(entity: IEstimateParameterPrjEntity, field: string) {
		// TODO
		// platformRuntimeDataService.applyValidationResult({valid:true}, entity, field);
		// platformDataValidationService.finishValidation({valid:true}, entity, '', field, service, estimateParameterPrjParamService);
	}
}
