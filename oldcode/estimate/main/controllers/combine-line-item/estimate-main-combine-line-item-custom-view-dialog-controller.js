/**
 * Created by salopek on 2/1/2019.
 */
/* angular globals */

(function (angular) {

	'use strict';
	var moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainCombineLineItemCustomViewDialogController', [
		'_',
		'$q',
		'$scope',
		'globals',
		'$rootScope',
		'$translate',
		'estimateMainStandardConfigurationService',
		'estimateMainCombineLineItemCustomViewConstants',
		'estimateMainCombineLineItemCustomViewService',
		'platformGridAPI',
		'platformTranslateService',
		'platformGridConfigService',
		'platformModalService',
		'estimateMainCombinedLineItemDynamicConfigurationService',
		function (_,
			$q,
			$scope,globals,$rootScope,
			$translate,
			estimateMainStandardConfigurationService,
			constants,
			customViewService,
			platformGridAPI,
			platformTranslateService,
			platformGridConfigService,
			platformModalService, estCombinedLineItemDynamicConfigurationService) {

			// right grid
			$scope.gridId = '664904581c2b4801a481ff8c988064d2';
			$scope.gridData = {state: $scope.gridId};

			// left grid
			$scope.availableGridId = '4b4dca1cb39842a4bf5c63e5ce63164b';
			$scope.availableGridData = {state: $scope.availableGridId};

			var customSaveFlag=false;

			// radio-button
			$scope.input = {};
			$scope.input.baseCombinedView = constants.baseType.Standard;

			// for left grid columns
			var availableGridColumns = getAvailableColumns();
			var availableGridConfig = {
				columns: angular.copy(availableGridColumns),
				data: [],
				id: $scope.availableGridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'id',
					skipPermissionCheck: true,
					showMainTopPanel: true
				}
			};
			platformTranslateService.translateGridConfig(availableGridConfig);
			platformGridAPI.grids.config(availableGridConfig);

			// for right grid columns
			var gridColumns = getCombineColumns();
			platformTranslateService.translateGridConfig(gridColumns);
			var grid = {
				data: [],
				columns: angular.copy(gridColumns),
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'id',
					skipPermissionCheck: true,
					showMainTopPanel: true
				},
				lazyInit: true,
				enableConfigSave: true
			};
			platformGridAPI.grids.config(grid);

			$scope.settings = {
				customView: {
					selectedValue: 0,
					options: {
						items: [],
						valueMember: 'Id',
						displayMember: 'Description',
						inputDomain: 'description',
						selected: '',
						change: function () {
							var item = _.find(this.items, {Id: $scope.settings.customView.selectedValue});
							if (item && item.ViewConfig) {
								customSaveFlag = true;
								customViewService.setCurrentCustomView(item, {
									eventName: constants.eventNames.applyNewCustomView
								});
							}
						}
					}
				}
			};

			$scope.isLoading = true;
			function loadCustomView(eventInfo) {
				let isChangeBaseCombinedView = eventInfo && eventInfo.eventName === constants.eventNames.changeBaseCombinedView;

				customViewService.getCurrentCustomView().then(function (customView) {
					if (angular.isString(customView.ViewConfig)) {
						customView.ViewConfig = JSON.parse(customView.ViewConfig);
					}
					$scope.baseCombinedView = customView.ViewConfig.baseCombinedView ? customView.ViewConfig.baseCombinedView : 1; // customView.ViewType;
					$scope.combineItems = customView.ViewConfig.columns && customView.ViewConfig.columns.combineColumns ? customView.ViewConfig.columns.combineColumns : [];

					let dynamicColumns  = estCombinedLineItemDynamicConfigurationService.getDynamicCols();

					let hasConfiged = false;

					$scope.combineItems = _.filter($scope.combineItems, function (combinedItem){
						let notHardCodeCostGroup = combinedItem.id.indexOf('liccostgroup') === -1 && combinedItem.id.indexOf('prjcostgroup') === -1;
						let existDynamicColumn = combinedItem.isCustomDynamicCol ? !!(_.find(dynamicColumns, {'id': combinedItem.id})) : true;
						if (combinedItem.isCustomDynamicCol){
							hasConfiged = true;
						}
						return notHardCodeCostGroup && existDynamicColumn;
					});

					$scope.availableColumns = estimateMainStandardConfigurationService.getStandardConfigForListView();

					let standardColumnList = ['AssemblyTemplate','DescriptionInfo','CostUnit','HoursUnit','PrjLocationFk','EstAssemblyFk',
						'SortCode01Fk','SortCode02Fk','SortCode03Fk' ,'SortCode04Fk','SortCode05Fk','SortCode06Fk' ,'SortCode07Fk','SortCode08Fk','SortCode09Fk' ,'SortCode10Fk'];

					let itemUnitCostList = [
						'AssemblyTemplate','DescriptionInfo','BasUomFk','CostUnit','HoursUnit','EstAssemblyFk'
					];

					let filteredResult = null;
					if($scope.input.baseCombinedView === 1) {
						filteredResult = $scope.availableColumns.columns.filter(({field}) => standardColumnList.includes(field));
						angular.forEach(dynamicColumns, function (item) {
							if (filteredResult.indexOf(item) === -1) {
								item.hidden = hasConfiged;
								filteredResult.push(item);
							}
						});
					}

					if($scope.input.baseCombinedView === 2) {
						filteredResult = $scope.availableColumns.columns.filter(({field}) => itemUnitCostList.includes(field));
					}

					if(!customSaveFlag) {
						$scope.combineItems = getBaseCombinedItems($scope.input.baseCombinedView, filteredResult);
					}
					// for left container
					initAvailableData(filteredResult);
					// for right container
					initCombineData($scope.combineItems);
					if (!isChangeBaseCombinedView) {
						$scope.settings.customView.selectedValue = customView.Id;
						$scope.options.dataItem.currentCustomView = customView;
					}
				});

			}

			function loadCustomViews() {
				customSaveFlag = true;
				var customViews = customViewService.getCustomViews(true);

				return $q.when(customViews).then(function (result) {
					$scope.settings.customView.options.items = _.filter(result, function (item) {
						return item.Description !== null;
					});
				});
			}

			var initPromise = [customViewService.getCurrentCustomView(), loadCustomViews()];

			$q.all(initPromise).then(function () {
				loadCustomView();
				$scope.isLoading = false;
			});

			function getBaseCombinedItems(baseCombinedView, availableColumns) {
				var filteredColumns = [];
				switch(baseCombinedView) {
					case 1:
						filteredColumns = _.filter(availableColumns, function(col) {
							return (col.id === 'costunit');
						});

						break;
					case 2:
						filteredColumns = _.filter(availableColumns, function(col) {
							return (col.id === 'costunit');
						});

						break;
				}

				return filteredColumns;
			}

			function initAvailableData(availableColumns) {
				platformGridAPI.columns.configuration($scope.availableGridId, angular.copy(availableGridColumns));

				let filteredColumns = [];
				let attachCombinedColumns = [];

				_.forEach(availableColumns, function (item) {
					if (!_.find($scope.combineItems, {id: item.id})) {
						if (item.hidden) {
							filteredColumns.push(item);
						} else {
							attachCombinedColumns.push(item);
						}
					}
				});

				$scope.combineItems = $scope.combineItems.concat(attachCombinedColumns);

				platformGridAPI.items.data($scope.availableGridId, filteredColumns);
			}

			function initCombineData(combineColumns) {
				$rootScope.customColumnList =$scope.combineItems;
				platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				platformGridAPI.items.data($scope.gridId, combineColumns);
			}

			function getAvailableColumns() {
				return [
					{
						id: 'fieldName',
						formatter: 'description',
						name: 'Label name',
						name$tr$: 'cloud.desktop.formConfigLabelName',
						field: 'name',
						width: 200,
						sortable: true
					}
				];
			}

			function getCombineColumns() {
				return [
					{
						id: 'fieldName',
						name: 'Field Name',
						name$tr$: 'cloud.desktop.formConfigLabelName',
						field: 'name',
						width: 200
					}
				];
			}

			// for center
			// Button interaction-Functions
			$scope.fromStartToTarget = function (kind, gridIdStart, gridIdTarget, visibleTag) {
				var moveItemsFromStart;
				var grid = platformGridAPI.grids.element('id', $scope[gridIdStart]);
				// get filtered content
				var filter = grid.dataView.getFilteredItems().rows;

				var startItems = platformGridAPI.items.data($scope[gridIdStart]);

				var baseCombinedItems = getBaseCombinedItems($scope.input.baseCombinedView, $scope.availableColumns.columns);
				var filterBaseRemoved = [];

				_.forEach(filter, function (item) {
					if (!_.find(baseCombinedItems, {id: item.id})) {
						filterBaseRemoved.push(item);
					}
				});

				if (kind === 'part') {
					// move not all the items
					var startGridInstance = platformGridAPI.grids.element('id', $scope[gridIdStart]).instance;
					var startSelectedRows = startGridInstance.getSelectedRows();

					filterBaseRemoved = [];

					_.forEach(startSelectedRows, function (row) {
						var dataItem = startGridInstance.getDataItem(row);
						if (!_.find(baseCombinedItems, {id: dataItem.id})) {
							filterBaseRemoved.push(dataItem);
						}
					});
					moveItemsFromStart = filterBaseRemoved;
				}
				else {
					// user click buttons for all items
					moveItemsFromStart = angular.copy(filterBaseRemoved);
				}

				var targetGridInstance = platformGridAPI.grids.element('id', $scope[gridIdTarget]).instance;
				var targetSelectedRows = targetGridInstance.getSelectedRows();
				var targetItems = platformGridAPI.items.data($scope[gridIdTarget]);

				// item add in Visible Columns
				var indexForVisibleColumn = targetSelectedRows.length === 1 ? (targetSelectedRows[0] + 1) : targetItems.length;

				angular.forEach(moveItemsFromStart, function (value) {
					// set visible tag
					value.hidden = visibleTag;

					// add item to the visible column in the right row-index
					targetItems.splice(indexForVisibleColumn, 0, value);
					indexForVisibleColumn++;

					// remove item from available columns
					startItems.splice(_.findIndex(startItems, {id: value.id}), 1);

					filterBaseRemoved.splice(_.findIndex(filterBaseRemoved, {id: value.id}), 1);
				});

				// update grid content
				platformGridAPI.items.data($scope[gridIdStart], startItems);

				platformGridAPI.grids.refresh($scope[gridIdStart]);

				platformGridAPI.items.data($scope[gridIdTarget], targetItems);

				// handle Button disabled-status
				$scope.availableGridIdSelected = true;
				$scope.gridIdSelected = true;
			};

			$scope.availableGridIdSelected = true;
			$scope.gridIdSelected = true;

			platformGridAPI.events.register($scope.availableGridId, 'onActiveCellChanged', onActiveCellChangedAvailableGrid);
			function onActiveCellChangedAvailableGrid() {
				// is also triggered by ctrl key(multiselection)
				$scope.availableGridIdSelected = false;
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChangedCombineGrid);
			function onSelectedRowsChangedCombineGrid(e, args) {
				$scope.selectedBaseItems = [];
				var baseCombinedItems = getBaseCombinedItems($scope.input.baseCombinedView, $scope.availableColumns.columns);

				angular.forEach(args.rows, function(row) {
					var dataItem = args.grid.getDataItem(row);

					if (_.find(baseCombinedItems, dataItem)) {
						// args.grid.getCellNode(row, args.grid.getActiveCell().cell).removeClass('selected').removeClass('active');
						$scope.selectedBaseItems.push(dataItem);
					}
				});

				$scope.gridIdSelected = $scope.selectedBaseItems.length > 0;
			}

			$scope.modalOptions = {
				headerText: $translate.instant('estimate.main.combineLineItems.customCombinedView'),
				btnOkText: $translate.instant('basics.common.button.ok'),
				btnCancelText: $translate.instant('basics.common.button.cancel'),
				saveAsText: $translate.instant('basics.common.button.saveAs'),
				customViewText: $translate.instant('estimate.main.combineLineItems.customView'),
				baseViewStandardText: $translate.instant('estimate.main.combineLineItems.standardView'),
				baseViewUnitCostText: $translate.instant('estimate.main.combineLineItems.itemUnitCostView'),
				combineColumnsText: $translate.instant('estimate.main.combineLineItems.combineColumns'),
				saveAsCustomView: function () {
					customViewService.getCurrentCustomView().then(function (customView) {
						showSaveCustomViewDialog($scope.input.baseCombinedView, customView, $scope.combineItems);
					});
				},
				ok: function () {
					$scope.isLoading = true;
				},
				cancel: function () {
				}
			};

			// radio-button
			$scope.input = {};
			$scope.input.baseCombinedView = constants.baseType.Standard;
			$scope.input.radioGroupOpt = {
				displayMember: 'description',
				valueMember: 'baseCombinedView',
				cssMember: 'cssClass',
				items: [
					{
						baseCombinedView: constants.baseType.Standard,
						description: $translate.instant('estimate.main.combineLineItems.standardView')
					},
					{
						baseCombinedView: constants.baseType.ItemUnitCost,
						description: $translate.instant('estimate.main.combineLineItems.itemUnitCostView')
					}
				]
			};

			$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
				$scope.input.baseCombinedView = parseInt(radioValue);
				customViewService.setBaseCombinedView();
				$scope.settings.customView.selectedValue = 0;
				$scope.availableGridIdSelected = true;
				$scope.gridIdSelected = true;
			};

			function showSaveCustomViewDialog(baseCombinedView, customView, combineColumns) {
				platformModalService.showDialog({
					scope: $scope,
					resolve: {
						controllerOptions: function () {
							return {
								viewType: baseCombinedView,
								customView: customView,
								combineColumns: combineColumns
							};
						}
					},
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/combine-line-item/estimate-main-combine-line-item-custom-view-save-template.html',
					controller: 'estimateCombineLineItemSaveCustomViewController'
				}).then(function (result) {
					if (result && result.ok) {
						loadCustomViews();
					}
				});
			}

			customViewService.onBaseCombinedViewChanged.register(loadCustomView);
			customViewService.onCurrentCustomViewChanged.register(loadCustomView);

			$scope.$on('$destroy', function () {
				customViewService.onBaseCombinedViewChanged.unregister(loadCustomView);
				customViewService.onCurrentCustomViewChanged.unregister(loadCustomView);

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChangedCombineGrid);
					platformGridAPI.grids.unregister($scope.gridId);
				}

				if (platformGridAPI.grids.exist($scope.availableGridId)) {
					platformGridAPI.events.unregister($scope.availableGridId, 'onActiveCellChanged', onActiveCellChangedAvailableGrid);
					platformGridAPI.grids.unregister($scope.availableGridId);
				}
			});
		}
	]);
})(angular);