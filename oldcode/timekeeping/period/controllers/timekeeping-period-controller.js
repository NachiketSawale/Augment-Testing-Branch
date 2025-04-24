/*
 * $Id: timekeeping-period-controller.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.period';

	angular.module(moduleName).controller('timekeepingPeriodController',
		['$scope', 'platformMainControllerService', 'timekeepingPeriodDataService',
			'timekeepingPeriodTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingPeriodDataService, timekeepingPeriodTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingPeriodDataService, mc, timekeepingPeriodTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingPeriodDataService, sidebarReports, timekeepingPeriodTranslationService, opt);
				});
			}]);
})();
