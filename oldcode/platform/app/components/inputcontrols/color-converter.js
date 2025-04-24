/*
 * $Id: color-converter.js 617454 2020-12-16 16:03:13Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformColorConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {

				ctrl.$formatters.push(function formatter(modelValue) {
					return !_.isNil(modelValue) ? _.padStart(modelValue.toString(16), 7, '#000000') : null;
				});

				ctrl.$parsers.push(function parser(viewValue) {
					return viewValue ? parseInt(viewValue.substring(1), 16) : null;
				});
			}
		};
	}
})(angular);
