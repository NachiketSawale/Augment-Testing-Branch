/**
 * Created by hae on 2018-07-02.
 */
(function (angular) {
	'use strict';

	/**
	 * @name mtwoControlTowerConfigurationController
	 * @function
	 */

	var moduleName = 'mtwo.controltowerconfiguration';

	angular.module(moduleName).controller('mtwoControltowerconfigurationController', MtwoControlTowerConfigurationController);

	MtwoControlTowerConfigurationController.$inject = ['$scope', '$translate', 'platformMainControllerService', 'platformNavBarService',
		'cloudDesktopInfoService', 'mtwoControlTowerConfigurationMainService',
		'mtwoControlTowerConfigurationItemService', 'mtwoControlTowerConfigurationTranslationService'];

	function MtwoControlTowerConfigurationController($scope, $translate, platformMainControllerService, platformNavBarService,
		cloudDesktopInfoService, mtwoControlTowerConfigurationMainService,
		mtwoControlTowerConfigurationItemService, mtwoControlTowerConfigurationTranslationService) {

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, mtwoControlTowerConfigurationMainService, configObject, mtwoControlTowerConfigurationTranslationService, moduleName, options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = mtwoControlTowerConfigurationTranslationService.getTranslate();
		}

		// register translation changed event
		mtwoControlTowerConfigurationTranslationService.registerUpdates(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			mtwoControlTowerConfigurationTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(mtwoControlTowerConfigurationMainService, sidebarReports, mtwoControlTowerConfigurationTranslationService, options);
		});
	}
})(angular);
