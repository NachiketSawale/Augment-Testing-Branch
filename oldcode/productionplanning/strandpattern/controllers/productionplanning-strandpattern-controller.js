/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.strandpattern';

	angular.module(moduleName).controller('productionplanningStrandpatternController',
		['$scope', 'platformMainControllerService', 'productionplanningStrandpatternDataService',
			'productionplanningStrandpatternTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, productionplanningStrandpatternDataService,
			          productionplanningStrandpatternTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: true };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, productionplanningStrandpatternDataService, mc, productionplanningStrandpatternTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(productionplanningStrandpatternDataService, sidebarReports, productionplanningStrandpatternTranslationService, opt);
				});
			}]);
})();
