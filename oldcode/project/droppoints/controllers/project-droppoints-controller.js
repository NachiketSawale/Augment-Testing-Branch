/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'project.droppoints';

	angular.module(moduleName).controller('projectDroppointsController',
		['$scope', 'platformMainControllerService', 'projectDropPointsAreaDataService',
			'projectDropPointsTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, projectDropPointsAreaListController, projectDropPointsAreaDataService,
				projectDropPointsTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = projectDropPointsAreaListController.registerCompletely($scope, projectDropPointsAreaDataService, mc, projectDropPointsTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					projectDropPointsAreaListController.unregisterCompletely(projectDropPointsAreaDataService, sidebarReports, projectDropPointsTranslationService, opt);
				});
			}]);
})();
