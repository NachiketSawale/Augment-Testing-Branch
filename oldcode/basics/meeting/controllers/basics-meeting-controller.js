/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsMeetingController',
		['$scope', 'platformMainControllerService', 'basicsMeetingMainService', 'basicsMeetingTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, basicsMeetingMainService, basicsMeetingTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, basicsMeetingMainService, mc, basicsMeetingTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(basicsMeetingMainService, sidebarReports, basicsMeetingTranslationService, opt);
				});
			}]);
})();
