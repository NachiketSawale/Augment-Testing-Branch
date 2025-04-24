(function() {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc directive
	 * @name timekeepingRoundingConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure rounding
	 */

	angular.module(moduleName).directive('timekeepingRoundingConfigDetailGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + '/timekeeping.recording/templates/timekeeping-rounding-config-details.html'
			};
		}
	]);

})();