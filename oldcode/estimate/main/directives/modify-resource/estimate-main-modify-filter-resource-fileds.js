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
	 * @name estimateMainModifyFilterResourceFileds
	 * @restrict A
	 * @description use in modify resource
	 */
	angular.module(moduleName).directive('estimateMainModifyFilterResourceFileds', function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/replace-resource/estimate-main-modify-filter-resource-fields.html'
		};
	});

})(angular);
