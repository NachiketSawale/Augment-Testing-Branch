/**
 * Created by waldrop on 2020-03-27.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc controller
	 * @name estimate.estimateMainPowerBiController
	 * @require $scoep
	 * @description estimateMainPowerBiController controller for mtwo ControlTowerconfiguration item list controller
	 *
	 */
	var moduleName = 'procurement.quote';

	angular.module(moduleName).controller('procurementQuoteMainPowerBiListController', ProcurementQuoteMainPowerBiListController);

	ProcurementQuoteMainPowerBiListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'procurementQuoteMainPowerBiDataService',
		'mtwoControlTowerConfigurationItemConfigurationService',
		'mtwoControlTowerConfigurationValidationService'];

	function ProcurementQuoteMainPowerBiListController(
		$scope,
		platformGridControllerService,
		procurementQuoteMainPowerBiDataService,
		mtwoControlTowerConfigurationItemConfigurationService,
		mtwoControlTowerConfigurationValidationService) {

		var myGridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'groupid',
			childProp: 'ChildItems',
			cellChangeCallBack: function (arg) {
				procurementQuoteMainPowerBiDataService.markItemAsModified(arg.item);
			}
		};



		$scope.isLiveChanged = procurementQuoteMainPowerBiDataService.isLiveChanged;
		/* var currentColumns = angular.copy(mtwoControlTowerConfigurationItemConfigurationService.getStandardConfigForListView().columns);
		var newColumns = {
			getStandardConfigForListView: function () {
				return {columns: currentColumns};
			}
		}; */
		var listConfig = angular.copy(mtwoControlTowerConfigurationItemConfigurationService.getStandardConfigForListView());

		// set all grid columns readonly
		_.each(listConfig.columns, function (col) {
			if (col.editor) {
				col.editor = null;
				if (col.editorOptions) {
					col.editorOptions = null;
				}
			}
		});

		var uiConfigService = {
			getStandardConfigForListView: function () {
				return listConfig;
			}
		};
		platformGridControllerService.initListController($scope,uiConfigService, procurementQuoteMainPowerBiDataService, mtwoControlTowerConfigurationValidationService, myGridConfig);

		var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});

		$scope.tools.items.splice(createBtnIdx, 1);

		var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'delete';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'createChild';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't14';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

	}
})(angular);
