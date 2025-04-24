/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationImportPropertyKeyValidationService
	 * @description
	 * Provides validation code for model import property key rules.
	 */
	angular.module(moduleName).service('modelAdministrationImportPropertyKeyValidationService',
		ModelAdministrationImportPropertyKeyValidationService);

	ModelAdministrationImportPropertyKeyValidationService.$inject = ['platformDataValidationService',
		'modelAdministrationImportPropertyKeyRuleDataService', '$http', '$translate'];

	function ModelAdministrationImportPropertyKeyValidationService(platformDataValidationService,
		modelAdministrationImportPropertyKeyRuleDataService, $http, $translate) {

		const service = {};

		service.validatePatternTypeFk = function (entity, value, model) {
			platformDataValidationService.ensureNoRelatedError(entity, model, ['NamePattern', 'ValueTypePattern', 'ValuePattern'], this, modelAdministrationImportPropertyKeyRuleDataService);

			return platformDataValidationService.finishValidation(true, entity, value, model, this, modelAdministrationImportPropertyKeyRuleDataService);
		};

		function asyncValidatePatternField(entity, value, model) {
			const asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, modelAdministrationImportPropertyKeyRuleDataService);

			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'model/administration/importprf/checkpattern', {
				params: {
					patternTypeId: entity.PatternTypeFk,
					pattern: value
				}
			}).then(function (response) {
				let validationResult;
				if (response.data) {
					validationResult = true;
				} else {
					validationResult = {
						valid: false,
						error: $translate.instant('model.administration.invalidPattern')
					};
				}
				return platformDataValidationService.finishAsyncValidation(validationResult, entity, value, model, asyncMarker, this, modelAdministrationImportPropertyKeyRuleDataService);
			});

			return asyncMarker.myPromise;
		}

		service.asyncValidateNamePattern = function (entity, value, model) {
			return asyncValidatePatternField(entity, value, model);
		};

		service.asyncValidateValueTypePattern = function (entity, value, model) {
			return asyncValidatePatternField(entity, value, model);
		};

		service.asyncValidateValuePattern = function (entity, value, model) {
			return asyncValidatePatternField(entity, value, model);
		};

		return service;
	}
})(angular);
