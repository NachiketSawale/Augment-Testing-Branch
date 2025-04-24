/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainReplacedFieldsGrid
	 * @restrict A
	 * @description use in replace resource
	 */
	angular.module(moduleName).directive('estimateMainReplacedFieldsGrid', function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/replace-resource/estimate-main-replace-resource-fields-grid.html'
		};
	});

})(angular);
