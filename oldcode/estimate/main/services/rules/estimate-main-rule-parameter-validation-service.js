/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	// todo change used service name from code
	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterValidationService
	 * @description provides validation methods for estimate rule parameter.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('estimate.main').service('estimateMainRuleParameterValidationService',
		['$http', '$q', '$injector', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateRuleCommonService',
			'estimateRuleParameterConstant', '$translate', 'platformModalService','estimateMainService','estimateProjectEstimateRuleCommonService',
			function (
				$http, $q, $injector, platformDataValidationService, platformRuntimeDataService, estimateRuleCommonService,
				estimateRuleParameterConstant, $translate, platformModalService,estimateMainService,estimateProjectEstimateRuleCommonService) {


				let service = {};
				let valueTypes = estimateRuleParameterConstant;
				let parameterTypes = $injector.get('estimateRuleParameterTypeDataService').getParameterTypes();
				let paramDataService = $injector.get('estimateMainRuleParameterDataServiceFactory');

				service.validateEstEvaluationSequenceFk = function validateBasRubricCategoryFk(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateCode = function validateCode(entity, value, field) {

					paramDataService.setExistParamCode(entity[field]);
					let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, paramDataService.getList(), service, paramDataService);
					return platformDataValidationService.finishValidation(result, entity, value, field, service, paramDataService);
				};

				service.asyncValidateCode = function (entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, paramDataService);
					let prjId = estimateMainService.getProjectId();

					asyncMarker.myPromise = estimateProjectEstimateRuleCommonService.CheckCodeConflict(prjId, entity.Id, value, entity.ValueType, entity.IsLookup).then(function (responeData) {
						let res = {};
						if (responeData && !responeData.conflictResult) {
							copyParamByExist(entity, responeData.estprjruleparam);
							entity.IsUnique = responeData.uniqueResult;

							res = platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, paramDataService.getList(), service, paramDataService);
							platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, paramDataService);

						} else {
							res.valid = false;
							res.apply = true;
							res.error =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
							res.error$tr$ = $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
							$injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'Code');
							platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, paramDataService);
						}

						return res;
					});
					return asyncMarker.myPromise;
				};

				service.validateValueDetail = function (entity, value, field) {
					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
					let isMapCulture = true;
					let result;

					entity[field] = value;
					let paramReference = {isLoop: false, linkReference: ''};
					estimateRuleCommonService.checkLoopReference(entity, paramDataService, paramReference);
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
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, paramDataService.getList(), value);
					}

					if (!isMapCulture) {
						return commonCalculationSer.mapCultureValidation(entity, value, field, service, paramDataService);
					}
					else {
						let isBoolean = $injector.get('estimateRuleCommonService').isBooleanType(value, paramDataService);
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

								if(entity.ValueType ===  valueTypes.Text || entity.ValueType === valueTypes.TextFormula){
									entity.ValueText = entity.ValueDetail;
								}else {
									if(!entity.isCalculateByParamReference){
										estimateRuleCommonService.calculateDetails(entity, field, 'DefaultValue', paramDataService);
									}else{
										entity.DefaultValue = entity.CalculateDefaultValue;
									}
								}
								entity.ValueDetail = oldValueDetail;
							}
						}

						if (parameterReference.invalidParam) {
							result.error = parameterReference.error;
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = paramDataService;
							result.valid = false;
							entity.nonVallid = true;
						}

					}

					return platformDataValidationService.finishValidation(result, entity, value, field, service, paramDataService);
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					if(entity.ValueType === valueTypes.Text && !entity.IsLookup){
						return $q.when(true);
					}
					return estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, paramDataService, service);
				};

				service.validateDefaultValue = function (entity, value, field) {

					// let newValueText = value;
					let oldValueDetail = entity.ValueDetail;

					if (field === 'ValueText') {
						if (entity.ValueType === valueTypes.TextFormula) {
							// let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
							let paramValueList = $injector.get('estimateMainRuleParameterValueDataServiceFactory').getList();
							return $injector.get('estimateRuleCommonService').validateParameterValue(service, entity, value, field, paramValueList);
						}
					} else if (field === 'DefaultValue') {
						if (!entity.IsLookup) {
							entity.DefaultValue = value;
							if (entity.ValueType === valueTypes.Boolean) {
								entity.ValueDetail = '';
							} else if (entity.ValueType === valueTypes.Text || entity.ValueType === valueTypes.TextFormula) {
								entity.ValueText = entity.ValueDetail = value;
							} else {
								entity.ValueDetail = entity.DefaultValue;
							}
							// estimateRuleCommonService.calculateDetails(entity, field);
							estimateRuleCommonService.calculateDetails(entity, field, 'ValueDetail', paramDataService);
							if (oldValueDetail !== entity.ValueDetail) {
								removeFieldError(entity, 'ValueDetail');
							}
							return platformDataValidationService.createSuccessObject();
						}
						else if (value === null) {
							entity.ValueDetail = '';
							removeFieldError(entity, 'ValueDetail');
						} else {
							estimateRuleCommonService.calculateReferenceParams(entity, paramDataService);
						}

						return true;
					}
				};

				service.validateValueType = function (entity, value) {
					let oldValue = entity.ValueType;
					let oldDefaultValue = entity.DefaultValue;
					entity.ValueType = value;

					let valuesData =  angular.copy($injector.get('estimateMainRuleParameterValueDataServiceFactory').getList());
					if (entity.IsUnique &&  valuesData &&  valuesData.length > 0 && oldValue !==valueTypes.Boolean  && entity.Version >0) {
						let strContent = $translate.instant('estimate.rule.validationTypeAndValueContent', {
							value0: _.find(parameterTypes, {Id: oldValue}).Description,
							value1: _.find(parameterTypes, {Id: value}).Description
						});
						let strTitle = $translate.instant('estimate.rule.validationTypeAndValueTitle');
						platformModalService.showYesNoDialog(strContent, strTitle, 'no').then(function (result) {

							if (result.yes) {
								entity.DefaultValue = 0;
								if(value === valueTypes.Boolean) {
									entity.IsLookup = 0;
								}
								entity.ValueDetail = '';
								entity.ValueText = '';
								entity.EstRuleParamValueFk = '';
								$injector.get('estimateMainRuleParameterProcessor').processItem(entity);
								if (valuesData !== null && valuesData.length > 0 && !entity.IsUnique) {
									// paramDataService.parameterSetValueList.fire();
									$injector.get('estimateMainRuleParameterValueDataServiceFactory').setList([]);
								}
								else {
									// paramDataService.deleteValuesComplete.fire(valuesData);
									estimateMainService.update().then(function () {
										$injector.get('estimateMainRuleParameterValueDataServiceFactory').deleteEntities(valuesData);
									});
								}
								removeFieldError(entity, 'ValueDetail');
								paramDataService.gridRefresh();
								return true;
							}
							if (result.no) {
								entity.ValueType = oldValue;
								entity.DefaultValue = oldDefaultValue;
								if (entity.IsLookup) {
									let readOnlyField = [{field: 'IsLookup', readonly: false}];
									$injector.get('platformRuntimeDataService').readonly(entity, readOnlyField);
								}
								paramDataService.gridRefresh();
							}
						}, function () {
							entity.ValueType = oldValue;
							entity.DefaultValue = oldDefaultValue;
							paramDataService.gridRefresh();
						});
					}

					else if (value === valueTypes.Decimal2) {
						entity.DefaultValue = 0;
						entity.ValueDetail = '';
						entity.ValueText = '';
						estimateRuleCommonService.calculateReferenceParams(entity, paramDataService);
						$injector.get('estimateMainRuleParameterProcessor').processItem(entity);
						removeFieldError(entity, 'ValueDetail');
					}else if(value === valueTypes.Text || entity.ValueType === valueTypes.TextFormula){
						entity.DefaultValue = 0;
						entity.ValueDetail = '';
						$injector.get('estimateMainRuleParameterProcessor').processItem(entity);
						removeFieldError(entity, 'ValueDetail');
					}else if(value === valueTypes.Boolean){
						entity.ValueDetail = '';
						entity.IsLookup = 0;
						removeFieldError(entity, 'ValueDetail');
					}
				};

				service.asyncValidateValueType = function (entity) {

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, 'Code', entity.Code, paramDataService);
					let prjId = estimateMainService.getProjectId();

					asyncMarker.myPromise = estimateProjectEstimateRuleCommonService.CheckCodeConflict(prjId, entity.Id, entity.Code, entity.ValueType, entity.IsLookup).then(function (responeData) {
						let res = {};
						if (responeData && !responeData.conflictResult) {
							copyParamByExist(entity, responeData.estprjruleparam);
							res = platformDataValidationService.validateMandatoryUniqEntity(entity, entity.Code, 'Code', paramDataService.getList(), service, paramDataService);
						} else {
							res.valid = false;
							res.apply = true;
							res.error =  $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'code'});
							res.error$tr$ =  $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'code'});
							res.model = 'Code';
						}
						$injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'Code');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, 'Code', asyncMarker, service, paramDataService);
						return true;
					});

					return asyncMarker.myPromise;
				};

				service.validateIsLookup = function (entity, value) {
					let oldEntity= angular.copy(entity);

					entity.IsLookup = value;

					let valuesData = angular.copy($injector.get('estimateMainRuleParameterValueDataServiceFactory').getList());// paramDataService.parameterGetValueListComplete.fire();

					if (entity.IsUnique && valuesData && !value && valuesData.length > 0  && entity.Version >0) {
						let strContent = $translate.instant('estimate.rule.validationIsLookupContent');
						let strTitle = $translate.instant('estimate.rule.validationIsLookupTitle');
						platformModalService.showYesNoDialog(strContent, strTitle, 'no').then(function (result) {
							if (result.yes) {
								if (valuesData !== null && !entity.IsUnique) {
									// paramDataService.parameterSetValueList.fire();
									$injector.get('estimateMainRuleParameterValueDataServiceFactory').setList([]);
								}
								else {
									// paramDataService.deleteValuesComplete.fire(valuesData);
									$injector.get('estimateMainRuleParameterValueDataServiceFactory').deleteEntities(valuesData,oldEntity);
								}
								paramDataService.gridRefresh();
								return true;
							}
							if (result.no) {
								entity.IsLookup = oldEntity.IsLookup;
								entity.DefaultValue = oldEntity.DefaultValue;
								entity.EstRuleParamValueFk = oldEntity.EstRuleParamValueFk;
								paramDataService.gridRefresh();
							}
						}, function () {
							entity.ValueType = oldEntity.IsLookup;
							entity.DefaultValue = oldEntity.DefaultValue;
							paramDataService.gridRefresh();
						});
					}

					if(value) {
						if (entity.__rt$data && entity.__rt$data.errors) {
							let error = entity.__rt$data.errors.ValueDetail;
							if (error) {
								entity.ValueDetail = '';
								removeFieldError(entity, 'ValueDetail');
							}
						}
					}
				};

				service.asyncValidateIsLookup = function (entity) {

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, 'Code', entity.Code, paramDataService);
					let prjId = estimateMainService.getProjectId();

					asyncMarker.myPromise = estimateProjectEstimateRuleCommonService.CheckCodeConflict(prjId, entity.Id, entity.Code, entity.ValueType, entity.IsLookup).then(function (responeData) {
						let res = {};
						if (responeData && !responeData.conflictResult) {
							copyParamByExist(entity, responeData.estprjruleparam);
							res = platformDataValidationService.validateMandatoryUniqEntity(entity, entity.Code, 'Code', paramDataService.getList(), service, paramDataService);
						} else {
							res.valid = false;
							res.apply = true;
							res.error =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
							res.model = 'Code';
							res.error$tr$ =  $translate.instant('estimate.rule.errors.differentTypeToSameCode', {object: 'code'});
						}

						if(res.valid && entity.ValueType === valueTypes.Decimal2) {
							entity.ParameterValue = 0;
							entity.ActualValue = 0;
							estimateRuleCommonService.calculateReferenceParams(entity, paramDataService);
						}
						$injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'Code');
						platformDataValidationService.finishAsyncValidation(res, entity, entity.Code, 'Code', asyncMarker, service, paramDataService);
						paramDataService.gridRefresh();
						return true;
					});

					return asyncMarker.myPromise;
				};

				function copyParamByExist(entity, estprjruleparam) {
					if(estprjruleparam){
						entity.DescriptionInfo.Description = estprjruleparam.DescriptionInfo.Description;
						entity.DescriptionInfo.Translated = estprjruleparam.DescriptionInfo.Description;
						entity.DescriptionInfo.Modified = true;
						entity.UomFk = estprjruleparam.UomFk;
						entity.EstRuleParamValueFk = entity.IsLookup ? estprjruleparam.EstRuleParamValueFk : null;
						entity.DefaultValue = entity.IsLookup ? entity.EstRuleParamValueFk : estprjruleparam.DefaultValue;
						entity.ValueDetail = estprjruleparam.ValueDetail;
					}
					else {
						entity.EstRuleParamValueFk = null;
						entity.DefaultValue = null;
						entity.ValueDetail = null;
					}
				}

				function removeFieldError(entity, field){
					platformRuntimeDataService.applyValidationResult({valid:true}, entity, field);
					platformDataValidationService.finishValidation({valid:true}, entity, '', field, service, paramDataService);
				}

				return service;
			}
		]);
})();
