/*
 * $Id: iban-converter.js 467822 2017-11-13 15:40:35Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformIBANConverter', converter);

	converter.$inject = ['_', 'IBAN'];

	function converter(_, IBAN) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$formatters.unshift(function (modelValue) {
					if (!_.isNil(modelValue)) {
						return IBAN.printFormat(modelValue);
					}
					return modelValue;
				});

				ctrl.$parsers.push(function (viewValue) {
					if (!_.isNil(viewValue) && IBAN.isValid(viewValue)) {
						var model = IBAN.electronicFormat(viewValue);
						var trans = IBAN.printFormat(model);

						if (trans !== viewValue) {
							ctrl.$setViewValue(trans);
							ctrl.$render();
						}

						return model;
					}

					return viewValue;
				});
			}
		};
	}
})(angular);