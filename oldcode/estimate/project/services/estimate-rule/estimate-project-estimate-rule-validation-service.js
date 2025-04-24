/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.project';
	let projectMainModule = angular.module(moduleName);
	/**
     * @ngdoc service
     * @name estimateProjectEstRuleValidationService
     * @description provides validation methods for project estimate rule
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('estimateProjectEstRuleValidationService',
		['$http', '$q','$injector','platformModalService','$translate', 'platformDataValidationService', 'estimateRuleCommonService','estimateProjectEstimateRulesService','platformRuntimeDataService',
			function ($http, $q,$injector,platformModalService,$translate, platformDataValidationService, estimateRuleCommonService, estimateProjectEstimateRulesService,platformRuntimeDataService) {

				let service = {};

				service.validateBasRubricCategoryFk = function validateBasRubricCategoryFk(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};
				service.validateCode = function validateCode(entity, value,model) {
					let fieldToValidate = 'Code';
					let oldPrjRule = angular.copy(entity);
					entity.oldCode = oldPrjRule.Code;
					entity.isUniq = true;
					if(value) {
						value = value.toUpperCase();
					}
					let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, fieldToValidate, estimateProjectEstimateRulesService.getList(), service, estimateProjectEstimateRulesService);

					if(!result.valid){
						entity.isUniq = false;
					}

					if(result.valid){
						if(value.length > _length){
							result.valid = false;
							result.error = $translate.instant('project.main.ruleCodeMaxLength', {count: _length});
							result.error$tr$ = $translate.instant('project.main.ruleCodeMaxLength', {count: _length});
						}
					}

					platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
					return platformDataValidationService.finishValidation(result, entity, entity.Code, model, service, estimateProjectEstimateRulesService);
					// return result;
				};

				let _length = 24;
				service.setMaxCodeLength = function (length){
					_length = length;
					if(_length <=0 || _length > 24){
						_length = 24;
					}
				};

				service.validateEstRuleExecutionTypeFk = function validateEstRuleExecutionTypeFk(entity, value, field) {
					let result = null;
					if(entity.EstRuleExecutionTypeFk > 0 ||(entity.EstRuleExecutionTypeFk === 0 && value > 0)){
						result = platformDataValidationService.createSuccessObject();
					}
					else{
						result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: field.toLowerCase()} );
					}

					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateProjectEstimateRulesService);
				};

				return service;
			}
		]);
})();
