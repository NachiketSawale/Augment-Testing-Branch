/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName).controller('timekeepingWorktimemodelController',
		['$scope', 'platformMainControllerService', 'timekeepingWorkTimeModelDataService',
			'timekeepingWorkTimeModelTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingWorkTimeModelDataService, timekeepingWorkTimeModelTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingWorkTimeModelDataService, mc, timekeepingWorkTimeModelTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingWorkTimeModelDataService, sidebarReports, timekeepingWorkTimeModelTranslationService, opt);
				});
			}]);
})();
