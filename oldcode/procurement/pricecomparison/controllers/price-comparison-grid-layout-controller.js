(function (angular) {

	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('priceComparisonGridLayoutController',
		[
			'_',
			'$',
			'$scope',
			'$injector',
			'$translate',
			'platformGridAPI',
			'platformRuntimeDataService',
			'platformGridConfigService',
			'platformTranslateService',
			'platformObjectHelper',
			'mainViewService',
			'procurementPriceComparisonCommonService',
			'procurementPriceComparisonCommonHelperService',
			'procurementPriceComparisonSettingConfiguration',
			'basicsCostGroupAssignmentService',
			function (
				_,
				$,
				$scope,
				$injector,
				$translate,
				platformGridAPI,
				platformRuntimeDataService,
				platformGridConfigService,
				platformTranslateService,
				platformObjectHelper,
				mainViewService,
				commonDataService,
				commonHelperService,
				settingConfiguration,
				basicsCostGroupAssignmentService) {

				var currentConfig = settingConfiguration.getCurrentConfig();
				var configure = currentConfig.gridLayout;
				var configGridId = configure.gridId;
				var helpService = currentConfig.helpService;
				var configService = currentConfig.configService;
				var parentService = currentConfig.parentService;
				var isVerticalCompareRows = parentService.isVerticalCompareRows();
				var verticalCompareRows = [];
				let columnTreeOptions = {
					idProp: 'id',
					parentProp: 'parentId',
					childrenProp: 'children'
				};

				// right grid
				$scope.visibleGridId = 'decddee99755459a972b7a8d3b633345';
				$scope.gridData = {state: $scope.visibleGridId};
				// left grid
				$scope.availableGridId = 'af50af484ef3433ab25d19a7eaf2448c';
				$scope.availableGridData = {state: $scope.availableGridId};

				// for left grid columns
				var availableGridColumns = getAvailableColumns();

				var compareBidders = configService.visibleCompareColumnsCache;
				if (compareBidders && !compareBidders.length) {
					compareBidders = _.filter(parentService.getCustomSettingsCompareColumns(), {Visible: true});
				}

				platformTranslateService.translateGridConfig(availableGridColumns);
				var availableGridConfig = {
					columns: commonHelperService.mergeGridColumnWithConfiguration($scope.availableGridId, angular.copy(availableGridColumns)),
					data: [],
					id: $scope.availableGridId,
					lazyInit: true,
					options: {
						tree: true,
						indicator: true,
						allowRowDrag: false,
						idProperty: 'id',
						parentProp: 'parentId',
						childProp: 'children',
						skipPermissionCheck: true,
						showMainTopPanel: true
					}
				};
				platformTranslateService.translateGridConfig(availableGridConfig.columns);
				platformGridAPI.grids.config(availableGridConfig);

				// for right grid columns
				var gridColumns = getCommonVisibleColumns();

				platformTranslateService.translateGridConfig(gridColumns);
				var grid = {
					data: [],
					columns: commonHelperService.mergeGridColumnWithConfiguration($scope.visibleGridId, angular.copy(gridColumns)),
					id: $scope.visibleGridId,
					options: {
						tree: true,
						indicator: true,
						allowRowDrag: false,
						idProperty: 'id',
						parentProp: 'parentId',
						childProp: 'children',
						skipPermissionCheck: true,
						showMainTopPanel: true
					},
					lazyInit: true,
					enableConfigSave: true
				};
				platformGridAPI.grids.config(grid);

				// for right grid toolbar
				$scope.tools = platformGridConfigService.initToolBar($scope.visibleGridId);

				// overWrite the toolbar disable function
				_.forEach($scope.tools.items, function (item) {
					item.disabled = function () {
						let selectedItems = _.filter(getGridSelectedInfos($scope.visibleGridId).selectedItems, function (item) {
							return angular.isDefined(item);
						});
						let filterValue = $('.filterinput.' + $scope.visibleGridId).val() || '';
						if (filterValue.trim().length > 0) {
							return true;
						}

						if (selectedItems.length === 0) {
							return true;
						}

						if (_.some(selectedItems, function (s) {
							return _.startsWith(s.id, '_rt$bidder_');
						})) {
							return !_.every(selectedItems, function (m) {
								return commonHelperService.isLayoutBidderLineValueColumn(m.id);
							});
						}
						return false;
					};
					item.fn = function () {
						switch (item.id) {
							case  'moveUp':
								commonHelperService.moveSelectedItemTo(1, $scope.visibleGridId, columnTreeOptions);
								break;
							case  'moveTop':
								commonHelperService.moveSelectedItemTo(2, $scope.visibleGridId, columnTreeOptions);
								break;
							case  'moveDown':
								commonHelperService.moveSelectedItemTo(3, $scope.visibleGridId, columnTreeOptions);
								break;
							case  'moveBottom':
								commonHelperService.moveSelectedItemTo(4, $scope.visibleGridId, columnTreeOptions);
								break;
						}

						commonDataService.configColumns = $scope.visibleItems;
					};
				});

				function refreshGrid(type) {
					let allConfigColumns = type ? '' : $scope.visibleItems.concat($scope.availableItems);
					let defaultColumns = helpService.getDefaultColumns(configService);
					let costGroupColumns = basicsCostGroupAssignmentService.createCostGroupColumns(configService.costGroupCats || [], false);
					let configColumns = commonDataService.getGridLayoutColumns(configGridId, defaultColumns, compareBidders, verticalCompareRows, isVerticalCompareRows, allConfigColumns, costGroupColumns);

					let grid = platformGridAPI.grids.element('id', configGridId);
					let currentColumns = grid.instance.getColumns();
					configColumns = _.map(configColumns, column => {
						let isExist;
						if (column.id === '_rt$bidder'){
							isExist = _.find(currentColumns, item => {
								return item.isDynamic === true;
							});
						}
						else {
							isExist = _.find(currentColumns, item => {
								return item.id === column.id && item.field === column.field;
							});
						}
						column.hidden = !!isExist;
						return column;
					});

					$scope.visibleItems = _.filter(configColumns, ['hidden', true]);
					$scope.availableItems = _.sortBy(_.filter(configColumns, ['hidden', false]), ['name']);

					commonDataService.configColumns = $scope.visibleItems;
					commonDataService.allConfigColumns = $scope.visibleItems.concat($scope.availableItems);

					initAvailableData();

					initVisibleData();
				}

				function loadData() {
					let compareRows = parentService.getCustomSettingsCompareRows();
					readVerticalCompareRows(compareRows);
					refreshGrid('loadData');
				}

				function initAvailableData() {
					refreshGridData($scope.availableGridId, $scope.availableItems);
				}

				function initVisibleData() {
					refreshGridData($scope.visibleGridId, $scope.visibleItems);
				}

				// for center
				// Button interaction-Functions
				$scope.fromStartToTarget = function (kind, gridIdStart, gridIdTarget, visibleTag) {
					var moveItemsFromStart;
					var grid = platformGridAPI.grids.element('id', $scope[gridIdStart]);
					// get filtered content
					var filter = grid.dataView.getFilteredItems().rows;

					var startItems = platformGridAPI.items.data($scope[gridIdStart]);

					if (kind === 'part') {
						// move not all the items
						var startGridInstance = platformGridAPI.grids.element('id', $scope[gridIdStart]).instance;
						var startSelectedRows = startGridInstance.getSelectedRows();

						moveItemsFromStart = startSelectedRows.map(function (row) {
							// get item from startGrid
							return startGridInstance.getDataItem(row);
						});
					} else {
						// user click buttons for all items
						moveItemsFromStart = angular.copy(filter);
					}

					var actualMoveItems = _.filter(moveItemsFromStart, function (item) {
						return !_.startsWith(item.id, '_rt$bidder_');
					});

					var targetGridInstance = platformGridAPI.grids.element('id', $scope[gridIdTarget]).instance;
					var targetSelectedRows = targetGridInstance.getSelectedRows();
					var targetItems = platformGridAPI.items.data($scope[gridIdTarget]);

					// item add in Visible Columns
					var indexForVisibleColumn = targetSelectedRows.length === 1 ? (targetSelectedRows[0] + 1) : targetItems.length;

					angular.forEach(actualMoveItems, function (value) {
						// set visible tag
						value.hidden = visibleTag;

						// add item to the visible column in the right row-index
						targetItems.splice(indexForVisibleColumn, 0, value);
						indexForVisibleColumn++;

						// remove item from available columns
						startItems.splice(_.findIndex(startItems, {id: value.id}), 1);

						filter.splice(_.findIndex(filter, {id: value.id}), 1);
					});

					commonDataService.configColumns = $scope.visibleItems;

					// update grid content
					refreshGridData($scope[gridIdStart], startItems);

					platformGridAPI.grids.refresh($scope[gridIdStart]);

					refreshGridData($scope[gridIdTarget], targetItems);

					// set selection in grid
					platformGridAPI.rows.selection({gridId: $scope[gridIdTarget], rows: actualMoveItems});

					// handle Button disabled-status
					$scope.isAvailablePartToVisibleDisabled = gridIdTarget !== 'availableGridId';
					$scope.isVisiblePartToAvailableDisabled = gridIdTarget !== 'visibleGridId';

				};

				$scope.isAvailablePartToVisibleDisabled = true;
				$scope.isVisiblePartToAvailableDisabled = true;

				function onAvailableColumnGridCellActiveChanged(e, args) {
					if (angular.isDefined(args.row)) {
						var selectedItems = _.map(args.grid.getSelectedRows().concat([args.row]), function (id) {
							return args.grid.getDataItem(id);
						});
						$scope.isAvailablePartToVisibleDisabled = _.some(selectedItems, function (item) {
							return _.startsWith(item.id, '_rt$bidder_');
						});
					} else {
						$scope.isAvailablePartToVisibleDisabled = true;
					}
				}

				function onVisibleColumnGridCellActiveChanged(e, args) {
					if (angular.isDefined(args.row)) {
						var selectedItems = _.map(args.grid.getSelectedRows().concat([args.row]), function (id) {
							return args.grid.getDataItem(id);
						});
						$scope.isVisiblePartToAvailableDisabled = _.some(selectedItems, function (item) {
							return _.startsWith(item.id, '_rt$bidder_');
						});
					} else {
						$scope.isVisiblePartToAvailableDisabled = true;
					}
				}

				function onCellChange(e, args) {
					var column = args.grid.getColumns()[args.cell];
					if (column.field === 'width') {
						if (_.startsWith(args.item.id, '_rt$bidder')) {
							if (args.item.id === '_rt$bidder') {
								var originalGroupWidth = _.sumBy(args.item.children, 'width');
								var newGroupWidth = parseInt(args.item.width / compareBidders.length);
								_.each(args.item.children, function (child) {
									child.width = parseInt(newGroupWidth * (child.width / originalGroupWidth));
								});

								var currGroupWidth = _.sumBy(args.item.children, 'width');
								if (newGroupWidth > currGroupWidth) {
									var maxItem = _.maxBy(args.item.children, 'width');
									maxItem.width = maxItem.width + newGroupWidth - currGroupWidth;
								}
								args.item.width = _.sumBy(args.item.children, 'width') * compareBidders.length;
							} else {
								var bidderCol = _.find(args.grid.getData().getRows(), {id: '_rt$bidder'});
								bidderCol.width = _.sumBy(bidderCol.children, 'width') * compareBidders.length;
							}
							platformGridAPI.grids.refresh(args.grid.id);
						}
					}

					if (column.field === 'userLabelName' && args.item.parentId === '_rt$bidder' && args.item.field !== 'LineValue') {
						commonHelperService.fireEvent('Scope_Compare_Setting', 'GridLayoutCompareFieldUserLabelNameChanged', args.item);
					}
				}

				function onCompareBidderVisibleItemChanged(checkedItems) {
					compareBidders = checkedItems;

					var visibleItems = platformGridAPI.grids.element('id', $scope.visibleGridId).dataView.getRows();
					var availableItems = platformGridAPI.grids.element('id', $scope.availableGridId).dataView.getRows();

					var targetItems = null;
					var targetGridId = null;

					if (_.some(visibleItems, {id: '_rt$bidder'})) {
						targetGridId = $scope.visibleGridId;
						targetItems = visibleItems;
					} else {
						targetGridId = $scope.availableGridId;
						targetItems = availableItems;
					}

					var bidderColumn = _.find(targetItems, {id: '_rt$bidder'});
					bidderColumn.width = _.sumBy(bidderColumn.children, 'width') * compareBidders.length;
					platformGridAPI.grids.refresh(targetGridId);
				}

				function onCompareFieldItemChanged(items) {
					readVerticalCompareRows(items);

					if (isVerticalCompareRows) {
						refreshGrid();
					}
				}

				function onVerticalCompareRowsChanged(isVertical) {
					isVerticalCompareRows = isVertical;
					refreshGrid();
				}

				function onSelectedRowsChanged(e, args) {
					if (args.grid.id === $scope.availableGridId) {
						$scope.isAvailablePartToVisibleDisabled = false;
					} else {
						$scope.isVisiblePartToAvailableDisabled = false;
					}
				}

				function readVerticalCompareRows(items) {
					let checkedItems = _.filter(items, {Visible: true});
					verticalCompareRows = _.filter(checkedItems, function (row) {
						return !commonHelperService.isExcludedCompareRowInVerticalMode(row.Field);
					});
				}

				function onCompareFieldSortingChanged(args) {
					onCompareFieldItemChanged(args.items);
				}

				commonHelperService.registerEvent('Scope_Compare_Setting', 'onCompareBidderVisibleItemChanged', onCompareBidderVisibleItemChanged);
				commonHelperService.registerEvent('Scope_Compare_Setting', 'onCompareFieldVisibleItemChanged', onCompareFieldItemChanged);
				commonHelperService.registerEvent('Scope_Compare_Setting', 'CompareFieldUserLabelNameChanged', compareFieldUserLabelNameChanged);
				commonHelperService.registerEvent('Scope_Compare_Setting', 'onCompareFieldSortingChanged', onCompareFieldSortingChanged);

				platformGridAPI.events.register($scope.availableGridId, 'onActiveCellChanged', onAvailableColumnGridCellActiveChanged);
				platformGridAPI.events.register($scope.visibleGridId, 'onActiveCellChanged', onVisibleColumnGridCellActiveChanged);

				platformGridAPI.events.register($scope.visibleGridId, 'onCellChange', onCellChange);

				platformGridAPI.events.register($scope.availableGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.visibleGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				var isAvailableLoad = false;
				var isVisibleLoad = false;
				platformGridAPI.events.register($scope.availableGridId, 'onInitialized', availableLoadFinish);
				platformGridAPI.events.register($scope.visibleGridId, 'onInitialized', visibleLoadFinish);

				function availableLoadFinish() {
					isAvailableLoad = true;
					if (isAvailableLoad && isVisibleLoad) {
						fireLoadFinish();
					}
					platformGridAPI.events.unregister($scope.availableGridId, 'onInitialized', availableLoadFinish);
				}

				function visibleLoadFinish() {
					isVisibleLoad = true;
					if (isAvailableLoad && isVisibleLoad) {
						fireLoadFinish();
					}
					platformGridAPI.events.unregister($scope.visibleGridId, 'onInitialized', visibleLoadFinish);
				}

				function fireLoadFinish() {
					var gids = settingConfiguration.getGids();
					commonDataService.registerLoadFinish.fire({
						value: gids.gridLayout
					});
				}

				function gridFireLoadFinish() {
					gridWithNoData($scope.availableItems, availableLoadFinish);
					gridWithNoData($scope.visibleItems, visibleLoadFinish);
				}

				function gridWithNoData(list, loadFinish) {
					if (!list || list.length <= 0) {
						loadFinish();
					}
				}

				parentService.onVerticalCompareRowsChanged.register(onVerticalCompareRowsChanged);

				function getAvailableColumns() {
					return [
						{
							id: 'fieldName',
							formatter: 'description',
							name: 'Label name',
							name$tr$: 'cloud.desktop.formConfigLabelName',
							field: 'name',
							width: 300,
							sortable: true,
							searchable: true
						}
					];
				}

				function getCommonVisibleColumns() {
					return [
						{
							id: 'fieldName',
							formatter: 'description',
							name: 'Label name',
							name$tr$: 'cloud.desktop.formConfigLabelName',
							groupName: 'Labels',
							field: 'name',
							width: 180,
							searchable: true
						},
						{
							id: 'userFieldName',
							formatter: 'description',
							name: 'User label name',
							name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
							field: 'userLabelName',
							width: 150,
							editor: 'description',
							focusable: true,
							searchable: true
						},
						{
							id: 'kbenter',
							formatter: 'boolean',
							name: 'Enter',
							name$tr$: 'cloud.desktop.formConfigAllowEnterNavigation',
							field: 'keyboard.enter',
							width: 60,
							cssClass: 'cell-center',
							editor: 'boolean',
							headerChkbox: true,
							focusable: true
						},
						{
							id: 'fixed',
							formatter: 'boolean',
							name: 'Fixed',
							name$tr$: 'cloud.desktop.gridFixedColumnHeader',
							field: 'pinned',
							width: 40,
							cssClass: 'cell-center',
							editor: 'boolean',
							focusable: true
						},
						{
							id: 'width',
							formatter: function (row, cell, value, columnDef, dataContext) {
								const validWidth = (compareBidders.length === 0 ? dataContext.width : parseInt(dataContext.width / compareBidders.length));
								return dataContext.id === '_rt$bidder' ? (dataContext.width + '(' + validWidth + ' x ' + compareBidders.length + ')') : dataContext.width;
							},
							name: 'Width',
							name$tr$: 'cloud.desktop.gridWidthHeader',
							field: 'width',
							width: 40,
							cssClass: 'cell-right',
							editor: 'integer',
							focusable: true
						}
					];
				}

				// for the disable function
				function getGridSelectedInfos(gridId) {
					// platformGridAPI.rows.selection -> only for single items
					// but, multiselection get not a toolbar function, this is maybe the solution
					var selectedInfo = {};
					var gridinstance = platformGridAPI.grids.element('id', gridId).instance;

					// one or multiple selection
					selectedInfo.selectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];

					// need for selection in grid
					selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
						// get row-data
						return gridinstance.getDataItem(row);
					});
					return selectedInfo;
				}

				loadData();
				gridFireLoadFinish();

				function compareFieldUserLabelNameChanged(item) {
					let items = platformGridAPI.rows.getRows($scope.visibleGridId);
					let bidder = _.find(items, {id: '_rt$bidder'});
					var target = bidder && bidder.children ? _.find(bidder.children, {field: item.Field}) : null;
					if (target) {
						target.userLabelName = item.UserLabelName;
						platformGridAPI.grids.refresh($scope.visibleGridId);
					}
				}

				function refreshGridData(gridId, data) {
					if (gridId === $scope.visibleGridId) {
						let bidder = _.find(data, {id: '_rt$bidder'});
						platformRuntimeDataService.readonly(bidder, [{field: 'userLabelName', readonly: true}]);
					}
					platformGridAPI.items.data(gridId, data);
				}

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.visibleGridId)) {
						platformGridAPI.events.unregister($scope.visibleGridId, 'onActiveCellChanged', onVisibleColumnGridCellActiveChanged);
						platformGridAPI.events.unregister($scope.visibleGridId, 'onCellChange', onCellChange);
						platformGridAPI.grids.unregister($scope.visibleGridId);
					}

					if (platformGridAPI.grids.exist($scope.availableGridId)) {
						platformGridAPI.events.unregister($scope.availableGridId, 'onActiveCellChanged', onAvailableColumnGridCellActiveChanged);
						platformGridAPI.grids.unregister($scope.availableGridId);
					}

					commonHelperService.unregisterEvent('Scope_Compare_Setting', 'onCompareBidderVisibleItemChanged', onCompareBidderVisibleItemChanged);
					commonHelperService.unregisterEvent('Scope_Compare_Setting', 'onCompareFieldVisibleItemChanged', onCompareFieldItemChanged);
					commonHelperService.unregisterEvent('Scope_Compare_Setting', 'CompareFieldUserLabelNameChanged', compareFieldUserLabelNameChanged);
					commonHelperService.unregisterEvent('Scope_Compare_Setting', 'onCompareFieldSortingChanged', onCompareFieldSortingChanged);

					parentService.onVerticalCompareRowsChanged.unregister(onVerticalCompareRowsChanged);

					platformGridAPI.events.unregister($scope.availableGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.unregister($scope.visibleGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				});
			}

		]);
})(angular);