/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* globals globals */
	var moduleName = 'productionplanning.formworktype';

	angular.module(moduleName).controller('productionplanningFormworktypeController',
		['$scope', 'platformMainControllerService', 'productionplanningFormworktypeDataService',
			'productionplanningFormworktypeTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, dataService,
			          translationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, dataService, mc, translationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(dataService, sidebarReports, translationService, opt);
				});
			}]);
})();
