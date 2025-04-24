/*
 * $Id: project-calendar-controller.js 541617 2019-04-16 05:02:52Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'project.calendar';

	angular.module(moduleName).controller('projectCalendarController',
		['$scope', 'platformMainControllerService', 'projectCalendarCalendarDataService',
			'projectCalendarTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, projectCalendarCalendarDataService, projectCalendarTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, projectCalendarCalendarDataService, mc, projectCalendarTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					projectCalendarCalendarDataService.setReadOnly(false);
					platformMainControllerService.unregisterCompletely(projectCalendarCalendarDataService, sidebarReports, projectCalendarTranslationService, opt);
				});
			}]);
})();
