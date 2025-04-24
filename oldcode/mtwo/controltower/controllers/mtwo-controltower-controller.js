	/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	'use strict';

	/**
	 * @name mtwoControltowerController
	 * @function
	 */

	var moduleName = 'mtwo.controltower';

	angular.module(moduleName).controller('mtwoControltowerController', MtwoControltowerController);
	MtwoControltowerController.$inject = [
		'$scope',
		'$translate',
		'$injector',
		'platformMainControllerService',
		'platformNavBarService',
		'cloudDesktopInfoService',
		'mtwoControlTowerMainService',
		'mtwoControlTowerDataPineDashboardsService',
		'mtwoControlTowerReportsService',
		'mtwoControlTowerTranslationService',
		'mtwoControlTowerUserListDataService',
		'mtwoControlTowerProReportsDataService',
		'mtwoControlTowerProDashboardService'];

	function MtwoControltowerController(
		$scope,
		$translate,
		$injector,
		platformMainControllerService,
		platformNavBarService,
		cloudDesktopInfoService,
		mtwoControlTowerMainService,
		mtwoControlTowerDataPineDashboardsService,
		mtwoControlTowerReportsService,
		mtwoControlTowerTranslationService,
		mtwoControlTowerUserListDataService,
		mtwoControlTowerProReportsDataService,
		mtwoControlTowerProDashboardService) {
		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, mtwoControlTowerUserListDataService, configObject,
			mtwoControlTowerTranslationService, moduleName, options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = mtwoControlTowerTranslationService.getTranslate();
		}

		// register translation changed event
		mtwoControlTowerTranslationService.registerUpdates(loadTranslations);

		function refresh() {
			mtwoControlTowerDataPineDashboardsService.load();
			// Wall behind Premium
			var premium = $injector.get('mtwoControlTowerCommonService').getPremiumStatus();
			if (premium) {
				mtwoControlTowerMainService.load().then(function () {
					mtwoControlTowerReportsService.load();
				});
			} else {
				mtwoControlTowerUserListDataService.refresh().then(function () {
					if (mtwoControlTowerUserListDataService.hasSelection()) {
						mtwoControlTowerProReportsDataService.load();
						mtwoControlTowerProDashboardService.load();
					}
				});
			}
		}

		// regresh button on navigation
		platformNavBarService.getActionByKey('refresh').fn = refresh;
		// mtwoControlTowerReportsService.listLoaded = new PlatformMessenger();
		// mtwoControlTowerReportsService.listLoaded.register(refresh);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			mtwoControlTowerTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(mtwoControlTowerMainService, sidebarReports, mtwoControlTowerTranslationService, options);
		});
	}
})(angular);
