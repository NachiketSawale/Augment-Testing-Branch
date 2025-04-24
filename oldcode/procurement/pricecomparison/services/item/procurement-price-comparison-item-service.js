(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemService', [
		'_',
		'globals',
		'$http',
		'$q',
		'$translate',
		'$injector',
		'$timeout',
		'platformDataServiceFactory',
		'platformGridAPI',
		'platformModuleStateService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonItemDataStructureService',
		'platformDataServiceValidationErrorHandlerExtension',
		'procurementPriceComparisonItemConfigService',
		'PlatformMessenger',
		'procurementPriceComparisonLineTypes',
		'platformObjectHelper',
		'basicsLookupdataTreeHelper',
		'platformDataServiceModificationTrackingExtension',
		'mainViewService',
		'procurementPriceComparisonConfigurationService',
		'procurementContextService',
		'procurementPriceComparisonItemHelperService',
		'prcCommonItemCalculationHelperService',
		'commonBusinessPartnerEvaluationServiceCache',
		'PriceComparisonUpdateModifiedKeyService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'platformModalService',
		'prcCommonGetVatPercent',
		'treeStateHelperService',
		function (
			_,
			globals,
			$http,
			$q,
			$translate,
			$injector,
			$timeout,
			platformDataServiceFactory,
			platformGridAPI,
			platformModuleStateService,
			lookupDescriptorService,
			lookupFilterService,
			mainDataService,
			commonService,
			itemDataStructureService,
			platformDataServiceValidationErrorHandlerExtension,
			itemConfigService,
			PlatformMessenger,
			compareLineTypes,
			platformObjectHelper,
			basicsLookupdataTreeHelper,
			platformDataServiceModificationTrackingExtension,
			mainViewService,
			procurementPriceComparisonConfigurationService,
			moduleContext,
			itemHelperService,
			itemCalculationHelper,
			evaluationServiceCache,
			updateModifiedKeyService,
			commonHelperService,
			checkBidderService,
			platformModalService,
			prcCommonGetVatPercent,
			treeStateHelperService) {

			lookupDescriptorService.loadData(['prcpricecondition', 'PrcItemEvaluation']);

			let itemsSource = []; // data source
			let localModifiedEntity = {};
			let localIdealQuoteCopiedEntity = {};
			let reverseCalculateCompareFields = [
				commonService.itemCompareFields.priceOc,
				commonService.itemCompareFields.total,
				commonService.itemCompareFields.totalOC,
				commonService.itemCompareFields.totalGross,
				commonService.itemCompareFields.totalOCGross,
				commonService.itemCompareFields.totalNoDiscount,
				commonService.itemCompareFields.totalOcNoDiscount,
				commonService.itemCompareFields.priceGross,
				commonService.itemCompareFields.priceOCGross
			];

			let serviceOption = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonItemService',
					presenter: {
						tree: {parentProp: '', childProp: 'Children'}
					},
					entitySelection: {},
					entityRole: {
						node: {
							itemName: 'ItemComparisonData',
							parentService: mainDataService
						}
					}
				}
			};
			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;
			container.data.forceNodeItemCreation = true;

			service.gridId = 'ef496d027ad34b1f8fe282b1d6692ded';
			service.name = 'procurementPriceComparisonItemService';
			service.data = {};
			service.onColumnsChanged = new PlatformMessenger();
			service.modifiedData = {};
			service.idealQuoteCopiedData = {};

			service.onQuoteItemSelected = new PlatformMessenger();
			service.onConditionChanged = new PlatformMessenger();
			service.onRowDeselected = new PlatformMessenger();
			service.onActiveCellChanged = new PlatformMessenger();
			service.onPriceChanged = new PlatformMessenger();
			service.onGrandTotalRankSortingChanged = new PlatformMessenger();
			service._grandTotalRankSortingCheckedState = {
				ui: false,
				print: false
			};
			service.loading = false;
			service.getGrandTotalRankSortingCheckedState = function (section) {
				return section === 'ui' ? this._grandTotalRankSortingCheckedState.ui : this._grandTotalRankSortingCheckedState.print;
			};
			service.setGrandTotalRankSortingCheckedState = function (section, checked) {
				if (section === 'ui') {
					this._grandTotalRankSortingCheckedState.ui = checked;
				} else {
					this._grandTotalRankSortingCheckedState.print = checked;
				}
			};
			service.lastSelectedQuoteItem = null;
			service.selectedQuoteItem = null;
			service.lastSelectedQuote = null;
			service.selectedQuote = null;

			service.compareQuoteRows = null;
			service.compareRows = null;
			service.onLineValueColumnVisibleChanged = new PlatformMessenger();
			service.onVerticalCompareRowsChanged = new PlatformMessenger();
			service.onListLoaded = new PlatformMessenger();
			service.onFinalShowInTotalChanged = new PlatformMessenger();

			service.beforeDataLoad = new PlatformMessenger();
			service.beforeRecalcuateItem = new PlatformMessenger();
			registerLookupFilter();

			/**
			 * note: override 'getTree()' to set data source for the tree exactly.
			 */
			service.getTree = function getTree() {
				return itemsSource || [];
			};

			service.doDeselect = function () {
				service.selectedQuoteItem = null;
				service.currentEnterCell = null;
				return service.deselect().then(function () {
					clearModuleStateData();
					service.onRowDeselected.fire();
				});
			};

			service.clearItemConfigData = function () {
				itemConfigService.rfqHeadersCache = [];
				itemConfigService.originalFieldsCache = []; // will delete?

				itemConfigService.visibleCompareColumnsCache = [];
				itemConfigService.showInSummaryCompareRowsCache = [];
				itemConfigService.visibleCompareRowsCache = [];
				itemConfigService.leadingFieldCache = '';

				itemConfigService.generalTypesCache = {};
				itemConfigService.quoteItemAddressCache = [];

				itemConfigService.quoteCharacteristicCache = [];
				itemConfigService.rfqCharacteristicCache = [];
				itemConfigService.allQuoteCharacteristicCache = [];
				itemConfigService.allRfqCharacteristicCache = [];
				itemConfigService.childrenCharacterCache = [];
			};

			service.reorderCompareColumns = function () {
				itemHelperService.reorderCompareColumns(itemConfigService, itemsSource);
			};

			service.getData = function () {
				let readData = {
					rfqHeaderId: mainDataService.getIfSelectedIdElse(-1),
					compareType: commonService.constant.compareType.prcItem,
					CompareQuoteRows: service.getCustomSettingsCompareQuoteRows(),
					CompareBillingSchemaRows: service.getCustomSettingsCompareBillingSchemaRows(),
					CompareRows: service.getCustomSettingsCompareRows(),
					CompareBaseColumns: service.getCustomSettingsCompareColumns()
				};
				service.loading = true;
				return itemHelperService.loadData(readData, itemConfigService, itemDataStructureService, {
					serviceData: service.data,
					childProp: serviceOption.hierarchicalNodeItem.presenter.tree.childProp,
					isVerticalCompareRows: service.isVerticalCompareRows(),
					isFinalShowInTotal: service.isFinalShowInTotal(),
					onReadSuccess: function (items) {
						commonHelperService.updateCompareConfig(items, service.getCustomSettingsCompareRows(), service.getCustomSettingsCompareBillingSchemaRows(), service.getCustomSettingsCompareQuoteRows(), commonService.constant.compareType.prcItem);
						service.loading = false;
					}
				});
			};

			service.loadData = function loadData() {
				service.beforeDataLoad.fire();
				service.doDeselect(); // remove the current selected row
				itemsSource = []; // clear data.
				localModifiedEntity = {};
				localIdealQuoteCopiedEntity = {};
				service.modifiedData = {}; // clear data when reload data
				service.idealQuoteCopiedData = {};

				// reset grid data
				platformGridAPI.items.data(service.gridId, []);

				if (!mainDataService.hasSelection()) {
					return;
				}
				service.clearItemConfigData();

				service.getData().then(function (items) {
					if (!_.isEmpty(items)){
						treeStateHelperService.processNodeList(items, commonService.constant.compareType.prcItem, service.gridId);
					}

					if (_.isEmpty(items)) {
						drawTree(itemsSource);
						service.onListLoaded.fire();
						container.data.listLoaded.fire({setTreeGridLevel: true});
						return items;
					}
					itemsSource = items;
					itemHelperService.setFirstEvaluation(itemsSource, itemConfigService, itemDataStructureService, serviceOption.hierarchicalNodeItem.presenter.tree.childProp, service.isVerticalCompareRows());
					service.reorderCompareColumns();
					// update common change data
					commonService.updateChangeData(service.updateAsExchangeRateChange);
					drawTree(itemsSource);

					service.trySyncQuoteEvaluation();

					service.onColumnsChanged.fire();

					service.onListLoaded.fire();
					container.data.listLoaded.fire({setTreeGridLevel: true});
				});
			};

			service.onCellEditable = function onCellEditable(args, currentRowQuoteItem) {
				let quoteKey = args.column.isVerticalCompareRows ? args.column.quoteKey : args.column.field;
				let qtnStatus = commonService.getQtnStatusById(itemConfigService.itemQtnMatchCache, quoteKey, args.item.RfqHeaderId);
				if (qtnStatus && qtnStatus.IsReadonly) {
					return false;
				}
				let compareField = commonHelperService.getPrcCompareField(args.item, args.column);
				// IsProtected = true, readonly,
				// and the AllowEditVisibleFields should not be effected by this factor
				if (qtnStatus && qtnStatus.IsProtected && itemHelperService.isPrcItemOrCompareRow(args.item.LineType) &&
					((commonService.itemCompareFields.price !== compareField &&
							commonService.itemCompareFields.priceOc !== compareField &&
							commonService.itemCompareFields.quantity !== compareField &&
							!_.includes(commonService.itemAllowEditVisibleFields, compareField)) ||
						(commonService.itemCompareFields.quantity === compareField && currentRowQuoteItem && !currentRowQuoteItem.IsFreeQuantity))) {
					return false;
				}

				let editableFieldsTextElement = ['ItemNo', commonService.itemCompareFields.userDefined1, commonService.itemCompareFields.userDefined2,
					commonService.itemCompareFields.userDefined3, commonService.itemCompareFields.userDefined4, commonService.itemCompareFields.userDefined5];
				if (currentRowQuoteItem && currentRowQuoteItem.ItemTypeFk === 7){
					return _.includes(editableFieldsTextElement, args.item.rowType);
				}

				if (args.item && args.item.LineType === compareLineTypes.prcItem && args.item.ItemTypeFk === 7){
					return false;
				}

				if (commonHelperService.isPrcCompareCellEditable(args.item, args.column)) {
					if (_.includes(commonService.itemAllowEditVisibleFields, compareField)) {
						let compareRowsSetting = this.getCustomSettingsCompareRows();
						let targetField = _.find(compareRowsSetting, {Field: compareField});
						let parentItem = commonHelperService.tryGetParentItem(args.item, args.item.LineType !== compareLineTypes.compareField);
						return targetField && targetField.AllowEdit === true && (parentItem && !itemCalculationHelper.isOptionalOrAlternativeItem(parentItem));
					}
					if (currentRowQuoteItem && compareField === commonService.itemCompareFields.discountAbsolute) {
						let totalPrice = currentRowQuoteItem.Price + currentRowQuoteItem.PriceExtra;
						return currentRowQuoteItem.Price !== 0 && totalPrice !== 0;
					}

					return !(args.column.isIdealBidder && compareField !== commonService.itemCompareFields.prcItemEvaluationFk);
				}
				// only Item container have this case.
				else if (args.item.LineType === compareLineTypes.prcItem && args.column.field === 'ChosenBusinessPartner') {
					return true;
				} else if (args.item.LineType === compareLineTypes.characteristic && args.item[args.column.field + '_$hasBidder'] === true &&
					(!args.column.isIdealBidder || compareField === commonService.itemCompareFields.prcItemEvaluationFk)) {
					return true;
				} else if (args.item.LineType === compareLineTypes.quoteExchangeRate &&
					(!args.column.isIdealBidder || compareField === commonService.itemCompareFields.prcItemEvaluationFk)) {
					return commonService.exchangeRateReadonly(itemConfigService.itemQtnMatchCache, args.column.field, args.item.RfqHeaderId, args.column.isVerticalCompareRows);
				} else if (((args.item.LineType === compareLineTypes.quoteUserDefined || args.item.LineType === compareLineTypes.quoteRemark) && args.column.field === quoteKey)
					&& checkBidderService.item.isNotReference(quoteKey)) {
					return true;
				} else if (args.item.LineType === compareLineTypes.generalItem && checkBidderService.item.isNotReference(quoteKey) && !args.column.isVerticalCompareRows) {
					return true;
				} else if (args.item.LineType === compareLineTypes.prcItem && _.some(args.item.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'}) && !commonHelperService.isBidderColumn(args.column)) {
					return true;
				} else if ((args.item.LineType === compareLineTypes.quotePaymentTermPA || args.item.LineType === compareLineTypes.quotePaymentTermFI) && checkBidderService.item.isNotReference(quoteKey)) {
					return true;
				}
				return false;
			};

			service.saveCustomSettings2DB = function (createData) {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.saveCustomSettings2DB(configurationFk, commonService.constant.compareType.prcItem, createData).then(function () {
					service.loadData();
				});
			};

			service.getCustomSettingsCompareQuoteRows = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareQuoteRows(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.getCustomSettingsCompareQuoteRowsAsync = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareQuoteRowsAsync(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.getCustomSettingsCompareBillingSchemaRows = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareBillingSchemaRows(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.getCustomSettingsCompareBillingSchemaRowsAsync = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareBillingSchemaRowsAsync(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.getCustomSettingsCompareRows = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareRows(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.getCustomSettingsCompareRowsAsync = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareRowsAsync(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.isVerticalCompareRows = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isVerticalCompareRows(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.getCustomSettingsCompareColumns = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareColumns(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.isLineValueColumnVisible = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isLineValueColumnVisible(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.isFinalShowInTotal = function () {
				var configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isFinalShowInTotal(configurationFk, commonService.constant.compareType.prcItem);
			};

			service.dataChangeMessenger = new PlatformMessenger();

			service.onCompareRowsAllowEditVisibleFieldsChanged = new PlatformMessenger();

			service.reloadLatestQuotes = function reloadLatestQuotes() {
				if (mainDataService.hasSelection()) {
					var obj = {};
					var baseInfo = commonService.getBaseRfqInfo();
					obj.rfqHeaderFk = baseInfo.baseRfqId;
					obj.compareType = commonService.constant.compareType.prcItem;
					service.dataChangeMessenger.fire();
					$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/reload', obj).then(function (response) {
						if (response.data) {
							service.loadData();
						}
					});
				}
			};

			service.cacheQuoteItem2BizPartner = function cacheQuoteItem2BizPartner(data) {
				if (data.value && data.quoteItemInfo && data.quoteItemInfo.PrcItemId > 0) {
					var newItem = {
						Id: data.entity.Id,     // row key
						type: 'itemData',       // use to determine it is a procurement item
						rfqHeaderId: data.entity.RfqHeaderId,
						quoteId: data.value,
						qtnPrcItemId: data.quoteItemInfo.PrcItemId,
						itemNo: data.quoteItemInfo.ItemNo,
						quantity: data.quoteItemInfo.Quantity,
						total: data.quoteItemInfo.Total,
						qtnReqPrcHeaderId: data.quoteItemInfo.PrcHeaderId,
						reqPrcItemInfo: data.quoteItemInfo
					};

					var item = _.find(itemConfigService.quoteItem2BizPartnerCache, {Id: data.entity.Id});
					if (item) {
						angular.extend(item, newItem);
					} else {
						itemConfigService.quoteItem2BizPartnerCache.push(newItem);
					}
				}
			};

			/**
			 * [ {columnTitle: xxx, columnField: xxx, comparingValues: [ {title: value} ] } ]
			 */
			service.getDataForGraphicalEvaluation = function getDataForGraphicalEvaluation(activeColumn) {
				var datas = [];

				var selectedItem = service.getSelected();
				if (!(selectedItem && Object.hasOwn(selectedItem, 'Id'))) {
					return datas;
				}

				_.map(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
					var data = {
						columnTitle: commonService.translateTargetOrBaseBoqName(visibleColumn.Id) || visibleColumn.Description,
						columnField: visibleColumn.Id,
						comparingValues: []
					};

					// always has grand total values for chart container.
					var grandTotalItem = _.first(service.getTree());
					if (grandTotalItem && grandTotalItem.LineType === compareLineTypes.grandTotal) {
						var comparingValue = {
							title: $translate.instant('procurement.pricecomparison.compareGrandTotal'),
							value: grandTotalItem.totals[visibleColumn.Id]
						};
						data.comparingValues.push(comparingValue);
					}
					if (selectedItem.LineType === compareLineTypes.rfq) {
						var comparingValue1 = {
							title: $translate.instant('procurement.pricecomparison.compareRfqTotal'),
							value: selectedItem.totals[visibleColumn.Id]
						};
						data.comparingValues.push(comparingValue1);
					} else if (selectedItem.LineType === compareLineTypes.requisition) {
						var comparingValue2 = {
							title: $translate.instant('procurement.pricecomparison.compareRequisitionTotal'),
							value: selectedItem.totals[visibleColumn.Id]
						};
						data.comparingValues.push(comparingValue2);
					} else if (selectedItem.LineType === compareLineTypes.prcItem && !activeColumn.isVerticalCompareRows) {
						_.map(itemConfigService.showInSummaryCompareRowsCache, function (summaryRow) {
							var comparingValue = {
								title: summaryRow.DisplayName,
								value: null
							};
							if (summaryRow.Field === commonService.itemCompareFields.percentage) {
								comparingValue.value = selectedItem.percentages[visibleColumn.Id];
							} else if (summaryRow.Field === commonService.itemCompareFields.rank) {
								comparingValue.value = selectedItem.ranks[visibleColumn.Id];
							} else {
								var quoteItem = _.find(selectedItem.QuoteItems, {QuoteKey: visibleColumn.Id});
								comparingValue.value = quoteItem ? quoteItem[summaryRow.Field] : 0;
							}

							data.comparingValues.push(comparingValue);
						});
					} else if ((selectedItem.LineType === compareLineTypes.compareField || (selectedItem.LineType === compareLineTypes.prcItem && activeColumn.isVerticalCompareRows)) &&
						!_.includes([commonService.itemCompareFields.userDefined1, commonService.itemCompareFields.userDefined2, commonService.itemCompareFields.userDefined3, commonService.itemCompareFields.userDefined4, commonService.itemCompareFields.userDefined5, commonService.itemCompareFields.prcItemEvaluationFk, commonService.itemCompareFields.alternativeBid, commonService.itemCompareFields.commentClient, commonService.itemCompareFields.commentContractor], commonHelperService.getPrcCompareField(selectedItem, activeColumn))
					) {
						var compareField = commonHelperService.getPrcCompareField(selectedItem, activeColumn),
							summaryRow = _.find(itemConfigService.visibleCompareRowsCache, {Field: compareField}),
							parentItem = commonHelperService.tryGetParentItem(selectedItem, activeColumn.isVerticalCompareRows);
						var obj = {
							title: summaryRow ? summaryRow.DisplayName : null,
							value: null
						};

						if (compareField === commonService.itemCompareFields.percentage) {
							obj.value = parentItem.percentages[visibleColumn.Id];
						} else if (compareField === commonService.itemCompareFields.rank) {
							obj.value = parentItem.ranks[visibleColumn.Id];
						} else {
							var quoteItem = null;
							if (parentItem) {
								quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							}
							obj.value = quoteItem ? quoteItem[compareField] : 0;
						}
						data.comparingValues.push(obj);
					}

					datas.push(data);
				});

				return datas;
			};

			/**
			 * collect modified compare fields data.
			 * data formatter definition is:
			 *
			 * {
			 *   11: [                        //quoteId
			 *          {
			 *               Id: 101,         //FieldName: FeildValue
			 *               Price: 20,       //FieldName: FeildValue
			 *               PriceExtra: 21   //FieldName: FeildValue
			 *          }
			 *       ]
			 *   12: [ {Id: 201, Price: 31, PriceExtra: 31.5}, {Id: 202, Price: 32, PriceUnit: 2} ]
			 * }
			 *
			 * */
			service.collectQuoteModifiedField = function (argsBeforeValueChanged, args) {
				let column = args.grid.getColumns()[argsBeforeValueChanged.cell];
				collectQuoteModifiedFieldFromEntity(argsBeforeValueChanged.item, args.item, column);
			};

			/**
			 * @param entity object => currency changed object
			 * @param quoteKey string => base QTN key
			 * @param ownQuoteKey string => own QTN key
			 * @param exchangeRate number
			 * @param updateExchangeRate bool => true: the call function from register
			 */
			service.updateAsExchangeRateChange = function (entity, quoteKey, ownQuoteKey, exchangeRate, updateExchangeRate) {
				var itemTree = service.getTree(),
					currencyRfq = _.find(itemTree, function (item) {
						return item.LineType === compareLineTypes.rfq && item.RfqHeaderId === entity.RfqHeaderId;
					});

				if (currencyRfq) {
					commonService.updateAsExchangeRateChange(service, currencyRfq, serviceOption.hierarchicalNodeItem.presenter.tree.childProp,
						'LineType', 'PrcItemId', localModifiedEntity, recalculateList, entity, quoteKey, ownQuoteKey, exchangeRate, updateExchangeRate, service.isVerticalCompareRows());
				}
			};

			service.updateDiscountAmountField = function(entity, ownQuoteKey, discountPercent, discountAmount, discountAmountOc){
				let itemTree = service.getTree();
				let itemList = commonHelperService.flatTree(itemTree, 'Children')
				let quoteRow = _.find(itemList, item => item.Id === entity.ParentId);

				let percentDiscountRow = _.find(quoteRow.Children, item => item.LineType === compareLineTypes.discountPercent);
				if (percentDiscountRow){
					percentDiscountRow[ownQuoteKey] = discountPercent;
				}
				let discountAmountRow = _.find(quoteRow.Children, item => item.LineType === compareLineTypes.discountAmount);
				if (discountAmountRow){
					discountAmountRow[ownQuoteKey] = discountAmount;
				}
				let discountAmountOcRow = _.find(quoteRow.Children, item => item.LineType === compareLineTypes.discountAmountOc);
				if (discountAmountOcRow){
					discountAmountOcRow[ownQuoteKey] = discountAmountOc;
				}
				service.redrawTree();
			}

			service.collectFieldValueByPriceConditions = function (customQuoteItem, fieldValue, columnField) {
				var field = customQuoteItem.QuoteKey + '.' + customQuoteItem.PrcItemId + '.' + columnField;

				// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
				commonService.assignValue(localModifiedEntity, field, fieldValue);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				var data = {};
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					var quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				service.modifiedData = data;
			};

			/**
			 * save the modified quote data (header/item plain texts, item price conditions, item compare fields...) to the orginal or a new version quote.
			 */
			service.saveToQuote = function saveToQuote(isNewVersion, qtnSourceTarget, isFromNewVersion, isSaveAll) {
				let allQuoteIds = [];
				if (isNewVersion && isSaveAll) {
					_.forEach(itemConfigService.visibleCompareColumnsCache, function (itemConfig) {
						allQuoteIds.push(itemConfig.QuoteHeaderId);
					});
				}
				return service.checkModifiedState(isNewVersion).then(function (state) {
					if (state.hasModified || (isNewVersion && isSaveAll)) {
						let saveData = state.saveData;
						let modifiedData = state.modifiedData;
						// for save all qtn
						saveData.AllQuoteIds = allQuoteIds;

						if (isNewVersion && commonService.PrcGeneralsToSave) {
							let generalQuoteIds = _.map(commonService.PrcGeneralsToSave, 'QuoteHeaderId');
							saveData.AllQuoteIds = saveData.AllQuoteIds.concat(generalQuoteIds);
						}

						if (angular.isObject(qtnSourceTarget)) {
							updateModifiedKeyService.updateModifiedKey(saveData, commonService.constant.compareType.prcItem, qtnSourceTarget);
							modifiedData = saveData.ModifiedData;
						}
						return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/save?isNewVersion=' + isNewVersion, saveData).then(function (response) {
							if (response.data) {
								localModifiedEntity = {};
								localIdealQuoteCopiedEntity = {};
								let otherService = $injector.get('procurementPriceComparisonBoqService');
								delete otherService.modifiedData.characteristic;
								service.modifiedData = {}; // clear data when save successfully
								service.idealQuoteCopiedData = {};
								commonService.clearData();
								service.clearItemEvaluationRecalculateRowCache(saveData.ModifiedData);
								treeStateHelperService.cleanNodesCache(commonService.constant.compareType.prcItem);
								platformDataServiceModificationTrackingExtension.clearModificationsInRoot(mainDataService);

								if (!isNewVersion && !isFromNewVersion) {
									let children = service.getChildServices();
									_.forEach(children, function (childService) {
										childService.mergeInUpdateData(response.data);
									});

									let evaluationService = evaluationServiceCache.getService(evaluationServiceCache.serviceTypes.EVALUATION_DATA, '367c0031930d45d9a84cd866326702bc');
									if (evaluationService) {
										evaluationService.mergeInUpdateData(response.data);
									}

									if (!_.isEmpty(response.data['BillingSchemaTypeList']) || !_.isEmpty(response.data.BillingSchemaToSave)) {
										if (_.isEmpty(otherService.modifiedData)) {
											let billingSchemaService = $injector.get('priceComparisonBillingSchemaService');
											billingSchemaService.mergeInUpdateData(response.data);
											service.resetBillingSchemaValue(response.data['BillingSchemaTypeList'], service.selectedQuote, response.data.BillingSchemaToSave);
										} else {
											let exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
											commonHelperService.recalculateBillingSchema(service, service.selectedQuote.QtnHeaderId, exchangeRate, {}, {}, service.modifiedData, otherService.modifiedData);
										}
									}
								}
							}
							return {
								status: true,
								data: response.data,
								modifiedData: modifiedData
							};
						});
					} else {
						return {status: false, data: null};
					}
				});
			};

			function drawTree(itemList, isRedraw) {
				let isVerticalCompareRows = service.isVerticalCompareRows();
				if (!isRedraw) {
					platformGridAPI.grids.columnGrouping(service.gridId, false);

					let configColumns = commonHelperService.getColumnsFromViewConfig(service.gridId);
					let allColumns = itemConfigService.getAllColumns();
					allColumns = allColumns.concat(itemConfigService.getLineNameColumn());
					let existing = _.intersectionBy(configColumns, allColumns, 'id');
					if (existing && existing.length === 0) {
						configColumns = _.map(allColumns, column => {
							column.hidden = !column.hidden;
							return column;
						});
						procurementPriceComparisonConfigurationService.setViewConfig(service.gridId, allColumns);
					}
					service.initGridConfiguration(configColumns);
				}

				if (!_.isEmpty(itemList)) {
					platformGridAPI.items.data(service.gridId, itemList);
					platformGridAPI.grids.resize(service.gridId);
				}
				if (!isRedraw && isVerticalCompareRows) {
					platformGridAPI.grids.columnGrouping(service.gridId, true);
				}
			}

			service.getDefaultColumns = function getDefaultColumns() {
				var commonColumns = angular.copy(itemConfigService.getCommonColumns());
				var commonColumns2 = angular.copy(itemConfigService.getCommonColumns2());
				var lineNameColumn = angular.copy(itemConfigService.getLineNameColumn());
				// get compare 'description' column (using the custom 'description' value).
				var compareDescriptionColumn = angular.copy(itemConfigService.getCompareDescriptionColumnByCustomSettings());
				var maxMinAverageColumns = angular.copy(itemConfigService.getMaxMinAverageColumns());

				return commonColumns.concat(lineNameColumn).concat(compareDescriptionColumn).concat(maxMinAverageColumns).concat(commonColumns2);
			};

			// when the change of evaluation container Points, reset the qtn evaluation result and rank.Then redraw tree
			service.resetEvaluationValue = function (evaluationHeader, targetQuote, isRefreshGrid) {

				// get total points of the evaluation container
				var evaluationPoints = Math.round((evaluationHeader ? evaluationHeader.Points : 0) * 100) / 100;
				var isEvaluationChange = commonService.resetEvaluationValue(service, evaluationPoints, targetQuote, 'Children', 'LineType', 'RefreshBoqEvaluation', true, itemConfigService.visibleCompareColumnsCache);
				if (isEvaluationChange) {
					if (angular.isUndefined(isRefreshGrid) || isRefreshGrid) {
						service.redrawTree(true, service.currentEnterCell);
					}
				}
			};

			// when the change of Billing Schema result, reset compare field value.Then redraw tree
			service.resetBillingSchemaValue = function (billingSchemaTypeList, selectedQuote, billingSchemas) {
				commonService.resetBillingSchemaValue(billingSchemaTypeList, selectedQuote, service, itemConfigService.itemQtnMatchCache, 'Children', 'LineType', 'RefreshBoqBillingSchema', true, itemConfigService.visibleCompareColumnsCache, billingSchemas);
			};

			itemHelperService.onCalculateCompleted.register(calculateCompleted);

			function calculateCompleted(event) {
				const otherService = $injector.get('procurementPriceComparisonBoqService');
				commonHelperService.recalculateBillingSchema(service, event.qtnHeaderId, event.exchangeRate, event.originalQuoteItems, {}, service.modifiedData, otherService.modifiedData);
			}

			function domainFn(row, col) {
				const compareFiled = commonHelperService.getPrcCompareField(row, col);
				if (compareFiled === commonService.itemCompareFields.prcItemEvaluationFk) {
					const filterKey = col.isIdealBidder ? 'procurement-pricecomparison-ideal-item-prcitemevaluationfk-filter' : 'procurement-pricecomparison-item-prcitemevaluationfk-filter';
					col.editorOptions = {
						lookupDirective: 'procurement-pricecomparison-prc-item-evaluation-combobox',
						lookupOptions: {
							filterKey: filterKey,
							lookupMember: col.field + '_$PrcItemEvaluationFk',
							getPrcItemEvaluation: commonService.getPrcItemEvaluation,
							getPriceByPrcItemEvaluation: function (prcItemEvaluationFk, field, entity) {
								if (!service.hasSelection() && !entity) {
									return;
								}
								// cache the original values of compare field before recalculation by the selected evaluation item
								const selectedRow = service.getSelected() ? service.getSelected() : entity;
								return itemHelperService.getPriceByPrcItemEvaluation(prcItemEvaluationFk, field, selectedRow, itemDataStructureService, service.isVerticalCompareRows());
							},
							updateQuoteItemPrice: function (entity, sourceQuoteItemOrEvalValue, lookupMember, field) {
								updateQuoteItemPriceForEvaluation(entity, sourceQuoteItemOrEvalValue, lookupMember, field, col);
							},
							entityType: 'item',
							showClearButton: !col.isIdealBidder,
							markAsModified: function (entityBeforeValueChange, entity) {
								collectQuoteModifiedFieldFromEntity(entityBeforeValueChange, entity, col);
							},
							itemEvaluationChanged: itemEvaluationChanged
						}
					};
					col.validator = validatePrice;
				} else if (compareFiled === commonService.itemCompareFields.quantity || compareFiled === commonService.itemCompareFields.priceUnit) {
					col.validator = validatePrice;
					col.editorOptions = null;
				} else if (compareFiled === commonService.itemCompareFields.prcPriceConditionFk) {
					col.editorOptions = {
						lookupDirective: 'basics-material-price-condition-simple-combobox',
						lookupType: 'prcpricecondition',
						lookupOptions: {
							showClearButton: true,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										handlePriceConditionChanged(args.entity, col.formatterOptions.dynamicField, col.formatterOptions.lookupMember, args.selectedItem, undefined, undefined, col);
										return true;
									}
								}
							]
						}
					};
					col.validator = null;
				} else if (compareFiled === commonService.itemCompareFields.alternativeBid) {
					col.editorOptions = {
						lookupDirective: 'procurement-price-comparison-basicsitemtype85-combobox',
						lookupType: 'PrcItemType85'
					};
					col.validator = null;
				} else if (compareFiled === commonService.itemCompareFields.commentContractor || compareFiled === commonService.itemCompareFields.commentClient) {
					col.validator = null;
					col.editorOptions = null;
				} else if (compareFiled === commonService.itemCompareFields.uomFk) {
					col.editorOptions = {
						lookupDirective: 'basics-lookupdata-uom-lookup',
						lookupType: 'PCUom'
					};
					col.validator = validateUomFk;
				} else if (compareFiled === commonService.itemCompareFields.paymentTermPaFk || compareFiled === commonService.itemCompareFields.paymentTermFiFk
				|| row.LineType === compareLineTypes.quotePaymentTermPA || row.LineType === compareLineTypes.quotePaymentTermFI) {
					col.editorOptions = {
						lookupDirective: 'basics-lookupdata-payment-term-lookup',
						lookupType: 'PaymentTerm',
						lookupOptions: {
							showClearButton: true
						}
					};
					col.validator = null;
				} else if (_.includes(commonService.itemAllowEditVisibleFields, compareFiled) && compareFiled !== commonService.itemCompareFields.priceOc) {
					col.validator = function (entity, value, field) {
						const parentItem = commonHelperService.tryGetParentItem(entity, col.isVerticalCompareRows);
						const quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: field}) || {};
						const exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
						if(_.includes(commonService.itemNeedRemovePriceConditionFields, compareFiled)){
							service.onCompareRowsAllowEditVisibleFieldsChanged.fire({
								selectedQuoteItem: quoteItem,
								exchangeRate: exchangeRate
							});
						}
						validatePrice(entity, value, field, false);
					};
					col.editorOptions = null;
				} else if (_.includes(commonService.itemEditableCompareFields, compareFiled)) {
					col.validator = validatePrice;
					col.editorOptions = null;
				} else if (row.LineType === compareLineTypes.quoteRemark) {
					col.editorOptions = {
						lookupDirective: 'show-draw-down-text-directive',
						lookupOptions: {
							lookupMember: col.field
						}
					};
				}

				// ALM 145071, Try to config decimal places for specified fields.
				col.editorOptions = commonHelperService.assignDecimalPlacesOptions(col.editorOptions, compareFiled);
			}

			/**
			 * validate price and recalculate the item tree in client-side, then redraw item tree.
			 *
			 * first, change the quote 'Price' by the selected prcItem Evaluation value as modified items
			 * second, update the original quote item 'Price' by the modified item. (called recalculate PrcItem)
			 * at last, recalculate the whole tree data (called Recalculate Tree) and redraw it.
			 */
			function validatePrice(entity, value, field, cannotRedraw, isExchangeRateChanged) {

				// collect the modified quote item.
				let itemTree = service.getTree();
				let columnInfo = commonHelperService.extractCompareInfoFromFieldName(field);
				let isVerticalCompareRows = service.isVerticalCompareRows();
				let compareField = isVerticalCompareRows ? columnInfo.field : commonHelperService.getPrcCompareField(entity);
				let parentItem = commonHelperService.tryGetParentItem(entity, isVerticalCompareRows);
				let modifiedItems = commonService.getCompareModifications(entity, value, columnInfo.quoteKey, serviceOption.hierarchicalNodeItem.presenter.tree.childProp, field, compareField, isVerticalCompareRows)(service.getTree());

				// change PrcItemEvaluationFk row value to 'Guessed' (id = 8) because user changed the Price now.
				if ((compareField === commonService.itemCompareFields.price || _.includes(commonService.itemDataToPriceFields, compareField)) && parentItem && parentItem.Children) {
					let hasItemEvaluation = _.find(itemConfigService.visibleCompareRowsCache, {Field: commonService.itemCompareFields.prcItemEvaluationFk});
					if (hasItemEvaluation) {
						let prcItemEvalRow = isVerticalCompareRows ? entity : (parentItem.Children ? _.find(parentItem.Children, {rowType: commonService.itemCompareFields.prcItemEvaluationFk}) : null);
						if (prcItemEvalRow) {
							let item = _.find(parentItem.QuoteItems, {QuoteKey: columnInfo.quoteKey});
							let property = (isVerticalCompareRows ? commonHelperService.getCombineCompareField(columnInfo.quoteKey, commonService.itemCompareFields.prcItemEvaluationFk) : field) + '_$PrcItemEvaluationFk';
							if (!Object.hasOwn(prcItemEvalRow, property)) {
								prcItemEvalRow[property] = 8;
								if (item) {
									item.PrcItemEvaluationId = 8;
									collectItemEvaluationModifiedFromCompareFields(columnInfo.quoteKey, item.PrcItemId, 8);
								}
							} else if (prcItemEvalRow[property] !== 8) {
								prcItemEvalRow[property] = 8;
								if (item) {
									item.PrcItemEvaluationId = 8;
									collectItemEvaluationModifiedFromCompareFields(columnInfo.quoteKey, item.PrcItemId, 8);
								}
							}
						}
					}
				}

				if (_.includes(commonService.itemAllowEditVisibleFields, compareField) && compareField !== commonService.itemCompareFields.priceOc && parentItem && parentItem.Children) {
					let hasPriceCondition = _.find(itemConfigService.visibleCompareRowsCache, {Field: commonService.itemCompareFields.prcPriceConditionFk});
					if (hasPriceCondition) {
						let priceConditionRow = isVerticalCompareRows ? entity : (parentItem.Children ? _.find(parentItem.Children, {rowType: commonService.itemCompareFields.prcPriceConditionFk}) : null);
						if (priceConditionRow) {
							let conditionProperty = (isVerticalCompareRows ? commonHelperService.getCombineCompareField(columnInfo.quoteKey, commonService.itemCompareFields.prcPriceConditionFk) : field);
							priceConditionRow[conditionProperty] = 0;
						}
					}
				}

				if (!_.isEmpty(modifiedItems) && value !== null && value !== undefined) {
					let allQuoteItems = commonService.getAllQuoteItems(itemTree, serviceOption.hierarchicalNodeItem.presenter.tree.childProp);
					let idealItemsFromParent = _.filter(parentItem.QuoteItems, function (item) {
						return item.IsIdealBidder;
					});
					let idealBidderItem = angular.isArray(idealItemsFromParent) && idealItemsFromParent.length > 0 ? idealItemsFromParent[0] : null;

					_.forEach(modifiedItems, function (item) {
						let originalQuoteItems = _.filter(allQuoteItems, function (i) {
							return i.PrcItemId === item.PrcItemId && i.QtnHeaderId === item.QtnHeaderId;
						});

						let idealQuoteItemsOfItemModified = item.IsIdealBidder ? null : _.filter(allQuoteItems, function (i) {
							return i.IsIdealBidder && item.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && item.PrcItemId === i[commonService.itemEvaluationRelatedFields.sourcePrcItemId];
						});

						let allIdealItemsRelate2SamePrcItemFk = null;
						let isPriceChanged = _.includes([
							commonService.itemCompareFields.price,
							commonService.itemCompareFields.priceOc
						], compareField);
						_.each(originalQuoteItems.concat(item), function (entity) {
							let vatPercent = prcCommonGetVatPercent.getVatPercent(entity.TaxCodeFk, entity['QtnHeaderVatGroupFk']);
							let currentQuote = _.find(lookupDescriptorService.getData('quote'), {Id: entity.QtnHeaderId});
							let exchangeRate = currentQuote ? commonService.getExchangeRate(currentQuote.RfqHeaderFk, currentQuote.Id) : 1;
							let field = compareField;
							if (field !== commonService.itemCompareFields.prcItemEvaluationFk) {
								if (!_.includes([
									commonService.itemCompareFields.discount,
									commonService.itemCompareFields.discountAbsolute
								], field)) {
									entity[field] = value;
								}

								if (_.includes([commonService.itemCompareFields.charge, commonService.itemCompareFields.chargeOc], field)) {
									itemCalculationHelper.setChargeChargeOc(entity, value, field, exchangeRate);
								}
							} else {
								field = commonService.itemCompareFields.price;
							}
							itemCalculationHelper.setPricePriceOcPriceGrossPriceGrossOc(entity, value, field, vatPercent, exchangeRate);
						});

						service.beforeRecalcuateItem.fire(item);
						itemHelperService.recalculatePrcItem(originalQuoteItems, item, !!isExchangeRateChanged, isPriceChanged, () => {
							// For the case change the gross fields, then recalculate the billing schema
							// Because of the onCalculateCompleted fire as sync the recalculate request will be sent immediately
							// But at the time the modified data has not been collected because the cell change event not trigger
							// Added this async action to let the cell change event fire before recalculate the billing schema
							// Otherwise the modified data send to the backend is not the latest. It's always the last
							return $q.when();
						});

						if (!isExchangeRateChanged && !item.IsIdealBidder) {
							getSourceItem4IdealItem(entity, item, parentItem.QuoteItems).then(function (response) {
								if (!response || !response.data || !response.data['QuoteItemInfo']) {
									return;
								}
								// case 1: the item modified is assigned to ideal bidder. And the source item and ideal item are on UI.
								// case 2: the item modified is not assigned to ideal item but the ideal item is on UI;
								// case 3: the ideal bidder is not shown on UI;
								// case 4: no ideal bidder exists.
								let sourceQuoteItem = response.data['QuoteItemInfo'];
								let idealInfo = response.data['IdealBidderItemInfo']; // null - no new source item needs to assign to ideal bidder item; not null - new source item needs to assign to ideal bidder item

								if (idealQuoteItemsOfItemModified && idealQuoteItemsOfItemModified.length > 0) { // case 1: the item modified is assigned to ideal bidder. And the source item and ideal item are on UI.
									allIdealItemsRelate2SamePrcItemFk = _.filter(allQuoteItems, function (i) {
										if (!i.IsIdealBidder) {
											return false;
										}
										let found = _.find(idealQuoteItemsOfItemModified, {
											QtnHeaderId: i.QtnHeaderId,
											PrcItemId: i.PrcItemId
										});
										return !!found;
									});

									if (!idealInfo) { // no new source item needs to assign to ideal bidder item
										let tempItem = angular.copy(item);
										tempItem.QtnHeaderId = allIdealItemsRelate2SamePrcItemFk[0].QtnHeaderId;
										itemHelperService.recalculatePrcItem(allIdealItemsRelate2SamePrcItemFk, tempItem, false);
									} else { // new source item needs to assign to ideal bidder item
										mergeIdealFromSourceItem(idealBidderItem, sourceQuoteItem, allIdealItemsRelate2SamePrcItemFk);
										collectPrcItemIdToBeCopiedByItemEvaluation(idealBidderItem, idealInfo.PrcItemIdToBeCopied);
									}

									updateUI();
								} else {
									if (idealBidderItem) { // case 2: the item modified is not assigned to ideal item but the ideal item is on UI
										allIdealItemsRelate2SamePrcItemFk = _.filter(allQuoteItems, function (i) {
											if (!i.IsIdealBidder) {
												return false;
											}
											return idealBidderItem.QtnHeaderId === i.QtnHeaderId && idealBidderItem.PrcItemId === i.PrcItemId;
										});

										if (idealInfo) { // new source item needs to assign to ideal bidder item
											mergeIdealFromSourceItem(idealBidderItem, sourceQuoteItem, allIdealItemsRelate2SamePrcItemFk);
											collectPrcItemIdToBeCopiedByItemEvaluation(idealBidderItem, idealInfo.PrcItemIdToBeCopied);
											updateUI();
										}
									} else if (idealInfo) { // case 3: the ideal bidder is not shown on UI and the ideal bidder item exist.
										collectPrcItemIdToBeCopiedByItemEvaluation(idealInfo, idealInfo.PrcItemIdToBeCopied);
										updateUI();
									}
								}
							});
						}
					});
					updateUI();
				}

				function updateUI() {
					// Using async feature to delay the draw tree action to fixed defect 110862,
					// call stack >> editor blur > commit edit > execute validator > execute validatePrice > execute updateUI > execute drawTree > reset active cell > trigger onCellChange events > row & cell missing
					$q.when([]).then(function () {
						// recalculate item tree data
						itemDataStructureService.recalculateTreeByModifiedPrcItemEvaluation(itemTree);

						// collapse other item
						_.forEach(itemTree, function (item) {
							if (item.RfqHeaderId !== parentItem.RfqHeaderId) {
								item.nodeInfo.collapsed = true;
							}
						});
						if (!cannotRedraw) {
							drawTree(itemTree, true);
						}
					});
				}
			}

			function validateUomFk(entity, value, field) {
				let columnInfo = commonHelperService.extractCompareInfoFromFieldName(field),
					isVerticalCompareRows = service.isVerticalCompareRows(),
					compareField = isVerticalCompareRows ? columnInfo.field : commonHelperService.getPrcCompareField(entity);
				let modifiedItems = commonService.getCompareModifications(entity, value, columnInfo.quoteKey, serviceOption.hierarchicalNodeItem.presenter.tree.childProp, field, compareField, isVerticalCompareRows)(service.getTree());

				// update quoteItems' uomFk
				if (modifiedItems && modifiedItems.length && value !== null && value !== undefined) {
					let itemTree = service.getTree();
					let originalQuoteItems = _.filter(commonService.getAllQuoteItems(itemTree, serviceOption.hierarchicalNodeItem.presenter.tree.childProp), function (i) {
						return i.QuoteKey === columnInfo.quoteKey;
					});
					_.forEach(modifiedItems, function (modifyItem) {
						let sources = _.filter(originalQuoteItems, {
							QuoteKey: modifyItem.QuoteKey,
							PrcItemId: modifyItem.PrcItemId
						});
						if (sources && sources.length) {
							_.forEach(sources, source => {
								source.UomFk = modifyItem.UomFk;
							});
						}
					});
				}
			}

			/**
			 * for exchangeRate recalculate data
			 * @param modifiedItems
			 */
			function recalculateList(modifiedItems, quoteKey, compareField, isExchangeRateChanged) {
				_.forEach(modifiedItems, function (item) {
					var actualFiled = compareField && compareField !== quoteKey ? commonHelperService.getCombineCompareField(quoteKey, compareField) : quoteKey;
					validatePrice(item, item[actualFiled], actualFiled, true, isExchangeRateChanged);
				});
				var itemTree = service.getTree();
				drawTree(itemTree, true);
			}

			function registerLookupFilter() {
				var filter = [
					{
						key: 'procurement-pricecomparison-item-chosenbusinesspartner-filter',
						serverKey: 'procurement-pricecomparison-item-chosenbusinesspartner-filter',
						serverSide: true,
						fn: function (item) {
							var filterStr = 'RfqHeaderFk ==' + item.RfqHeaderId;
							var subFilterStr = 'Id == -1';
							if (item && item.QuoteItems && item.QuoteItems.length > 0) {
								_.forEach(item.QuoteItems, function (quote) {
									if (quote.BusinessPartnerId >= 0) {
										subFilterStr += '||Id ==' + quote.QtnHeaderId;
									}
								});
								filterStr += '&&(' + subFilterStr + ')';
							}
							return filterStr;
						}
					},
					{
						key: 'procurement-pricecomparison-item-prcitemevaluationfk-filter',
						serverSide: true,
						fn: function () {
							return 'Id != 3 && Id != 9'; // id = 3 --> baseBoq
						}
					},
					{
						key: 'procurement-pricecomparison-ideal-item-prcitemevaluationfk-filter',
						serverSide: true,
						fn: function () {
							return 'Id == 6 || Id == 7 || Id == 9'; // id == 6 --> Minimum; id == 7 --> Maximum
						}
					}
				];
				lookupFilterService.registerFilter(filter);
			}

			service.getOriginalQuoteItem = function getOriginalQuoteItem(quoteKey, priceConditionId) {
				var selected = service.getSelected();
				var orginalItem = null;
				if (selected && selected.LineType === compareLineTypes.prcItem) {
					orginalItem = _.find(selected.QuoteItems, {QuoteKey: quoteKey});
					orginalItem.PrcPriceConditionFk = priceConditionId;
				} else if (selected && selected.LineType === compareLineTypes.compareField) {
					orginalItem = _.find(selected.parentItem.QuoteItems, {QuoteKey: quoteKey}) || {};
					orginalItem.PrcPriceConditionFk = priceConditionId;
				}

				return orginalItem;
			};

			/**
			 * @param isNoNeedRecalculate: for the sub container changed (evaluation and billing schema: true)
			 * @param selectDefaultCell: the selected cell, for the sub container changed (others almost is null)
			 */
			service.redrawTree = function redrawTree(isNoNeedRecalculate, selectDefaultCell) {
				let cell = null,
					itemTree = service.getTree(),
					selected = service.getSelected();

				if (!isNoNeedRecalculate) {
					itemDataStructureService.recalculateTreeByModifiedPrcItemEvaluation(itemTree);
				}
				drawTree(itemTree, true);

				// the selected cell to set the selected row and cell
				if (isNoNeedRecalculate && selectDefaultCell !== null) {
					cell = selectDefaultCell;
				} else {
					cell = service.currentEnterCell;
				}
				// keep the selected item and selected cell after the tree redraw
				if (selected && cell !== null) {
					platformGridAPI.rows.selection({
						gridId: service.gridId,
						rows: [selected],
						nextEnter: cell
					});
				}
			};

			mainDataService.registerSelectionChanged(clearModuleStateData);

			function clearModuleStateData() {
				// clear data of header/item text, price condition containers
				var modState = platformModuleStateService.state(mainDataService.getModule());
				if (modState) {
					modState.modifications = {
						EntitiesCount: 0
					};
					modState.validation = {
						asynCalls: [], issues: []
					};
				}
			}

			function getSelectedItemConfigurationFk() {
				var configurationFk = null, selectItem = mainDataService.getSelected();
				if (selectItem) {
					configurationFk = selectItem.PrcConfigurationFk;
				}
				return configurationFk;
			}

			service.updateBillingSchema = function (resultData) {
				var billingSchema = $injector.get('priceComparisonBillingSchemaService');
				billingSchema.mergeInUpdateData(resultData);
			};

			service._conditionCache = {};
			service.setNewConditionFk = function (prcItemId, value) {
				service._conditionCache[prcItemId] = value;
			};
			service.getNewConditionFk = function (prcItemId) {
				return service._conditionCache[prcItemId];
			};
			service.clearNewConditionFk = function () {
				service._conditionCache = {};
			};

			function checkModified(saveData, isNewVersion) {
				let hasModified = false;
				if (!saveData || _.isEmpty(saveData)) {
					return hasModified;
				}

				let emptyCheckItems = [
					saveData.PrcItemToSave,
					saveData.PrcHeaderBlobToSave,
					saveData.PrcHeaderBlobToDelete,
					saveData.ModifiedData,
					saveData.IdealQuoteCopiedData,
					saveData.ModifiedQuote,
					saveData.PrcGeneralsToSave
				];

				let emptyCheckItemsForOriginalVersion = [
					saveData.BusinessPartnerEvaluationToSave,
					saveData.BusinessPartnerEvaluationToDelete,
					saveData.EvaluationDocumentToSave,
					saveData.EvaluationDocumentToDelete,
					saveData.PrcGeneralsToSave
				];

				if (_.some(emptyCheckItems, v => !_.isEmpty(v)) || (!isNewVersion && _.some(emptyCheckItemsForOriginalVersion, v => !_.isEmpty(v)))) {
					hasModified = true;
				}
				return hasModified;
			}

			service.allDoPrepareUpdateCall = allDoPrepareUpdateCall;

			function allDoPrepareUpdateCall() {

				var billingSchemaService = $injector.get('priceComparisonBillingSchemaService');

				return billingSchemaService.recalculateBillingSchema().then(function () {

					var modalOptions = {
						headerTextKey: 'Save Options',
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-save-option.html',
						iconClass: 'ico-question',
						value: {
							selectedValue: 'newVersion'
						}
					};
					return platformModalService.showDialog(modalOptions).then(function (result) {
						if (result && result.ok && result.value.selectedValue !== 'dontSave') {
							return service.saveBoqAndItemModifiedData(result.value.selectedValue === 'newVersion');
						}
						return true;
					});
				});
			}

			service.saveBoqAndItemModifiedData = function saveBothBoqAndItemData(isNewVersion) {
				var deferred = $q.defer();
				var boqService = $injector.get('procurementPriceComparisonBoqService'),
					updateData = platformDataServiceModificationTrackingExtension.getModifications(mainDataService),
					itemCompleteDto = mainDataService.doPrepareUpdateCall(updateData, service.modifiedData, service.idealQuoteCopiedData),
					isCheckModified = checkModified(itemCompleteDto, false),
					boqCompleteDto = {
						ModifiedData: !_.isEmpty(boqService.modifiedData) ? boqService.modifiedData : null,
						IdealQuoteCopiedData: !_.isEmpty(boqService.idealQuoteCopiedData) ? boqService.idealQuoteCopiedData : null
					};

				// collect the common fields in BOQ and Item
				if (commonService.commonModifiedData) {
					_.forIn(commonService.commonModifiedData, function (value, key) {
						if (_.includes(commonService.commonEditableFields, key)) {
							if (!boqCompleteDto[key + 'ToSave']) {
								boqCompleteDto[key + 'ToSave'] = [];
							}
							boqCompleteDto[key + 'ToSave'] = value;
						}
					});
				}
				if (isCheckModified || _.isEmpty(boqService.modifiedData) || _.isEmpty(boqService.idealQuoteCopiedData)) {
					var allUpdateData = [
						itemCompleteDto,
						boqCompleteDto
					];

					$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/savetotal?isNewVersion=' + isNewVersion, allUpdateData).then(
						function (respsonse) {
							if (respsonse.data) {
								localModifiedEntity = {};
								localIdealQuoteCopiedEntity = {};
								service.modifiedData = {}; // clear data when save successfully
								commonService.commonModifiedData = {};
								service.idealQuoteCopiedData = {};
								boqService.modifiedData = {};
								boqService.idealQuoteCopiedData = {};
								platformDataServiceModificationTrackingExtension.clearModificationsInRoot(mainDataService);

								var children = service.getChildServices();
								_.forEach(children, function (childService) {
									childService.mergeInUpdateData(respsonse.data);
								});

								var evaluationService = evaluationServiceCache.getService(evaluationServiceCache.serviceTypes.EVALUATION_DATA, '367c0031930d45d9a84cd866326702bc');
								if (evaluationService) {
									evaluationService.mergeInUpdateData(respsonse.data);
								}

								if (!_.isEmpty(respsonse.data.BillingSchemaTypeList) || !_.isEmpty(respsonse.data.BillingSchemaToSave)) {
									var billingSchemaService = $injector.get('priceComparisonBillingSchemaService');
									billingSchemaService.mergeInUpdateData(respsonse.data);
									service.resetBillingSchemaValue(respsonse.data.BillingSchemaTypeList, service.selectedQuote, respsonse.data.BillingSchemaToSave);
								}

								if (isNewVersion) {
									commonService.reloadNewVersionData(respsonse, service, boqService, commonService.constant.compareType.prcItem, commonService.constant.compareType.boqItem, false, false, true);
								} else {
									var msg = 'procurement.pricecomparison.saveToOriginalDone';
									commonService.showInfoDialog(msg);
								}
							}
							deferred.resolve(true);
						}
					);
				}
				return deferred.promise;
			};

			service.recalculatePrcItemBy = function (item, drawTreeAfterRecalculate) {
				var itemTree = service.getTree();
				var selectedItem = service.getSelected();
				var parentItem = selectedItem ? (selectedItem.LineType === compareLineTypes.prcItem ? selectedItem : selectedItem.parentItem) : null;
				var originalQuoteItems = _.filter(commonService.getAllQuoteItems(itemTree, serviceOption.hierarchicalNodeItem.presenter.tree.childProp), function (i) {
					return i.PrcItemId === item.PrcItemId && i.QtnHeaderId === item.QtnHeaderId;
				});

				// reclaculte PrcItem ==> update the original quote item 'Price' by the modified item.
				itemHelperService.recalculatePrcItem(originalQuoteItems, item, false);

				// recalculate item tree data
				itemDataStructureService.recalculateTreeByModifiedPrcItemEvaluation(itemTree);

				// collapse other item
				_.forEach(itemTree, function (treeItem) {
					if (parentItem && treeItem.RfqHeaderId !== parentItem.RfqHeaderId) {
						treeItem.nodeInfo.collapsed = true;
					}
				});

				if (drawTreeAfterRecalculate) {
					// redraw the tree
					drawTree(itemTree, true);
				}
			};

			itemConfigService.needUpdate.register(onNeedUpdate);

			service.checkModifiedState = function (isNewVersion) {
				return $q.all([platformDataServiceValidationErrorHandlerExtension.assertAllValid(container.service)]).then(function (responses) {
					var hasModified = false,
						responseData = responses[0];
					var saveData = null,
						modifiedData = null;
					if (responseData === true) {
						var updateData = platformDataServiceModificationTrackingExtension.getModifications(mainDataService);
						if (mainDataService.doPrepareUpdateCall) {
							saveData = mainDataService.doPrepareUpdateCall(updateData, service.modifiedData, service.idealQuoteCopiedData);
						}
						modifiedData = service.modifiedData;
						if (checkModified(saveData, isNewVersion)) {
							hasModified = true;
						}
					}
					return {
						hasModified: hasModified,
						modifiedData: modifiedData,
						saveData: saveData
					};
				});
			};

			service.trySyncQuoteEvaluation = function () {
				let selectedRfq = mainDataService.getSelected();
				if (!selectedRfq) {
					return;
				}
				let quotes = itemConfigService.itemQtnMatchCache[selectedRfq.Id];
				let evaluationSchemaFk = selectedRfq.EvaluationSchemaFk;
				let isChanged = false;
				_.each(quotes, function (quote) {
					if (checkBidderService.item.isNotReference(quote.QuoteKey)) {
						var syncResult = mainDataService.trySyncQuoteEvaluation(quote.QtnHeaderId, evaluationSchemaFk, quote.EvaluationList);
						if (syncResult.isChanged) {
							service.resetEvaluationValue({Points: syncResult.summary.Points}, quote, false);
							isChanged = true;
						}
					}
				});
				if (isChanged) {
					service.redrawTree(true, service.currentEnterCell);
				}
			};

			function onNeedUpdate() {
				service.loadData();
			}

			function itemEvaluationChanged(entity, value, field, cannotRedraw) {
				validatePrice(entity, value, field, cannotRedraw);
			}

			function collectBaseOnSpecifiedModifiedKeys(modifiedEntity, quote, quoteKey, itemKey, baseOnFields, targetFields) {
				let modifiedData = _.get(localModifiedEntity, quoteKey + '.' + itemKey);
				let modifiedKeys = _.keys(modifiedData);
				if (_.intersection(modifiedKeys, baseOnFields).length) {
					_.forEach(targetFields, field => {
						let targetField = quoteKey + '.' + itemKey + '.' + field;
						if (Object.hasOwn(quote, field)) {
							commonService.assignValue(modifiedEntity, targetField, quote[field]);
						}
					});
				}
			}

			function collectQuoteModifiedFieldFromEntity(entityBeforeValueChange, entity, column) {
				let ownQuoteKey = null, itemKey = null, itemConfig = null, data = {}, quote = null,
					quoteKey = column.isVerticalCompareRows ? column.quoteKey : column.field,
					parentItem = commonHelperService.tryGetParentItem(entity, column.isVerticalCompareRows),
					compareField = commonHelperService.getPrcCompareField(entity, column),
					itemEvalField = null,
					itemEvalValue = null;

				let priceOcField = null;
				let priceOcValue = null;
				let anotherChargeField = null;
				let anotherChargeValue = null;
				let value = entity[column.field];

				if (!parentItem || !compareField) {
					return;
				}

				if (entityBeforeValueChange) {
					let itemList = itemConfigService.itemQtnMatchCache[entityBeforeValueChange.RfqHeaderId];
					itemConfig = _.find(itemList, function (item) {
						return item.QuoteKey === quoteKey && item.OwnQuoteKey;
					});
					ownQuoteKey = itemConfig ? itemConfig.OwnQuoteKey : quoteKey;
					quote = _.find(parentItem.QuoteItems, {QuoteKey: ownQuoteKey});
					itemKey = (quote || {}).PrcItemId; // key
				}

				let field = ownQuoteKey + '.' + itemKey + '.' + compareField;
				if (compareField === commonService.itemCompareFields.prcItemEvaluationFk) {
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.price;
					priceOcField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.priceOc;
					priceOcValue = quote[commonService.itemCompareFields.priceOc];
					itemEvalField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.prcItemEvaluationFk;
					itemEvalValue = service.isVerticalCompareRows() ? entity[ownQuoteKey + '_PrcItemEvaluationFk_$' + commonService.itemCompareFields.prcItemEvaluationFk]
						: entity[ownQuoteKey + '_$' + commonService.itemCompareFields.prcItemEvaluationFk];

					let quoteItem = _.find(parentItem.QuoteItems, quoteItem => quoteItem.QuoteKey === quoteKey);
					if (itemEvalValue !== 8) {
						if (quoteItem) {
							quoteItem.EvaluationQuoteId = 0;
							quoteItem.EvaluationQuoteCode = null;
						}
					}

					let exQtnIsEvaluated = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
					let isEvaluated = !_.includes([1, 2, 8], itemEvalValue);
					quoteItem.ExQtnIsEvaluated = isEvaluated;
					commonService.assignValue(localModifiedEntity, exQtnIsEvaluated, isEvaluated);
				}

				// Discount Absolute relative fields.
				if (_.includes(commonService.discountAbsoluteFields, compareField)) {
					value = quote[compareField];
				}

				if (compareField === commonService.itemCompareFields.price) {
					// priceOc
					priceOcField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.priceOc;
					priceOcValue = quote[commonService.itemCompareFields.priceOc];
				}

				if (compareField === commonService.itemCompareFields.priceOc) {
					// price
					priceOcField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.price;
					priceOcValue = quote[commonService.itemCompareFields.price];
				}

				if (compareField === commonService.itemCompareFields.charge) {
					// chargeOc
					anotherChargeField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.chargeOc;
					anotherChargeValue = quote[commonService.itemCompareFields.chargeOc];
				}

				if (compareField === commonService.itemCompareFields.chargeOc) {
					// charge
					anotherChargeField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.charge;
					anotherChargeValue = quote[commonService.itemCompareFields.charge];
				}

				if (_.includes(reverseCalculateCompareFields, compareField) && compareField !== commonService.itemCompareFields.priceOc) {
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.price;
					priceOcField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.priceOc;
					value = itemCalculationHelper.round(itemCalculationHelper.roundingType.Price, quote[commonService.itemCompareFields.price]);
					priceOcValue = quote[commonService.itemCompareFields.priceOc];
				}

				// Collect current editing field.
				commonService.assignValue(localModifiedEntity, field, value);

				if (priceOcField !== null && priceOcValue !== null) {
					commonService.assignValue(localModifiedEntity, priceOcField, priceOcValue);
				}

				if (anotherChargeField !== null && anotherChargeValue !== null) {
					commonService.assignValue(localModifiedEntity, anotherChargeField, anotherChargeValue);
				}

				if (itemEvalField) {
					commonService.assignValue(localModifiedEntity, itemEvalField, itemEvalValue);
				}

				// Discount absolute.
				collectBaseOnSpecifiedModifiedKeys(localModifiedEntity, quote, ownQuoteKey, itemKey, [
					commonService.itemCompareFields.price,
					commonService.itemCompareFields.priceOc
				].concat(commonService.discountAbsoluteFields), commonService.discountAbsoluteFields);

				// PriceGross
				collectBaseOnSpecifiedModifiedKeys(localModifiedEntity, quote, ownQuoteKey, itemKey, [
					commonService.itemCompareFields.price,
					commonService.itemCompareFields.priceOc
				], [
					commonService.itemCompareFields.priceGross,
					commonService.itemCompareFields.priceOCGross,
					'PriceGrossOc'
				]);

				// Co2Project
				collectBaseOnSpecifiedModifiedKeys(localModifiedEntity, quote, ownQuoteKey, itemKey, [
					commonService.itemCompareFields.co2Project
				], [
					commonService.itemCompareFields.co2ProjectTotal
				]);

				if (_.includes([commonService.itemCompareFields.price, commonService.itemCompareFields.priceOc, commonService.itemCompareFields.prcItemEvaluationFk], compareField)) {
					let exQtnIsEvaluated = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
					let isEvaluated = false;
					if (compareField === commonService.itemCompareFields.prcItemEvaluationFk ){
						isEvaluated = !_.includes([1, 2, 8], itemEvalValue);
					}
					commonService.assignValue(localModifiedEntity, exQtnIsEvaluated, isEvaluated);
					// not submitted
					let notSubmitted = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.notSubmitted;
					commonService.assignValue(localModifiedEntity, notSubmitted, 0);

					if (compareField === commonService.itemCompareFields.prcItemEvaluationFk && value === 0) {
						commonService.assignValue(localModifiedEntity, exQtnIsEvaluated, false);
						// reset evaluated node
						resetIsEvaluated();

						let quoteItem = _.find(parentItem.QuoteItems, quoteItem => quoteItem.QuoteKey === quoteKey);
						if (quoteItem && quoteItem.PrcItemEvaluationId === 1) { // empty
							quoteItem.ExQtnIsEvaluated = false;
						}
					}
				}

				if (compareField === commonService.itemCompareFields.uomFk) {
					field = ownQuoteKey + '.' + itemKey + '.' + 'BasUomFk';
					commonService.assignValue(localModifiedEntity, field, value);
				}

				if (compareField === commonService.itemCompareFields.notSubmitted) {
					// price
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.price;
					commonService.assignValue(localModifiedEntity, field, 0);

					// priceOc
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.priceOc;
					commonService.assignValue(localModifiedEntity, field, 0);

					// price gross
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.priceGross;
					commonService.assignValue(localModifiedEntity, field, 0);

					// price gross oc
					field = ownQuoteKey + '.' + itemKey + '.' + 'PriceGrossOc';
					commonService.assignValue(localModifiedEntity, field, 0);

					// is evaluated
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
					commonService.assignValue(localModifiedEntity, field, false);

					let quoteItem = _.find(parentItem.QuoteItems, quoteItem => quoteItem.QuoteKey === quoteKey);
					if (quoteItem) {
						quoteItem.EvaluationQuoteId = 0;
						quoteItem.EvaluationQuoteCode = null;
					}
				}

				if (_.includes([commonService.itemCompareFields.price, commonService.itemCompareFields.priceOc], compareField)) {
					let checked = false;
					let notSubmittedField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.notSubmitted;
					commonService.assignValue(localModifiedEntity, notSubmittedField, checked);
					commonHelperService.setCompareFieldReadOnly(service, commonService.constant.compareType.prcItem, parentItem, quoteKey, entity.Id, commonService.itemCompareFields.notSubmitted, checked);

					// not submitted
					let notSubmittedNode = commonHelperService.getCompareFieldNode(service, commonService.constant.compareType.prcItem, parentItem, quoteKey, entity.Id, commonService.itemCompareFields.notSubmitted);
					if (notSubmittedNode && notSubmittedNode.item) {
						notSubmittedNode.item[quoteKey] = checked;
					}
					if (notSubmittedNode && notSubmittedNode.node && notSubmittedNode.node.length > 0) {
						let node = notSubmittedNode.node[0];
						if (node && node.childNodes && node.childNodes.length > 0) {
							node.childNodes[0].checked = checked;
						}
					}

					// reset evaluated node
					resetIsEvaluated();

					let quoteItem = _.find(parentItem.QuoteItems, quoteItem => quoteItem.QuoteKey === quoteKey);
					if (quoteItem) {
						quoteItem.NotSubmitted = checked;
						quoteItem.ExQtnIsEvaluated = false;
						quoteItem.EvaluationQuoteId = 0;
						quoteItem.EvaluationQuoteCode = null;
					}
				}
				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				if (service.idealQuoteCopiedData) {
					_.map(service.idealQuoteCopiedData, function (quoteKeys) {
						_.remove(quoteKeys, function (item) {
							return _.toNumber(item.Id) === itemKey;
						});
					});
				}

				service.modifiedData = data;

				function resetIsEvaluated() {
					let isEvaluatedNode = commonHelperService.getCompareFieldNode(service, commonService.constant.compareType.prcItem, parentItem, quoteKey, entity.Id, commonService.itemCompareFields.exQtnIsEvaluated);
					if (isEvaluatedNode && isEvaluatedNode.item) {
						isEvaluatedNode.item[quoteKey] = false;
					}
					if (isEvaluatedNode && isEvaluatedNode.node && isEvaluatedNode.node.length > 0) {
						let node = isEvaluatedNode.node[0];
						if (node && node.childNodes && node.childNodes.length > 0) {
							node.childNodes[0].checked = false;
						}
					}
				}
			}

			function handlePriceConditionChanged(entity, field, lookupMember, selectedItem, isFromEvaluation, sourceItem4Copy, column) {
				$timeout.cancel(service._loadTimerId);
				var exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
				service._loadTimerId = $timeout(function () {
					var value = null,
						parentItem = commonHelperService.tryGetParentItem(entity, column.isVerticalCompareRows);
					if (selectedItem) {
						value = selectedItem[lookupMember];
					}
					var quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: field}) || {};

					service.setNewConditionFk(quoteItem.PrcItemId, value);

					if (quoteItem && !quoteItem.IsIdealBidder) {
						var idealQuoteItems = _.filter(parentItem.QuoteItems, function (i) {
							return i.IsIdealBidder && quoteItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && quoteItem.PrcItemId === i[commonService.itemEvaluationRelatedFields.sourcePrcItemId];
						});
						if (angular.isArray(idealQuoteItems) && idealQuoteItems.length > 0) {
							_.forEach(idealQuoteItems, function (idealQuoteItem) {
								idealQuoteItem.PrcPriceConditionFk = value;
								service.setNewConditionFk(idealQuoteItem.PrcItemId, value);
							});
						}
					}
					service.onConditionChanged.fire(value, {
						selectedQuoteItem: quoteItem,
						isFromEvaluation: isFromEvaluation,
						sourceItem4Copy: sourceItem4Copy,
						exchangeRate: exchangeRate
					});
				}, 10);
			}

			function collectPrcItemIdToBeCopiedByItemEvaluation(customQuoteItem, fieldValue) {
				// if (!customQuoteItem || !customQuoteItem.IsIdealBidder) {
				if (!customQuoteItem) {
					return;
				}
				var field = customQuoteItem.QuoteKey + '.' + customQuoteItem.PrcItemId + '.PrcItemIdToBeCopied';

				// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
				_.map(localModifiedEntity, function (quoteKeys) {
					_.map(quoteKeys, function (itemField, itemId) {
						if (itemId === customQuoteItem.PrcItemId) {
							delete quoteKeys[customQuoteItem.PrcItemId];
						}
					});
				});
				commonService.assignValue(localIdealQuoteCopiedEntity, field, fieldValue);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				var data = {};
				_.map(localIdealQuoteCopiedEntity, function (quoteKeys, quoteKey) {
					var quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				service.idealQuoteCopiedData = data;
			}

			function collectItemEvaluation4IdealBidder(customQuoteItem, fieldValue) {
				if (!customQuoteItem || !customQuoteItem.IsIdealBidder) {
					return;
				}
				var field = customQuoteItem.QuoteKey + '.' + customQuoteItem.PrcItemId + '.PrcItemEvaluationFk';

				// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
				_.map(localModifiedEntity, function (quoteKeys) {
					_.map(quoteKeys, function (itemField, itemId) {
						if (itemId === customQuoteItem.PrcItemId) {
							delete quoteKeys[customQuoteItem.PrcItemId];
						}
					});
				});

				commonService.assignValue(localIdealQuoteCopiedEntity, field, fieldValue);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				var data = {};
				_.map(localIdealQuoteCopiedEntity, function (quoteKeys, quoteKey) {
					var quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				service.idealQuoteCopiedData = data;
			}

			function updateQuoteItemPriceForEvaluation(entity, sourceQuoteItemOrEvalValue, lookupMember, field, column) {
				var target = getQuoteFromEntity(entity, field, column);

				if (!sourceQuoteItemOrEvalValue || !target) {
					return;
				}

				var sourceQuoteItem = null;
				if (angular.isObject(sourceQuoteItemOrEvalValue)) {
					sourceQuoteItem = sourceQuoteItemOrEvalValue;
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteCode, sourceQuoteItem.QtnCode);
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteId, sourceQuoteItem.Id);
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.sourcePrcItemId, sourceQuoteItem.PrcItemId);
					var tempItemOnUI = getQuoteFromEntity(entity, sourceQuoteItem.QuoteKey, {
						isVerticalCompareRows: column.isVerticalCompareRows,
						quoteKey: sourceQuoteItem.QuoteKey
					});
					if (tempItemOnUI) {
						tempItemOnUI = angular.copy(tempItemOnUI);
						tempItemOnUI.QtnCode = sourceQuoteItem.QtnCode;
						tempItemOnUI.Id = sourceQuoteItem.Id;
						tempItemOnUI.PrcItemId = sourceQuoteItem.PrcItemId;
					}
					updatePrice(entity, tempItemOnUI || sourceQuoteItem, lookupMember, field, null);
				} else if (angular.isNumber(sourceQuoteItemOrEvalValue)) {
					var evaluation = sourceQuoteItemOrEvalValue;
					var dataService = $injector.get('procurementPriceComparisonOtherQuoteItemDialogDataService');
					var quoteItemService = dataService.getService('item');
					var parentItem = commonHelperService.tryGetParentItem(entity, column.isVerticalCompareRows);
					var filter = {
						rfqHeaderId: entity.RfqHeaderId,
						prcItemId: parentItem.PrcItemId
					};
					quoteItemService.loadByFilter(filter).then(function (quoteItems) {
						if (!quoteItems) {
							return;
						}

						var additional = '';
						var tempQuoteItems = [];

						_.forEach(quoteItems, function (item) {
							var itemOnUI = getQuoteFromEntity(entity, item.QuoteKey, {
								isVerticalCompareRows: column.isVerticalCompareRows,
								quoteKey: item.QuoteKey
							});
							if (itemOnUI) {
								var tempItemOnUI = angular.copy(itemOnUI);
								tempItemOnUI.QtnCode = item.QtnCode;
								tempItemOnUI.Id = item.Id;
								tempItemOnUI.PrcItemId = item.PrcItemId;
								if (tempItemOnUI.PrcItemEvaluationId !== 2) {
									tempQuoteItems.push(tempItemOnUI);
								}
							} else if (item.PrcItemEvaluationId !== 2) {
								tempQuoteItems.push(item);
							}
						});

						let quoteItemsToCompare = tempQuoteItems;
						if (evaluation === 6) { // min value
							if (target.IsIdealBidder) {
								quoteItemsToCompare = _.filter(tempQuoteItems, function (item) {
									return item.Price !== 0;
								});
							}
							sourceQuoteItem = _.minBy(quoteItemsToCompare, 'Price');
							additional = $translate.instant('procurement.pricecomparison.prcItemEvaluationMin');
						} else if (evaluation === 7) { // max value
							if (target.IsIdealBidder) {
								quoteItemsToCompare = _.filter(tempQuoteItems, function (item) {
									return item.Price !== 0;
								});
							}
							sourceQuoteItem = _.maxBy(tempQuoteItems, 'Price');
							additional = $translate.instant('procurement.pricecomparison.prcItemEvaluationMax');
						} else if (evaluation === 9 && target.IsIdealBidder) { // min Total Price
							quoteItemsToCompare = _.filter(tempQuoteItems, function (item) {
								return item.TotalPrice !== 0;
							});
							sourceQuoteItem = _.minBy(quoteItemsToCompare, 'TotalPrice');
							additional = $translate.instant('procurement.pricecomparison.prcItemEvaluationMinDiscounted');
						}
						if (sourceQuoteItem) {
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteCode, sourceQuoteItem.QtnCode + additional);
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteId, sourceQuoteItem.Id);
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.sourcePrcItemId, sourceQuoteItem.PrcItemId);
						}
						updatePrice(entity, sourceQuoteItem, lookupMember, field, evaluation);
					});
				}

				function updatePrice(entity, sourceQuoteItem, lookupMember, field, evaluation) {
					if (!entity || !sourceQuoteItem) {
						return;
					}

					var newValue = sourceQuoteItem.PrcItemPrice || sourceQuoteItem.Price || 0;
					target.PriceOc = sourceQuoteItem.PrcItemPriceOc || sourceQuoteItem.PriceOc || 0;
					target.Price = sourceQuoteItem.PrcItemPrice || sourceQuoteItem.Price || 0;

					if (target && target.IsIdealBidder) {
						platformObjectHelper.setValue(entity, lookupMember, null);
						target.PrcItemEvaluationId = evaluation;
					} else {
						platformObjectHelper.setValue(entity, lookupMember, 8);
					}
					platformObjectHelper.setValue(entity, field, newValue);

					if (!target.IsIdealBidder) {
						itemEvaluationChanged(entity, newValue, field);
						collectQuoteModifiedFieldFromEntity(entity, entity, column);
					} else {
						target.PriceUnit = sourceQuoteItem.PrcItemPriceUnit || sourceQuoteItem.PriceUnit || 0;
						target.Discount = sourceQuoteItem.PrcItemDiscount || sourceQuoteItem.Discount || 0;
						itemEvaluationChanged(entity, newValue, field);
						// if (target.PrcPriceConditionFk !== sourceQuoteItem.PrcItemPriceConditionFk) {
						target.PrcPriceConditionFk = sourceQuoteItem.PrcItemPriceConditionFk || sourceQuoteItem.PrcPriceConditionFk || null;
						var conditions = lookupDescriptorService.getData('prcpricecondition');
						var condition = null;
						if (sourceQuoteItem.PrcItemPriceConditionFk || sourceQuoteItem.PrcPriceConditionFk) {
							condition = conditions[sourceQuoteItem.PrcItemPriceConditionFk || sourceQuoteItem.PrcPriceConditionFk];
						}
						service.selectedQuoteItem.PrcPriceConditionFk = sourceQuoteItem.PrcItemPriceConditionFk || sourceQuoteItem.PrcPriceConditionFk || null;
						handlePriceConditionChanged(entity, field, 'Id', condition, true, sourceQuoteItem, column);
					}
					collectPrcItemIdToBeCopiedByItemEvaluation(target, sourceQuoteItem.PrcItemId);
					collectItemEvaluation4IdealBidder(target, evaluation);
				}
			}

			function getQuoteFromEntity(entity, field, column) {
				if (entity) {
					var parentItem = commonHelperService.tryGetParentItem(entity, column.isVerticalCompareRows);
					if (parentItem && parentItem.QuoteItems) {
						var quoteItems = parentItem.QuoteItems;
						return _.find(quoteItems, {QuoteKey: column.isVerticalCompareRows ? column.quoteKey : field});
					}
				}
				return null;
			}

			service.initGridConfiguration = function (configColumns) {
				const isVerticalCompareRows = service.isVerticalCompareRows();
				const isLineValueColumn = service.isLineValueColumnVisible();
				const isFinalShowInTotal = service.isFinalShowInTotal();

				const columns = itemHelperService.loadColumns(itemConfigService, itemDataStructureService, configColumns, {
					columnDomainFn: domainFn,
					isVerticalCompareRows: isVerticalCompareRows,
					isLineValueColumn: isLineValueColumn,
					isFinalShowInTotal: isFinalShowInTotal
				});

				platformGridAPI.columns.configuration(service.gridId, columns);
			};

			service.isContainerUsing = function isContainerUsing(gridId) {
				return gridId ? _.includes(container.data.usingContainer, gridId) : !_.isEmpty(container.data.usingContainer);
			};

			container.data.doCallHTTPRead = function () {
				return $q.when([]).then((result) => {
					if (!service.loading) {
						$timeout(() => {
							container.data.listLoaded.fire({setTreeGridLevel: true});
						}, 1000);
					}
					return result;
				});
			};

			service.collectQuoteModifiedFieldFromEntity = collectQuoteModifiedFieldFromEntity;

			service.saveToRequisition = function (isOnlyRequisition, row, field) {
				let saveData = {
					HeaderId: row.ReqHeaderId,
					PrcItemToSave: []
				};
				let targetItem = _.find(row.QuoteItems, item => {
					return item.QuoteKey === 'QuoteCol_-1_-1_-1';
				});
				if (targetItem) {
					let saveItem = {
						PrcItemId: targetItem.PrcItemId
					};
					saveItem[field] = row[field];
					saveData.PrcItemToSave.push(saveItem);
				}

				$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/saveRequisition', saveData)
					.then(function (response) {
						if (response.data) {
							if (!isOnlyRequisition) {
								service.collectRequisitionQuoteModifiedData(row, field);
							} else {
								let targetRow = _.find(row.Children, item => {
									return item.rowType === field;
								});
								if (targetRow) {
									validatePrice(targetRow, row[field], 'QuoteCol_-1_-1_-1');
								}
							}
						}
					});
			};

			service.collectRequisitionQuoteModifiedData = function (row, field) {
				let prcItems = _.filter(row.QuoteItems, item => {
					return checkBidderService.item.isNotReference(item.QuoteKey);
				});
				let modifiedField = '';
				_.forEach(prcItems, prcItem => {
					if (field === 'ItemTypeFk') {
						prcItem[field] = row[field];
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'BasItemTypeFk';
						commonService.assignValue(localModifiedEntity, modifiedField, row[field]);
					} else if (field === 'ItemType2Fk') {
						prcItem[field] = row[field];
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'BasItemType2Fk';
						commonService.assignValue(localModifiedEntity, modifiedField, row[field]);
					} else if (field === commonService.itemCompareFields.uomFk){
						prcItem[field] = row[field];
						modifiedField = prcItem.QuoteKey +'.'+ prcItem.PrcItemId +'.'+'BasUomFk';
						commonService.assignValue(localModifiedEntity,modifiedField,row[field]);
					} else {
						prcItem[field] = row[field];
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + field;
						commonService.assignValue(localModifiedEntity, modifiedField, row[field]);
					}

					if (field === 'ItemTypeFk' && row[field] === 7) { // text element
						prcItem['Price'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'Price';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['PriceOc'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'PriceOc';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['PriceGross'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'PriceGross';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['PriceOcGross'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'PriceGrossOc';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['Quantity'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'Quantity';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['QuantityConverted'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'QuantityConverted';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['UomFk'] = 0;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'BasUomFk';
						commonService.assignValue(localModifiedEntity, modifiedField, 0);

						prcItem['ItemType2Fk'] = 1;
						modifiedField = prcItem.QuoteKey + '.' + prcItem.PrcItemId + '.' + 'BasItemType2Fk';
						commonService.assignValue(localModifiedEntity, modifiedField, 1);
					}
				});

				let data = {};
				_.map(localModifiedEntity, function(quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function(itemField, itemId) {
						return angular.extend({ Id: itemId }, itemField);
					});
				});
				service.modifiedData = data;

				prcItems = prcItems.concat(_.filter(row.QuoteItems, item => {
					return checkBidderService.item.isTarget(item.QuoteKey);
				}));

				// redrawTree
				if (field === 'ItemTypeFk' && row[field] === 7) {
					let targetRow = _.find(row.Children, item => {
						return item.rowType === 'Price';
					});
					_.forEach(prcItems, quoteItem => {
						validatePrice(targetRow, 0, quoteItem.QuoteKey);
					});
				} else {
					let targetRow = _.find(row.Children, item => {
						return item.rowType === field;
					});
					if (targetRow) {
						_.forEach(prcItems, quoteItem => {
							validatePrice(targetRow, row[field], quoteItem.QuoteKey);
						});
					}
				}
			};

			service.collectItemEvaluationModifiedDataFromWizard = function (quoteItem) {
				let field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + commonService.itemCompareFields.price;
				commonService.assignValue(localModifiedEntity, field, quoteItem.Price);

				field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + commonService.itemCompareFields.prcItemEvaluationFk;
				commonService.assignValue(localModifiedEntity, field, quoteItem.PrcItemEvaluationId);

				field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
				commonService.assignValue(localModifiedEntity, field, quoteItem.ExQtnIsEvaluated);

				field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + commonService.itemCompareFields.notSubmitted;
				commonService.assignValue(localModifiedEntity, field, quoteItem.NotSubmitted);

				// price oc
				field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + commonService.itemCompareFields.priceOc;
				commonService.assignValue(localModifiedEntity, field, quoteItem.PriceOc);

				// price gross
				field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + commonService.itemCompareFields.priceGross;
				commonService.assignValue(localModifiedEntity, field, quoteItem.PriceGross);

				// price gross oc
				field = quoteItem.QuoteKey + '.' + quoteItem.PrcItemId + '.' + 'PriceGrossOc';
				commonService.assignValue(localModifiedEntity, field, quoteItem.PriceGrossOc);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				var data = {};
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					var quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				service.modifiedData = data;
			};

			service.clearItemEvaluationRecalculateRowCache = function (modifiedData) {
				let itemTree = service.getTree();
				let isVerticalCompareRows = service.isVerticalCompareRows();
				let itemEvaluationNodes = commonService.getAllPrcItemEvaluation(itemTree, 'Children', function (item) {
					return isVerticalCompareRows ? commonHelperService.isPrcItemRow(item.LineType) : commonHelperService.getPrcCompareField(item) === commonService.itemCompareFields.prcItemEvaluationFk;
				});
				commonHelperService.clearItemEvaluationRecalculateRowCache(itemEvaluationNodes, modifiedData, isVerticalCompareRows);
			};

			mainDataService.registerListLoadStarted(function(){
				itemsSource = [];
			});

			return service;

			function mergeIdealFromSourceItem(idealBidderItem, sourceQuoteItem, allIdealItems) {
				if (!idealBidderItem || !sourceQuoteItem || !angular.isArray(allIdealItems) || allIdealItems.length === 0) {
					return;
				}
				// modify the ideal item with the new source items
				var exchangeRate = commonService.getExchangeRate(idealBidderItem.RfqHeaderId, idealBidderItem.QtnHeaderId);
				var value = sourceQuoteItem.PrcItemPriceConditionFk;
				platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.quoteCode, sourceQuoteItem.QtnCode);
				platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.quoteId, sourceQuoteItem.Id);
				platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.sourcePrcItemId, sourceQuoteItem.PrcItemId);
				idealBidderItem.Price = sourceQuoteItem.PrcItemPrice;
				idealBidderItem.PriceOc = idealBidderItem.Price * exchangeRate;
				idealBidderItem.PriceUnit = sourceQuoteItem.PrcItemPriceUnit;
				idealBidderItem.Discount = sourceQuoteItem.PrcItemDiscount;
				idealBidderItem.TotalPrice = sourceQuoteItem.PrcItemTotalPrice;
				idealBidderItem.TotalPriceOc = idealBidderItem.TotalPrice * exchangeRate;
				idealBidderItem.FactoredTotalPrice = sourceQuoteItem.FactoredPrcItemTotalPrice;
				var tempItem = angular.copy(idealBidderItem);
				tempItem.QtnHeaderId = allIdealItems[0].QtnHeaderId;
				itemHelperService.recalculatePrcItem(allIdealItems, tempItem, false);
				idealBidderItem.PrcPriceConditionFk = value;
				service.setNewConditionFk(idealBidderItem.PrcItemId, value);
				$timeout.cancel(service._loadTimerId);
				service._loadTimerId = $timeout(function () {
					service.onConditionChanged.fire(value, {
						selectedQuoteItem: idealBidderItem,
						isFromEvaluation: false,
						sourceItem4Copy: sourceQuoteItem,
						exchangeRate: exchangeRate
					});
				});
			}

			function getSourceItem4IdealItem(entity, sourceItem, quoteItemsFromParent) {
				var quoteItemsWithoutIdeal = _.map(_.filter(quoteItemsFromParent, function (item) {
					return item.QtnHeaderId > 0 && !item.IsIdealBidder;
				}), function (item) {
					return {
						QuoteId: item.QtnHeaderId,
						Id: item.PrcItemId,
						PriceOc: item.PriceOc,
						Price: item.Price,
						Discount: item.Discount,
						PriceUnit: item.PriceUnit,
						PrcPriceConditionFk: item.PrcPriceConditionFk,
						PrcItemEvaluationFk: item.PrcItemEvaluationId,
						TotalPrice: item.TotalPrice,
						TotalPriceOc: item.TotalPriceOc,
						FactoredTotalPrice: item.FactoredTotalPrice
					};
				});

				var idealItemsFromParent = _.map(_.filter(quoteItemsFromParent, function (item) {
					return item.IsIdealBidder;
				}), function (item) {
					return {
						QuoteId: item.QtnHeaderId,
						PrcItemId: item.PrcItemId,
						PrcItemEvaluationFk: item.PrcItemEvaluationId,
						PrcItemIdToBeCopied: item[commonService.itemEvaluationRelatedFields.sourcePrcItemId],
						QuoteKey: item.QuoteKey
					};
				});
				var idealBidderItem = idealItemsFromParent.length > 0 ? idealItemsFromParent[0] : null;
				var request = {
					RfqHeaderId: entity.RfqHeaderId,
					PrcItemId: sourceItem.PrcItemId,
					PriceModifiedItemList: quoteItemsWithoutIdeal,
					IdealQuoteItemInfo: idealBidderItem
				};
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/getquoteiteminfo4pricemodified', request);
			}

			function collectItemEvaluationModifiedFromCompareFields(quoteKey, itemKey, value) {
				var field = quoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.prcItemEvaluationFk;
				commonService.assignValue(localModifiedEntity, field, value);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				var data = {};
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					var quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				service.modifiedData = data;
			}
		}
	]);
})(angular);
