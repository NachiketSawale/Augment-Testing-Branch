(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonBoqController
	 * @requires $scope, $timeout
	 * @description
	 * #
	 * Controller for price comparison boq container.
	 */
	angular.module(moduleName).controller('procurementPriceComparisonBoqController', [
		'_', 'globals', '$scope', '$timeout', '$translate', '$rootScope', '$injector', 'platformGridControllerService', 'platformModalService', 'procurementPriceComparisonCheckBidderService',
		'platformGridAPI', 'procurementPriceComparisonMainService', 'procurementPriceComparisonBoqService',
		'procurementPriceComparisonCommonService', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'procurementPriceComparisonBoqConfigService',
		'boqMainLineTypes', 'procurementPriceComparisonLineTypes', 'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonHelperService', 'procurementPriceComparisonColumnResizeHelperService',
		'procurementPriceComparisonSettingConfiguration',
		'procurementPriceComparisonBoqCompareRows',
		'commonTooltipService',
		'platformObjectHelper',
		'mainViewService',
		'treeStateHelperService',
		function (_, globals, $scope, $timeout, $translate, $rootScope, $injector, platformGridControllerService, platformModalService, checkBidderService,
			platformGridAPI, mainDataService, dataService, commonService, moduleContext, basicsLookupdataLookupDescriptorService, boqConfigService, boqMainLineTypes, lineTypes, printConstants,
			commonHelperService, columnResizeHelper,
			settingConfiguration,
			boqCompareRows,
			commonTooltipService,
			platformObjectHelper,
			mainViewService,
			treeStateHelperService) {
			var columnsDef = {
				getStandardConfigForListView: function () {
					let allColumns = boqConfigService.getAllColumns();
					allColumns = allColumns.concat(commonService.getImageColumns());
					let columns = commonHelperService.getColumnsFromViewConfig($scope.getContainerUUID());
					columns = _.map(columns, function (item) {
						let column = _.find(allColumns, {id: item.id});
						if (column) {
							item.name$tr$ = column.name$tr$;
						}
						return item;
					});
					return {
						columns: columns
					};
				}
			};

			var arg = null;
			var gridConfig = {
				initCalled: false,
				columns: [],
				parentProp: '',
				childProp: 'BoqItemChildren',
				enableColumnReorder: false,
				cellEditableCallBack: function (args) {
					arg = args;
					return dataService.onCellEditable(args);
				}
			};
			var gridConfigId = 't200';
			var removeItems = ['create', 'delete', 'createChild', 't109'];

			// add export capability
			if (!moduleContext.getMainService() ||
				(moduleContext.getMainService().getItemName() !== 'ItemComparisonData' &&
					moduleContext.getMainService().getItemName() !== 'BoqComparisonData')) {
				moduleContext.setLeadingService(dataService);
				moduleContext.setMainService(dataService);
			}

			platformGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);
			$scope.printType = commonService.constant.compareType.boqItem;

			commonService.addToolbars($scope, [
				{
					id: 't104',
					sort: 140,
					caption: $translate.instant('procurement.pricecomparison.reload'),
					iconClass: commonService.icons.toolBars.reload,
					type: 'item',
					fn: dataService.reloadLatestQuotes
				},
				{
					id: 't105',
					sort: 141,
					caption: $translate.instant('cloud.common.toolbarSetting'),
					iconClass: commonService.icons.toolBars.settings,
					type: 'item',
					fn: configSettings
				},
				{
					id: 't106',
					sort: 142,
					caption: 'platform.formContainer.print',
					type: 'item',
					iconClass: 'tlb-icons ico-print',
					fn: function () {
						showPrintSettingsDialog();
					}
				},
				{
					id: 't107',
					sort: 143,
					caption: $translate.instant('procurement.pricecomparison.saveToOriginal'),
					iconClass: 'tlb-icons ico-save',
					type: 'item',
					fn: function () {
						var otherService = $injector.get('procurementPriceComparisonItemService');
						commonService.saveOriginalDialog(dataService, otherService);
					}
				},
				{
					id: 't108',
					sort: 144,
					caption: $translate.instant('procurement.pricecomparison.saveToNewVersion'),
					iconClass: 'tlb-icons ico-save-as',
					type: 'item',
					fn: function () {
						commonService.beforeSaveNewVersionDialog().then(function (result) {
							var otherService = $injector.get('procurementPriceComparisonItemService');
							if (result === 'saveModified') {
								commonService.saveNewVersionDialog(dataService, otherService, commonService.constant.compareType.boqItem, commonService.constant.compareType.prcItem, false);
							} else if (result === 'saveAll') {
								commonService.saveNewVersionDialog(dataService, otherService, commonService.constant.compareType.boqItem, commonService.constant.compareType.prcItem, true);
							}
						});
					}
				}
			]);

			commonService.removeToolbars($scope, removeItems, gridConfigId);

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCellRendered', commonService.onHeaderCellRendered);
			mainDataService.registerSelectionChanged(dataService.loadData);

			// Deal with compare data while it was changed from one side.
			var onRefreshCompareField = function (eventInfo) {
				if (eventInfo.eventName === 'RefreshBoqBillingSchema') {
					commonService.resetBillingSchemaValue(eventInfo.value, eventInfo.selectedQuote, dataService, boqConfigService.boqQtnMatchCache, 'BoqItemChildren', 'BoqLineTypeFk', 'RefreshItemBillingSchema', false, boqConfigService.visibleCompareColumnsCache, eventInfo.billingSchemas);
				} else if (eventInfo.eventName === 'RefreshBoqEvaluation') {

					var isEvaluationChange = commonService.resetEvaluationValue(dataService, eventInfo.value.points, eventInfo.value.quote, 'BoqItemChildren', 'BoqLineTypeFk', 'RefreshItemEvaluation', false, boqConfigService.visibleCompareColumnsCache);
					if (isEvaluationChange) {
						var enterCell = eventInfo.value.quote && eventInfo.value.quote.type === 'boq' ? dataService.currentEnterCell : null;
						dataService.redrawTree(true, enterCell);
					}
				} else if (eventInfo.eventName === 'RefreshBoqCommonQtnField') {
					dataService.updateAsExchangeRateChange(eventInfo.value.entity, eventInfo.value.field, eventInfo.value.key, eventInfo.value.exchangeRate, true);
				} else if (eventInfo.eventName === 'RedrawTree') {
					commonService.resetQuote(dataService, 'BoqItemChildren', 'BoqLineTypeFk', eventInfo.value.field, eventInfo.value.value, eventInfo.value.quoteField);
				} else if (eventInfo.eventName === 'GeneralRedrawTree') {
					if (eventInfo.value.fromType === commonService.constant.compareType.prcItem) {
						var tree = dataService.getTree();
						if (tree && tree.length > 0) {
							commonHelperService.resetGenerals(tree, 'BoqItemChildren', 'BoqLineTypeFk', eventInfo.value, boqConfigService.boqQtnMatchCache, boqConfigService.visibleCompareColumnsCache);
							dataService.redrawTree(true);
						}
					}
				} else if (eventInfo.eventName === 'updateDiscountAmountField') {
					dataService.updateDiscountAmountField(eventInfo.value.entity, eventInfo.value.ownQuoteKey, eventInfo.value.discountPercent, eventInfo.value.discountAmount, eventInfo.value.discountAmountOc);
				}
			};
			commonService.onRefreshCompareField.register(onRefreshCompareField);

			function onInitialized() {

				platformGridAPI.filters.extendFilterFunction($scope.gridId, function customFilter(node) {
					node.HasChildren = !_.isNil(node.BoqItemChildren) && _.filter(node.BoqItemChildren, function (item) {
						return !item._rt$Deleted;
					}).length > 0;
					if (node.nodeInfo) {
						node.nodeInfo.children = node.HasChildren;
						node.nodeInfo.lastElement = !node.HasChildren;
					}
					return node._rt$Deleted !== true;
				});

			}

			// load data after controller initialized (avoid losing data when using browser go back/forward)
			$timeout(function () {
				dataService.loadData();
			});

			// config custom settings for compare columns and rows (fields).
			function configSettings() {
				// show boq comparison dialog only on when a rfqHeader selected.
				if (mainDataService.hasSelection()) {
					settingConfiguration.setCurrentConfig('boq');
					commonService.loadDeviation();
					platformModalService.showDialog({
						scope: $rootScope.$new(true),
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-item-boq-settings.html',
						backdrop: false,
						controller: 'procurementPriceComparisonSettingsController',
						width: '80%',
						height: '90%',
						resizeable: true
					}).then(function (result) {
						if (result) {
							if (result.isOK) {
								var createData = {};
								var baseInfo = commonService.getBaseRfqInfo();
								createData.rfqHeaderFk = baseInfo.baseRfqId;  // get the base RFQ data
								createData.compareType = commonService.constant.compareType.boqItem;
								createData.compareColumns = result.data.compareColumns;     // compare columns to be inserted or updated
								createData.compareBaseColumns = result.data.baseColumnList;
								createData.deletedColumns = result.data.deletedColumns;     // compare columns to be deleted
								createData.compareRows = commonService.resetSorting(result.data.compareFields);         // compare field rows be inserted or updated
								createData.compareQuoteRows = commonService.resetSorting(result.data.compareQuoteFields);    // compare quote field rows be inserted or updated
								createData.compareBillingSchemaRows = commonService.resetSorting(result.data.compareBillingSchemaFields);
								createData.isVerticalCompareRows = result.data.isVerticalCompareRows;
								createData.isLineValueColumn = result.data.isLineValueColumn;
								createData.isFinalShowInTotal = result.data.isFinalShowInTotal;
								createData.isCalculateAsPerAdjustedQuantity = result.data.isCalculateAsPerAdjustedQuantity;
								createData.gridColumns = result.data.gridColumns;

								// process the pinned column to top

								// Save setting to database
								dataService.saveCustomSettings2DB(createData).then(function () {
									commonService.onCompareModeChanged($scope);
								});
							} else if (result.isDelete) {
								mainDataService.refresh();
							}
						}
					});

				}
			}

			function showPrintSettingsDialog() {
				if (!_.isEmpty(dataService.getTree())) {
					settingConfiguration.setCurrentConfig('printBoq');
					platformModalService.showDialog({
						scope: $scope,
						width: '1000px',
						resolve: {
							controllerOptions: function () {
								return {
									title: $translate.instant('procurement.pricecomparison.printing.configBoQ'),
									printType: printConstants.printType.boq,
									tabItems: [
										{
											name: 'boq',
											title: $translate.instant('procurement.pricecomparison.printing.boq'),
											content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-boq.html',
											sorting: 60
										},
										{
											name: 'analysis',
											title: $translate.instant('procurement.pricecomparison.printing.analysis'),
											content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-abc-analysis.html',
											sorting: 70
										}
									]
								};
							}
						},
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-print-settings-new.html',
						controller: 'procurementPriceComparisonItemBoqPrintSettingsNewController'
					});
				}
			}

			function onCellChange(e, args) {
				var columns = args.grid.getColumns(), field = columns[args.cell].field,
					quoteKey = columns[args.cell].isVerticalCompareRows ? columns[args.cell].quoteKey : field,
					rowType = columns[args.cell].isVerticalCompareRows ? columns[args.cell].originalField : args.item.rowType;
				var ownQuoteKey = commonService.getOwnQuoteKey(boqConfigService.boqQtnMatchCache, field, args.item.RfqHeaderId);

				if (args.item && args.item.BoqLineTypeFk === lineTypes.characteristic) {
					commonService.collectCharacterModifiedData(dataService, boqConfigService.boqQtnMatchCache, arg, args, true);
					return;
				}

				if (args.item && args.item.BoqLineTypeFk === lineTypes.generalItem) {
					commonHelperService.generalModifiedDataChange(args.item, field, boqConfigService.boqQtnMatchCache, boqConfigService.visibleCompareColumnsCache);
					commonService.onRefreshCompareField.fire({
						eventName: 'GeneralRedrawTree',
						value: {
							entity: args.item,
							field: field,
							fromType: commonService.constant.compareType.boqItem,
							value: args.item[field],
							key: ownQuoteKey
						}
					});
					return;
				}

				if (args.item && args.item.BoqLineTypeFk === lineTypes.quoteExchangeRate) {
					commonService.collectExchangeRateData(dataService, args, field, ownQuoteKey, 'RefreshBoqCommonQtnField');
					return;
				}

				if (args.item && (args.item.BoqLineTypeFk === lineTypes.quoteUserDefined || args.item.BoqLineTypeFk === lineTypes.quoteRemark)) {
					commonService.collectQuoteModifiedData(args.item.QuoteField, args.item[field], ownQuoteKey);
					commonService.onRefreshCompareField.fire({
						eventName: 'RedrawTree',
						value: {
							entity: args.item,
							field: field,
							quoteField: args.item.QuoteField,
							value: args.item[field]
						}
					});
					return;
				}

				if (args.item && (args.item.BoqLineTypeFk === lineTypes.quotePaymentTermPA || args.item.BoqLineTypeFk === lineTypes.quotePaymentTermFI)) {
					commonService.collectPaymentTermData(dataService, args, args.item.BoqLineTypeFk, field, ownQuoteKey);
					return;
				}

				if (args.item && rowType === boqCompareRows.isLumpsum) {
					let quoteItem = null, boqCompareFieldValue = null;
					let parentItem = commonHelperService.tryGetParentItem(args.item, columns[args.cell].isVerticalCompareRows);
					if (columns[args.cell].isVerticalCompareRows) { // isVerticalCompareRows = true
						var readonlyField = _.replace(field, boqCompareRows.isLumpsum, boqCompareRows.lumpsumPrice);
						var vReadonlyFields = [
							{field: readonlyField, readonly: !args.item[field] || columns[args.cell].isIdealBidder}
						];
						commonService.setFieldReadOnly(args.item, vReadonlyFields);
						if (args.item[field]) {
							boqCompareFieldValue = args.item[readonlyField] = args.item.finalPriceFields[quoteKey];
						} else {
							boqCompareFieldValue = args.item[readonlyField] = 0;
						}
						args.item[rowType] = args.item[field];
					}
					// isVerticalCompareRows = false
					if (parentItem && parentItem.BoqItemChildren) {
						var boqCompareField = _.find(parentItem.BoqItemChildren, {rowType: boqCompareRows.lumpsumPrice});
						if (boqCompareField) {
							var readonlyFields = [
								{field: field, readonly: !args.item[field] || columns[args.cell].isIdealBidder}
							];
							commonService.setFieldReadOnly(boqCompareField, readonlyFields);

							if (args.item[field]) {
								boqCompareFieldValue = boqCompareField[field] = parentItem.finalPriceFields[field];
							} else {
								boqCompareFieldValue = boqCompareField[field] = 0;
							}
						}
					}
					if (parentItem && parentItem.QuoteItems) {
						quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey});
						if (quoteItem) {
							quoteItem[rowType] = args.item[field];
							quoteItem[boqCompareRows.lumpsumPrice] = boqCompareFieldValue !== null ? boqCompareFieldValue : quoteItem[boqCompareRows.lumpsumPrice];
						}
					}
					dataService.collectQuoteModifiedField(args, args);
					if (quoteItem) {
						dataService.recalculateList(quoteKey, [quoteItem]);
					}
					return;
				}

				if (args.item && (rowType === boqCompareRows.included || rowType === boqCompareRows.notSubmitted)) {
					args.grid.gotoCell(args.row, args.cell);
					let quoteItem = null;
					let parentItem = commonHelperService.tryGetParentItem(args.item, columns[args.cell].isVerticalCompareRows);
					if (parentItem && parentItem.QuoteItems) {
						quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey});
						if (quoteItem) {
							quoteItem[rowType] = args.item[field];
						}
					}
					if (args.item && args.item[field] === true) {
						platformModalService.showYesNoDialog('boq.main.askDeleteUnitRate', 'boq.main.confirmDeleteUnitRate').then(function (response) {
							if (response.yes) {
								if (quoteItem) {
									let evaluatedValue = rowType === boqCompareRows.included ? 2 : null;
									quoteItem[boqCompareRows.price] = 0;
									quoteItem.PrcItemEvaluationFk = evaluatedValue;
									quoteItem.PrcItemEvaluationId = evaluatedValue;
									quoteItem.NotSubmitted = rowType === boqCompareRows.notSubmitted;
									quoteItem.ExQtnIsEvaluated = false;
									commonService.assignItemEvaluation(evaluatedValue, dataService.isVerticalCompareRows(), quoteItem, parentItem, 'BoqItemChildren');
									dataService.collectQuoteModifiedField(args, args);
									dataService.beforeRecalculateTree.fire([quoteItem]);
									dataService.recalculateList(quoteKey, [quoteItem]);
								}
							} else {
								args.grid.getActiveCellNode()[0].childNodes[0].checked = false;
								args.item[field] = false;
								quoteItem[rowType] = false;
							}
						});
					}
					else {
						quoteItem[rowType] = args.item[field];
						dataService.collectQuoteModifiedField(args, args);
					}
					return;
				}

				let requisitionFieldToSave = ['BasItemTypeFk','UomFk', 'Quantity', 'Brief'];
				if (args.item && args.item.BoqLineTypeFk === boqMainLineTypes.position && _.includes(requisitionFieldToSave, field)){
					commonService.onRequisitionFieldChange(dataService, args, field);
				}

				dataService.collectQuoteModifiedField(arg, args); // here 'args.cell' is null, so use 'arg' to get it's value
			}

			function getBoqItemNode(currentRow, quoteKey) {
				if (commonHelperService.isBoqRow(currentRow.BoqLineTypeFk)) {
					return _.find(currentRow.QuoteItems, {QuoteKey: quoteKey}) || {};
				}
				if (currentRow.BoqLineTypeFk === lineTypes.compareField && currentRow.parentItem) {
					return getBoqItemNode(currentRow.parentItem, quoteKey);
				}
				return null;
			}

			function getBoqRoot(currentRow, quoteKey, row) {
				if (currentRow.BoqLineTypeFk === boqMainLineTypes.root) {
					return _.find(currentRow.QuoteItems, {QuoteKey: quoteKey}) || {};
				}
				var parentRow = platformGridAPI.grids.element('id', $scope.gridId).dataView.getItem(--row);
				if (parentRow) {
					return getBoqRoot(parentRow, quoteKey, row);
				}
				return null;
			}

			function onActiveCellChanged(event, args) {
				if ((!args.row && args.row !== 0) || (!args.cell && args.cell !== 0)) {
					return;
				}
				// inject 'priceComparisonBillingSchemaService' in advanced.
				$injector.get('priceComparisonBillingSchemaService');
				var currentRow = platformGridAPI.grids.element('id', $scope.gridId).dataView.getItem(args.row);
				var currentCol = platformGridAPI.columns.configuration($scope.gridId).visible[args.cell];
				dataService.currentRow = currentRow;
				dataService.lastSelectedQuote = angular.copy(dataService.selectedQuote);
				dataService.selectedQuote = null;
				dataService.allSelectedQuote = null;
				dataService.selectedQuoteBoq = null;
				dataService.lastSelectedQuoteBoq = angular.copy(dataService.selectedQuoteBoq);

				if (args.row > -1 && args.cell && _.startsWith(currentCol.field, commonService.constant.prefix2) &&
					checkBidderService.boq.isNotReference(currentCol.field)) {

					var qtnMatchCache = boqConfigService.boqQtnMatchCache[currentRow.RfqHeaderId],
						quoteKey = currentCol.isVerticalCompareRows ? currentCol.quoteKey : currentCol.field;
					if (qtnMatchCache) {
						dataService.selectedQuote = _.find(qtnMatchCache, function (item) {
							return item.QuoteKey === quoteKey && item.ReqHeaderId === currentRow.ReqHeaderId ||
								(item.QuoteKey === quoteKey && args.row === 0);// click GrandTotal Row also can show billingSchema.
						});

						if (dataService.selectedQuote) {
							dataService.selectedQuote.LineType = currentRow.BoqLineTypeFk;
						}
					}
					var quoteBoq = getBoqItemNode(currentRow, quoteKey);
					if (quoteBoq) {
						dataService.selectedQuoteBoq = angular.copy(quoteBoq);
						dataService.selectedQuoteBoq.rootItem = getBoqRoot(currentRow, quoteKey, args.row);
						if (dataService.selectedQuoteBoq && dataService.selectedQuoteBoq.BoqItemId) {
							dataService.selectedQuoteBoq.Id = quoteBoq.BoqItemId;
						}
					}
				}
				dataService.currentEnterCell = args.cell;
				dataService.activeField = currentCol.field;
				dataService.onQuoteBoqSelected.fire();
				mainDataService.lastSelectedQuote = dataService.selectedQuote;
				mainDataService.onQuoteSelectedLoadEvaluation.fire(dataService.selectedQuote);
				dataService.onActiveCellChanged.fire();
			}

			columnResizeHelper.registerColumnResizeProcessor($scope, {
				isVerticalCompareRows: function () {
					return dataService.isVerticalCompareRows();
				},
				getTree: function () {
					return dataService.getTree();
				},
				initGridConfiguration: function (columns) {
					dataService.initGridConfiguration(columns);
				}
			});

			function onListLoaded() {
				let rfqRow = _.find(dataService.getTree(), {
					BoqLineTypeFk: lineTypes.rfq
				});
				if (rfqRow) {
					dataService.setSelected(rfqRow);
				}

				let columns = platformGridAPI.columns.getColumns($scope.gridId);
				let quoteColumns = _.filter(columns, function (col) {
					return _.startsWith(col.field, 'QuoteCol');
				});
				commonTooltipService.unregister($scope.gridId);
				commonTooltipService.register($scope.gridId, {
					isShowArrow: false,
					fields: _.map(quoteColumns, function (col) {
						return {
							tooltipField: col.field,
							textField: function (item) {
								let text = '',
									columnInfo = commonHelperService.extractCompareInfoFromFieldName(col.field),
									quoteData = item ? (item.parentItem || item) : null;
								if (quoteData && quoteData.QuoteItems && ((columnInfo.isVerticalCompareRows && item.BoqLineTypeFk === boqMainLineTypes.position) || (item.rowType === commonService.itemCompareFields.price))) {
									let quoteItem = _.find(quoteData.QuoteItems, {QuoteKey: columnInfo.quoteKey});
									if (quoteItem && quoteItem.PreviousItem) {
										text = commonHelperService.getNumericFormattedValue(quoteItem.PreviousItem.Price, 'money') + ' (' + $translate.instant('procurement.pricecomparison.rateFromPreviousVersion') + ')';
									}
								}
								return text;
							}
						};
					})
				});

				let cache = treeStateHelperService.getNodesCache(commonService.constant.compareType.boqItem, $scope.gridId);
				if (_.isEmpty(cache)){
					let config = mainViewService.getViewConfig($scope.gridId);
					if (config && config.Gridconfig && config.Gridconfig.treeGridLevel) {
						platformGridAPI.grids.setTreeGridLevel($scope.gridId, config.Gridconfig.treeGridLevel);
					}
					treeStateHelperService.setNodesCache(dataService.getTree(), commonService.constant.compareType.boqItem, $scope.gridId);
				}
			}

			function addEvaluatedNodeStyle() {
				let columns = platformGridAPI.columns.getColumns($scope.gridId);
				let quoteColumns = _.filter(columns, function (col) {
					return checkBidderService.isNotReference(col.field) && commonHelperService.isBidderColumn(col) && !col.isIdealBidder;
				});

				let styleKey = 'itemEvaluatedBoqCellStyle';
				let grid = platformGridAPI.grids.element('id', $scope.gridId);

				let rows = grid.dataView.getRows();

				let highlightNodes = [];
				if (!dataService.isVerticalCompareRows()) {
					let priceRows = _.filter(rows, row => row.rowType === boqCompareRows.price);
					if (priceRows && priceRows.length > 0){
						createHighLightNodes(priceRows, rows, highlightNodes);
					}

					let itemEvaluationRows = _.filter(rows, row => row.rowType === boqCompareRows.prcItemEvaluationFk);
					if (itemEvaluationRows && itemEvaluationRows.length > 0) {
						createHighLightNodes(itemEvaluationRows, rows, highlightNodes);
					}
				} else {
					let positions = _.filter(rows, row => row.BoqLineTypeFk === boqMainLineTypes.position);
					if (positions && positions.length > 0) {
						createHighLightNodes(positions, rows, highlightNodes);
					}
				}

				function createHighLightNodes(targetRows, rows, highlightNodes){
					if (!dataService.isVerticalCompareRows()) {
						_.forEach(targetRows, row => {
							let rowIndex = _.indexOf(rows, row);
							_.forEach(quoteColumns, column => {
								let quoteItem = _.find(row.parentItem.QuoteItems, item => item.QuoteKey === column.field);
								if (quoteItem && quoteItem.ExQtnIsEvaluated) {
									highlightNodes.push({
										cell: {
											row: rowIndex,
											col: column.field
										}
									});
								}
							});
						});
					} else {
						_.forEach(targetRows, row => {
							let rowIndex = _.indexOf(rows, row);
							_.forEach(row.QuoteItems, quoteItem => {
								if (quoteItem.ExQtnIsEvaluated) {
									highlightNodes.push({
										cell: {
											row: rowIndex,
											col: quoteItem.QuoteKey + '_' + boqCompareRows.price
										}
									});
									highlightNodes.push({
										cell: {
											row: rowIndex,
											col: quoteItem.QuoteKey + '_' + boqCompareRows.prcItemEvaluationFk
										}
									});
								}
							});
						});
					}
				}

				commonService.processEvaluatedStyle(grid, highlightNodes, styleKey);
			}

			platformGridAPI.events.register($scope.gridId, 'onRowsChanged', addEvaluatedNodeStyle);

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			dataService.onListLoaded.register(onListLoaded);

			$scope.$on('$destroy', function destroyFn() {
				if (!mainDataService.getOrSetBoqCheck().status) {
					mainDataService.checkAndQuerySave(2);
				}
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderCellRendered', commonService.onHeaderCellRendered);
				platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', addEvaluatedNodeStyle);
				mainDataService.unregisterSelectionChanged(dataService.loadData);
				commonService.onRefreshCompareField.unregister(onRefreshCompareField);
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
				dataService.onListLoaded.unregister(onListLoaded);
			});

		}
	]);
})(angular);
