/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParameterPrjParamValidationService
	 * @description provides validation methods for estimate parameter
	 */
	angular.module(moduleName).factory('estimateParameterPrjParamValidationService',
		['$http', '$q','$injector','$translate', 'platformDataValidationService','estimateParameterPrjParamService','platformRuntimeDataService', 'estimateMainCommonFeaturesService',
			function ($http, $q,$injector,$translate, platformDataValidationService,estimateParameterPrjParamService,platformRuntimeDataService, estimateMainCommonFeaturesService) {

				let service = {};
				let estimateRuleCommonService =$injector.get('estimateRuleCommonService');
				let valueTypes = $injector.get('estimateRuleParameterConstant');
				let estimateMainCommonCalculationService = $injector.get('estimateMainCommonCalculationService');

				service.validateCode = function validateCode(entity, value,field){
					let res = {};
					res.valid = true;

					if(value && value!==''){
						let matchReg=/^[a-zA-Z_]+([a-zA-Z0-9_]{0,14})?$/g;
						if(!matchReg.test(value)){
							res.valid = false;
							res.apply = true;
							res.error ='The parameter code only support letters,numeric digits or symbol "_". It should start with letter or symbol "_".';
							res.error$tr$ = 'estimate.parameter.errorCode';
						}else{
							if(value){
								value = value.toUpperCase();
							}

							$http.post(globals.webApiBaseUrl + 'basics/customize/estparameter/list').then(function (response) {
								let list = response.data;

								if(list){
									let item = _.filter(list,function (x){
										return x.Code === value;
									});

									if(!!item && item.length > 0){
										entity.EstParameterGroupFk = item[0].ParametergroupFk;
										entity.ParameterValue = item[0].DefaultValue;
										entity.ValueDetail = item[0].DefaultValue;
										entity.UoMFk = item[0].UomFk;
										entity.DescriptionInfo = item[0].DescriptionInfo;
										entity.DefaultValue = item[0].DefaultValue;
										entity.IsLookup = item[0].Islookup;
										if(item[0].ParamvaluetypeFk===1){
											entity.ValueType  = $injector.get('estimateRuleParameterConstant').Decimal2;

										}else if(item[0].ParamvaluetypeFk=== 2){
											entity.ValueType  = $injector.get('estimateRuleParameterConstant').Boolean;

										}else if(item[0].ParamvaluetypeFk=== 3){
											entity.ValueType  = $injector.get('estimateRuleParameterConstant').Text;
											entity.ValueDetail  = entity.ParameterText =entity.ValueText = item[0].ValueText;

										}else if(item[0].ParamvaluetypeFk=== 4){
											entity.ValueType  = $injector.get('estimateRuleParameterConstant').TextFormula;

										}else{
											entity.ValueType  = $injector.get('estimateRuleParameterConstant').Decimal2;
										}
									}

								}
								estimateMainCommonFeaturesService.fieldChanged(field,entity);
								estimateParameterPrjParamService.gridRefresh();
							});

							res= platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, estimateParameterPrjParamService.getList(), service, estimateParameterPrjParamService);
						}
					}else{
						res= platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, estimateParameterPrjParamService.getList(), service, estimateParameterPrjParamService);
					}

					return platformDataValidationService.finishValidation(res, entity, value, field, service, estimateParameterPrjParamService);
				};

				service.validateParameterValue = function validateParameterValue(entity, value, field) {

					if(field === 'ParameterText') {
						let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
						let paramValueList =estimateMainParameterValueLookupService.getList();
						return estimateRuleCommonService.validateParameterValue(service, entity, value,field, paramValueList);
					}else{
						let res = estimateMainCommonCalculationService.mapCultureValidation(entity, value, entity.ValueDetail, service, estimateParameterPrjParamService);
						if(res && res.valid) {
							platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
							$injector.get('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, estimateParameterPrjParamService);
						}
						return res;
					}
				};

				service.validateValueDetail = function validateValueDetail(entity, value, field) {

					entity[field] = value;
					let isMapCulture = true;
					let paramReference = {isLoop: false, linkReference: ''};
					let result={apply: true,valid: true};
					estimateRuleCommonService.checkLoopReference(entity, estimateParameterPrjParamService, paramReference);
					if (paramReference.isLoop) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
						};

						platformRuntimeDataService.applyValidationResult(result, entity, field);
						return result;
					}

					let parameterReference ={};
					if( entity.ValueType !== valueTypes.Text  ){
						isMapCulture = estimateMainCommonCalculationService.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, estimateParameterPrjParamService.getList(), value);
					}
					if (!isMapCulture) {
						return estimateMainCommonCalculationService.mapCultureValidation(entity, value, field, service, estimateParameterPrjParamService);
					}else{
						if (parameterReference.invalidParam) {
							result.error = parameterReference.error;
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = estimateParameterPrjParamService;
							result.valid = false;
							entity.nonVallid = true;
						}
						return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateParameterPrjParamService);
					}

				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateParameterPrjParamService);

					asyncMarker.myPromise =estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, estimateParameterPrjParamService, service);

					return asyncMarker.myPromise;
				};

				service.validateDefaultValue = function validateDefaultValue(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateParameterValue = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						let error = entity.__rt$data.errors.ValueDetail;
						if(error){
							removeFieldError(entity, 'ValueDetail');
						}
					}
				};

				service.validateValueType = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						let error = entity.__rt$data.errors.ValueDetail;
						if(error){
							entity.ValueDetail = '';
							removeFieldError(entity, 'ValueDetail');
						}
					}
				};

				service.validateIsLookup = function (entity, value) {
					if(value){
						if (entity.__rt$data && entity.__rt$data.errors) {
							let error = entity.__rt$data.errors.ValueDetail;
							if(error){
								entity.ValueDetail = '';
								removeFieldError(entity, 'ValueDetail');
							}
						}
					}
				};

				function removeFieldError(entity, field){
					platformRuntimeDataService.applyValidationResult({valid:true}, entity, field);
					platformDataValidationService.finishValidation({valid:true}, entity, '', field, service, estimateParameterPrjParamService);
				}

				return service;
			}
		]);
})();
