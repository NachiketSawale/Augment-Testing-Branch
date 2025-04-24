/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.settlement';

	angular.module(moduleName).controller('timekeepingSettlementController',
		['$scope', 'platformMainControllerService', 'timekeepingSettlementDataService',
			'timekeepingSettlementTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingSettlementDataService, timekeepingSettlementTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingSettlementDataService, mc, timekeepingSettlementTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingSettlementDataService, sidebarReports, timekeepingSettlementTranslationService, opt);
				});
			}]);
})();
