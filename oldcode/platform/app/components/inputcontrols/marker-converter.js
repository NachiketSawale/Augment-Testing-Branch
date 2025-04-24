/*
 * $Id: marker-converter.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformMarkerConverter', converter);

	converter.$inject = [];

	function converter() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$formatters.push(function (modelValue) {
					if (modelValue !== undefined && modelValue !== null) {
						return modelValue.toString();
					}

					return modelValue;
				});

				ctrl.$parsers.push(function (viewValue) {
					if (viewValue !== undefined && viewValue !== null) {
						return viewValue === 'true';
					}

					return viewValue;
				});
			}
		};
	}
})(angular);