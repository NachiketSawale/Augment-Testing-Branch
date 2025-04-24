/*
 * $Id: url-validation.js
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformUrlValidation', platformValidation);

	platformValidation.$inject = ['_', 'platformRuntimeDataService', '$injector', 'platformDataValidationService'];

	function platformValidation(_, platformRuntimeDataService, $injector, platformDataValidationService) {
		return {
			restrict: 'A',
			require: '^ngModel',
			scope: false,
			link: function (scope, element, attrs, ctrl) {
				var result = false;
				if (ctrl.$validators.url) {
					let config = !_.isUndefined(attrs.grid) ? scope.config : (attrs.config ? scope.$eval(attrs.config) : {});

					if (!config) {
						return;
					}

					ctrl.$validators.url = function (modelValue) {
						var entity = scope.$eval(attrs.entity);
						var field = config.model || config.field;
						var dataService = config.formatterOptions ? config.formatterOptions.dataServiceName : null;

						if (entity && field) {
							//if (config.formatterOptions && config.formatterOptions.dataServiceName) {
								result = platformDataValidationService.validateUrl(entity, modelValue, field, 'platformUrlValidation', dataService);
							//}
						}

						return true;
					};
				}

				scope.isValid = function () {
					return !result.valid;
				};
			}
		};
	}
})(angular);
