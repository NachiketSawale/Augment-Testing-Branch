/**
 * Created by ada on 2018/10/10.
 */
(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonPrintItemRowSettingController', [
		'_', '$scope', '$timeout', '$translate', '$injector', 'platformGridAPI', 'platformTranslateService', 'platformGridConfigService', 'reportingPrintService',
		'basicsCommonDialogGridControllerService', 'procurementPriceComparisonPrintSettingService', 'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonService', 'procurementPriceComparisonItemRowService', 'procurementPriceComparisonBoqRowService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonHeaderCheckHelperService',
		'procurementPriceComparisonBoqQuoteRowService',
		'procurementPriceComparisonItemQuoteRowService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonSettingConfiguration',
		function (_, $scope, $timeout, $translate, $injector, platformGridAPI, platformTranslateService, platformGridConfigService, reportingPrintService,
			basicsCommonDialogGridControllerService, printSettingService, printConstants,
			commonService, itemRowService, boqRowService,
			commonHelperService,
			headerCheckHelperService,
			boqQuoteRowService,
			itemQuoteRowService,
			boqService,
			itemService,
			settingConfiguration) {

			var currentConfig = settingConfiguration.getCurrentConfig();
			var configure = currentConfig.compareField;
			var printType = printSettingService.getCurrentPrintType();
			var deviationFields = printType === printConstants.printType.boq ? commonService.boqDeviationFields : commonService.itemDeviationFields;
			var gridColumns = [
				{
					id: 'fieldName',
					field: 'FieldName',
					name: 'Field Name',
					name$tr$: 'procurement.pricecomparison.compareConfigFieldsFieldName',
					width: 120
				},
				{
					id: 'userFieldName',
					formatter: 'description',
					name: 'User label name',
					name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
					field: 'UserLabelName',
					width: 150,
					hidden: false
				},
				{
					id: $scope.entity ? $scope.entity.item.id : 'Visible',
					field: 'Visible',
					name: $scope.entity ? $scope.entity.item.name : 'Visible',
					name$tr$: $scope.entity ? $scope.entity.item.name$tr$ : 'procurement.pricecomparison.compareConfigColumnsVisible',
					formatter: 'boolean',
					editor: 'boolean',
					width: 150,
					headerChkbox: true
				}
			];

			var containerType = $scope.model.split('.')[1];

			if (containerType === 'itemFields') {
				gridColumns.push(
					{
						id: 'showInSummary',
						field: 'ShowInSummary',
						name: 'Show In Summary',
						name$tr$: 'procurement.pricecomparison.compareConfigFieldsShowInSummary',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: true
					},
					{
						id: 'leadingField',
						field: 'IsLeading',
						name: 'Leading Field',
						name$tr$: 'procurement.pricecomparison.compareConfigFieldsLeadingField',
						formatter: 'boolean',
						editor: 'boolean'
					},
					{
						id: 'conditionalFormat',
						field: 'ConditionalFormat',
						name: 'Conditional Format',
						width: 500,
						name$tr$: 'procurement.pricecomparison.compareConfigFieldsConditionalFormat'
					},
					{
						id: 'deviationField',
						field: 'DeviationField',
						name: 'Deviation Field',
						name$tr$: 'procurement.pricecomparison.deviationField',
						formatter: 'boolean',
						editor: 'boolean',
						width: 100,
						headerChkbox: true
					},
					{
						id: 'deviationPercent',
						field: 'DeviationPercent',
						name: 'Deviation Percent',
						name$tr$: 'procurement.pricecomparison.deviationPercent',
						formatter: 'percent',
						editor: 'percent',
						width: 100,
						regex: '(^[+]?\\d*$)|(^(?:[+]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,2})$)'
					},
					{
						id: 'deviationReference',
						field: 'DeviationReference',
						name: 'Deviation Reference',
						name$tr$: 'procurement.pricecomparison.deviationReference',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'DeviationReference',
							displayMember: 'DescriptionInfo.Translated'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								filterKey: 'price-comparison-item-evaluation-filter'
								// showClearButton: true
							},
							directive: 'deviation-reference-combobox'
						},
						width: 100
					});
			}
			if (containerType === 'quoteFields') {
				gridColumns.push({
					id: 'isSorting',
					field: 'IsSorting',
					name: 'Sorting',
					name$tr$: 'procurement.pricecomparison.isSorting',
					editor: 'boolean',
					formatter: 'boolean',
					width: 100
				});
			}
			// var type = $scope.entity.item.type;
			$scope.uuid = $scope.entity.item[containerType];
			var toolbarItems = [
				{
					id: 't105',
					sort: 40,
					caption: $translate.instant('procurement.pricecomparison.moveUp'),
					iconClass: commonService.icons.toolBars.moveUp,
					type: 'item',
					fn: function () {
						if (platformGridAPI.grids.exist($scope.uuid)) {
							platformGridConfigService.moveSelectedItemTo(1, $scope.uuid);
							clickChange();
							commonHelperService.fireEvent('Scope_Compare_Print_Setting', 'onCompareFieldSortingChanged', {
								name: 'moveUp',
								items: platformGridAPI.items.data($scope.uuid)
							});
						}
					}
				},
				{
					id: 't106',
					sort: 50,
					caption: $translate.instant('procurement.pricecomparison.moveDown'),
					iconClass: commonService.icons.toolBars.moveDown,
					type: 'item',
					fn: function () {
						if (platformGridAPI.grids.exist($scope.uuid)) {
							platformGridConfigService.moveSelectedItemTo(3, $scope.uuid);
							clickChange();
							commonHelperService.fireEvent('Scope_Compare_Print_Setting', 'onCompareFieldSortingChanged', {
								name: 'moveDown',
								items: platformGridAPI.items.data($scope.uuid)
							});
						}
					}
				},
				{
					id: 'd3',
					sort: 70,
					type: 'divider'
				},
				{
					id: 't1',
					sort: 110,
					caption: 'cloud.common.taskBarSearch',
					type: 'check',
					value: platformGridAPI.grids.exist($scope.uuid) ? platformGridAPI.filters.showSearch($scope.uuid) : '',
					iconClass: 'tlb-icons ico-search',
					fn: function () {
						platformGridAPI.filters.showSearch($scope.uuid, this.value);
						// $scope.toggleFilter(this.value);
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 't109',
					sort: 111,
					caption: 'cloud.common.print',
					iconClass: 'tlb-icons ico-print-preview',
					type: 'item',
					fn: function () {
						reportingPrintService.printGrid($scope.uuid);
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 't111',
					sort: 112,
					caption: 'cloud.common.gridlayout',
					iconClass: 'tlb-icons ico-settings',
					type: 'item',
					fn: function () {
						platformGridAPI.configuration.openConfigDialog($scope.uuid);
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				}
			];

			$scope.tools = platformGridConfigService.initToolBar($scope.uuid);
			$scope.tools = commonService.getTools($scope.tools, toolbarItems);
			$scope.gridData = {state: $scope.uuid};

			// get columns from config
			var columns = [];
			var config = $injector.get('mainViewService').getViewConfig($scope.uuid);
			if (config && config.Propertyconfig) {
				var configColumns = angular.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
				if (configColumns) {
					// gridColumns = configColumns;
					_.forEach(configColumns, function (item) {
						var colDef = _.find(gridColumns, {id: item.id});
						if (colDef) {
							// some filed can't always use the custom settings in databse to avoid not updating when changed in client.
							colDef.hidden = !item.hidden;
							colDef.keyboard = item.keyboard;
							colDef.pinOrder = item.pinOrder;
							colDef.pinned = item.pinned;
							colDef.userLabelName = item.userLabelName;
							colDef.width = item.width;
							columns.push(angular.copy(colDef));
						}
					});

					_.forEach(gridColumns, function (item) {
						var configColumn = _.find(configColumns, {id: item.id});
						if (!configColumn) {
							columns.push(item);
						}
					});
				}
			} else {
				columns = gridColumns;
			}

			// set columns definition and refresh grid with the grouped data.
			platformTranslateService.translateGridConfig(columns);
			var grid = {
				columns: columns,
				data: [],
				id: $scope.uuid,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'Id',
					skipPermissionCheck: true,
					showMainTopPanel: false
				}
			};

			platformGridAPI.grids.config(grid);
			platformGridAPI.columns.configuration($scope.uuid, grid.columns);
			$scope.gridId = $scope.uuid;
			if (containerType === 'quoteFields') {
				headerCheckHelperService.configForQuoteRows($scope, {
					completeFn: function (items, field) {
						var targetItems = _.filter(items, function (item) {
							return !commonHelperService.isDataPropReadonly(item, field);
						});
						processCheckboxCellChanged(targetItems, field, false);
					}
				});
			}
			setData();

			if (containerType === 'itemFields') {
				headerCheckHelperService.configForCompareRows($scope, {
					completeFn: function (items, field) {
						var targetItems = _.filter(items, function (item) {
							return !commonHelperService.isDataPropReadonly(item, field);
						});
						processCheckboxCellChanged(targetItems, field, true);
					}
				});
			}

			function setData(eventInfo) {
				if (!eventInfo || eventInfo.eventName === printConstants.eventNames.rowConfigChange) {
					if (eventInfo) {
						$scope.entity = eventInfo.value;
					}
					if (!_.isEmpty($scope.entity)) {
						if (containerType === 'itemFields') {
							if (printType === printConstants.printType.boq) {
								boqRowService.setDataReadOnly($scope.entity[containerType], deviationFields, $scope.isDeviationColumn);
							} else {
								itemRowService.setDataReadOnly($scope.entity[containerType], deviationFields, $scope.isDeviationColumn);
							}
						} else {
							readonly($scope.uuid, ($scope.entity.isVerticalCompareRows && !$scope.entity.isLineValueColumn), $scope.entity[containerType]);
						}
						if (containerType === 'quoteFields') {
							var quoteRows = $scope.entity[containerType];
							var grandTotal = _.find(quoteRows, {Field: commonService.quoteCompareFields.grandTotalRank}),
								checked = grandTotal ? grandTotal.IsSorting : false;
							if (printType === printConstants.printType.boq) {
								boqService.setGrandTotalRankSortingCheckedState('print', checked);
								boqService.onGrandTotalRankSortingChanged.fire({
									origin: commonService.constant.compareSection.PRINT,
									checked: checked
								});
							} else {
								itemService.setGrandTotalRankSortingCheckedState('print', checked);
								itemService.onGrandTotalRankSortingChanged.fire({
									origin: commonService.constant.compareSection.PRINT,
									checked: checked
								});
							}
							commonHelperService.setQuoteCompareFieldsReadOnly(quoteRows, $scope.uuid);
							if ($scope.entity.isVerticalCompareRows && !$scope.entity.isLineValueColumn) {
								headerCheckHelperService.disabledHeaderCheckBox($scope.uuid, ['Print', 'isSorting'], true, 20);
							}
						}
						if (containerType === 'billingSchemaFields') {
							if ($scope.entity.isVerticalCompareRows && !$scope.entity.isLineValueColumn) {
								headerCheckHelperService.disabledHeaderCheckBox($scope.uuid, ['Print', 'isSorting'], true, 10);
							}
						}
						if ($scope.entity[containerType] && $scope.entity[containerType].length > 0) {
							if ($scope.entity.isVerticalCompareRows) {
								fireCompareFieldsInVertical(true);
							}
							platformGridAPI.items.data($scope.uuid, $scope.entity[containerType]);
						}
						platformGridAPI.grids.invalidate($scope.uuid);
					}
				}
			}

			function onCellChange(e, args) {
				var columns = args.grid.getColumns(), field = columns[args.cell].field, item = args.item;
				processCheckboxCellChanged([item], field, true, args.item.Field);
			}

			function processCheckboxCellChanged(items, field, isRefreshGrid, itemField) {
				var hasChanged = false;
				var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView;
				var allItems = dataView.getItems();
				var percentage = _.find(allItems, {Field: commonService.itemCompareFields.percentage});
				_.each(items, function (item) {
					if (field === 'DeviationField') {
						commonService.highlightRowCellChanged(item, $scope.isDeviationColumn);
						if (item.Field === commonService.itemCompareFields.absoluteDifference) {
							percentage.DeviationField = item.DeviationField;
							percentage.DeviationPercent = item.DeviationPercent;
							percentage.DeviationReference = item.DeviationReference;
						}
						hasChanged = true;
					}
					if (field === 'IsLeading') {
						$scope.entity[containerType].map(function (col) {
							col[field] = false;
						});
						item[field] = true;
						hasChanged = true;
					}

					if (containerType === 'quoteFields' && (field === 'IsSorting' || field === 'Visible')) {
						var grandTotal = _.find(items, {Field: commonService.quoteCompareFields.grandTotalRank});
						if (grandTotal && !grandTotal.Visible) {
							grandTotal.IsSorting = false;
						}
						var checked = grandTotal ? grandTotal.IsSorting : false;
						if (printType === printConstants.printType.boq) {
							boqService.onGrandTotalRankSortingChanged.fire({
								origin: commonService.constant.compareSection.PRINT,
								checked: checked
							});
						} else {
							itemService.onGrandTotalRankSortingChanged.fire({
								origin: commonService.constant.compareSection.PRINT,
								checked: checked
							});
						}
						commonHelperService.setQuoteCompareFieldsReadOnly(items, $scope.uuid);
						if (angular.isFunction($scope.updateHeaderCheckState)) {
							$scope.updateHeaderCheckState();
						}
					}
				});

				if (itemField === commonService.itemCompareFields.absoluteDifference &&
					(field === 'DeviationField' || field === 'DeviationPercent' || field === 'DeviationReference')) {
					configure.dataService.setPercentDeviation(allItems);
					hasChanged = true;
				}

				if (field === 'Visible' && containerType === 'itemFields') {
					if ($scope.entity.isVerticalCompareRows) {
						fireCompareFieldsInVertical(false);
					}
					commonHelperService.fireEvent('Scope_Compare_Print_Setting', 'onCompareFieldVisibleItemChanged', dataView.getRows());
				}

				if (hasChanged && isRefreshGrid) {
					platformGridAPI.grids.invalidate($scope.uuid);
				}
				clickChange();
			}

			function clickChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.genericClickChange
				});
			}

			function fireCompareFieldsInVertical(isFirstLoad) {
				var length = 1;
				if ($scope.entity.isVerticalCompareRows) {
					var itemFields = $scope.entity ? $scope.entity.itemFields : [];
					var printFields = _.filter(itemFields, function (printField) {
						return printField && printField.Visible === true && !_.includes(commonService.boqNotPositionFields, printField.Field);
					});
					var index = $scope.entity.isLineValueColumn ? 1 : 0;
					length = printFields.length + index;
				}

				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.compareFieldsCountChange,
					printFieldLength: length,
					isFirstLoad: isFirstLoad,
					isVerticalCompareRows: $scope.entity.isVerticalCompareRows
				});
			}

			var onHighlightChanged = function (eventInfo) {
				if (eventInfo.eventName === 'ColumnHighlightChanged') {
					$scope.isDeviationColumn = eventInfo.value;
					var list = $scope.entity[containerType];
					commonService.onHighlightChanged(eventInfo, list, deviationFields);
					// refresh the grid data
					platformGridAPI.grids.invalidate($scope.uuid);
				}
			};
			if (containerType === 'itemFields') {
				commonService.onHighlightSelectedChanged.register(onHighlightChanged);
			}
			platformGridAPI.grids.resize($scope.uuid);
			printSettingService.onCurrentSettingChanged.register(setData);
			platformGridAPI.events.register($scope.uuid, 'onCellChange', onCellChange);

			$scope.onVerticalCompareRowsChanged = function () {
				if ($scope.entity.isVerticalCompareRows) {
					$scope.entity.isLineValueColumn = true;
					readonlyFields(!$scope.entity.isLineValueColumn);
				} else {
					$scope.entity.isLineValueColumn = false;
					readonlyFields(false);
				}
				fireCompareFieldsInVertical(false);
				clickChange();
			};

			$scope.onLineValueColumnChanged = function () {
				readonlyFields(!$scope.entity.isLineValueColumn);
				fireCompareFieldsInVertical(false);
				clickChange();
			};

			$scope.onFinalShowInTotalChanged = function () {
				clickChange();
			};

			$scope.isCalculateAsPerAdjustedQuantity = function () {
				clickChange();
			};

			function onLineValueColumnVisibleChanged(lineValueChecked, horizontalChecked) {
				if (!horizontalChecked || lineValueChecked) {
					headerCheckHelperService.enabledHeaderCheckBox($scope.entity.item.quoteFields, ['Visible', 'visible', 'Print'], true);
					commonHelperService.setQuoteCompareFieldsReadOnly($scope.entity.quoteFields, $scope.entity.item.quoteFields);
					var grandRow = _.find($scope.entity.quoteFields, {Field: commonService.quoteCompareFields.grandTotalRank}),
						enabledSorting = !!(grandRow && grandRow.Visible);
					if (enabledSorting) {
						headerCheckHelperService.enabledHeaderCheckBox($scope.entity.item.quoteFields, ['isSorting'], false);
					}

					headerCheckHelperService.enabledHeaderCheckBox($scope.entity.item.billingSchemaFields, ['Visible', 'visible', 'Print'], true);
				} else {
					headerCheckHelperService.disabledHeaderCheckBox($scope.entity.item.quoteFields, ['Visible', 'visible', 'Print', 'isSorting'], true);
					headerCheckHelperService.disabledHeaderCheckBox($scope.entity.item.billingSchemaFields, ['Visible', 'visible', 'Print'], true);
				}
			}

			function readonlyFields(isReadonly) {
				onLineValueColumnVisibleChanged($scope.entity.isLineValueColumn, $scope.entity.isVerticalCompareRows);
				// readonly($scope.entity.item.quoteFields, isReadonly, $scope.entity.quoteFields);
				readonly($scope.entity.item.billingSchemaFields, isReadonly, $scope.entity.billingSchemaFields);
			}

			function readonly(uuid, isReadonly, list) {
				var readonlyField = [
					{
						field: 'Visible',
						readonly: isReadonly
					}];
				_.forEach(list, function (row) {
					if (row.Field === commonService.quoteCompareFields.grandTotalRank) {
						commonService.setFieldReadOnly(row, [{
							field: 'IsSorting',
							readonly: commonHelperService.isDataPropReadonly(row, 'Visible') || isReadonly
						}]);
					}
					commonService.setFieldReadOnly(row, readonlyField);
				});
				// refresh the grid data
				platformGridAPI.grids.invalidate(uuid);
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.uuid)) {
					platformGridAPI.grids.unregister($scope.uuid);
					printSettingService.onCurrentSettingChanged.unregister(setData);
				}
				platformGridAPI.events.unregister($scope.uuid, 'onCellChange', onCellChange);
				if (containerType === 'itemFields') {
					commonService.onHighlightSelectedChanged.unregister(onHighlightChanged);
					$scope.isDeviationColumn = false;
				}
			});
		}]);
})(angular);