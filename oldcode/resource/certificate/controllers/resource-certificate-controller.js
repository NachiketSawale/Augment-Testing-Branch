/*
 * $Id: resource-certificate-controller.js 553910 2019-08-07 16:33:39Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.certificate';

	angular.module(moduleName).controller('resourceCertificateController',
		['$scope', 'platformMainControllerService', 'resourceCertificateDataService',
			'resourceCertificateTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, resourceCertificateDataService,
				resourceCertificateTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: true, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceCertificateDataService, mc, resourceCertificateTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(resourceCertificateDataService, sidebarReports, resourceCertificateTranslationService, opt);
				});
			}]);
})();
