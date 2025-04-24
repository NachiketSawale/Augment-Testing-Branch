(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonItemController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for price comparison item container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementPriceComparisonItemController', [
		'_', 'globals', '$http', '$scope', '$translate', '$injector', '$timeout', '$rootScope',
		'platformGridControllerService', 'platformGridAPI', 'platformModalService',
		'procurementPriceComparisonMainService', 'procurementPriceComparisonItemService',
		'procurementPriceComparisonItemConfigService', 'procurementPriceComparisonCommonService',
		'procurementPriceComparisonLineTypes', 'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonPriceConditionService', 'procurementContextService', 'procurementPriceComparisonPrintConstants', 'procurementPriceComparisonCheckBidderService', 'procurementPriceComparisonColumnResizeHelperService',
		'procurementPriceComparisonSettingConfiguration',
		'procurementPriceComparisonCommonHelperService',
		'commonTooltipService',
		'prcCommonGetVatPercent',
		'prcCommonItemCalculationHelperService',
		'procurementPriceComparisonItemHelperService',
		'platformObjectHelper',
		'mainViewService',
		'treeStateHelperService',
		function (_, globals, $http, $scope, $translate, $injector, $timeout, $rootScope,
			platformGridControllerService, platformGridAPI, platformModalService,
			mainDataService, dataService,
			itemConfigService, commonService,
			itemLineTypes, basicsLookupdataLookupDescriptorService,
			procurementPriceComparisonPriceConditionService, moduleContext, printConstants, checkBidderService, columnResizeHelper,
			settingConfiguration,
			commonHelperService,
			commonTooltipService,
			prcCommonGetVatPercent,
			itemCalculationHelper,
			itemHelperService,
			platformObjectHelper,
			mainViewService,
			treeStateHelperService) {

			var columnsDef = {
				getStandardConfigForListView: function () {
					let allColumns = itemConfigService.getAllColumns();
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
				lazyInit: true,
				columns: [],
				parentProp: '',
				childProp: 'Children',
				enableColumnReorder: false,
				cellEditableCallBack: function (args) {
					arg = args;
					var quoteItem = getCurrentRowQuoteItem(args);
					return dataService.onCellEditable(args, quoteItem);
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
			$scope.printType = commonService.constant.compareType.prcItem;

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
					type: 'item',
					cssClass: commonService.icons.toolBars.settings,
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
						var otherService = $injector.get('procurementPriceComparisonBoqService');
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
							var otherService = $injector.get('procurementPriceComparisonBoqService');
							if (result === 'saveModified') {
								commonService.saveNewVersionDialog(dataService, otherService, commonService.constant.compareType.prcItem, commonService.constant.compareType.boqItem, false);
							} else if (result === 'saveAll') {
								commonService.saveNewVersionDialog(dataService, otherService, commonService.constant.compareType.prcItem, commonService.constant.compareType.boqItem, true);
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
				if (eventInfo.eventName === 'RefreshItemBillingSchema') {
					commonService.resetBillingSchemaValue(eventInfo.value, eventInfo.selectedQuote, dataService, itemConfigService.itemQtnMatchCache, 'Children', 'LineType', 'RefreshBoqBillingSchema', false, itemConfigService.visibleCompareColumnsCache, eventInfo.billingSchemas);
				} else if (eventInfo.eventName === 'RefreshItemEvaluation') {

					var isEvaluationChange = commonService.resetEvaluationValue(dataService, eventInfo.value.points, eventInfo.value.quote, 'Children', 'LineType', 'RefreshBoqEvaluation', false, itemConfigService.visibleCompareColumnsCache);
					if (isEvaluationChange) {
						var enterCell = eventInfo.value.quote && eventInfo.value.quote.type === 'item' ? dataService.currentEnterCell : null;
						dataService.redrawTree(true, enterCell);
					}
				} else if (eventInfo.eventName === 'RefreshItemCommonQtnField') {
					dataService.updateAsExchangeRateChange(eventInfo.value.entity, eventInfo.value.field, eventInfo.value.key, eventInfo.value.exchangeRate, true);
				} else if (eventInfo.eventName === 'RedrawTree') {
					commonService.resetQuote(dataService, 'Children', 'LineType', eventInfo.value.field, eventInfo.value.value, eventInfo.value.quoteField);
				} else if (eventInfo.eventName === 'GeneralRedrawTree') {
					if (eventInfo.value.fromType === commonService.constant.compareType.boqItem) {
						var tree = dataService.getTree();
						if (tree && tree.length > 0) {
							commonHelperService.resetGenerals(tree, 'Children', 'LineType', eventInfo.value, itemConfigService.itemQtnMatchCache, itemConfigService.visibleCompareColumnsCache);
							dataService.redrawTree(true);
						}
					}
				} else if (eventInfo.eventName === 'updateDiscountAmountField') {
					dataService.updateDiscountAmountField(eventInfo.value.entity, eventInfo.value.ownQuoteKey, eventInfo.value.discountPercent, eventInfo.value.discountAmount, eventInfo.value.discountAmountOc);
				}
			};
			commonService.onRefreshCompareField.register(onRefreshCompareField);

			// eslint-disable-next-line no-unused-vars
			$scope.validateChosenBusinessPartner = function validateChosenBusinessPartner(entity, value, model) { // jshint ignore:line
				if (value) {
					$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/quoteiteminfo', {
						ReqHeaderId: entity.ReqHeaderId,
						QuoteHeaderId: value,
						ItemNo: entity.ItemNo,
						PrcItemId: entity.PrcItemId
					}).then(function (response) {
						if (response && response.data) {
							entity.ChosenBusinessPartnerPrice = response.data.Total;
							dataService.cacheQuoteItem2BizPartner({
								entity: entity,
								value: value,
								quoteItemInfo: response.data
							});

							dataService.gridRefresh();
						}
					});
				} else {
					// clear value after field 'ChosenBusinessPartner' changed to null.
					entity.ChosenBusinessPartnerPrice = null;
					itemConfigService.quoteItem2BizPartnerCache = _.filter(itemConfigService.quoteItem2BizPartnerCache, function (item) {
						return item.Id !== entity.Id;
					});
				}

				return {apply: true, valid: true};
			};

			$timeout(function () {
				dataService.loadData();
			});

			// the setting pop is available ONLY  after the data is loaded
			function configSettings() {
				if (mainDataService.hasSelection()) {
					settingConfiguration.setCurrentConfig('item');
					commonService.loadDeviation();
					platformModalService.showDialog({
						scope: $rootScope.$new(true), // isolate scope
						backdrop: false,
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-item-boq-settings.html',
						controller: 'procurementPriceComparisonSettingsController',
						width: '80%',
						height: '90%',
						resizeable: true
					}).then(function (result) {
						if (result) {
							if (result.isOK) {
								// save to DB
								var createData = {};
								var baseInfo = commonService.getBaseRfqInfo();
								createData.rfqHeaderFk = baseInfo.baseRfqId;
								createData.compareType = commonService.constant.compareType.prcItem;
								createData.compareColumns = result.data.compareColumns;         // compare columns to be inserted or updated
								createData.compareBaseColumns = result.data.baseColumnList;
								createData.deletedColumns = result.data.deletedColumns;         // compare columns to be deleted
								createData.compareRows = commonService.resetSorting(result.data.compareFields);             // compare field rows be inserted or updated
								createData.compareQuoteRows = commonService.resetSorting(result.data.compareQuoteFields);   // compare quote fields be inserted or updated
								createData.compareBillingSchemaRows = commonService.resetSorting(result.data.compareBillingSchemaFields);
								createData.isVerticalCompareRows = result.data.isVerticalCompareRows;
								createData.isLineValueColumn = result.data.isLineValueColumn;
								createData.isFinalShowInTotal = result.data.isFinalShowInTotal;
								createData.gridColumns = result.data.gridColumns;

								// process the pinned column to top
								/* let pinnedColumns = _.filter(result.data.gridColumns, col => col.pinned && col.id !== '_rt$bidder');
								let unPinnedColumns = _.filter(result.data.gridColumns, col => !col.pinned || col.id === '_rt$bidder');
								createData.gridColumns = pinnedColumns.concat(unPinnedColumns); */

								dataService.saveCustomSettings2DB(createData).then(function () {
									commonService.onCompareModeChanged();
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
					settingConfiguration.setCurrentConfig('printItem');
					platformModalService.showDialog({
						scope: $scope,
						width: '1000px',
						resolve: {
							controllerOptions: function () {
								return {
									title: $translate.instant('procurement.pricecomparison.printing.configItem'),
									printType: printConstants.printType.item,
									tabItems: [{
										name: 'item',
										title: $translate.instant('procurement.pricecomparison.printing.item'),
										content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-item.html',
										sorting: 60
									}]
								};
							}
						},
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-print-settings-new.html',
						controller: 'procurementPriceComparisonItemBoqPrintSettingsNewController'
					});
				}
			}

			function onCellChange(e, args) {

				let columns = args.grid.getColumns(), field = columns[args.cell].field;
				let ownQuoteKey = commonService.getOwnQuoteKey(itemConfigService.itemQtnMatchCache, field, args.item.RfqHeaderId);
				let quoteKey = columns[args.cell].isVerticalCompareRows ? columns[args.cell].quoteKey : field;
				let rowType = columns[args.cell].isVerticalCompareRows ? columns[args.cell].originalField : args.item.rowType;
				if (args.item && args.item.LineType === itemLineTypes.characteristic) {
					commonService.collectCharacterModifiedData(dataService, itemConfigService.itemQtnMatchCache, arg, args, false);
					return;
				}

				if (args.item && args.item.LineType === itemLineTypes.quoteExchangeRate) {
					commonService.collectExchangeRateData(dataService, args, field, ownQuoteKey, 'RefreshItemCommonQtnField');
					return;
				}

				if (args.item && args.item.LineType === itemLineTypes.generalItem) {
					commonHelperService.generalModifiedDataChange(args.item, field, itemConfigService.itemQtnMatchCache, itemConfigService.visibleCompareColumnsCache);
					commonService.onRefreshCompareField.fire({
						eventName: 'GeneralRedrawTree',
						value: {
							entity: args.item,
							field: field,
							fromType: commonService.constant.compareType.prcItem,
							value: args.item[field],
							key: ownQuoteKey
						}
					});
					return;
				}

				if (args.item && (args.item.LineType === itemLineTypes.quoteUserDefined || args.item.LineType === itemLineTypes.quoteRemark)) {
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

				if (args.item && (args.item.LineType === itemLineTypes.quotePaymentTermPA || args.item.LineType === itemLineTypes.quotePaymentTermFI)) {
					commonService.collectPaymentTermData(dataService, args, args.item.LineType, field, ownQuoteKey);
					return;
				}

				if (args.item && rowType === commonService.itemCompareFields.isFreeQuantity) {
					if (args.item.parentItem) {
						if (args.item.parentItem.Children) {
							var itemCompareField = _.find(args.item.parentItem.Children, {rowType: commonService.itemCompareFields.quantity});
							if (itemCompareField) {
								var readonlyFields = [
									{field: field, readonly: !args.item[field] || columns[args.cell].isIdealBidder}
								];
								commonService.setFieldReadOnly(itemCompareField, readonlyFields);
							}
						}
						if (args.item.parentItem.QuoteItems) {
							var quoteItem = _.find(args.item.parentItem.QuoteItems, {QuoteKey: field});
							if (quoteItem) {
								quoteItem[args.item.rowType] = args.item[field];
							}
						}
					}
					dataService.collectQuoteModifiedField(args, args);
					return;
				}

				if (args.item && rowType === commonService.itemCompareFields.notSubmitted) {
					let quoteItem = null;
					let parentItem = commonHelperService.tryGetParentItem(args.item, dataService.isVerticalCompareRows());
					if (parentItem && parentItem.QuoteItems) {
						quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey});
						if (quoteItem) {
							quoteItem[rowType] = args.item[field];
						}
					}
					if (args.item && args.item[field] === true) {
						platformModalService.showYesNoDialog('procurement.common.askDeletePrice', 'procurement.common.confirmDeletePrice').then(function (response) {
							if (response.yes) {
								if (quoteItem) {
									quoteItem[commonService.itemCompareFields.price] = 0;
									quoteItem.PrcItemEvaluationFk = null;
									quoteItem.PrcItemEvaluationId = null;
									quoteItem.NotSubmitted = true;
									quoteItem.ExQtnIsEvaluated = false;
									let parentItem = commonHelperService.tryGetParentItem(args.item, dataService.isVerticalCompareRows());
									commonService.assignItemEvaluation(null, dataService.isVerticalCompareRows(), quoteItem, parentItem, 'Children');
									dataService.collectQuoteModifiedField(args, args);

									let itemTree = dataService.getTree();
									let allQuoteItems = commonService.getAllQuoteItems(itemTree, 'Children');
									let originalQuoteItems = _.filter(allQuoteItems, function (i) {
										return i.PrcItemId === quoteItem.PrcItemId && i.QtnHeaderId === quoteItem.QtnHeaderId;
									});
									_.each(originalQuoteItems.concat(quoteItem), function (entity) {
										let vatPercent = prcCommonGetVatPercent.getVatPercent(entity.TaxCodeFk, entity.QtnHeaderVatGroupFk);
										let currentQuote = _.find(basicsLookupdataLookupDescriptorService.getData('quote'), {Id: entity.QtnHeaderId});
										let exchangeRate = currentQuote ? commonService.getExchangeRate(currentQuote.RfqHeaderFk, currentQuote.Id) : 1;

										itemCalculationHelper.setPricePriceOcPriceGrossPriceGrossOc(entity, 0, 'Price', vatPercent, exchangeRate);
									});

									dataService.beforeRecalcuateItem.fire(quoteItem);
									itemHelperService.recalculatePrcItem(originalQuoteItems, quoteItem, false);
									dataService.redrawTree(false, null);
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

				let requisitionFieldToSave = ['ItemTypeFk','UomFk', 'Quantity', 'Specification','Description1'];
				if (args.item && args.item.LineType === itemLineTypes.prcItem && _.includes(requisitionFieldToSave, field)) {
					commonService.onRequisitionFieldChange(dataService, args, field);
				}

				if (_.startsWith(arg.column.field, commonService.constant.prefix2)) {
					// here 'args.cell' is null, so use 'arg' to get it's value
					dataService.collectQuoteModifiedField(arg, args);
				}
			}

			function getCurrentRowQuoteItem(args) {
				var currentRow = platformGridAPI.grids.element('id', $scope.gridId).dataView.getItem(args.row);
				var currentCol = platformGridAPI.columns.configuration($scope.gridId).visible[args.cell];
				var quoteKey = currentCol.isVerticalCompareRows ? currentCol.quoteKey : currentCol.field;
				return commonService.getRowQuotePrcItem(currentRow, quoteKey);
			}

			// trigger to load quote item price condition
			function onActiveCellChanged(event, args) {
				if ((!args.row && args.row !== 0) || (!args.cell && args.cell !== 0)) {
					return;
				}
				$injector.get('procurementPriceComparisonItemPlainTextService');
				$injector.get('procurementPriceComparisonHeaderPlainTextService');
				$injector.get('priceComparisonBillingSchemaService');

				var currentRow = platformGridAPI.grids.element('id', $scope.gridId).dataView.getItem(args.row);
				var currentCol = platformGridAPI.columns.configuration($scope.gridId).visible[args.cell];

				dataService.currentRow = currentRow;
				dataService.lastSelectedQuoteItem = angular.copy(dataService.selectedQuoteItem);
				dataService.selectedQuoteItem = null; // init selected quote item
				dataService.lastSelectedQuote = angular.copy(dataService.selectedQuote);
				dataService.selectedQuote = null;
				dataService.allSelectedQuote = null;

				if (args.row > -1 && args.cell && _.startsWith(currentCol.field, commonService.constant.prefix2) &&
					checkBidderService.item.isNotReference(currentCol.field)) {

					var qtnMatchCache = itemConfigService.itemQtnMatchCache[currentRow.RfqHeaderId || currentRow.rfqHeaderId],
						quoteKey = currentCol.isVerticalCompareRows ? currentCol.quoteKey : currentCol.field;
					if (qtnMatchCache) {
						dataService.selectedQuote = _.find(qtnMatchCache, function (item) {
							return item.QuoteKey === quoteKey && item.ReqHeaderId === currentRow.ReqHeaderId ||
								(item.QuoteKey === quoteKey && args.row === 0);// click GrandTotal Row also can show billingSchema.
						});

						if (dataService.selectedQuote) {
							dataService.selectedQuote.LineType = currentRow.LineType;
						}
					}

					var quoteItem = commonService.getRowQuotePrcItem(currentRow, quoteKey);

					if (quoteItem) {
						dataService.selectedQuoteItem = angular.copy(quoteItem);
						var newConditionFk = dataService.getNewConditionFk(quoteItem.PrcItemId);
						if (angular.isDefined(newConditionFk)) {
							dataService.selectedQuoteItem.PrcPriceConditionFk = newConditionFk;
						}
						if (dataService.selectedQuoteItem && dataService.selectedQuoteItem.PrcItemId) {
							dataService.selectedQuoteItem.Id = quoteItem.PrcItemId;
						}

						// used to remove price condition entity from cache (see method: deleteSubEntities)
						procurementPriceComparisonPriceConditionService.containerData.currentParentItem = dataService.selectedQuoteItem;
					}
				}
				dataService.currentEnterCell = args.cell;
				dataService.activeField = currentCol.field;
				dataService.onQuoteItemSelected.fire();
				mainDataService.lastSelectedQuote = dataService.selectedQuote;
				mainDataService.onQuoteSelectedLoadEvaluation.fire(dataService.selectedQuote);
				dataService.onActiveCellChanged.fire();
			}

			function onListLoaded() {
				let rfqRow = _.find(dataService.getTree(), {
					LineType: itemLineTypes.rfq
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
								if (quoteData && quoteData.QuoteItems && ((columnInfo.isVerticalCompareRows && item.LineType === itemLineTypes.prcItem) || (item.rowType === commonService.itemCompareFields.price))) {
									let quoteItem = _.find(quoteData.QuoteItems, {QuoteKey: columnInfo.quoteKey});
									if (quoteItem && quoteItem.PreviousItem) {
										text = commonHelperService.getNumericFormattedValue(quoteItem.PreviousItem.Price, 'money') + ' (' + $translate.instant('procurement.pricecomparison.rateFromPreviousVersion') + ')';
									}
								}
								if (quoteData && quoteData.QuoteItems && ((columnInfo.isVerticalCompareRows && item.LineType === itemLineTypes.prcItem) ||
									_.includes([commonService.itemCompareFields.paymentTermPaFk, commonService.itemCompareFields.paymentTermFiFk], item.rowType))){
									let quoteItem = _.find(quoteData.QuoteItems, {QuoteKey: columnInfo.quoteKey});
									if (columnInfo.isVerticalCompareRows && item.LineType === itemLineTypes.prcItem){
										text = getPaymentTermDescription(quoteItem, col.originalField);
									}
									else {
										text = getPaymentTermDescription(quoteItem, item.rowType);
									}
								}
								if (quoteData && _.includes([itemLineTypes.quotePaymentTermPA, itemLineTypes.quotePaymentTermFI], item.LineType)){
									let items = basicsLookupdataLookupDescriptorService.getData('PaymentTerm') || [];
									let paymentTermFk = quoteData[col.field];
									text = platformObjectHelper.getValue(items[paymentTermFk], 'Description') || '';
								}
								return text;
							}
						};
					})
				});

				let cache = treeStateHelperService.getNodesCache(commonService.constant.compareType.prcItem, $scope.gridId);
				if (_.isEmpty(cache)){
					let config = mainViewService.getViewConfig($scope.gridId);
					if (config && config.Gridconfig && config.Gridconfig.treeGridLevel) {
						platformGridAPI.grids.setTreeGridLevel($scope.gridId, config.Gridconfig.treeGridLevel);
					}
					treeStateHelperService.setNodesCache(dataService.getTree(), commonService.constant.compareType.prcItem, $scope.gridId);
				}
			}

			function getPaymentTermDescription(quoteItem, paymentTermType){
				let items = basicsLookupdataLookupDescriptorService.getData('PaymentTerm') || [];
				let text = '';
				if (quoteItem && quoteItem.PaymentTermPaFk && paymentTermType === commonService.itemCompareFields.paymentTermPaFk) {
					text = platformObjectHelper.getValue(items[quoteItem.PaymentTermPaFk], 'Description') || '';
				}
				else if (quoteItem && quoteItem.PaymentTermFiFk && paymentTermType === commonService.itemCompareFields.paymentTermFiFk){
					text = platformObjectHelper.getValue(items[quoteItem.PaymentTermFiFk], 'Description') || '';
				}
				return text;
			}

			function addEvaluatedNodeStyle() {
				let columns = platformGridAPI.columns.getColumns($scope.gridId);
				let quoteColumns = _.filter(columns, function (col) {
					return checkBidderService.isNotReference(col.field) && commonHelperService.isBidderColumn(col) && !col.isIdealBidder;
				});

				let styleKey = 'itemEvaluatedItemCellStyle';
				let grid = platformGridAPI.grids.element('id', $scope.gridId);

				let rows = grid.dataView.getRows();
				let highlightNodes = [];
				if (!dataService.isVerticalCompareRows()) {
					let priceRows = _.filter(rows, row => row.rowType === commonService.itemCompareFields.price);
					if (priceRows && priceRows.length > 0){
						createHighLightNodes(priceRows, rows, highlightNodes);
					}

					let itemEvaluationRows = _.filter(rows, row => row.rowType === commonService.itemCompareFields.prcItemEvaluationFk);
					if (itemEvaluationRows && itemEvaluationRows.length > 0) {
						createHighLightNodes(itemEvaluationRows, rows, highlightNodes);
					}
				} else {
					let prcItemRows = _.filter(rows, row => row.LineType === itemLineTypes.prcItem);
					if (prcItemRows && prcItemRows.length > 0) {
						createHighLightNodes(prcItemRows, rows, highlightNodes);
					}
				}

				function createHighLightNodes(targetRows, rows, highlightNodes){
					if(!dataService.isVerticalCompareRows()) {
						_.forEach(targetRows, row => {
							let rowIndex = _.indexOf(rows, row);
							_.forEach(quoteColumns, column => {
								let quoteItem = _.find(row.parentItem.QuoteItems, item => item.QuoteKey === column.field);
								if (quoteItem && quoteItem.ExQtnIsEvaluated) {
									highlightNodes.push({
										cell: {
											row: rowIndex,
											col: column.id
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
											col: quoteItem.QuoteKey + '_' + commonService.itemCompareFields.price
										}
									});
									highlightNodes.push({
										cell: {
											row: rowIndex,
											col: quoteItem.QuoteKey + '_' + commonService.itemCompareFields.prcItemEvaluationFk
										}
									});
								}
							});
						});
					}
				}

				commonService.processEvaluatedStyle(grid, highlightNodes, styleKey);
			}

			function onInitialized() {
				platformGridAPI.filters.extendFilterFunction($scope.gridId, function customFilter(node) {
					node.HasChildren = !_.isNil(node.Children) && _.filter(node.Children, function (item) {
						return !item._rt$Deleted;
					}).length > 0;
					if (node.nodeInfo) {
						node.nodeInfo.children = node.HasChildren;
						node.nodeInfo.lastElement = !node.HasChildren;
					}
					return node._rt$Deleted !== true;
				});
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

			platformGridAPI.events.register($scope.gridId, 'onRowsChanged', addEvaluatedNodeStyle);

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			dataService.onListLoaded.register(onListLoaded);

			$scope.$on('$destroy', function destroyFn() {
				if (!mainDataService.getOrSetItemCheck().status) {
					mainDataService.checkAndQuerySave(1);
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