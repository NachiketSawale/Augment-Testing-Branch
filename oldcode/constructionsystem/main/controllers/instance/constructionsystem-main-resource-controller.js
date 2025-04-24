(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc controller
	 * @name constructionsystemMainResourceController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionsystem main Resource container.
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMainResourceController', [
		'$scope', '$injector', '$timeout',
		'$http','platformGridControllerService', 'platformGridAPI',
		'constructionsystemMainResourceDynamicConfigurationService', 'constructionsystemMainCompareFlags',
		'constructionSystemMainInstanceService','constructionsystemMainResourceDetailService',
		'constructionsystemMainCommonLookupService','constructionsystemMainResourceDataService',
		'constructionsystemMainLineItemService','constructionsystemMainCommonCalculationService',
		'estimateMainGenerateSortingService','estimateMainClipboardService','constructionsystemMainResourceValidationService',
		function ($scope, $injector, $timeout,
			$http,platformGridControllerService, platformGridAPI,
			uiDynamicConfigurationService, compareFlags,constructionSystemMainInstanceService,
			cosMainResDetailService,cosMainCommonLookupService,constructionsystemMainResourceDataService,
			constructionsystemMainLineItemService,constructionsystemMainCommonCalculationService,
			estimateMainGenerateSortingService,estimateMainClipboardService,constructionsystemMainResourceValidationService) {


			var isSorted = false;
			var gridConfig = {
				parentProp: 'EstResourceFk',
				childProp: 'EstResources',
				childSort: true,
				type: 'resources',
				cellChangeCallBack: function cellChangeCallBack(arg) {
					var column = arg.grid.getColumns()[arg.cell];
					var field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;

					// cosMainResDetailService.valueChangeCallBack(arg.item, field,projInfo);
					cosMainResDetailService.fieldChange(arg.item, field, column);
					constructionSystemMainInstanceService.updateIsUserModified(true);

				},
				rowChangeCallBack: function rowChangeCallBack(arg) {
					cosMainCommonLookupService.resetLookupItem();
					var selectItem = constructionsystemMainResourceDataService.getSelected();
					if(isSorted){
						var selected = angular.copy(selectItem);
						var activeCell = arg.grid.getActiveCell();
						isSorted = false;
						setFocusOnSort(activeCell, selected);
					}
				}

			};

			var dataServiceName = $scope.getContentValue('dataService');
			var dataService = $injector.get(dataServiceName);

			platformGridControllerService.initListController($scope, uiDynamicConfigurationService, dataService, constructionsystemMainResourceValidationService, gridConfig);

			function onBeforeEditCell(){

				var cosInstance = constructionSystemMainInstanceService.getSelected();
				var cosInstanceModified = cosInstance.IsUserModified;
				if(cosInstanceModified === null){
					cosInstanceModified = false;
				}

				return cosInstanceModified === true;
			}
			// remove create and delete buttons.
			_.remove($scope.tools.items, function (item) {
				return item.id === 'create' || item.id === 'delete' || item.id === 'createChild' || item.id === 't14';
			});

			function refreshData(parentLineItem) {
				// estimateMainResourceService.gridRefresh();
				angular.forEach(constructionsystemMainResourceDataService.getList(), function(resItem){
					constructionsystemMainResourceDataService.fireItemModified(resItem);
				});
				// use this to refresh line item container when the resource is changed
				// #defect: 73220
				constructionsystemMainLineItemService.fireItemModified(parentLineItem);
			}
			constructionsystemMainResourceDataService.setGridId($scope.gridId);
			var CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');

			platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

			function onActiveCellChanged(e, arg) {
				var column = arg.grid.getColumns()[arg.cell];
				if(column) {
					var isCharacteristic = $injector.get('estimateMainCommonService').isCharacteristicCulumn(column);
					if (isCharacteristic) {
						var lineItem = constructionsystemMainResourceDataService.getSelected();
						if (lineItem !== null) {
							var col = column.field;
							var colArray = _.split(col, '_');
							if(colArray && colArray.length> 1) {
								var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
								var value = parseInt(characteristicType);
								var isLookup = CharacteristicTypeService.isLookupType(value);
								var updateColumn= isLookup ? col : undefined;
								$injector.get('estimateMainService').setCharacteristicColumn(updateColumn);
							}
						}
					}
				}
				return;
			}

			function itemModified(res) {
				constructionsystemMainResourceDataService.markItemAsModified(res);
			}

			function refresh(lineItem) {
				refreshData(lineItem);
			}

			function getList() {
				return constructionsystemMainResourceDataService.getList();
			}

			function setFocusOnSort(cell, selectedItem) {
				constructionsystemMainResourceDataService.updateList(constructionsystemMainResourceDataService.getTree());
				if(selectedItem && selectedItem.Id ){
					var options = {
						item : selectedItem,
						cell : cell && cell.cell ? cell.cell : 1,
						forceEdit : true
					};
					constructionsystemMainResourceDataService.setCellFocus(options);
				}
			}function refreshResource() {
				var lineItemSelect = constructionsystemMainLineItemService.getSelected();
				if (lineItemSelect) {
					constructionsystemMainResourceDataService.load();
					$injector.get('estimateMainPrcPackageLookupDataService').resetCache({});
					constructionsystemMainResourceDataService.gridRefresh();
				}
			}
			/**
			 * set cell css style for the modified fields
			 */
			function hightlightModifedFields() {
				// Note:  temp solution
				// for tree, when using 'toggle behavior' to expand a node, it will invoke method 'refresh',
				// then trigger event 'onRowCountChanged' to set css for the item.
				// but here before setting css for a tree, we need the tree row indexs updated first,
				// otherwise, it will result in setting an item's css to an nother item.
				//
				// so use timeout to delay to invoke: see slick.rib.dataview.js  method: toggleNode
				$timeout(function () {
					var items = dataService.getTree();
					if (_.isEmpty(items) || items[0].CompareFlag === compareFlags.noComparison) {
						return;
					}

					if (gridIsReady($scope.gridId)) {
						var localGrid = platformGridAPI.grids.element('id', $scope.gridId);
						var result = {
							isEqual: true,
							changedProperties: []
						};

						setCssStyleForTree(items, result, localGrid, gridConfig.childProp);

						// Add CSS styles for all changed properties of the items (remove old css first if it has)
						localGrid.instance.setCellCssStyles('changedResourceFields', result);
						// platformGridAPI.grids.refresh($scope.gridId); // will result cycle loop.
					}
				}, 500);
			}

			/**
			 * set Css Styles for Tree items.
			 */
			function setCssStyleForTree(itemTree, result, grid, childProp) {
				_.each(itemTree, function (item) {
					var cssObj = {};

					if (item && item.changedProperties && item.CompareFlag === compareFlags.modified) {
						item.changedProperties.map(function (field) { // jshint ignore: line
							cssObj[field.toLowerCase()] = compareFlags.cellCss.modified;
						});

						// if data is a tree, need to apply css on the eaxct item by row Index.
						var rowIdx = grid.dataView.getIdxById(item.Id);
						if (!_.isUndefined(rowIdx)) {
							result[rowIdx] = {};
							angular.extend(result[rowIdx], cssObj);
						}
					}

					// if children collapsed, do not add css for them because they are not visible in UI for the Users.
					if (item[childProp] && item[childProp].length && item.nodeInfo && !item.nodeInfo.collapsed) {
						setCssStyleForTree(item[childProp], result, grid, childProp);
					}
				});
			}

			function gridIsReady(gridid) {
				var localgrid;
				var result = false;
				if (platformGridAPI.grids.exist(gridid)) {
					localgrid = platformGridAPI.grids.element('id', gridid);
					if (localgrid.instance && localgrid.dataView) {
						result = true;
					}
				}
				return result;
			}

			function setDynamicColumnsLayoutToGrid(){
				uiDynamicConfigurationService.applyToScope($scope);
			}
			uiDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

			let constructionsystemMainResourceDynamicUserDefinedColumnService = $injector.get('constructionsystemMainResourceDynamicUserDefinedColumnService');
			constructionsystemMainResourceDynamicUserDefinedColumnService.initReloadFn();

			function onInitialized() {
				constructionsystemMainResourceDynamicUserDefinedColumnService.loadDynamicColumns();
			}
			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
			platformGridAPI.events.register($scope.gridId, 'onRowCountChanged', hightlightModifedFields);
			constructionsystemMainCommonCalculationService.resourceItemModified.register(itemModified);
			constructionsystemMainCommonCalculationService.refreshData.register(refresh);
			constructionsystemMainCommonCalculationService.getList.register(getList);
			estimateMainGenerateSortingService.resourceItemModified.register(itemModified);
			estimateMainClipboardService.setResourceSelectionOnSort.register(setFocusOnSort);
			constructionsystemMainResourceDataService.registerFilters();
			constructionsystemMainResourceDataService.refreshData.register(refreshResource);


			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
				platformGridAPI.events.unregister($scope.gridId, 'onRowCountChanged', hightlightModifedFields);
				constructionsystemMainCommonCalculationService.resourceItemModified.unregister(itemModified);
				constructionsystemMainCommonCalculationService.refreshData.unregister(refresh);
				constructionsystemMainCommonCalculationService.getList.unregister(getList);
				estimateMainGenerateSortingService.resourceItemModified.unregister(itemModified);
				estimateMainClipboardService.setResourceSelectionOnSort.unregister(setFocusOnSort);
				constructionsystemMainResourceDataService.unregisterFilters();
				constructionsystemMainResourceDataService.refreshData.unregister(refreshResource);
				platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

			});

		}
	]);
})(angular);
