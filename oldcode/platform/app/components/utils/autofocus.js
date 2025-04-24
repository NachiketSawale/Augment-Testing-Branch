/*
 * $Id: autofocus.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.platformAutofocus
	 * @restrict A
	 * @priority default value
	 * @description
	 * The HTML5 autofocus property can be tricky when it comes to dynamically loaded and compiled templates
	 * Use this simple directive to tame this beast once and for all.
	 *
	 * @example
	 * <input type="text" autofocus>
	 * <input type="text" data-autofocus="50">
	 * <input type="text" data-platform-autofocus="50">
	 */
	angular.module('platform')
		.directive('autofocus', autofocus)
		.directive('platformAutofocus', autofocus);

	autofocus.$inject = ['$timeout', '_'];

	function autofocus($timeout, _) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element, attrs) {
				if (_.isUndefined(attrs.domainControl)) {
					var timeout = parseInt(attrs.platformAutofocus || attrs.autofocus || '0');

					$timeout(function () {
						element[0].focus();
					}, _.isNaN(timeout) ? 0 : timeout);
				}
			}
		};
	}
})(angular);