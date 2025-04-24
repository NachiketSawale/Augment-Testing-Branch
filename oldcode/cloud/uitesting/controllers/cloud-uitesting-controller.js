/*
 * $Id: cloud-uitesting-controller.js 614684 2020-11-25 13:28:11Z ong $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'cloud.uitesting';

	angular.module(moduleName).controller('cloudUitestingController',
		['$scope', 'platformMainControllerService',
			'cloudUitestingTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService,
			          cloudUitestingTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
//				var sidebarReports = platformMainControllerService.registerCompletely($scope, cloudUitestingMainEntityNameDataService, mc, cloudUitestingTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					//platformMainControllerService.unregisterCompletely(cloudUitestingMainEntityNameDataService, sidebarReports, cloudUitestingTranslationService, opt);
				});
			}]);
})();
