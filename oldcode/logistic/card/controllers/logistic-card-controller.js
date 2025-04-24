/*
 * $Id: logistic-card-controller.js 553353 2019-08-05 05:43:23Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.card';

	angular.module(moduleName).controller('logisticCardController',
		['$scope', 'platformMainControllerService', 'logisticCardDataService', 'logisticCardTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, logisticCardDataService, logisticCardTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: true };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticCardDataService, mc, logisticCardTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(logisticCardDataService, sidebarReports, logisticCardTranslationService, opt);
				});
			}]);
})();
