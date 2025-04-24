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

	angular.module(moduleName).directive('estimateMainEstRuleParamsDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				template : $templateCache.get('estimate-main-rule-params-details.html')
			};
		}
	]);

})(angular);
