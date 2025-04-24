/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.parameter';
	/**
	 * @ngdoc service
	 * @name estimateParameterComplexLookupValidationService
	 * @description provides validation methods for estimate parameter
	 */
	angular.module(moduleName).factory('estimateParameterComplexLookupValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService','platformRuntimeDataService','estimateParamDataService', 'estimateRuleCommonService',
			function ($http, $q, $injector, $translate, platformDataValidationService,platformRuntimeDataService,estimateParamDataService, estimateRuleCommonService) {

				let service = {},
					// paramOptions = {},
					validation = {issues : []};

				service.validateCode = function validateCode(entity, value, model,updateData,isIgnoreInitRedIcon) {
					let count = 0;

					if (updateData && updateData.length > 0) {
						_.forEach(updateData, function (param) {
							if (param.Code && value && param.Code.toLowerCase() === value.toLowerCase() && param.Id !== entity.Id) {
								count++;
							}
						});
					}

					let result;
					if(value === '...' || count > 0 || value ==='' ){
						if(value === '...' || value ===''){
							result = platformDataValidationService.createErrorObject('cloud.common.Error_RuleParameterCodeHasError', { object: model.toLowerCase() } );
						}else{
							result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', { object: model.toLowerCase() } );
						}
						result.entity = entity;
						result.value = value;
						result.model = model;
						result.valideSrv = service;
						result.dataSrv = estimateParamDataService;
						validation.issues.push(result);
					}
					else{
						result = platformDataValidationService.createSuccessObject();
						validation.issues = _.filter(validation.issues, function(err) {
							return err.entity.Id !== entity.Id || err.model !== model;
						});
					}
					
					let rootServices =['estimateMainBoqService','estimateMainRootService','estimateMainActivityService'];
					if((entity.IsRoot || entity.IsEstHeaderRoot) && !isIgnoreInitRedIcon){
						angular.forEach(rootServices, function(serv){
							if(serv){
								let rootService = $injector.get(serv);
								let affectedRoot = _.find(rootService.getList(), {IsRoot : true});
								if(!affectedRoot){
									affectedRoot = _.find(rootService.getList(), {IsEstHeaderRoot : true});
								}
								if(affectedRoot){
									affectedRoot.Param = entity.Param;
									rootService.fireItemModified(affectedRoot);
								}
							}
						});
					}
					
					return platformRuntimeDataService.applyValidationResult(result, entity, model);
					// platformDataValidationService.finishValidation(result, entity, value, model, service, toDataService);
				};

				service.validateValueDetail = function validateValueDetail(entity, value, field) {
					// let isValid=false;
					let result=  platformDataValidationService.createSuccessObject();

					value = value === null ? '': value;
					let paramslist = estimateParamDataService.getList();

					let valueTypes = $injector.get('estimateRuleParameterConstant');
					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
					let isMapCulture = true;

					let parameterReference ={};

					entity[field] = value;
					let paramReference = {isLoop: false, linkReference: ''};
					estimateRuleCommonService.checkLoopReference(entity, estimateParamDataService, paramReference);
					if (paramReference.isLoop) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
						};
						platformRuntimeDataService.applyValidationResult(result, entity, field);
						return result;
					}


					if(entity.ValueType !== valueTypes.Text){
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, paramslist, value);
						if (parameterReference.invalidParam) {
							result.error = parameterReference.error;
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = estimateParamDataService;
							result.valid = false;
							entity.nonVallid = true;

							platformRuntimeDataService.applyValidationResult(result, entity, field);
							return result;
						}
					}
					if (!isMapCulture) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
						// isValid = true;
					}
					else {
						let ParamDataServ = estimateParamDataService;
						let isBoolean = estimateRuleCommonService.isBooleanType(value, ParamDataServ);
						if (isBoolean) {
							result = platformDataValidationService.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = ParamDataServ;
							// isValid = true;
							validation.issues.push(result);
						}
						else {
							validation.issues = _.filter(validation.issues, function (err) {
								return err.entity.Id !== entity.Id || err.model !== field;
							});
							platformRuntimeDataService.applyValidationResult(result, entity, 'ParameterValue');
							// isValid = false;

						}
					}

					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateParamDataService);

					asyncMarker.myPromise = estimateRuleCommonService.getAsyncParameterDetailValidationResult(entity, value, model, estimateParamDataService).then(function(data){
						if(data.valid){
							validation.issues = _.filter(validation.issues, function(err) {
								return err.entity.Id !== entity.Id || err.model !== model;
							});
						}else{
							data.entity = entity;
							data.value = value;
							data.model = model;
							data.valideSrv = service;
							data.dataSrv = estimateParamDataService;
							validation.issues.push(data);
						}

						return data;
					});

					return asyncMarker.myPromise;
				};

				service.validateDefaultValue = function validateDefaultValue(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.setParamOptions = function setParamOptions(){
					// paramOptions = opt;
				};

				service.getValidationIssues = function getValidationIssues(){
					return validation.issues;
				};

				service.validateParameterValue = function validateParameterValue(entity, value,field){
					if (entity.__rt$data && entity.__rt$data.errors) {
						let error = entity.__rt$data.errors.ValueDetail;
						if(error){
							removeFieldError(entity, 'ValueDetail');
						}
					}

					let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
					let paramValueList =estimateMainParameterValueLookupService.getList();
					return $injector.get('estimateRuleCommonService').validateParameterValue(service, entity, value,field, paramValueList);
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
					platformDataValidationService.finishValidation({valid:true}, entity, '', field, service, estimateParamDataService);
				}

				return service;
			}
		]);
})();
