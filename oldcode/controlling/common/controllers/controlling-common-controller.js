/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'controlling.common';

	angular.module(moduleName).controller('controllingCommonController',
		['$scope', 'platformMainControllerService', 'controllingCommonMainEntityNameDataService',
			'controllingCommonTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, controllingCommonMainEntityNameDataService,
				controllingCommonTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: false, reports: false};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, controllingCommonMainEntityNameDataService, mc, controllingCommonTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(controllingCommonMainEntityNameDataService, sidebarReports, controllingCommonTranslationService, opt);
				});
			}]);
})();
