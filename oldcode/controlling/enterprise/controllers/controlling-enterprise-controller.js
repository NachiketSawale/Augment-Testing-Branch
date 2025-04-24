/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.enterprise';

	angular.module(moduleName).controller('controllingEnterpriseController',
		['globals', '$scope', 'platformMainControllerService', 'controllingEnterpriseTranslationService', 'cloudDesktopInfoService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (globals, $scope, platformMainControllerService, controllingEnterpriseTranslationService, cloudDesktopInfoService) {
				$scope.path = globals.appBaseUrl;
				// var opt = {search: false, reports: false};
				var mc = {};

				cloudDesktopInfoService.updateModuleInfo("cloud.desktop.moduleDisplayNameControllingEnterprise");

				var module = angular.module(moduleName);
				platformMainControllerService.registerWizards(module);
				platformMainControllerService.registerReports(module);
				platformMainControllerService.registerTranslation($scope, mc, controllingEnterpriseTranslationService);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterTranslation(controllingEnterpriseTranslationService);
					platformMainControllerService.unregisterReports();
					platformMainControllerService.unregisterWizards();
				});
			}]);
})();
