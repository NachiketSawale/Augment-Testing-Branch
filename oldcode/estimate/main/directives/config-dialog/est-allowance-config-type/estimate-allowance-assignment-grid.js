
(function(angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateAllowanceAssignmentGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl +'estimate.main/templates/estimate-allowance-config-type/estimate-allowance-assignment-grid.html',
			};
		}
	]);

})(angular);