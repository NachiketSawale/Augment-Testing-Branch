/**
 * Created by bel on 9/15/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainModifySpecifyResource
	 * @restrict A
	 * @description use in modify resource
	 */
	angular.module(moduleName).directive('estimateMainModifySpecifyResource', function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/replace-resource/estimate-main-modify-resource-specify-resource.html'
		};
	});

})(angular);
