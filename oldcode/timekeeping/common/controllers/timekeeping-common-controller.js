/*
 * $Id: timekeeping-common-controller.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.common';

	angular.module(moduleName).controller('timekeepingCommonController',
		['$scope', 'platformMainControllerService', 'timekeepingCommonMainEntityNameDataService',
			'timekeepingCommonTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingCommonMainEntityNameDataService, timekeepingCommonTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: false, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingCommonMainEntityNameDataService, mc, timekeepingCommonTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingCommonMainEntityNameDataService, sidebarReports, timekeepingCommonTranslationService, opt);
				});
			}]);
})();
