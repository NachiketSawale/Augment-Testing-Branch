/*
 * $Id: numeric-code-converter.js 586668 2020-05-11 07:45:44Z kh $
 * Copyright (c) RIB Software GmbH
 */

// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformNumericCodeConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var codeLength = _.get(attrs, 'ngPatternRestrict', '{0,16}').match(/{\d+,(\d+)}/)[1] >> 0;
				var inForm = !attrs.grid;

				ctrl.$formatters.unshift(function formatter(modelValue) {
					return modelValue;
				});

				ctrl.$parsers.push(function parser(viewValue) {
					if (viewValue) {
						if (_.isString(viewValue)) {
							var trans = _.padStart(viewValue, codeLength, '0');

							if (inForm && trans !== viewValue) {
								ctrl.$setViewValue(trans);
								ctrl.$render();
							}

							return trans;
						}

						return viewValue;
					}

					return '';
				});
			}
		};
	}
})(angular);