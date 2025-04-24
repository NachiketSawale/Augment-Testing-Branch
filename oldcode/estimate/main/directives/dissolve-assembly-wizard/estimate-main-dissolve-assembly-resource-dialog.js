
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainDissolveAssemblyResourceDialog
	 * @description
	 */
	angular.module(moduleName).directive('estimateMainDissolveAssemblyResourceDialog',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/dissolve-assembly/estimate-main-dissolve-assembly-resource-dialog-grid.html',
			};
		});
})();
