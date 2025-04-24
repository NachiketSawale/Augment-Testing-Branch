/**
 * Created by waldrop on 2020-03-27.
 */
(function (angular) {
	'use strict';
	/* globals _ */

	/**
	 * @ngdoc controller
	 * @name estimate.estimateMainPowerBiController
	 * @require $scoep
	 * @description estimateMainPowerBiController controller for mtwo ControlTowerconfiguration item list controller
	 *
	 */
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).controller('constructionsystemMasterPowerBiListController',ConstructionsystemMasterowerBiListController);

	ConstructionsystemMasterowerBiListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'constructionsystemMasterPowerBiDataService',
		'mtwoControlTowerConfigurationItemConfigurationService',
		'mtwoControlTowerConfigurationValidationService'];

	function ConstructionsystemMasterowerBiListController(
		$scope,
		platformGridControllerService,
		constructionsystemMasterPowerBiDataService,
		mtwoControlTowerConfigurationItemConfigurationService,
		mtwoControlTowerConfigurationValidationService) {

		var myGridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'groupid',
			childProp: 'ChildItems',
			cellChangeCallBack: function (arg) {
				constructionsystemMasterPowerBiDataService.markItemAsModified(arg.item);
			}
		};



		$scope.isLiveChanged = constructionsystemMasterPowerBiDataService.isLiveChanged;
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
		platformGridControllerService.initListController($scope,uiConfigService, constructionsystemMasterPowerBiDataService, mtwoControlTowerConfigurationValidationService, myGridConfig);

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
