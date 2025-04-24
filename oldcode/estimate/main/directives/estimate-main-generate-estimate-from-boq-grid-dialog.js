/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainGenerateEstimateFromBoqGridDialog
	 * @description
	 */
	angular.module(moduleName).directive('estimateMainGenerateEstimateFromBoqGridDialog',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/estimate-main-generate-estimate-from-boq-grid-dialog.html',
			};
		});
})();
