/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).controller('controllingControllingunittemplateController',
		['$scope', 'platformMainControllerService', 'controllingControllingunittemplateDataService', 'controllingControllingunittemplateTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, controllingControllingunittemplateDataService, controllingControllingunittemplateTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: false};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, controllingControllingunittemplateDataService, mc, controllingControllingunittemplateTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(controllingControllingunittemplateDataService, sidebarReports, controllingControllingunittemplateTranslationService, opt);
				});
			}]);
})();
