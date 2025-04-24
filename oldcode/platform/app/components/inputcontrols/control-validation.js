/*
 * $Id: control-validation.js 611784 2020-11-11 11:59:48Z alisch $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformControlValidation', platformValidation);

	platformValidation.$inject = ['platformRuntimeDataService', '$q', '_', 'platformDataValidationService', 'mainViewService'];

	function platformValidation(platformRuntimeDataService, $q, _, platformDataValidationService, mainViewService) {
		return {
			restrict: 'A',
			require: '^ngModel',
			scope: false,
			link: function (scope, element, attrs, ctrl) {
				var config = scope.$eval(attrs.config);
				var valid = {valid: true};
				var moduleName = mainViewService.getCurrentModuleName() || 'desktop';

				if (config) {
					if (config.validator) {
						ctrl.$validators.platform = function (modelValue) {
							var entity = scope.$eval(attrs.entity);
							var field = config.model || config.field;
							if (entity && _.get(entity, field) !== modelValue) {
								var deferred = $q.defer();
								var callState = platformDataValidationService.registerAsyncCallByModuleName(entity, field, modelValue, moduleName, deferred.promise);

								valid = platformRuntimeDataService.applyValidationResult(config.validator(entity, modelValue, field), entity, field);

								deferred.resolve(valid);
								platformDataValidationService.cleanUpAsyncMarkerByModuleName(callState, moduleName);
							}
							return true;
						};
					}

					if (config.asyncValidator) {
						ctrl.$asyncValidators.platform = function (modelValue) {
							return $q(function (resolve) {
								var entity = scope.$eval(attrs.entity);
								var field = config.model || config.field;

								if (valid.valid && entity && _.get(entity, field, modelValue) !== modelValue) {
									var deferred = $q.defer();
									var callState = platformDataValidationService.registerAsyncCallByModuleName(entity, field, modelValue, moduleName, deferred.promise);

									deferred.promise.then(function () {
										platformDataValidationService.cleanUpAsyncMarkerByModuleName(callState, moduleName);
									});

									config.asyncValidator(entity, modelValue, field)
										.then(function (result) {
											platformRuntimeDataService.applyValidationResult(result, entity, field);

											deferred.resolve(valid);
											resolve(true);
										}, function () {

											deferred.resolve(valid);
											resolve(true);
										});
								} else {
									resolve(true);
								}
							});
						};
					}
				}
			}
		};
	}
})(angular);
