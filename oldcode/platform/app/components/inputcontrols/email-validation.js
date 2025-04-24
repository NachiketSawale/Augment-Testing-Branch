/*
 * $Id: email-validation.js 471226 2017-11-30 13:12:56Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformEmailValidation', platformValidation);

	platformValidation.$inject = ['_', 'platformRuntimeDataService'];

	function platformValidation(_, platformRuntimeDataService) {
		return {
			restrict: 'A',
			require: '^ngModel',
			scope: false,
			link: function (scope, element, attrs, ctrl) {
				if (ctrl.$validators.email) {
					var config = !_.isUndefined(attrs.grid) ? scope.config : scope.$eval(attrs.config);
					var regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
					var regex2 = /@[\s\S]*@/;

					if (!config) {
						return;
					}

					ctrl.$validators.email = function (modelValue) {
						var entity = scope.$eval(attrs.entity);
						var field = config.model || config.field;

						if (entity && field && _.get(entity, field, modelValue) !== modelValue) {
							var valid = {
								valid: _.isNil(modelValue) || _.isEmpty(modelValue) || regex1.test(modelValue) && !regex2.test(modelValue),
								error$tr$: 'platform.errorMessage.email'
							};

							platformRuntimeDataService.applyValidationResult(valid, entity, field);
						}

						return true;
					};
				}
			}
		};
	}
})(angular);