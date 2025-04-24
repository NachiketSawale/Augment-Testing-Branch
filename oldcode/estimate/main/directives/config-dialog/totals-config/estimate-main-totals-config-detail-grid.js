/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainTotalsConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure totals
	 */

	angular.module(moduleName).directive('estimateMainTotalsConfigDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				// templateUrl: globals.appBaseUrl + 'estimate.main/templates/totals-config/estimate-main-totals-config-details.html'
				template : $templateCache.get('estimate-main-totals-config-details.html')
			};
		}
	]);

})(angular);
