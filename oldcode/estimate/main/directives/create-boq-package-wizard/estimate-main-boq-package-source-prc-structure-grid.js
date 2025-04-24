/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainBoqPackageSourcePrcStructureGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-boq-package-source-prc-structure-grid.html',
			};
		}
	]);
})(angular);
