/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	angular.module(moduleName).controller('timekeepingTimecontrollingController',
		['$scope', 'platformMainControllerService', 'timekeepingTimecontrollingReportDataService',
			'timekeepingTimeControllingTranslationService', 'platformNavBarService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingTimecontrollingReportDataService, timekeepingTimeControllingTranslationService, platformNavBarService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingTimecontrollingReportDataService, mc, timekeepingTimeControllingTranslationService, moduleName, opt);
				platformNavBarService.setActionInVisible('refresh');
				$scope.$on('$destroy', function () {
					platformNavBarService.clearActions();
					platformMainControllerService.unregisterCompletely(timekeepingTimecontrollingReportDataService, sidebarReports, timekeepingTimeControllingTranslationService, opt);
				});
			}]);
})();
