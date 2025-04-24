/**
 * $Id: boq-main-rounding-config-detail-grid.js 44255 2022-07-01 12:51:53Z joshi $
 * Copyright (c) RIB Software SE
 */

(function() {
	/* global globals */ 
	'use strict';
	let moduleName = 'boq.main';

	/**
	 * @ngdoc directive
	 * @name boqMainRoundingConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure rounding
	 */

	angular.module(moduleName).directive('boqMainRoundingConfigDetailGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + '/boq.main/templates/boq-main-rounding-config-details.html'
			};
		}
	]);

})();