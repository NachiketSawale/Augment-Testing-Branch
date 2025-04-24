
(function () {
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	/**
	 * @ngdoc controller
	 * @name controllingProjectcontrolsController
	 * @function
	 *
	 * @description
	 * Main controller for the controlling.projectcontrols module
	 **/
	angular.module(moduleName).controller('controllingProjectcontrolsController',
		['$scope', '$translate', 'platformMainControllerService','controllingProjectControlsTranslationService', 'cloudDesktopInfoService', 'controllingProjectcontrolsProjectMainListDataService',
			function ($scope, $translate, platformMainControllerService, controllingProjectControlsTranslationService, cloudDesktopInfoService, controllingProjectcontrolsProjectMainListDataService) {

				// Header info
				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameControllingProjectControls'));

				let options = {search: true, auditTrail: '824823e92d37400196fa05a850e972c0'};
				let configObject = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, controllingProjectcontrolsProjectMainListDataService, configObject, controllingProjectControlsTranslationService, moduleName, options);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(controllingProjectcontrolsProjectMainListDataService, sidebarReports, controllingProjectControlsTranslationService, options);
				});
			}]);
})();
