/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainSummaryCombineGrid
	 * @restrict A
	 * @description use in resource summary config dialog
	 */
	/* global globals */
	angular.module(moduleName).directive('estimateMainSummaryCombineGrid', function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/resource-summary/estimate-main-resource-summary-config-grid.html',
			controller: 'estimateMainResourceSummaryCombineGridController'
		};
	});

})(angular);
