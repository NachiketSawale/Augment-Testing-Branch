/**
 * Created by hae on 2018-07-02.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwo.mtwoControlTowerconfigurationListController
	 * @require $scoep
	 * @description mtwoControlTowerconfigurationListController controller for mtwo ControlTowerconfiguration main grid controller
	 *
	 */
	var moduleName = 'mtwo.controltowerconfiguration';

	angular.module(moduleName).controller('mtwoControlTowerConfigurationListController', MtwoControlTowerConfigurationListController);

	MtwoControlTowerConfigurationListController.$inject = [
		'$scope',
		'_',
		'platformGridControllerService',
		'mtwoControlTowerConfigurationMainService',
		'mtwoControlTowerConfigurationStandardConfigurationService',
		'mtwoControlTowerConfigurationValidationService', '$translate'];

	function MtwoControlTowerConfigurationListController(
		$scope,
		_,
		platformGridControllerService,
		mtwoControlTowerConfigurationMainService,
		mtwoControlTowerConfigurationItemConfigurationService,
		mtwoControlTowerConfigurationValidationService, $translate) {

		var myGridConfig = {
			initCalled: false, columns: [], isFlatList: true

		};

		$scope.availableFeatures = mtwoControlTowerConfigurationMainService.usageObject;

		platformGridControllerService.initListController($scope, mtwoControlTowerConfigurationItemConfigurationService, mtwoControlTowerConfigurationMainService, mtwoControlTowerConfigurationValidationService, myGridConfig);

		var tools = [
			{
				id: 't2002',
				sort: 2002,
				caption: $translate.instant('mtwo.controltowerconfiguration.Refresh'),
				type: 'item',
				iconClass: 'control-icons ico-crefo3',// add the icon for update the data from powerbi wervice.
				disabled: function () {
					return _.isEmpty(mtwoControlTowerConfigurationMainService.getSelected());
				},
				fn: function downloadFromPowerBIService() {
					mtwoControlTowerConfigurationMainService.DownloadPowerBIItems($scope);
				}
			},
			{
				id: 't2003',
				sort: 2003,
				caption: $translate.instant('mtwo.controltowerconfiguration.availableFeatures'),
				type: 'item',
				iconClass: 'control-icons ico-question',// add the icon for update the data from powerbi wervice.
				disabled: function () {
					return _.isEmpty(mtwoControlTowerConfigurationMainService.getSelected());
				},
				fn: function getAvailableFeatures() {
					mtwoControlTowerConfigurationMainService.GetUsage();
				}
			}
		];

		platformGridControllerService.addTools(tools);
	}
})(angular);
