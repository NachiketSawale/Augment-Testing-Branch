/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.fabricationunit';

	angular.module(moduleName).controller('productionplanningFabricationunitController',
		['$scope', 'platformMainControllerService', 'ppsFabricationunitDataService',
			'ppsFabricationunitTranslationService',
			function ($scope, platformMainControllerService, mainDataService,
			          translationService) {
				var opt = { search: true, reports: false };
				var sidebarReports = platformMainControllerService.registerCompletely($scope, mainDataService, {}, translationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mainDataService, sidebarReports, translationService, opt);
				});
			}]);
})();
