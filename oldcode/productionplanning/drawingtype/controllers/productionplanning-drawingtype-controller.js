/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* globals globals */
	var moduleName = 'productionplanning.drawingtype';

	angular.module(moduleName).controller('productionplanningDrawingtypeController',
		['$scope', 'platformMainControllerService', 'productionPlanningDrawingTypeDataService',
			'productionPlanningDrawingTypeTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, productionPlanningDrawingTypeDataService,
			          productionPlanningDrawingTypeTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, productionPlanningDrawingTypeDataService, mc, productionPlanningDrawingTypeTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(productionPlanningDrawingTypeDataService, sidebarReports, productionPlanningDrawingTypeTranslationService, opt);
				});
			}]);
})();
