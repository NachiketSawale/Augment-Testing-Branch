/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'services.schedulerui';

	angular.module(moduleName).controller('servicesScheduleruiController',
		['$scope', 'platformMainControllerService', 'servicesSchedulerUIJobDataService',
			'servicesScheduleruiTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, servicesSchedulerUIJobDataService,
			          servicesScheduleruiTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, servicesSchedulerUIJobDataService, mc, servicesScheduleruiTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(servicesSchedulerUIJobDataService, sidebarReports, servicesScheduleruiTranslationService, opt);
				});
			}]);
})();
