/**
 * Created by ada on 2018/9/30.
 */
(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonPrintColumnSettingController', [
		'_',
		'$',
		'$q',
		'$scope',
		'$translate',
		'platformGridAPI',
		'platformGridConfigService',
		'platformTranslateService',
		'platformObjectHelper',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		function (_,
			$,
			$q,
			$scope,
			$translate,
			platformGridAPI,
			platformGridConfigService,
			platformTranslateService,
			platformObjectHelper,
			printConstants,
			printSettingService,
			commonHelperService,
			commonService,
			boqService,
			itemService) {

			var printType = printSettingService.getCurrentPrintType(),
				compareType = printConstants.compareType[printType];

			// right grid
			$scope.visibleGridId = '3854bc41b76a46549aad4d7e62e3fecb';
			$scope.gridData = {state: $scope.visibleGridId};
			// left grid
			$scope.availableGridId = '22fc691a75834e4bab9cb2918f12ba1d';
			$scope.availableGridData = {state: $scope.availableGridId};
			let columnTreeOptions = {
				idProp: 'id',
				parentProp: 'parentId',
				childrenProp: 'children'
			};

			// for left grid columns
			var availableGridColumns = [
				{
					id: 'fieldName',
					formatter: function (row, cell, value, columnDef, dataContext) {
						return value || dataContext.field;
					},
					name: 'Label name',
					name$tr$: 'cloud.desktop.formConfigLabelName',
					field: 'name',
					width: 300,
					sortable: true,
					searchable: true
				}
			];
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

			var compareBidders = [];
			var verticalCompareRows = [];

			platformTranslateService.translateGridConfig(availableGridConfig.columns);
			platformGridAPI.grids.config(availableGridConfig);

			// for right grid columns
			var gridColumns = [
				{
					id: 'fieldName',
					formatter: function (row, cell, value, columnDef, dataContext) {
						value = value || dataContext.field;
						if (dataContext.id === printConstants.bidderFieldName) {
							var bidderNums = !$scope.bidderPerSizeCheck ? $scope.bidderVisibleNum : _.min([$scope.bidderPageSize, $scope.bidderVisibleNum]);
							if ($scope.isVerticalCompareRows) {
								return '<span style="color: green;">' + value + '(' + $scope.compareFieldsLength + 'x' + bidderNums + ')' + '</span>';
							} else {
								return '<span style="color: green;">' + value + '(' + bidderNums + ')' + '</span>';
							}
						}
						return value;
					},
					name: 'Field Name',
					name$tr$: 'cloud.desktop.formConfigLabelName',
					field: 'name',
					width: 200,
					searchable: true
				},
				{
					id: 'userFieldName',
					formatter: 'description',
					name: 'User label name',
					name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
					field: 'userLabelName',
					width: 150,
					editor: null,
					focusable: true,
					searchable: true
				},
				{
					id: 'width',
					formatter: function (row, cell, value, columnDef, dataContext) {
						var totalValue = value;
						if (dataContext.isOverSize && dataContext.fieldLeft !== null) {
							return '<span style="color: red;">' + totalValue + '(' + Math.floor(_.toNumber(dataContext.fieldLeft)) + ')' + '</span>';
						} else if (dataContext.isOverSize && dataContext.fieldLeft === null) {
							return '<span style="color: red;">' + totalValue + '</span>';
						}
						return totalValue;
					},
					name: 'Width',
					name$tr$: 'cloud.desktop.gridWidthHeader',
					field: 'width',
					width: 150,
					cssClass: 'cell-right',
					editor: 'integer',
					focusable: true
				}
			];
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
				// var oldFn = item.fn;
				item.fn = function () {
					// oldFn();
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
					checkPageSize($scope.visibleItems);
					platformGridAPI.grids.refresh($scope.visibleGridId);
					fireGenericClickChangeEvent();
				};
			});

			function refreshGrid() {
				commonService.checkBidderColumn($scope.visibleItems.concat($scope.availableItems), compareBidders, verticalCompareRows, $scope.isVerticalCompareRows);

				initAvailableData();

				initVisibleData();
			}

			function loadSetting(eventInfo) {
				var isApplyNewProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.generic,
					isReloadProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.loadProfileFromBase;
				if (!eventInfo || isApplyNewProfile || isReloadProfile) {
					// get data for the left grid
					var printType = printSettingService.getCurrentPrintType();
					// set data for grids
					printSettingService.getCurrentGenericSetting().then(function (profile) {
						getCurrentRfqSetting().then(function (rfqProfile) {
							var baseConfigPromise = printType === printConstants.printType.item ? [itemService.getCustomSettingsCompareQuoteRowsAsync(), itemService.getCustomSettingsCompareBillingSchemaRowsAsync(), itemService.getCustomSettingsCompareRowsAsync()]
								: [boqService.getCustomSettingsCompareQuoteRowsAsync(), boqService.getCustomSettingsCompareBillingSchemaRowsAsync(), boqService.getCustomSettingsCompareRowsAsync()];

							$q.all(baseConfigPromise).then(function (response) {
								$scope.visibleItems = profile.column && profile.column[compareType] ? profile.column[compareType].printColumns : [];
								$scope.paperSize = profile.pageLayout.paperSize;
								$scope.orientation = profile.pageLayout.orientation;
								$scope.isVerticalCompareRows = profile.row && profile.row[compareType] ? profile.row[compareType].isVerticalCompareRows : false;
								$scope.isLineValueColumn = profile.row && profile.row[compareType] ? profile.row[compareType].isLineValueColumn : $scope.isVerticalCompareRows;
								$scope.isFinalShowInTotal = profile.row && profile.row[compareType] ? profile.row[compareType].isFinalShowInTotal : false;

								if(printType === printConstants.printType.boq) {
									$scope.isCalculateAsPerAdjustedQuantity = profile.row && profile.row[compareType] ? profile.row[compareType].isCalculateAsPerAdjustedQuantity : false;
								}

								$scope.compareFieldsLength = 1;
								$scope.bidderPageSize = profile.report.bidderPageSize;

								var baseBidders = platformObjectHelper.getValue(profile, 'bidder', []);
								compareBidders = _.filter(commonHelperService.getAllBidders(baseBidders[compareType], platformObjectHelper.getValue(rfqProfile, 'bidder.quotes', [])), {Visible: true});
								$scope.bidderVisibleNum = commonHelperService.getVisibleBidderLength(compareBidders);
								$scope.bidderPerSizeCheck = profile.report.bidderPageSizeCheck;

								if ($scope.visibleItems.length > 0) {
									$scope.visibleItems = printSettingService.getVisibleColumns(printType, $scope.visibleItems);
								}
								checkPageSize($scope.visibleItems);

								$scope.availableItems = _.sortBy(printSettingService.getAvailableColumns(printType, $scope.visibleItems), ['field']);

								var compareFieldProp = printType === printConstants.printType.item ? 'row.item.itemFields' : 'row.boq.itemFields';
								var itemFields = printSettingService.formatterRowData(response[2], platformObjectHelper.getValue(profile, compareFieldProp, []));
								verticalCompareRows = _.filter(itemFields, function (row) {
									return row.Visible && !commonHelperService.isExcludedCompareRowInVerticalMode(row.Field);
								});

								refreshGrid();

								// if new profile, recalculate the bidder width
								if (isApplyNewProfile) {
									var bidder = _.find($scope.visibleItems, {id: printConstants.bidderFieldName});
									if (bidder) {
										printSettingService.onCurrentSettingChanged.fire({
											eventName: printConstants.eventNames.bidderWidthChange,
											value: bidder.width
										});
									}
								}
							});
						});
					});
				}
			}

			function getCurrentRfqSetting() {
				return printType === printConstants.printType.boq ? printSettingService.getCurrentRfqBoqSetting() : printSettingService.getCurrentRfqItemSetting();
			}

			function initAvailableData() {
				// platformGridAPI.columns.configuration($scope.availableGridId, angular.copy(availableGridColumns));
				platformGridAPI.items.data($scope.availableGridId, $scope.availableItems);
			}

			function initVisibleData() {
				// platformGridAPI.columns.configuration($scope.visibleGridId, angular.copy(gridColumns));
				platformGridAPI.items.data($scope.visibleGridId, $scope.visibleItems);
			}

			// check the page size and total column
			function checkPageSize(columns) {
				var hasNotSize = false;
				var currencyTotalSize = 0;
				var maxWidth = printSettingService.getPrintPaperWidth($scope.paperSize, $scope.orientation);
				_.forEach(columns, function (col) {
					var width = col.width;
					if (col.id === printConstants.bidderFieldName) {
						if (!$scope.isVerticalCompareRows) {
							var lineValueCol = _.find(col.children, {field: 'LineValue'});
							if (lineValueCol) {
								width = lineValueCol.width * compareBidders.length;
							}
						}
					}
					col.isOverSize = false;
					col.fieldLeft = null;
					if (hasNotSize) {
						col.isOverSize = true;
						validateBidderColumn(col);
						return;
					}
					currencyTotalSize += width;
					var space = maxWidth - currencyTotalSize;
					if (space < 0) {
						hasNotSize = true;
						col.isOverSize = true;
						col.fieldLeft = width + space;
					}
					validateBidderColumn(col);
				});
				return hasNotSize;
			}

			function validateBidderColumn(col) {
				if (col.id === printConstants.bidderFieldName) {
					printSettingService.onTabStateChange.fire({
						name: 'column',
						warnings: [
							angular.extend({}, printConstants.hints.warning.bidderWidthInvalid, {invalid: col.isOverSize})
						]
					});
				}
			}

			// check the bidder width and recalculate the bidder column width
			function checkBidderWidth(actualMoveItems, gridIdStart) {
				var bidder = _.find(actualMoveItems, {id: printConstants.bidderFieldName});
				if (bidder) {
					var width = gridIdStart === 'visibleGridId' ? 0 : bidder.width;
					printSettingService.onCurrentSettingChanged.fire({
						eventName: printConstants.eventNames.bidderWidthChange,
						value: width
					});
				}
			}

			function fireGenericClickChangeEvent() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.genericClickChange
				});
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
					// moveItemsFromStart = angular.copy(startItems);
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

				// check bidder width
				checkBidderWidth(actualMoveItems, gridIdStart);

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

				// check pageSize
				checkPageSize($scope.visibleItems);
				fireGenericClickChangeEvent();

				// update grid content
				platformGridAPI.items.data($scope[gridIdStart], startItems);

				platformGridAPI.grids.refresh($scope[gridIdStart]);

				platformGridAPI.items.data($scope[gridIdTarget], targetItems);

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

			function onVisibleColumnGridCellChanged(e, args) {
				var column = args.grid.getColumns()[args.cell];
				if (column.field === 'width') {
					if (_.startsWith(args.item.id, '_rt$bidder')) {
						var bidderCol = null;
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
							bidderCol = args.item;
						} else {
							bidderCol = _.find(args.grid.getData().getRows(), {id: '_rt$bidder'});
							bidderCol.width = _.sumBy(bidderCol.children, 'width') * compareBidders.length;
						}
						checkPageSize($scope.visibleItems);
						platformGridAPI.grids.refresh(args.grid.id);
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.bidderWidthChange,
							value: bidderCol.width
						});
						fireGenericClickChangeEvent();
					}
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
				if (targetGridId === $scope.visibleGridId) {
					checkPageSize($scope.visibleItems);
				}
				platformGridAPI.grids.refresh(targetGridId);
			}

			function onCompareFieldItemChanged(items) {
				readVerticalCompareRows([{
					Field: 'LineValue',
					DisplayName: $translate.instant('procurement.pricecomparison.lineValue'),
					Visible: true
				}].concat(items));
				if ($scope.isVerticalCompareRows) {
					refreshGrid();
				}
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

			commonHelperService.registerEvent('Scope_Compare_Print_Setting', 'onCompareBidderVisibleItemChanged', onCompareBidderVisibleItemChanged);
			commonHelperService.registerEvent('Scope_Compare_Print_Setting', 'onCompareFieldVisibleItemChanged', onCompareFieldItemChanged);
			commonHelperService.registerEvent('Scope_Compare_Print_Setting', 'onCompareFieldSortingChanged', onCompareFieldSortingChanged);

			platformGridAPI.events.register($scope.availableGridId, 'onActiveCellChanged', onAvailableColumnGridCellActiveChanged);
			platformGridAPI.events.register($scope.visibleGridId, 'onActiveCellChanged', onVisibleColumnGridCellActiveChanged);
			platformGridAPI.events.register($scope.visibleGridId, 'onCellChange', onVisibleColumnGridCellChanged);

			platformGridAPI.events.register($scope.availableGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.visibleGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function recalculateColumns(event) {
				if (event.eventName === printConstants.eventNames.paperSizeChange) {
					$scope.paperSize = event.value;
					checkPageSize($scope.visibleItems);
					// platformGridAPI.columns.configuration($scope.visibleGridId, angular.copy(gridColumns));
					platformGridAPI.grids.refresh($scope.visibleGridId);
				}
				if (event.eventName === printConstants.eventNames.orientationChange) {
					$scope.orientation = event.value;
					checkPageSize($scope.visibleItems);
					// platformGridAPI.columns.configuration($scope.visibleGridId, angular.copy(gridColumns));
					platformGridAPI.grids.refresh($scope.visibleGridId);
				}
				if (event.eventName === printConstants.eventNames.maxBidderPageSizeChange) {
					var bidderPerSize = event.value.bidderPerSize;
					if (!event.value.bidderPerSizeCheck) {
						bidderPerSize = $scope.bidderVisibleNum;
					}
					if ($scope.bidderPageSize !== bidderPerSize || $scope.bidderPerSizeCheck !== event.value.bidderPerSizeCheck) {
						$scope.bidderPerSizeCheck = event.value.bidderPerSizeCheck;
						$scope.bidderPageSize = bidderPerSize;
						checkPageSize($scope.visibleItems);
						platformGridAPI.grids.refresh($scope.visibleGridId);
					}
				}

				if (event.eventName === printConstants.eventNames.bidderVisibleNumChange) {
					$scope.bidderVisibleNum = event.value;
					// $scope.totalBidderCount = _.min([$scope.bidderPageSize, $scope.bidderVisibleNum]) * $scope.compareFieldsLength;
					checkPageSize($scope.visibleItems);
					// platformGridAPI.columns.configuration($scope.visibleGridId, angular.copy(gridColumns));
					platformGridAPI.grids.refresh($scope.visibleGridId);
				}

				if (event.eventName === printConstants.eventNames.compareFieldsCountChange) {
					// var oldTotalBidderCount = $scope.totalBidderCount;
					$scope.compareFieldsLength = event.printFieldLength;
					// $scope.totalBidderCount = _.min([$scope.bidderPageSize, $scope.bidderVisibleNum]) * event.printFieldLength;
					$scope.isVerticalCompareRows = event.isVerticalCompareRows;
					refreshGrid();
					checkPageSize($scope.visibleItems);
					// platformGridAPI.columns.configuration($scope.visibleGridId, angular.copy(gridColumns));
					platformGridAPI.grids.refresh($scope.visibleGridId);

				}
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

			function onCollectSetting() {
				var collectData = {column: {}};
				var copyConfigItems = angular.copy($scope.visibleItems);
				collectData.column[compareType] = {
					printColumns: copyConfigItems
				};
				printSettingService.setCurrentGenericSetting(collectData);
			}

			printSettingService.onCurrentSettingChanged.register(recalculateColumns);
			printSettingService.onCurrentSettingChanged.register(loadSetting);
			printSettingService.onCollectSetting.register(onCollectSetting);

			loadSetting();

			$scope.$on('$destroy', function () {
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
				printSettingService.onCurrentSettingChanged.unregister(recalculateColumns);
				printSettingService.onCollectSetting.unregister(onCollectSetting);
				if (platformGridAPI.grids.exist($scope.visibleGridId)) {
					platformGridAPI.events.unregister($scope.visibleGridId, 'onActiveCellChanged', onVisibleColumnGridCellActiveChanged);
					platformGridAPI.grids.unregister($scope.visibleGridId);
					platformGridAPI.events.unregister($scope.visibleGridId, 'onCellChange', onVisibleColumnGridCellChanged);
				}

				if (platformGridAPI.grids.exist($scope.availableGridId)) {
					platformGridAPI.events.unregister($scope.availableGridId, 'onActiveCellChanged', onAvailableColumnGridCellActiveChanged);
					platformGridAPI.grids.unregister($scope.availableGridId);
				}

				commonHelperService.unregisterEvent('Scope_Compare_Print_Setting', 'onCompareBidderVisibleItemChanged', onCompareBidderVisibleItemChanged);
				commonHelperService.unregisterEvent('Scope_Compare_Print_Setting', 'onCompareFieldVisibleItemChanged', onCompareFieldItemChanged);
				commonHelperService.unregisterEvent('Scope_Compare_Print_Setting', 'onCompareFieldSortingChanged', onCompareFieldSortingChanged);

				platformGridAPI.events.unregister($scope.availableGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister($scope.visibleGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

		}

	]);
})(angular);