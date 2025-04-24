/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainBoqPackageAssignPage', estimateMainBoqPackageAssignPage);

	function estimateMainBoqPackageAssignPage() {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/create-package-boq/boq-package-assign-page.html',
		};
	}
})(angular);