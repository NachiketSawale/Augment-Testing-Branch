/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/** global globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainCostBudgetAssignDetailGrid
	 * @requires
	 * @description display a gridview to configure cost budget assignment
	 */

	angular.module(moduleName).directive('estimateMainCostBudgetAssignDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				template : $templateCache.get('estimate-main-cost-budget-assign-details.html')
			};
		}
	]);

})(angular);
