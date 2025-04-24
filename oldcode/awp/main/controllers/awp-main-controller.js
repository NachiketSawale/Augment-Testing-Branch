/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'awp.main';

	angular.module(moduleName).controller('awpMainController',
		['$scope', '$translate', 'platformMainControllerService', 'cloudDesktopInfoService', 'awpProjectMainListDataService',
			'awpMainTranslationService',
			function ($scope, $translate, platformMainControllerService, cloudDesktopInfoService, mainDataService,
			          awpMainTranslationService) {
				$scope.path = globals.appBaseUrl;

				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameAdvancedWorkPackaging'));

				const opt = { search: true, reports: false };
				const mc = {};
				const sidebarReports = platformMainControllerService.registerCompletely($scope, mainDataService, mc, awpMainTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mainDataService, sidebarReports, awpMainTranslationService, opt);
				});
			}]);
})();
