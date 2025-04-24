/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainDetailsParamDialog
	 * @requires
	 * @description
	 */
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainDetailsParamDialog', function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/details-parameters-dialog/estimate-main-details-param-list.html'
		};
	});
})();
