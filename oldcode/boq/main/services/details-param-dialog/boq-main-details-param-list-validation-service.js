/**
 * Created by zos on 3/14/2018.
 */

(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainDetailsParamListValidationService
	 * @description provides validation methods for boq details dialog parameter
	 */
	angular.module(moduleName).factory('boqMainDetailsParamListValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'PlatformMessenger', 'boqMainDetailsParamDialogService',
			function ($http, $q, $injector, $translate, platformDataValidationService, platformRuntimeDataService, PlatformMessenger, boqMainDetailsParamDialogService) {

				var service = {};
				var estimateRuleCommonService = $injector.get('estimateRuleCommonService');

				angular.extend(service, {
					onCodeChange: new PlatformMessenger()
				});

				service.validateCode = function validateCode(entity, value, field, source) {
					var boqMainDetailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
					var params = boqMainDetailsParamListDataService.getList();
					var count = 0;
					var isValid = false;
					var result;

					_.forEach(params, function (param) {
						if (param.Code.toUpperCase() === value.toUpperCase() && param.Id !== entity.Id) {
							if (param.AssignedStructureId === entity.AssignedStructureId) {
								count++;
								param.conlict = true;
							}
						}
					});

					if (value === '...' || count > 0 || value === '') {
						if (value === '...') {
							result = platformDataValidationService.createErrorObject('cloud.common.Error_RuleParameterCodeHasError', {object: field.toLowerCase()});
						} else {
							result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: field.toLowerCase()});
						}
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = boqMainDetailsParamListDataService;
						isValid = true;
						service.onCodeChange.fire(isValid);
					} else {
						result = platformDataValidationService.createSuccessObject();
						isValid = false;
						if (source !== 'listLoad') {
							service.onCodeChange.fire(isValid);
						}
					}

					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;

				};
				service.validateValueDetail = function validateValueDetail(entity, value, field) {
					var boqMainDetailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
					var data = boqMainDetailsParamListDataService.getList();

					entity[field] = value;
					entity.nonVallid = false;
					var isValid = false;
					var isMapCulture = true;
					var result = platformDataValidationService.createSuccessObject();
					var parameterReference = {};
					var commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
					var valueTypes = $injector.get('estimateRuleParameterConstant');

					var paramReference = {isLoop: false, linkReference: ''};
					estimateRuleCommonService.checkLoopReference(entity, boqMainDetailsParamListDataService, paramReference);
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

					if (entity.ValueType !== valueTypes.Text && !entity.IsLookup) {
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, data, value);
					}

					if (!isMapCulture) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
						isValid = true;
					} else {

						var isBoolean = estimateRuleCommonService.isBooleanType(value, boqMainDetailsParamListDataService);
						if (isBoolean) {
							result = platformDataValidationService.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = boqMainDetailsParamListDataService;
							isValid = true;
						}
					}
					if (parameterReference.invalidParam) {
						result.error = parameterReference.error;
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = boqMainDetailsParamListDataService;
						result.valid = false;
						isValid = true;
						entity.nonVallid = true;
					}

					if (!isValid) {
						var nonVallidData = _.filter(data, {'nonVallid': true});
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

				service.validateParameterValue = function validateParameterValue(entity, value, field) {

					if (field === 'ParameterText') {
						var estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
						var paramValueList = estimateMainParameterValueLookupService.getList();
						return estimateRuleCommonService.validateParameterValue(service, entity, value, field, paramValueList);
					}
					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateAssignedStructureId = function validateAssignedStructureId(entity, value, field) {

					var boqMainDetailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
					entity.AssignedStructureId = value;

					var data = boqMainDetailsParamListDataService.getList();

					var count = 0;
					_.forEach(data, function (param) {
						var result = service.validateCode(param, param.Code, 'Code');
						if (result && !result.valid) {
							count++;
						}
					});

					if (count > 0) {
						service.onCodeChange.fire(true);
					}

					boqMainDetailsParamDialogService.showSameCodeWarning(entity, entity.Code);

					platformDataValidationService.isMandatory(value, field);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
					var boqMainDetailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
					var estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant');

					// boq/wic the sourceBoqMainService is BoqMainService,other modules is related sourceBoqItemService
					var detailsParamDialogService = $injector.get('boqMainDetailsParamDialogService');
					var sourceBoqItemService = detailsParamDialogService.getSourceBoqItemService();

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, boqMainDetailsParamListDataService);
					var postData = {
						projectFk: sourceBoqItemService.getSelectedProjectId() ? sourceBoqItemService.getSelectedProjectId() : 0,
						code: value,
					};

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/parameter/prjparam/GetParamByCodeFromPrjOrBaseCustomize',
						postData).then(function (response) {
						var res = {
							apply: true,
							valid: true,
							error: ''
						};
						entity.Version = -1;
						if (response.data) {
							entity.DefaultValue = response.data.DefaultValue;
							entity.Code = response.data.Code;
							entity.DescriptionInfo = response.data.DescriptionInfo;
							entity.EstParameterGroupFk = response.data.EstParameterGroupFk;
							entity.ParameterText = response.data.ParameterText;
							entity.ParameterValue = response.data.ParameterValue;
							entity.ValueType = response.data.ValueType;
							entity.ValueText = response.data.ValueText;
							entity.ValueDetail = response.data.ValueDetail;
							entity.IsLookup = response.data.IsLookup;
							entity.Version = response.data.Version;
							entity.AssignedStructureId = estimateMainParamStructureConstant.Project;
						}
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, boqMainDetailsParamListDataService);

						return res;
					});

					return asyncMarker.myPromise;
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					var detailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, detailsParamListDataService);

					asyncMarker.myPromise = estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, detailsParamListDataService, service).then(function (result) {
						if (result.valid) {
							var data = detailsParamListDataService.getList();
							var nonVallidData = _.filter(data, {'nonVallid': true});
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
