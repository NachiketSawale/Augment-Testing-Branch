/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainTotalsConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure totals
	 */

	angular.module(moduleName).directive('estimateMainGroupSettingGrid', [function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-group-setting.html'
		};
	}
	]);

})(angular);
