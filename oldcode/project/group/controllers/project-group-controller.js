/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'project.group';

	angular.module(moduleName).controller('projectGroupController',
		['$scope', 'platformMainControllerService', 'projectGroupProjectGroupDataService', 'projectGroupTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, projectGroupProjectGroupDataService, projectGroupTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, projectGroupProjectGroupDataService, mc, projectGroupTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(projectGroupProjectGroupDataService, sidebarReports, projectGroupTranslationService, opt);
				});
			}]);
})();
