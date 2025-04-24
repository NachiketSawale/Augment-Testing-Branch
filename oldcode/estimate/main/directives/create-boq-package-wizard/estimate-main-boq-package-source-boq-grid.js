/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainBoqPackageSourceBoqGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-boq-package-generic-grid.html'
			};
		}
	]);
})(angular);
