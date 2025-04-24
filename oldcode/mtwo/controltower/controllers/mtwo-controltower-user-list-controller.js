/**
 * Created by waldrop on 2019-06-20.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwoControlTowerUserListController
	 * @require $scope
	 * @description mtwoControlTowerUserListController controller for mtwo ControlTower user grid controller
	 *
	 */
	var moduleName = 'mtwo.controltower';

	angular.module(moduleName).controller('mtwoControlTowerUserListController', MtwoControlTowerUserListController);

	MtwoControlTowerUserListController.$inject = [
		'_',
		'$scope',
		'platformGridControllerService',
		'mtwoControlTowerUserListDataService',
		'mtwoControlTowerUserConfigurationService',
		'mtwoControlTowerValidationService',
		'mtwoControlTowerProReportsDataService',
		'mtwoControlTowerProDashboardService',
		'platformUserInfoService',
		'$injector',
		'$translate'];

	function MtwoControlTowerUserListController(
		_,
		$scope,
		platformGridControllerService,
		mtwoControlTowerUserListDataService,
		mtwoControlTowerUserConfigurationService,
		mtwoControlTowerValidationService,
		mtwoControlTowerProReportsDataService,
		mtwoControlTowerProDashboardService,
		platformUserInfoService,
		$injector,
		$translate) {

		var myGridConfig = {
			initCalled: false, columns: [], isFlatList: true,

			rowChangeCallBack: function rowChangeCallBack() {
				mtwoControlTowerProReportsDataService.load();
				mtwoControlTowerProDashboardService.load();
			}
		};

		function loadUserInfo() {
			platformUserInfoService.getUserInfoPromise(true).then(function (userInfo) {
				mtwoControlTowerUserListDataService.setUserInfo(userInfo);
			});
		}

		loadUserInfo();

		platformGridControllerService.initListController($scope, mtwoControlTowerUserConfigurationService, mtwoControlTowerUserListDataService, mtwoControlTowerValidationService, myGridConfig);

		var tools = [
			{
				id: 't2002',
				sort: 2002,
				caption: $translate.instant('mtwo.controltowerconfiguration.Refresh'),
				type: 'item',
				iconClass: 'control-icons ico-crefo3', // add the icon for update the data from powerbi wervice.
				disabled: function () {
					var selectedItem = mtwoControlTowerUserListDataService.getSelected();
					return _.isEmpty(selectedItem) || selectedItem.Version === 0 || !selectedItem.Authorized || !selectedItem.AzureadIntegrated;
				},
				fn: function downloadFromPowerBIService() {
					mtwoControlTowerUserListDataService.downloadPowerBIItems($scope).then(function (refresh) {
						if (refresh) {
							mtwoControlTowerProReportsDataService.load();
							mtwoControlTowerProDashboardService.load();
						}
					}, function (error) {
						console.log('Error for AzureAD: ' + error);
					});
				}
			}
		];

		platformGridControllerService.addTools(tools);

		var premium = $injector.get('mtwoControlTowerCommonService').getPremiumStatus();
		if (premium) {
			_.remove($scope.tools.items, function (item) {
				return (item);
			});
		}
	}
})(angular);
