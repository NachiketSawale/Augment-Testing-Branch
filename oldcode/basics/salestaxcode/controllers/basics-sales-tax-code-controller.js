/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'basics.salestaxcode';

	angular.module(moduleName).controller('basicsSalesTaxCodeController',
		['$scope', 'platformMainControllerService', 'basicsSalesTaxCodeMainService', 'platformNavBarService',
			'basicsSalesTaxCodeTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, basicsSalesTaxCodeMainService, platformNavBarService, basicsSalesTaxCodeTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: true};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsSalesTaxCodeMainService, mc, basicsSalesTaxCodeTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(basicsSalesTaxCodeMainService, sidebarReports, basicsSalesTaxCodeTranslationService, opt);
				});
			}]);
})();
