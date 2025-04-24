/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* globals globals */
	const moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).controller('productionplanningProductionplaceController',
		['$scope', 'platformMainControllerService', 'ppsProductionPlaceDataService',
			'productionplanningProductionPlaceTranslationService',
			'productionplanningProductionplaceWizardService',
			function ($scope, platformMainControllerService, dataService, translationService,
				productionplaceWizardService) {
				$scope.path = globals.appBaseUrl;
				const opt = { search: true, reports: false };
				const mc = {};
				const sidebarReports = platformMainControllerService.registerCompletely($scope, dataService, mc, translationService, moduleName, opt);

				productionplaceWizardService.activate();

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(dataService, sidebarReports, translationService, opt);
					productionplaceWizardService.deactivate();
				});
			}]);
})();
