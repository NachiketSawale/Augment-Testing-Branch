/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'resource.plantestimate';

	angular.module(moduleName).controller('resourcePlantestimateController',
		['$scope', 'platformMainControllerService', 'resourcePlantEstimateEquipmentDataService',
			'resourcePlantestimateTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourcePlantEstimateEquipmentDataService,
			          resourcePlantestimateTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, resourcePlantEstimateEquipmentDataService, mc, resourcePlantestimateTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourcePlantEstimateEquipmentDataService, sidebarReports, resourcePlantestimateTranslationService, opt);
				});
			}]);
})();
