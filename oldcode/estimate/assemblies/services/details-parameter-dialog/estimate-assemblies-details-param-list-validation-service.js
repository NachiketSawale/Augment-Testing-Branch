/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesDetailsParamListValidationService
	 * @description provides validation methods for estimate details dialog parameter
	 */
	angular.module(moduleName).factory('estimateAssembliesDetailsParamListValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService','_','platformRuntimeDataService','PlatformMessenger',
			function ($http, $q, $injector, $translate, platformDataValidationService, _,platformRuntimeDataService,PlatformMessenger) {

				let service = {};

				angular.extend(service, {
					onCodeChange: new PlatformMessenger()
				});
				let valueTypes = $injector.get('estimateRuleParameterConstant');
				service.validateCode = function validateCode(entity, value, field,source) {

					let params =$injector.get('estimateAssembliesDetailsParamListDataService').getList();
					let count = 0;
					let isValid=false;
					let result;

					_.forEach(params, function(param) {
						if(param.Code === value && param.Id !== entity.Id) {count++;}
					});

					let model = $translate.instant('cloud.common.entityCode');
					if(value === '...' || count > 0 || value ===''){
						if(value === '...'){
							result = platformDataValidationService.createErrorObject('cloud.common.Error_RuleParameterCodeHasError', { object: model } );
						}else{
							result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', { object: model } );
						}
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = $injector.get('estimateAssembliesDetailsParamListDataService');
						isValid=true;
						service.onCodeChange.fire(isValid);
					}
					else{
						result = platformDataValidationService.createSuccessObject();
						isValid=false;
						if(source !== 'listLoad'){
							service.onCodeChange.fire(isValid);
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;
				};

				service.validateParameterValue = function validateParameterValue(entity, value, field) {

					if(field === 'ParameterText') {
						let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
						let paramValueList =estimateMainParameterValueLookupService.getList();
						return $injector.get('estimateRuleCommonService').validateParameterValue(service, entity, value,field, paramValueList);
					}

					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateValueDetail = function validateValueDetail(entity, value, field) {

					let detailsParamListDataService = $injector.get('estimateAssembliesDetailsParamListDataService');
					let paramslist = detailsParamListDataService.getList();
					let estimateRuleCommonService = $injector.get('estimateRuleCommonService');
					entity[field] = value;

					let isValid = false;
					entity.nonVallid = false;
					let isMapCulture = true;
					let result = platformDataValidationService.createSuccessObject();
					let parameterReference ={};
					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');

					let paramReference = {isLoop: false, linkReference: ''};
					estimateRuleCommonService.checkLoopReference(entity, detailsParamListDataService, paramReference);
					if (paramReference.isLoop) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
						};

						isValid = entity.nonVallid = true;
						service.onCodeChange.fire(isValid);
						platformRuntimeDataService.applyValidationResult(result, entity, field);
						return result;
					}

					if (entity.ValueType !== valueTypes.Text) {
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, paramslist, value);
					}

					if (!isMapCulture) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
						entity.nonVallid = true;
						isValid = true;
					}
					else {
						let isBoolean = estimateRuleCommonService.isBooleanType(value, detailsParamListDataService);
						if (isBoolean) {
							result = platformDataValidationService.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = detailsParamListDataService;
							isValid = true;
							entity.nonVallid = true;
						}
						else {
							result = platformDataValidationService.createSuccessObject();
							isValid = false;
						}
					}

					if (parameterReference.invalidParam) {
						result.error = parameterReference.error;
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = detailsParamListDataService;
						result.valid = false;
						isValid = true;
						entity.nonVallid = true;
					}


					if(!isValid) {
						let data = detailsParamListDataService.getList();
						let nonVallidData = _.filter(data, {'nonVallid': true});
						if (nonVallidData && nonVallidData.length) {
							isValid = true;
						}
					}
					service.onCodeChange.fire(isValid);
					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;
				};

				service.validateDefaultValue = function validateDefaultValue(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};


				service.asyncValidateValueDetail = function (entity, value, model) {
					let detailsParamListDataService = $injector.get('estimateAssembliesDetailsParamListDataService');
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, detailsParamListDataService);

					// if any valuedetail cannot pass under rule of 'service.validateValueDetail',then the ok button should be disabled
					asyncMarker.myPromise = $injector.get('estimateRuleCommonService').asyncParameterDetailValidation(entity, value, model, detailsParamListDataService, service).then(function(result){
						if(result.valid){
							let data = detailsParamListDataService.getList();
							let nonVallidData = _.filter(data, {'nonVallid': true});
							if (nonVallidData && nonVallidData.length) {
								service.onCodeChange.fire(true);
							}
						}
						return $q.when(result);
					});

					return asyncMarker.myPromise;
				};


				return service;
			}
		]);
})();
