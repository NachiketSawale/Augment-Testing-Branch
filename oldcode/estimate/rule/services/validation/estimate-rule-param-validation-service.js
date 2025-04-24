/**
 * Created by zos on 7/13/2016.
 */

(function () {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRuleValidationService
	 * @description provides validation methods for estimate rule
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateRuleParamValidationService',
		['$http', '$q', '$translate', '$injector', 'platformDataValidationService', 'platformModalService', 'platformRuntimeDataService', 'estimateRuleCommonService', 'estimateRuleParameterService',
			'estimateRuleParameterConstant',
			function (
				$http, $q, $translate, $injector, platformDataValidationService, platformModalService, platformRuntimeDataService, estimateRuleCommonService, estimateRuleParameterService,
				estimateRuleParameterConstant) {

				let service = {};
				let valueTypes = estimateRuleParameterConstant;

				service.validateEstEvaluationSequenceFk = function validateEstEvaluationSequenceFk(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateCode = function validateCode(entity, value,field) {
					estimateRuleParameterService.setExistParamCode(entity[field]);
					let result= platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, estimateRuleParameterService.getList(), service, estimateRuleParameterService);
					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateRuleParameterService);
				};

				service.asyncValidateCode = function (entity, value,field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity,  field,value, estimateRuleParameterService);
					asyncMarker.myPromise = estimateRuleCommonService.CheckCodeConflict(value,entity.Id,entity.ValueType,entity.IsLookup).then(function (responeData) {
						let res = {};
						if (responeData && !responeData.conflictResult) {
							// res = {apply: true, valid: true, error: ''};
							copyParamByExist(entity, responeData.estruleparam);
							entity.IsUnique=responeData.uniqueResult;

							res= platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, estimateRuleParameterService.getList(), service, estimateRuleParameterService);
							platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateRuleParameterService);

						} else {
							res.valid = false;
							res.apply = true;
							res.error =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
							res.error$tr$ =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
							$injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'Code');
							platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateRuleParameterService);
						}

						return res;
					});
					return asyncMarker.myPromise;
				};

				service.validateValueDetail = function (entity, value, model) {
					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');

					let result;
					result = {apply: true, valid: true};
					entity.nonVallid = false;
					let parameterReference ={};

					let paramReference = {isLoop: false, linkReference: ''};
					let item = angular.copy(entity);
					item[model] = value;
					estimateRuleCommonService.checkLoopReference(item, estimateRuleParameterService, paramReference);
					if (paramReference.isLoop) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
						};
						entity.nonVallid = true;
						return platformDataValidationService.finishValidation(result, entity, value, model, service, estimateRuleParameterService);
					}

					let isMapCulture = true;

					if (entity.ValueType !== valueTypes.Text && !entity.IsLookup) {
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, estimateRuleParameterService.getList(), value);
					}

					if (!isMapCulture) {
						return commonCalculationSer.mapCultureValidation(entity, value, model, service, estimateRuleParameterService);
					}
					else {
						let isBoolean = $injector.get('estimateRuleCommonService').isBooleanType(value, estimateRuleParameterService);
						result = {apply: true, valid: true};
						if (isBoolean) {
							result = {
								apply: true,
								valid: false,
								error: $translate.instant('estimate.rule.errors.calculationRule')
							};
						}
						else {
							if (!entity.IsLookup) {
								let oldValueDetail = entity.ValueDetail;
								entity.ValueDetail = value;
								if (entity.ValueType === valueTypes.Text || entity.ValueType === valueTypes.TextFormula) {
									entity.ValueText = entity.ValueDetail;
								} else {
									if(!entity.isCalculateByParamReference){
										estimateRuleCommonService.calculateDetails(entity, model, 'DefaultValue', estimateRuleParameterService);
									}else{
										entity.DefaultValue = entity.CalculateDefaultValue;
									}
								}
								entity.ValueDetail = oldValueDetail;
							}
						}
					}

					if (parameterReference.invalidParam) {
						result.error = parameterReference.error;
						result.entity = entity;
						result.value = value;
						result.model = model;
						result.valideSrv = service;
						result.dataSrv = estimateRuleParameterService;
						result.valid = false;
						entity.nonVallid = true;
					}

					return platformDataValidationService.finishValidation(result, entity, value, model, service, estimateRuleParameterService);
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					if(entity.ValueType === valueTypes.Text && !entity.IsLookup){
						return $q.when(true);
					}
					return estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, estimateRuleParameterService, service);
				};

				service.validateDefaultValue = function (entity, value, field) {

					let oldValueDetail = entity.ValueDetail;

					if (field === 'ValueText') {
						if (entity.ValueType === valueTypes.TextFormula) {
							// let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
							let paramValueList = $injector.get('estimateRuleParameterValueService').getList();
							return $injector.get('estimateRuleCommonService').validateParameterValue(service, entity, value, field, paramValueList);
						}

					} else if (field === 'DefaultValue') {
						if (!entity.IsLookup) {
							entity.DefaultValue = value;
							if (entity.ValueType === valueTypes.Boolean) {
								entity.ValueDetail = '';
							} else if (entity.ValueType === valueTypes.Text || entity.ValueType === valueTypes.TextFormula) {
								entity.ValueText = entity.ValueDetail = value;
							}
							estimateRuleCommonService.calculateDetails(entity, field, 'ValueDetail', estimateRuleParameterService);
							if (oldValueDetail !== entity.ValueDetail) {
								removeFieldError(entity, 'ValueDetail');
							}

							return platformDataValidationService.createSuccessObject();
						} else if (value === null) {
							entity.ValueDetail = '';
							removeFieldError(entity, 'ValueDetail');
						} else {
							estimateRuleCommonService.calculateReferenceParams(entity, estimateRuleParameterService);
						}
						return true;
					}
				};

				service.validateValueType = function (entity, value) {

					let oldEntity= angular.copy(entity);

					let oldValue = oldEntity.ValueType;
					let oldDefaultValue = oldEntity.DefaultValue;
					entity.ValueType = value;
					let parameterTypes = $injector.get('estimateRuleParameterTypeDataService').getParameterTypes();

					let valuesData = angular.copy($injector.get('estimateRuleParameterValueService').getList());
					if (entity.IsUnique && valuesData && valuesData.length > 0 && oldEntity.ValueType !== valueTypes.Boolean && entity.Version > 0) {
						let strContent = $translate.instant('estimate.rule.validationTypeAndValueContent', {
							value0: _.find(parameterTypes, {Id: oldValue}).Description,
							value1: _.find(parameterTypes, {Id: value}).Description
						});
						let strTitle = $translate.instant('estimate.rule.validationTypeAndValueTitle');

						platformModalService.showYesNoDialog(strContent, strTitle, 'no').then(function (result) {

							if (result.yes) {
								entity.DefaultValue = 0;
								if (value === valueTypes.Boolean) {
									entity.IsLookup = 0;
								}
								entity.ValueDetail = '';
								entity.ValueText = '';
								entity.EstRuleParamValueFk = '';
								estimateRuleParameterService.setReadOnly(entity);
								if (valuesData !== null && valuesData.length > 0 && !entity.IsUnique) {
									// estimateRuleParameterService.parameterSetValueList.fire();
									$injector.get('estimateRuleParameterValueService').setList([]);
								}
								else {
									// estimateRuleParameterService.deleteValuesComplete.fire(valuesData);
									$injector.get('estimateRuleParameterValueService').deleteEntities(valuesData, oldEntity);
								}
								removeFieldError(entity, 'ValueDetail');
								estimateRuleParameterService.gridRefresh();
								return true;
							}
							if (result.no) {
								entity.ValueType = oldValue;
								entity.DefaultValue = oldDefaultValue;
								if (entity.IsLookup) {
									let readOnlyField = [{field: 'IsLookup', readonly: false}];
									$injector.get('platformRuntimeDataService').readonly(entity, readOnlyField);
								}
								estimateRuleParameterService.gridRefresh();
							}
						}, function () {
							entity.ValueType = oldValue;
							entity.DefaultValue = oldDefaultValue;
							estimateRuleParameterService.gridRefresh();
						});

					}
					else if(value === valueTypes.Decimal2){
						entity.DefaultValue = 0;
						entity.ValueDetail = '';
						entity.ValueText = '';
						estimateRuleCommonService.calculateReferenceParams(entity, estimateRuleParameterService);
						estimateRuleParameterService.setReadOnly(entity);
						removeFieldError(entity, 'ValueDetail');
					}else if(value === valueTypes.Text || value === valueTypes.TextFormula){
						entity.DefaultValue = 0;
						entity.ValueDetail = '';
						estimateRuleParameterService.setReadOnly(entity);
						removeFieldError(entity, 'ValueDetail');
					}else if(value === valueTypes.Boolean){
						entity.ValueDetail = '';
						entity.IsLookup = 0;
						removeFieldError(entity, 'ValueDetail');
					}
				};

				service.asyncValidateValueType = function (entity) {

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity,'Code',  entity.Code, estimateRuleParameterService);

					asyncMarker.myPromise = estimateRuleCommonService.CheckCodeConflict(entity.Code,entity.Id,entity.ValueType,entity.IsLookup).then(function (responeData) {
						let res = {};
						if (responeData && !responeData.conflictResult) {
							copyParamByExist(entity, responeData.estruleparam);
							res= platformDataValidationService.validateMandatoryUniqEntity(entity, entity.Code, 'Code', estimateRuleParameterService.getList(), service, estimateRuleParameterService);
						} else {
							res.valid = false;
							res.apply = true;
							res.error =  $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'code'});
							res.error$tr$ = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'code'});
							res.model = 'Code';
						}
						$injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'Code');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, 'Code', asyncMarker, service, estimateRuleParameterService);
						return true;
					});

					return asyncMarker.myPromise;
				};

				service.validateIsLookup = function (entity, value) {
					let oldValue = entity.IsLookup;
					let oldDefaultValue = entity.DefaultValue;
					let oldParamValueFk = entity.EstRuleParamValueFk;
					entity.IsLookup = value;

					let valuesData = angular.copy($injector.get('estimateRuleParameterValueService').getList());
					if (entity.IsUnique && valuesData  && !value && valuesData.length > 0 && entity.Version >0) {
						let strContent = $translate.instant('estimate.rule.validationIsLookupContent');
						let strTitle = $translate.instant('estimate.rule.validationIsLookupTitle');
						platformModalService.showYesNoDialog(strContent, strTitle, 'no').then(function (result) {
							if (result.yes) {
								if(valuesData !== null && !entity.IsUnique){
									// estimateRuleParameterService.parameterSetValueList.fire();
									$injector.get('estimateRuleParameterValueService').setList([]);
								}
								else {
									// estimateRuleParameterService.deleteValuesComplete.fire(valuesData);
									$injector.get('estimateRuleParameterValueService').deleteEntities(valuesData);
								}
								estimateRuleParameterService.gridRefresh();
								return true;
							}
							if (result.no) {
								entity.IsLookup = oldValue;
								entity.DefaultValue = oldDefaultValue;
								entity.EstRuleParamValueFk = oldParamValueFk;
								estimateRuleParameterService.gridRefresh();
							}
						}, function () {
							entity.ValueType = oldValue;
							entity.DefaultValue = oldDefaultValue;
							estimateRuleParameterService.gridRefresh();
						});
					}

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

				service.asyncValidateIsLookup = function (entity) {

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity,'Code', entity.Code,estimateRuleParameterService);

					asyncMarker.myPromise = estimateRuleCommonService.CheckCodeConflict(entity.Code,entity.Id,entity.ValueType,entity.IsLookup).then(function (responeData) {
						let res = {};
						if (responeData && !responeData.conflictResult) {
							// synchro the exist param to new one
							copyParamByExist(entity, responeData.estruleparam);

							res= platformDataValidationService.validateMandatoryUniqEntity(entity, entity.Code, 'Code', estimateRuleParameterService.getList(), service, estimateRuleParameterService);
						} else {
							res.valid = false;
							res.apply = true;
							res.error =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
							res.model = 'Code';
							res.error$tr$ =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
						}
						if(res.valid && entity.ValueType === valueTypes.Decimal2) {
							entity.ActualValue = 0;
							estimateRuleCommonService.calculateReferenceParams(entity, estimateRuleParameterService);
						}
						$injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'Code');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, 'Code', asyncMarker, service, estimateRuleParameterService);
						return true;
					});

					return asyncMarker.myPromise;
				};

				function copyParamByExist(entity, estruleparam) {
					if(estruleparam){
						entity.DescriptionInfo.Description = estruleparam.DescriptionInfo.Description;
						entity.DescriptionInfo.Translated = estruleparam.DescriptionInfo.Description;
						entity.DescriptionInfo.Modified = true;
						entity.UomFk = estruleparam.UomFk;
						entity.EstRuleParamValueFk = entity.IsLookup ? estruleparam.EstRuleParamValueFk : null;
						entity.DefaultValue = entity.IsLookup ? entity.EstRuleParamValueFk : estruleparam.DefaultValue;
						entity.ValueDetail = estruleparam.ValueDetail;
					}
					else {
						entity.EstRuleParamValueFk = null;
						entity.DefaultValue = null;
						entity.ValueDetail = null;
					}

					removeFieldError(entity, 'ValueDetail');
				}

				function removeFieldError(entity, field){
					platformRuntimeDataService.applyValidationResult({valid:true}, entity, field);
					platformDataValidationService.finishValidation({valid:true}, entity, '', field, service, estimateRuleParameterService);
				}

				return service;
			}
		]);

})();
