/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* globals _ */

	/**
	 * @ngdoc controller
	 * @name estimate.estimateMainPowerBiController
	 * @require $scoep
	 * @description estimateMainPowerBiController controller for mtwo ControlTowerconfiguration item list controller
	 *
	 */
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainPowerBiController', EstimateMainPowerBiController);

	EstimateMainPowerBiController.$inject = [
		'$scope',
		'platformGridControllerService',
		'estimatePowerBiDataService',
		'mtwoControlTowerConfigurationItemConfigurationService',
		'mtwoControlTowerConfigurationValidationService'];

	function EstimateMainPowerBiController(
		$scope,
		platformGridControllerService,
		estimatePowerBiDataService,
		mtwoControlTowerConfigurationItemConfigurationService,
		mtwoControlTowerConfigurationValidationService) {

		let myGridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'groupid',
			childProp: 'ChildItems',
			cellChangeCallBack: function (arg) {
				estimatePowerBiDataService.markItemAsModified(arg.item);
			}
		};



		$scope.isLiveChanged = estimatePowerBiDataService.isLiveChanged;
		/* let currentColumns = angular.copy(mtwoControlTowerConfigurationItemConfigurationService.getStandardConfigForListView().columns);
		let newColumns = {
			getStandardConfigForListView: function () {
				return {columns: currentColumns};
			}
		}; */
		let listConfig = angular.copy(mtwoControlTowerConfigurationItemConfigurationService.getStandardConfigForListView());

		// set all grid columns readonly
		_.each(listConfig.columns, function (col) {
			if (col.editor) {
				col.editor = null;
				if (col.editorOptions) {
					col.editorOptions = null;
				}
			}
		});

		let uiConfigService = {
			getStandardConfigForListView: function () {
				return listConfig;
			}
		};
		platformGridControllerService.initListController($scope,uiConfigService, estimatePowerBiDataService, mtwoControlTowerConfigurationValidationService, myGridConfig);

		let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});

		$scope.tools.items.splice(createBtnIdx, 1);

		let deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
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
