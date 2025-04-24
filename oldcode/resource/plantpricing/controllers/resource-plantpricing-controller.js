/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'resource.plantpricing';

	angular.module(moduleName).controller('resourcePlantpricingController',
		['$scope', 'platformMainControllerService', 'resourcePlantpricingPricelistTypeDataService',
			'resourcePlantpricingTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourcePlantpricingPricelistTypeDataService,
			          resourcePlantpricingTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, resourcePlantpricingPricelistTypeDataService, mc, resourcePlantpricingTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourcePlantpricingPricelistTypeDataService, sidebarReports, resourcePlantpricingTranslationService, opt);
				});
			}]);
})();
