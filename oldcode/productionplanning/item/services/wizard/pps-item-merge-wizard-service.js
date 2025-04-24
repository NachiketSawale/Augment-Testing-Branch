/**
 * Created by anl on 7/23/2020.
 */

(function (angular) {
	'use strict';
	/*global Slick, globals, angular*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemMergeWizardService', MergeItemWizardService);

	MergeItemWizardService.$inject = [
		'_',
		'$http',
		'$injector',
		'platformGridAPI',
		'platformModalService',
		'productionplanningItemUIStandardService',
		'basicsLookupdataLookupDescriptorService'];

	function MergeItemWizardService(
		_,
		$http,
		$injector,
		platformGridAPI,
		platformModalService,
		itemUIStandardService,
		basicsLookupdataLookupDescriptorService) {

		var service = {};
		var scope = {};
		var checkedItem = null;

		var itemGridConfig = {
			state: '84958a40167d43dbaf3defb04cfd5263',
			columns: initItemColumns()
		};

		service.initial = function initial($scope, ppsItems) {

			//$scope.isLoading = true;
			var itemGrid = {
				id: itemGridConfig.state,
				title: 'productionplanning.item.listTitle',
				data: _.cloneDeep(ppsItems),
				columns: itemGridConfig.columns,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: itemGridConfig.state,
				toolbarItemsDisabled: false
			};
			platformGridAPI.grids.config(itemGrid);

			$scope.itemGrid = itemGrid;

			$scope.isOKDisabled = isOKDisabled;

			scope = $scope;
		};

		service.checkSelectedItems = function checkSelectedItems(ppsItems) {
			var ids = _.map(ppsItems, 'Id');
			var statusIds = _.map(ppsItems, 'PPSItemStatusFk');
			var postData = {itemIds: ids, statusIds: statusIds};
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/checkSelectedItems', postData);
		};

		service.updateCheck = function updateCheck(checking) {
			checking.IsLive = true;
			checking.Checked = true;
			if (checkedItem === null) {
				checkedItem = checking;
			} else {
				clearCheck();
				checkedItem = checking;
			}

			var otherItems = getOtherItems();
			if (!checkTargetPU(checkedItem, otherItems)) {
				clearCheck();
			}
		};

		service.setDefaultSelected = function setDefaultSelected(){
			var defaultItem = getFirstItem();
			if(defaultItem !== null) {
				service.updateCheck(defaultItem);
				platformGridAPI.rows.refreshRow({
					'gridId': scope.itemGrid.state,
					'item': checkedItem
				});
				scope.itemGrid.instance.setSelectedRows([0]);
			}
		};

		service.showWarningInfo = function showWarningInfo(result) {
			switch (result) {
				case 1:
					platformModalService.showErrorBox('productionplanning.item.wizard.haveChildWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 2:
					platformModalService.showErrorBox('productionplanning.item.wizard.wrongStatesWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 3:
					platformModalService.showErrorBox('productionplanning.item.wizard.diffMaterialGroupWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 4:
					platformModalService.showErrorBox('productionplanning.item.wizard.diffMaterialWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 5:
					platformModalService.showErrorBox('productionplanning.item.wizard.diffProductDescriptionWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 6:
					platformModalService.showErrorBox('productionplanning.item.wizard.haveParentWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 7:
					platformModalService.showErrorBox('productionplanning.item.wizard.moreItemsWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 8:
					platformModalService.showErrorBox('productionplanning.item.wizard.diffEventSequenceWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					break;
				case 9:
					platformModalService.showErrorBox('productionplanning.item.wizard.notSame',
						'productionplanning.item.wizard.itemGroup.notSameTitle', 'warning');
					break;
			}
		};

		function isOKDisabled() {
			var grid = platformGridAPI.grids.element('id', scope.itemGrid.state);
			if (grid.dataView) {
				var checked = _.filter(platformGridAPI.rows.getRows(scope.itemGrid.state), function (row) {
					return row.Checked;
				});
				return checked.length === 0;
			}
		}

		function getOtherItems() {
			return _.filter(platformGridAPI.rows.getRows(scope.itemGrid.state), function (row) {
				return checkedItem.Id !== row.Id;
			});
		}

		function clearCheck() {
			checkedItem.Checked = false;
			platformGridAPI.rows.refreshRow({
				'gridId': scope.itemGrid.state,
				'item': checkedItem
			});
		}

		function checkTargetPU(targetPU, otherPUs) {
			var exist = [];

			//3. all PUs must be of the same (or in the hierarchy "lower") material-group. of the target PU
			if (targetPU.MaterialGroupFk !== null) {
				exist = _.filter(otherPUs, function (unit) {
					return unit.MaterialGroupFk !== targetPU.MaterialGroupFk &&
						!findParent(unit, targetPU.MaterialGroupFk);
				});
				if (exist.length !== 0) {
					platformModalService.showErrorBox('productionplanning.item.wizard.higherMaterialGroupWarn',
						'productionplanning.item.wizard.itemMerge.mergeDialogTitle', 'warning');
					return false;
				}
			}

			//No error set isLive = false;
			_.forEach(otherPUs, function (otherPU) {
				otherPU.IsLive = false;
			});

			return true;
		}

		function findParent(unit, targetMaterialGroupId) {
			if (unit.MaterialGroupFk < 0) {
				return false;
			} else if (unit.MaterialGroupFk === targetMaterialGroupId) {
				return true;
			}
			var materialGroup = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialGroup', unit.MaterialGroupFk);
			return findParent(materialGroup, targetMaterialGroupId);
		}

		function getFirstItem() {
			var listedItem = platformGridAPI.rows.getRows(scope.itemGrid.state);
			return listedItem[0];
		}

		function initItemColumns() {
			var listConfig = _.cloneDeep(itemUIStandardService.getStandardConfigForListView());
			var columns = ['code', 'descriptioninfo', 'quantity', 'materialgroupfk', 'mdcmaterialfk', 'uomfk',
				'productdescriptionfk', 'islive'];
			listConfig.columns = _.filter(listConfig.columns, function (column) {
				return columns.indexOf(column.id) > -1;
			});

			_.forEach(listConfig.columns, function (c) {
				c.editor = null;
			});

			listConfig.columns.filter(function (column) {
				return column.field === 'IsLive';
			}).forEach(function (column) {
				column.hidden = true;
			});

			var itemColumns = [{
				editor: 'marker',
				field: 'Checked',
				formatter: 'marker',
				id: 'checked',
				width: 80,
				pinned: true,
				headerChkbox: false,
				name$tr$: 'cloud.common.entitySelected'
			}];
			itemColumns = itemColumns.concat(listConfig.columns);

			return itemColumns;
		}

		return service;
	}

})(angular);