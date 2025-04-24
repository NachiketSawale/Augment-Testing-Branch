/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'privacy.config';

	angular.module(moduleName).controller('privacyConfigController',
		['$scope', 'platformMainControllerService', 'privacyConfigPrivacyHandleTypeDataService',
			'privacyConfigTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, privacyConfigPrivacyHandleTypeDataService,
				privacyConfigTranslationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false };
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, privacyConfigPrivacyHandleTypeDataService, mc, privacyConfigTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(privacyConfigPrivacyHandleTypeDataService, sidebarReports, privacyConfigTranslationService, opt);
				});
			}]);
})();
