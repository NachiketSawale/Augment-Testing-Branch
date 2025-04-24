/*
 * $Id: privacy-main-controller.js 630499 2021-03-30 06:45:13Z leo $
 * Copyright (c) RIB Software SE
 */

( (angular) => {
	'use strict';
	var moduleName = 'privacy.main';

	angular.module(moduleName).controller('privacyMainController',
		['$scope', 'platformMainControllerService', 'privacyMainPrivacyRequestDataService', 'privacyMainTranslationService', 'globals',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, privacyMainPrivacyRequestDataService, privacyMainTranslationService, globals) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: false, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, privacyMainPrivacyRequestDataService, mc, privacyMainTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(privacyMainPrivacyRequestDataService, sidebarReports, privacyMainTranslationService, opt);
				});
			}]);
})(angular);
