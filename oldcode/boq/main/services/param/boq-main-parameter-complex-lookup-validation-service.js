/**
 * Created by zos on 2/27/2018.
 */
(function () {
	/* global _ */
	'use strict';

	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqParameterComplexLookupValidationService
	 * @description provides validation methods for boq parameter
	 */
	angular.module(moduleName).factory('boqParameterComplexLookupValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'boqParamDataService',
			function ($http, $q, $injector, $translate, platformDataValidationService, platformRuntimeDataService, boqParamDataService) {

				var service = {},
					validation = {issues: []};

				service.validateCode = function validateCode(entity, value, model, updateData) {
					var count = 0;

					if (updateData && updateData.length > 0) {
						_.forEach(updateData, function (param) {
							if (param.Code === value && param.Id !== entity.Id) {
								count++;
							}
						});
					}

					var result;
					if (value === '...' || count > 0) {
						if (value === '...') {
							result = platformDataValidationService.createErrorObject('cloud.common.Error_RuleParameterCodeHasError', {object: model.toLowerCase()});
						} else {
							result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()});
						}
						result.entity = entity;
						result.value = value;
						result.model = model;
						result.valideSrv = service;
						result.dataSrv = boqParamDataService;
						validation.issues.push(result);
					} else {
						result = platformDataValidationService.createSuccessObject();
						validation.issues = _.filter(validation.issues, function (err) {
							return err.entity.Id !== entity.Id || err.model !== model;
						});
					}

					return platformRuntimeDataService.applyValidationResult(result, entity, model);
				};

				service.validateValueDetail = function validateValueDetail(entity, value, field) {
					var result;
					value = value === null ? '' : value;

					// TODO, sai
					var commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
					var isMapCulture = commonCalculationSer.getIsMapCulture(value);
					if (!isMapCulture) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
					} else {
						var isBoolean = $injector.get('estimateRuleCommonService').isBooleanType(value, boqParamDataService);
						if (isBoolean) {
							result = platformDataValidationService.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = boqParamDataService;
							validation.issues.push(result);
						} else {
							result = platformDataValidationService.createSuccessObject();
							validation.issues = _.filter(validation.issues, function (err) {
								return err.entity.Id !== entity.Id || err.model !== field;
							});
							platformRuntimeDataService.applyValidationResult(result, entity, 'ParameterValue');
						}
					}

					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;
				};

				service.validateDefaultValue = function validateDefaultValue(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.getValidationIssues = function getValidationIssues() {
					return validation.issues;
				};

				return service;
			}
		]);
})();