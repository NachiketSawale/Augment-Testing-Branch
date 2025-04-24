(function (angular) {

	'use strict';
	let moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementRequisitionSelectItemVariantController', procurementRequisitionSelectItemVariantController);

	procurementRequisitionSelectItemVariantController.$inject = ['_','$scope', '$translate', 'reportingPrintService','procurementCommonItemUIStandardService', 'procurementCommonPrcItemDataService', 'procurementRequisitionItemVariantService', 'platformGridAPI', 'platformTranslateService'];

	function procurementRequisitionSelectItemVariantController(_, $scope, $translate,reportingPrintService, procurementCommonItemUIStandardService, procurementCommonPrcItemDataService, procurementRequisitionItemVariantService, platformGridAPI, platformTranslateService) {

		$scope.currentItemGridId = '9313561132C1445980DEE0B787613A86';
		$scope.prcItemGridData = {
			state: $scope.currentItemGridId
		};
		let variantId = $scope.$parent.modalOptions.value.variantId;
		loadItemGrid();

		function loadItemVariant() {
			procurementRequisitionItemVariantService.loadItemVariant(variantId).then(function (res) {
				let itemVariantData = res.data;
				let itemList = procurementCommonPrcItemDataService.getService().getList();
				_.forEach(itemList, function (item) {
					let hasItemVariant = _.find(itemVariantData, function (itemVariant) {
						return item.Id === itemVariant.Id;
					});
					if (hasItemVariant) {
						item.IsChecked = true;
					}
					else{
						item.IsChecked = false;
					}
				});
				platformGridAPI.items.data($scope.currentItemGridId, itemList);
			});
		}

		function setTools(tools) {
			$scope.tools = tools || {};
			$scope.tools.update = function () {
			};
		}

		function loadItemGrid() {
			let columns = procurementCommonItemUIStandardService.getStandardConfigForListView().columns;
			let tempColumns = angular.copy(columns);
			_.forEach(tempColumns, function (o) {
				o.readonly = true;
				o.editor = null;
				o.navigator = null;
			});
			let colDef = {
				id: 'IsChecked',
				field: 'IsChecked',
				name$tr$: 'procurement.requisition.variant.check',
				formatter: 'boolean',
				editor: 'boolean',
				width: 50,
				sortable: true
			};
			tempColumns.unshift(colDef);
			if (platformGridAPI.grids.exist($scope.currentItemGridId)) {
				platformGridAPI.grids.unregister($scope.currentItemGridId);
			}
			if (!platformGridAPI.grids.exist($scope.currentItemGridId)) {
				let grid = {
					data: [],
					columns: angular.copy(tempColumns),
					id: $scope.currentItemGridId,
					options: {
						indicator: true,
						iconClass: '',
						enableDraggableGroupBy: true,
						enableColumnSort:true,
						enableModuleConfig: true,
						enableConfigSave: true
					},
					lazyInit: true,
					enableConfigSave: true
				};
				platformGridAPI.grids.config(grid);
				platformTranslateService.translateGridConfig(grid.columns);
				setTools(
					{
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 't16',
								sort: 10,
								caption: 'cloud.common.taskBarGrouping',
								type: 'check',
								iconClass: 'tlb-icons ico-group-columns',
								fn: function () {
									platformGridAPI.grouping.toggleGroupPanel($scope.currentItemGridId, this.value);
								},
								value: platformGridAPI.grouping.toggleGroupPanel($scope.currentItemGridId),
								disabled: false
							},
							{
								id: 't2',
								sort: 111,
								caption: 'cloud.common.print',
								iconClass: 'tlb-icons ico-print-preview',
								type: 'item',
								fn: function () {
									reportingPrintService.printGrid($scope.currentItemGridId);
								}
							},
							{
								id: 't4',
								caption: 'cloud.common.toolbarSearch',
								type: 'check',
								value: platformGridAPI.filters.showSearch($scope.currentItemGridId),
								iconClass: 'tlb-icons ico-search',
								fn: function () {
									platformGridAPI.filters.showSearch($scope.currentItemGridId, this.value);
								}
							},
							{
								id: 't111',
								sort: 112,
								caption: 'cloud.common.gridlayout',
								iconClass: 'tlb-icons ico-settings',
								type: 'item',
								fn: function () {
									platformGridAPI.configuration.openConfigDialog($scope.currentItemGridId);
								}
							}
						]
					});
			}
			loadItemVariant();
		}

		$scope.okClicked = function () {
			platformGridAPI.grids.commitAllEdits();
			let grid = platformGridAPI.grids.element('id', $scope.currentItemGridId);
			let gridDatas = grid.dataView.getRows();
			let selectedData = _.filter(gridDatas, function (item) {
				return item.IsChecked;
			});
			let items = [];
			_.forEach(selectedData, function (item) {
				items.push({
					ReqVariantFk: variantId,
					PrcItemFk: item.Id
				});
			});
			procurementRequisitionItemVariantService.saveChangedItems({
				ReqVariantFk: variantId,
				ItemVariantDtoList: items
			}).then(function () {
				$scope.$parent.$close(true);
				procurementRequisitionItemVariantService.load();
			}
			);
		};

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.currentItemGridId);
		});
	}

})(angular);