/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.formwork';

	angular.module(moduleName).controller('productionplanningFormworkController',
		['$scope', 'platformMainControllerService', 'ppsFormworkDataService',
			'productionplanningFormworkTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, ppsFormworkDataService,
			          productionplanningFormworkTranslationService) {

				var opt = { search: true, reports: true };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, ppsFormworkDataService, mc, productionplanningFormworkTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(ppsFormworkDataService, sidebarReports, productionplanningFormworkTranslationService, opt);
				});
			}]);
})();
