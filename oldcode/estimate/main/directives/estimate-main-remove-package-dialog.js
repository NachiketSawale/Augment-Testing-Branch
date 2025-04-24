/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	/**
     * @ngdoc directive
     * @name estimateMainRemovePackageWizardGenerateGrid
     * @description
     */
	angular.module(moduleName).directive('estimateMainRemovePackageWizardGenerateGrid',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/estimate-main-remove-package-grid-dialog.html',
			};
		});
})();
