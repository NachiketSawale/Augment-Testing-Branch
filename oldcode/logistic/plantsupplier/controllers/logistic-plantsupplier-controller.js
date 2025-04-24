/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	var moduleName = 'logistic.plantsupplier';
	angular.module(moduleName).controller('logisticPlantsupplierController',
		['$scope', 'platformMainControllerService', 'logisticPlantSupplierDataService',
			'logisticPlantSupplierTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, logisticPlantSupplierDataService,
				logisticPlantSupplierTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: true };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticPlantSupplierDataService, mc, logisticPlantSupplierTranslationService, moduleName, opt);
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(logisticPlantSupplierDataService, sidebarReports, logisticPlantSupplierTranslationService, opt);
				});
			}]);
})();