/**
 * Created by joshi on 09.01.2015.
 */

(function () {
	'use strict';
	/* global globals, _ */

	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRuleValidationService
	 * @description provides validation methods for estimate rule
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateRuleValidationService',
		['$http', '$q', '$translate', 'platformDataValidationService', 'estimateRuleCommonService','estimateRuleService',
			function ($http, $q, $translate, platformDataValidationService, estimateRuleCommonService, estimateRuleService) {

				let service = {};

				service.validateEstEvaluationSequenceFk = function validateEstEvaluationSequenceFk(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};
				service.validateCode = function validateCode(entity, value,field) {
					let result = platformDataValidationService.isMandatory(value, field);

					if(result.valid){
						if(value.length > _length){
							result.valid = false;
							result.error = $translate.instant('estimate.rule.errors.ruleCodeMaxLength', {count: _length});
							result.error$tr$ = $translate.instant('estimate.rule.errors.ruleCodeMaxLength', {count: _length});
						}
					}

					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateRuleService);
				};

				let _length = 24;
				service.setMaxCodeLength = function (length){
					_length = length;
					if(_length <=0 || _length > 24){
						_length = 24;
					}
				};

				service.validateIcon = function validateIcon(entity, value,field) {
					let result;
					if(entity.Icon > 0 ||(entity.Icon === 0 && value > 0)){
						result = platformDataValidationService.createSuccessObject();
					}
					else{
						result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: field.toLowerCase()} );
					}

					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateRuleService);
				};

				service.validateEstRuleExecutionTypeFk = function validateEstRuleExecutionTypeFk(entity, value,field) {
					let result;
					if(entity.EstRuleExecutionTypeFk > 0 ||(entity.EstRuleExecutionTypeFk === 0 && value > 0)){
						result = platformDataValidationService.createSuccessObject();
					}
					else{
						result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: field.toLowerCase()} );
					}

					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateRuleService);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateRuleService);
					// Now the data service knows there is an outstanding asynchronous request.
					let postData = {
						Id: entity.Id,
						Code: value,
						MdcLineItemContextFk: entity.MdcLineItemContextFk
					};// Call data prepared

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/isuniquecode', postData).then(function (response) {
						// Interprete result.
						let res = {};
						if (response.data) {
							res.valid = true;
						} else {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'estimate.rule.errors.uniqCode';
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateRuleService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};

				service.validateValueDetail = function(entity, value, field) {
					entity.ValueDetail = value;
					estimateRuleCommonService.calculateDetails(entity, field);
					return platformDataValidationService.createSuccessObject();
				};

				service.validateDefaultValue = function(entity, value, field){
					entity.DefaultValue = value;
					estimateRuleCommonService.calculateDetails(entity, field);
					return platformDataValidationService.createSuccessObject();
				};

				service.asyncValidateIsForEstimate = function asyncValidateIsForEstimate(entity, value, field){
					return resolveBulkUpdateOnRuleChecked(entity, value, field);
				};

				service.asyncValidateIsForBoq = function asyncValidateIsForBoq(entity, value, field){
					return resolveBulkUpdateOnRuleChecked(entity, value, field);
				};

				function resolveBulkUpdateOnRuleChecked(entity, value, field){
					let rulesEntities = estimateRuleService.getSelectedEntities();
					if (rulesEntities.length === 1){
						return $q.when(true);
					}

					_.forEach(rulesEntities, function(ruleEntity){
						ruleEntity[field] = value;
						// estimateRuleService.markItemAsModified(ruleEntity);
					});
					return estimateRuleService.bulkUpdateOnRuleChecked(entity, value, field);
				}

				return service;
			}
		]);
})();
