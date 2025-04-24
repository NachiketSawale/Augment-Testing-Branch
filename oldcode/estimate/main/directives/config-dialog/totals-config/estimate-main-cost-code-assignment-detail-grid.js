/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainCostCodeAssignmentDetailGrid
	 * @requires
	 * @description display a gridview to configure cost code assignment
	 */

	angular.module(moduleName).directive('estimateMainCostCodeAssignmentDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				template : $templateCache.get('estimate-main-cost-code-assignment-details.html')
			};
		}
	]);

})(angular);
