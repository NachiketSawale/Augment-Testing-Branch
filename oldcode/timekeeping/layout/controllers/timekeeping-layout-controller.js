/*
 * $Id: timekeeping-layout-controller.js 553911 2019-08-07 16:39:59Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.layout';

	angular.module(moduleName).controller('timekeepingLayoutController',
		['$scope', 'platformMainControllerService', 'timekeepingLayoutUserInterfaceLayoutDataService',
			'timekeepingLayoutTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingLayoutUserInterfaceLayoutDataService, timekeepingLayoutTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingLayoutUserInterfaceLayoutDataService, mc, timekeepingLayoutTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingLayoutUserInterfaceLayoutDataService, sidebarReports, timekeepingLayoutTranslationService, opt);
				});
			}]);
})();
