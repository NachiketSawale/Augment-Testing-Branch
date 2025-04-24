/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.ppscostcodes';

	angular.module(moduleName).controller('productionplanningPpscostcodesController',
		['$scope', 'platformMainControllerService', 'ppsCostCodesDataService', 'ppsCostCodesTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, ppsCostCodesDataService, ppsCostCodesTranslationService) {
				$scope.path = globals.appBaseUrl;
				const opt = { search: false, reports: true };
				const mc = {};
				const sidebarReports = platformMainControllerService.registerCompletely($scope, ppsCostCodesDataService, mc, ppsCostCodesTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(ppsCostCodesDataService, sidebarReports, ppsCostCodesTranslationService, opt);
				});
			}]);
})();
