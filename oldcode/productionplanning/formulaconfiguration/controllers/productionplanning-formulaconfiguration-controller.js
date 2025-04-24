/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('productionplanningFormulaconfigurationController',
		['$scope', 'platformMainControllerService', 'ppsFormulaDataService',
			'productionPlanningFormulaConfigurationTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, ppsFormulaDataService,
			          productionPlanningFormulaConfigurationTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: true };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, ppsFormulaDataService, mc, productionPlanningFormulaConfigurationTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(ppsFormulaDataService, sidebarReports, productionPlanningFormulaConfigurationTranslationService, opt);
				});
			}]);
})();
