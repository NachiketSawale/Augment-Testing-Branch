/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function () {
	'use strict';
	var moduleName = 'procurement.inventory';

	angular.module(moduleName).controller('procurementInventoryController',
		['$scope', 'platformMainControllerService', 'procurementInventoryHeaderDataService',
			'procurementInventoryHeaderTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, procurementInventoryHeaderDataService,
				procurementInventoryHeaderTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false,auditTrail:'a2b068b9963f4bb3a2f6a5118c6af471' };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, procurementInventoryHeaderDataService, mc, procurementInventoryHeaderTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(procurementInventoryHeaderDataService, sidebarReports, procurementInventoryHeaderTranslationService, opt);
				});
			}]);
})();
