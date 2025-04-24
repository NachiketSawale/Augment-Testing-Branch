/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	/* global globals */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainReplacedFieldsGrid
	 * @restrict A
	 * @description use in replace resource
	 */
	angular.module(moduleName).directive('estimateMainRiskImportFieldsGrid', function () {
		return {
			restrict: 'A',
			// templateUrl: 'estimate-main-replace-resource-fields-grid.html'
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/risk/estimate-main-risk-import-fields-grid.html'
		};
	});

})(angular);
