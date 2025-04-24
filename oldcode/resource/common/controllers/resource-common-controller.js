/*
 * $Id: resource-common-controller.js 514490 2018-09-26 13:24:11Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.common';

	angular.module(moduleName).controller('resourceCommonController',
		['$scope', 'platformMainControllerService', 'resourceCommonDataService',
			'resourceCommonTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourceCommonDataService,
				resourceCommonTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceCommonDataService, mc, resourceCommonTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourceCommonDataService, sidebarReports, resourceCommonTranslationService, opt);
				});
			}]);
})();
