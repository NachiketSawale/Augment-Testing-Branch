/*
 * $Id: iban-validation.js 470902 2017-11-29 08:06:49Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformIBANValidation', converter);

	converter.$inject = ['_', 'IBAN', 'platformRuntimeDataService'];

	function converter(_, IBAN, platformRuntimeDataService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var config = !_.isUndefined(attrs.grid) ? scope.config : scope.$eval(attrs.config);

				ctrl.$validators.iban = function (modelValue) {
					var entity = scope.$eval(attrs.entity);
					var field = config.model || config.field;

					if (entity && _.get(entity, field, modelValue) !== modelValue) {
						var valid = {
							valid: _.isNil(modelValue) || _.isEmpty(modelValue) || IBAN.isValid(modelValue),
							error$tr$: 'platform.errorMessage.iban'
						};

						platformRuntimeDataService.applyValidationResult(valid, entity, field);
					}
					return true;
				};
			}
		};
	}
})(angular);