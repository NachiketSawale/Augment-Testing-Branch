/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.evaluation';

	/**
	 * @ngdoc service
	 * @name modelEvaluationRulesetGroupValidationService
	 * @function
	 *
	 * @description
	 * A service for validating model rule set groups.
	 */
	angular.module(moduleName).factory('modelEvaluationRulesetGroupValidationService', ['platformDataValidationService',
		'modelEvaluationRulesetDataService', '$http',
		function (platformDataValidationService, modelEvaluationRulesetDataService, $http) {
			var service = {};

			service.asyncValidateScopeLevel = function validateScopeLevel (entity, value, model) {
				return $http.get(globals.webApiBaseUrl + 'model/evaluation/group/canassignscope', {
					params: {
						groupId: entity.Id,
						parentGroupid: entity.ModelRulesetGroupParentFk,
						accessScope: value
					}
				}).then(function (response) {
					if (response.data) {
						return {
							valid: true,
							apply: true
						};
					} else {
						return platformDataValidationService.createErrorObject('model.evaluation.inconsistentGroupAccess');
					}
				}).then(function (validationResult) {
					return platformDataValidationService.finishValidation(validationResult, entity, value, model, service, modelEvaluationRulesetDataService);
				});
			};

			return service;
		}]);
})(angular);
