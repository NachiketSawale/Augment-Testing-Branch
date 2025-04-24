
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainRemovePackageResourcesDialog
	 * @requires
	 * @description dialog grid to select the resources to remove Package
	 * */
	angular.module(moduleName).directive('estimateMainRemovePackageResourcesDialog',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/remove-package/estimate-main-remove-package-resources-dialog.html',
			};
		});
})(angular);
