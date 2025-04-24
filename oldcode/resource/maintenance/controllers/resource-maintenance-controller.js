/*
 * $Id: resource-maintenance-controller.js 537986 2019-03-19 16:58:29Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.maintenance';

	angular.module(moduleName).controller('resourceMaintenanceController',
		['$scope', 'platformMainControllerService', 'resourceMaintenanceSchemaDataService',
			'resourceMaintenanceTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourceMaintenanceSchemaDataService,
				resourceMaintenanceTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceMaintenanceSchemaDataService, mc, resourceMaintenanceTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourceMaintenanceSchemaDataService, sidebarReports, resourceMaintenanceTranslationService, opt);
				});
			}]);
})();
