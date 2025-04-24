/*
 * $Id: resource-wot-controller.js 553910 2019-08-07 16:33:39Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.wot';

	angular.module(moduleName).controller('resourceWotController',
		['$scope', 'platformMainControllerService', 'resourceWotWorkOperationTypeDataService',
			'resourceWotTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourceWotWorkOperationTypeDataService,
				resourceWotTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceWotWorkOperationTypeDataService, mc, resourceWotTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourceWotWorkOperationTypeDataService, sidebarReports, resourceWotTranslationService, opt);
				});
			}]);
})();
