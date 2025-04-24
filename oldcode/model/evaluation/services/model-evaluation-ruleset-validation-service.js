/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc service
	 * @name modelEvaluationRulesetValidationService
	 * @description Provides validation methods for model evaluation ruleset entities.
	 */
	angular.module(moduleName).service('modelEvaluationRulesetValidationService', ModelEvaluationRulesetValidationService);

	ModelEvaluationRulesetValidationService.$inject = ['platformDataValidationService',
		'modelEvaluationRulesetDataService', '$http'];

	function ModelEvaluationRulesetValidationService(platformDataValidationService, modelEvaluationRulesetDataService,
		$http) {

		const service = {};

		function validateHighlightingSchemeAccessMismatch(entity, value, model, scopeLevel, hlSchemeFk) {
			return $http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/canusedefaulthlscheme?accessScope=' + scopeLevel + '&highlightingSchemeFk=' + hlSchemeFk).then(function (response) {
				if (response.data) {
					return {
						valid: true,
						apply: true
					};
				} else {
					return platformDataValidationService.createErrorObject('model.evaluation.defaultHlSchemeScopeMismatch');
				}
			}).then(function (validationResult) {
				return platformDataValidationService.finishValidation(validationResult, entity, value, model, service, modelEvaluationRulesetDataService);
			});
		}

		service.asyncValidateScopeLevel = function (entity, value, model) {
			platformDataValidationService.ensureNoRelatedError(entity, model, ['HighlightingSchemeFk'], service, modelEvaluationRulesetDataService);
			return validateHighlightingSchemeAccessMismatch(entity, value, model, value, entity.HighlightingSchemeFk);
		};

		service.asyncValidateHighlightingSchemeFk = function (entity, value, model) {
			platformDataValidationService.ensureNoRelatedError(entity, model, ['ScopeLevel'], service, modelEvaluationRulesetDataService);
			return validateHighlightingSchemeAccessMismatch(entity, value, model, entity.ScopeLevel, value);
		};

		return service;
	}

})(angular);
