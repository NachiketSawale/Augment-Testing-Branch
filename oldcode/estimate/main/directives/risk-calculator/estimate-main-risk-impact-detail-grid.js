/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainTotalsConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure totals
	 */

	angular.module(moduleName).directive('estimateMainRiskImpactDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				template : $templateCache.get('estimate-main-risk-impact.html')
			};
		}
	]);

})(angular);
