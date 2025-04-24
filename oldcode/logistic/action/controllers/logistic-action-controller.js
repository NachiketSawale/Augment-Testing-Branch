/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	var moduleName = 'logistic.action';
	angular.module(moduleName).controller('logisticActionController',
		['$scope', 'platformMainControllerService', 'logisticActionTargetDataService',
			'logisticActionTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, logisticActionTargetDataService,
			          logisticActionTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticActionTargetDataService, mc, logisticActionTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(logisticActionTargetDataService, sidebarReports, logisticActionTranslationService, opt);
				});
			}]);
})();
