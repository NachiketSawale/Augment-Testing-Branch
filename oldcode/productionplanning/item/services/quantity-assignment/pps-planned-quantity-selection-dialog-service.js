/**
 * Created by zwz on 8/15/2022.
 */

(function (angular) {
	'use strict';
	/* globals angular, _, Slick */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsPlannedQuantitySelectionDialogService', SelectionDialogService);

	SelectionDialogService.$inject = [
		'$http', '$q', '$interval',
		'platformTranslateService',
		'platformGridAPI',
		'ppsPlannedQuantityCommonUIService',
		'ppsCommonGridToolbarBtnService',
		'cloudCommonGridService',
		'$translate'];

	function SelectionDialogService(
		$http, $q, $interval,
		platformTranslateService,
		platformGridAPI,
		ppsPlannedQuantityCommonUIService,
		gridToolbarBtnService,
		cloudCommonGridService,
		$translate) {

		let service = {};
		const gridId = '6338ca1359044fbba9eb0b403ce94fd8';

		function getColumns(selectedPU) {
			let commonColumns = ppsPlannedQuantityCommonUIService.getPlannedQtyCommonColumns(selectedPU, gridId);
			return [{
				editor: 'boolean',
				field: 'Checked',
				formatter: 'boolean',
				id: 'checked',
				width: 60,
				pinned: true,
				headerChkbox: false,
				name: '*Checked',
				name$tr$: 'cloud.common.entityChecked'
			}].concat(commonColumns);
		}

		function getGridConfig(data, selectedPU) {
			return {
				id: gridId,
				state: gridId,
				columns: getColumns(selectedPU),
				options: {
					indicator: true,
					enableConfigSave: true,
					enableModuleConfig: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				data: data
			};

		}

		service.initial = function initial($scope, $options) {
			_.extend($scope, $options);
			// grid config
			let gridConfig = getGridConfig($scope.assignablePlannedQuantityList, $scope.selectedPU);
			gridConfig.columns.current = gridConfig.columns;
			$scope.grid = gridConfig;
			$scope.grid.gridId = $scope.grid.state;
			$scope.tempLookupControllerForLayoutBtns = gridToolbarBtnService.addToolsIncludesLayoutBtns($scope.grid);
			if (!platformGridAPI.grids.exist($scope.grid.gridId)) {
				platformGridAPI.grids.config(gridConfig);
			}
			function isValidationPassed() {
				if ($scope.grid.data.length > 0) {
					for (let item of $scope.grid.data) {
						if (item.__rt$data && item.__rt$data.errors && !_.isNil(item.__rt$data.errors.AssigningQuantity)) {
							return false;
						}
					}
				}
				return true;
			}
			function isCheckedAnyItem() {
				return _.some($scope.grid.data, (item) => {
					return item.Checked;
				});
			}
			$scope.isOKDisabled = function () {
				return !isCheckedAnyItem() || !isValidationPassed();
			};

			$scope.handleOK = function () {
				platformGridAPI.grids.commitAllEdits();
				if($scope.isOKDisabled()){
					return;
				}
				let checkedEntities = _.filter($scope.grid.data, function (item) {
					return item.Checked;
				});

				$scope.tempLookupControllerForLayoutBtns.destroy();
				$scope.$close(checkedEntities);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('productionplanning.drawing.quantityAssignment.quantitySelection.dialogTitle'),
				cancel: close
			};

			function close() {
				$scope.tempLookupControllerForLayoutBtns.destroy();
				return $scope.$close(false);
			}
		};

		return service;
	}
})(angular);