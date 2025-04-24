/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	angular.module(moduleName).controller('timekeepingCertificateController',
		['$scope', 'platformMainControllerService', 'timekeepingCertificateDataService',
			'timekeepingCertificateTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, timekeepingCertificateDataService,
				timekeepingCertificateTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingCertificateDataService, mc, timekeepingCertificateTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingCertificateDataService, sidebarReports, timekeepingCertificateTranslationService, opt);
				});
			}]);
})();
