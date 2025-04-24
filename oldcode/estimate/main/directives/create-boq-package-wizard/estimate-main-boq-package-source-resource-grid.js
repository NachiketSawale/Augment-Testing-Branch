/**
 * Created by chi on 2/20/2021.
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainBoqPackageSourceResourceGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-boq-package-source-resource-grid.html'
			};
		}
	]);
})(angular);
