/*
 * $Id: timekeeping-paymentgroup-controller.js 624376 2021-02-22 07:01:45Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	angular.module(moduleName).controller('timekeepingPaymentgroupController',
		['$scope', 'platformMainControllerService', 'timekeepingPaymentGroupDataService',
			'timekeepingPaymentGroupTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingPaymentGroupDataService, timekeepingPaymentGroupTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: false};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingPaymentGroupDataService, mc, timekeepingPaymentGroupTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingPaymentGroupDataService, sidebarReports, timekeepingPaymentGroupTranslationService, opt);
				});
			}]);
})();
