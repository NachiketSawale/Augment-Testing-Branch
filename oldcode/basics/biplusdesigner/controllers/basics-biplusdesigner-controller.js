/*
 * $Id: basics-biplusdesigner-controller.js 610993 2020-11-06 03:54:03Z lta $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'basics.biplusdesigner';

	angular.module(moduleName).controller('basicsBiPlusDesignerController',
		['$scope', 'platformMainControllerService', 'basicsBiPlusDesignerService',
			'basicsBiPlusDesignerTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, basicsBiPlusDesignerService,
			          basicsBiPlusDesignerTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsBiPlusDesignerService, mc, basicsBiPlusDesignerTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(basicsBiPlusDesignerService, sidebarReports, basicsBiPlusDesignerTranslationService, opt);
				});
			}]);
})();
