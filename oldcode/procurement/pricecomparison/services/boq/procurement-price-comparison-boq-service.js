(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqService', [
		'_',
		'globals',
		'$http',
		'$translate',
		'$q',
		'$timeout',
		'$injector',
		'platformDataServiceFactory',
		'PlatformMessenger',
		'platformObjectHelper',
		'platformGridAPI',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonBoqConfigService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataTreeHelper',
		'platformDataServiceModificationTrackingExtension',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonCommonService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonLineTypes',
		'boqMainLineTypes',
		'procurementPriceComparisonBoqDataStructureService',
		'mainViewService',
		'procurementPriceComparisonConfigurationService',
		'procurementContextService',
		'procurementPriceComparisonBoqHelperService',
		'prcCommonItemCalculationHelperService',
		'commonBusinessPartnerEvaluationServiceCache',
		'PriceComparisonUpdateModifiedKeyService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService',
		'basicsCostGroupAssignmentService',
		'treeStateHelperService',
		function (
			_,
			globals,
			$http,
			$translate,
			$q,
			$timeout,
			$injector,
			platformDataServiceFactory,
			PlatformMessenger,
			platformObjectHelper,
			platformGridAPI,
			mainDataService,
			boqConfigService,
			lookupDescriptorService,
			basicsLookupdataTreeHelper,
			platformDataServiceModificationTrackingExtension,
			boqCompareRows,
			commonService,
			basicsLookupdataLookupDescriptorService,
			compareLineTypes,
			boqMainLineTypes,
			boqDataStructureService,
			mainViewService,
			procurementPriceComparisonConfigurationService,
			moduleContext,
			boqHelperService,
			itemCalculationHelper,
			evaluationServiceCache,
			updateModifiedKeyService,
			commonHelperService,
			checkBidderService,
			basicsLookupdataLookupFilterService,
			platformRuntimeDataService,
			basicsCostGroupAssignmentService,
			treeStateHelperService) {

			let baseTree = [];
			let localModifiedEntity = {};
			let localIdealQuoteCopiedEntity = {};
			let reverseCalculateCompareFields = [
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
				boqCompareRows.priceGross,
				boqCompareRows.priceGrossOc
			];

			let serviceOption = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonBoqService',
					presenter: {
						tree: {parentProp: '', childProp: 'BoqItemChildren'}
					},
					entitySelection: {},
					entityRole: {
						node: {
							itemName: 'BoqComparisonData',
							parentService: mainDataService
						}
					}
				}
			};
			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;
			registerLookupFilter();

			service.gridId = '8b9a53f0a1144c03b8447a99f7b38448';
			service.name = 'procurementPriceComparisonBoqService';
			service.qtnHeaderId = null; // for wizard 'create contract'
			service.onColumnsChanged = new PlatformMessenger();
			service.dataChangeMessenger = new PlatformMessenger();
			service.onQuoteBoqSelected = new PlatformMessenger();
			service.onRowDeselected = new PlatformMessenger();
			service.onActiveCellChanged = new PlatformMessenger();
			service.onGrandTotalRankSortingChanged = new PlatformMessenger();
			service.beforeDataLoad = new PlatformMessenger();
			service.onConditionChanged = new PlatformMessenger();
			service.onCompareRowsAllowEditVisibleFieldsChanged = new PlatformMessenger();
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
			service.data = {};
			service.modifiedData = {};
			container.data.forceNodeItemCreation = true;
			service.selectedQuoteBoq = null;
			service.onLineValueColumnVisibleChanged = new PlatformMessenger();
			service.onVerticalCompareRowsChanged = new PlatformMessenger();
			service.onListLoaded = new PlatformMessenger();
			service.beforeRecalculateTree = new PlatformMessenger();
			// note: override 'getTree()' to set data source for the tree exactly.
			service.getTree = function getTree() {
				return baseTree;
			};

			service.doDeselect = function () {
				service.selectedQuoteBoq = null;
				service.currentEnterCell = null;
				return service.deselect().then(function () {
					service.onRowDeselected.fire();
				});
			};

			service.clearBoqConfigData = function () {
				boqConfigService.rfqHeadersCache = [];
				boqConfigService.originalFieldsCache = []; // will delete?

				boqConfigService.visibleCompareColumnsCache = [];
				boqConfigService.showInSummaryCompareRowsCache = [];
				boqConfigService.visibleCompareRowsCache = [];
				boqConfigService.leadingFieldCache = '';

				boqConfigService.boqLineTypeNameCache = {};
				boqConfigService.generalTypesCache = {};

				boqConfigService.quoteCharacteristicCache = [];
				boqConfigService.rfqCharacteristicCache = [];
				boqConfigService.allQuoteCharacteristicCache = [];
				boqConfigService.allRfqCharacteristicCache = [];
				boqConfigService.childrenCharacterCache = [];
			};

			service.reorderCompareColumns = function (items) {
				boqHelperService.reorderCompareColumns(boqConfigService, items);
			};

			service.getData = function () {
				let readData = {
					rfqHeaderId: mainDataService.getIfSelectedIdElse(-1),
					compareType: commonService.constant.compareType.boqItem,
					CompareQuoteRows: service.getCustomSettingsCompareQuoteRows(),
					CompareBillingSchemaRows: service.getCustomSettingsCompareBillingSchemaRows(),
					CompareRows: service.getCustomSettingsCompareRows(),
					CompareBaseColumns: service.getCustomSettingsCompareColumns(),
					RecalculateDisabled: !service.isCalculateAsPerAdjustedQuantity() && globals['loadBoQWithRecalculateDisabled'] !== false,
					IsCalculateAsPerAdjustedQuantity: service.isCalculateAsPerAdjustedQuantity()
				};
				service.loading = true;
				return boqHelperService.loadData(readData, boqConfigService, boqDataStructureService, {
					serviceData: service.data,
					childProp: serviceOption.hierarchicalNodeItem.presenter.tree.childProp,
					onReadSuccess: function (items) {
						commonHelperService.updateCompareConfig(items, service.getCustomSettingsCompareRows(), service.getCustomSettingsCompareBillingSchemaRows(), service.getCustomSettingsCompareQuoteRows(), commonService.constant.compareType.boqItem);
						service.loading = false;
					},
					isVerticalCompareRows: service.isVerticalCompareRows(),
					isFinalShowInTotal: service.isFinalShowInTotal()
				});

			};

			service.loadData = function loadData() {
				service.beforeDataLoad.fire();
				service.doDeselect(); // remove the current selected row
				baseTree = [];
				localModifiedEntity = {};
				localIdealQuoteCopiedEntity = {};
				service.modifiedData = {}; // clear data when reload data
				commonService.boqModifiedData = {};
				service.idealQuoteCopiedData = {};
				service.originalQuoteItems = [];

				// reset grid data
				platformGridAPI.items.data(service.gridId, []);

				if (!mainDataService.hasSelection()) {
					return;
				}

				service.clearBoqConfigData();
				boqDataStructureService.setBoqCompareFields(service.getCustomSettingsCompareRows());

				let recalculateCallback = function (itemTreeAfterHandle) {
					let selected = service.getSelected();

					service.reorderCompareColumns(itemTreeAfterHandle);
					// redraw the tree
					drawTree(itemTreeAfterHandle);

					// keep the selected item and selected cell after the tree redraw
					if (selected) {
						platformGridAPI.rows.selection({
							gridId: service.gridId,
							rows: [selected],
							nextEnter: service.currentEnterCell
						});
					}
				};

				service.getData().then(function (items) {
					if (!_.isEmpty(items)){
						treeStateHelperService.processNodeList(items, commonService.constant.compareType.boqItem, service.gridId);
					}

					// update common change data
					commonService.updateChangeData(service.updateAsExchangeRateChange);
					service.reorderCompareColumns(items);
					drawTree(items);
					boqHelperService.setFirstEvaluation(items, boqConfigService, boqDataStructureService, serviceOption.hierarchicalNodeItem.presenter.tree.childProp, recalculateCallback, service.isVerticalCompareRows());

					service.trySyncQuoteEvaluation();
					service.onColumnsChanged.fire();
					service.onListLoaded.fire();
					container.data.listLoaded.fire({setTreeGridLevel: true});
				});
			};

			service.onCellEditable = function (args) {

				let quoteKey = args.column.isVerticalCompareRows ? args.column.quoteKey : args.column.field;
				let qtnStatus = commonService.getQtnStatusById(boqConfigService.boqQtnMatchCache, quoteKey, args.item.RfqHeaderId);
				let rowQuoteItem = commonService.getRowQuoteBoqItem(args.item, quoteKey);
				if (qtnStatus && qtnStatus.IsReadonly) {
					return false;
				}
				let compareField = commonHelperService.getBoqCompareField(args.item, args.column);
				// IsProtected = true, readonly,
				// and the AllowEditVisibleFields should not be effected by this factor
				if (qtnStatus && qtnStatus.IsProtected && commonHelperService.isBoqRow(args.item.BoqLineTypeFk) && !_.includes(commonService.boqAllowEditVisibleFields, compareField)) {
					return false;
				}

				if (args.column.isIdealBidder && commonHelperService.isBoqCompareCellEditable(args.item, args.column)) {
					return compareField === boqCompareRows.prcItemEvaluationFk;
				}

				if (commonHelperService.isBoqCompareCellEditable(args.item, args.column)) {
					if (_.includes(commonService.boqAllowEditVisibleFields, compareField)) {
						let compareRowsSetting = this.getCustomSettingsCompareRows();
						let targetField = _.find(compareRowsSetting, {Field: compareField});

						if (_.includes(commonService.unitRateBreakDownFields, compareField)) {
							let structure = boqDataStructureService.getBoqHeaderStructureWithNameUrb();
							switch (compareField) {
								case boqCompareRows.urBreakdown1:
									return !!(structure && structure.NameUrb1);
								case boqCompareRows.urBreakdown2:
									return !!(structure && structure.NameUrb2);
								case boqCompareRows.urBreakdown3:
									return !!(structure && structure.NameUrb3);
								case boqCompareRows.urBreakdown4:
									return !!(structure && structure.NameUrb4);
								case boqCompareRows.urBreakdown5:
									return !!(structure && structure.NameUrb5);
								case boqCompareRows.urBreakdown6:
									return !!(structure && structure.NameUrb6);
							}
						}
						// when the boqItem isUrb, price can not be edited.
						if (_.includes([boqCompareRows.price, boqCompareRows.priceOc, boqCompareRows.finalPrice, boqCompareRows.finalPriceOc], compareField)) {
							if (rowQuoteItem.IsUrb) {
								return false;
							}
						}

						if(!targetField || !targetField.AllowEdit){
							return false;
						}

						if (compareField === boqCompareRows.lumpsumPrice) {
							return rowQuoteItem && rowQuoteItem.IsLumpsum;
						}

						if(compareField === boqCompareRows.quantityAdj){
							return !rowQuoteItem.HasMultipleSplitQuantities;
						}

						return true;
					}
					return true;
				} else if (args.item.BoqLineTypeFk === compareLineTypes.characteristic &&
					args.item.CharacteristicTypeId !== 1 && args.item[args.column.field + '_$hasBidder'] === true) {
					return true;
				} else if (args.item.BoqLineTypeFk === compareLineTypes.quoteExchangeRate) {
					return commonService.exchangeRateReadonly(boqConfigService.boqQtnMatchCache, quoteKey, args.item.RfqHeaderId, args.column.isVerticalCompareRows);
				} else if (((args.item.BoqLineTypeFk === compareLineTypes.quoteUserDefined || args.item.BoqLineTypeFk === compareLineTypes.quoteRemark) && args.column.field === quoteKey)
					&& checkBidderService.boq.isNotReference(quoteKey)) {
					return true;
				} else if (args.item.BoqLineTypeFk === compareLineTypes.generalItem && checkBidderService.boq.isNotReference(quoteKey) && !args.column.isVerticalCompareRows) {
					return true;
				} else if (args.item.BoqLineTypeFk === compareLineTypes.prcItem && _.some(args.item.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'}) && !commonHelperService.isBidderColumn(args.column)) {
					return true;
				} else if ((args.item.BoqLineTypeFk === compareLineTypes.quotePaymentTermPA || args.item.BoqLineTypeFk === compareLineTypes.quotePaymentTermFI) && checkBidderService.item.isNotReference(quoteKey)) {
					return true;
				}
				return false;
			};

			service.saveCustomSettings2DB = function (createData) {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.saveCustomSettings2DB(configurationFk, commonService.constant.compareType.boqItem, createData).then(function () {
					service.loadData();
				});
			};

			service.getCustomSettingsCompareQuoteRows = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareQuoteRows(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.getCustomSettingsCompareQuoteRowsAsync = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareQuoteRowsAsync(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.getCustomSettingsCompareBillingSchemaRows = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareBillingSchemaRows(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.getCustomSettingsCompareBillingSchemaRowsAsync = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareBillingSchemaRowsAsync(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.getCustomSettingsCompareRows = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareRows(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.getCustomSettingsCompareColumns = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareColumns(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.getCustomSettingsCompareRowsAsync = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				let boqStructure = boqDataStructureService.getBoqHeaderStructureWithNameUrb() || {};
				return procurementPriceComparisonConfigurationService.getCustomSettingsCompareRowsAsync(configurationFk, commonService.constant.compareType.boqItem).then(function (compareRows) {
					_.forEach(compareRows, function (item) {
						if (_.includes(commonService.unitRateBreakDownFields, item.Field)) {
							switch (item.Field) {
								case  boqCompareRows.urBreakdown1:
									if (boqStructure.NameUrb1) {
										angular.extend(item, {
											DisplayName: item.UserLabelName || boqStructure.NameUrb1,
											FieldName: boqStructure.NameUrb1
										});
									}
									break;
								case  boqCompareRows.urBreakdown2:
									if (boqStructure.NameUrb2) {
										angular.extend(item, {
											DisplayName: item.UserLabelName || boqStructure.NameUrb2,
											FieldName: boqStructure.NameUrb2
										});
									}
									break;
								case  boqCompareRows.urBreakdown3:
									if (boqStructure.NameUrb3) {
										angular.extend(item, {
											DisplayName: item.UserLabelName || boqStructure.NameUrb3,
											FieldName: boqStructure.NameUrb3
										});
									}
									break;
								case  boqCompareRows.urBreakdown4:
									if (boqStructure.NameUrb4) {
										angular.extend(item, {
											DisplayName: item.UserLabelName || boqStructure.NameUrb4,
											FieldName: boqStructure.NameUrb4
										});
									}
									break;
								case  boqCompareRows.urBreakdown5:
									if (boqStructure.NameUrb5) {
										angular.extend(item, {
											DisplayName: item.UserLabelName || boqStructure.NameUrb5,
											FieldName: boqStructure.NameUrb5
										});
									}
									break;
								case  boqCompareRows.urBreakdown6:
									if (boqStructure.NameUrb6) {
										angular.extend(item, {
											DisplayName: item.UserLabelName || boqStructure.NameUrb6,
											FieldName: boqStructure.NameUrb6
										});
									}
									break;
							}
						}
					});
					return compareRows;
				});
			};

			service.getCustomSettingsTypeSummaryFields = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.getTypeSummaryCompareFields(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.isVerticalCompareRows = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isVerticalCompareRows(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.isCalculateAsPerAdjustedQuantity = function (){
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isCalculateAsPerAdjustedQuantity(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.isLineValueColumnVisible = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isLineValueColumnVisible(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.isFinalShowInTotal = function () {
				let configurationFk = getSelectedItemConfigurationFk();
				return procurementPriceComparisonConfigurationService.isFinalShowInTotal(configurationFk, commonService.constant.compareType.boqItem);
			};

			service.reloadLatestQuotes = function reloadLatestQuotes() {
				if (mainDataService.hasSelection()) {
					let obj = {};
					let baseInfo = commonService.getBaseRfqInfo();
					obj.rfqHeaderFk = baseInfo.baseRfqId;
					obj.compareType = commonService.constant.compareType.boqItem;

					$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/reload', obj).then(function (response) {
						if (response.data) {
							service.loadData();
						}
					});
				}
			};

			/**
			 * [ {columnTitle: xxx, columnField: xxx, comparingValues: [ {title: value} ] } ]
			 */
			service.getDataForGraphicalEvaluation = function getDataForGraphicalEvaluation(activeColumn) {
				let datas = [];

				if (!service.hasSelection()) {
					return datas;
				}

				let selectedItem = service.getSelected();
				_.map(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
					let data = {
						columnTitle: commonService.translateTargetOrBaseBoqName(visibleColumn.Id) || visibleColumn.Description,
						columnField: visibleColumn.Id,
						comparingValues: []
					};

					// always has grand total values for chart container.
					let grandTotalItem = _.head(service.getTree());
					if (grandTotalItem && grandTotalItem.BoqLineTypeFk === compareLineTypes.grandTotal) {
						let comparingValue = {
							title: $translate.instant('procurement.pricecomparison.compareGrandTotal'),
							value: grandTotalItem.totals[visibleColumn.Id]
						};
						data.comparingValues.push(comparingValue);
					}

					if (selectedItem.BoqLineTypeFk === compareLineTypes.rfq) {
						let comparingValue2 = {
							title: $translate.instant('procurement.pricecomparison.compareRfqTotal'),
							value: selectedItem.totals[visibleColumn.Id]
						};
						data.comparingValues.push(comparingValue2);
					} else if (selectedItem.BoqLineTypeFk === compareLineTypes.requisition) {
						let reqTotalShowInSummaryRows = _.filter(angular.copy(boqConfigService.showInSummaryCompareRowsCache), function (row) {
							return _.includes([boqCompareRows.finalPrice, boqCompareRows.rank, boqCompareRows.percentage], row.Field);
						});

						_.map(reqTotalShowInSummaryRows, function (summaryRow) {
							let comparingValue = {
								title: summaryRow.DisplayName,
								value: null
							};
							if (summaryRow.Field === boqCompareRows.percentage) {
								comparingValue.value = selectedItem.percentages[visibleColumn.Id];
							} else if (summaryRow.Field === boqCompareRows.rank) {
								comparingValue.value = selectedItem.ranks[visibleColumn.Id];
							} else {
								comparingValue.title = $translate.instant('procurement.pricecomparison.compareTotal');
								comparingValue.value = selectedItem.totals[visibleColumn.Id];
							}
							data.comparingValues.push(comparingValue);
						});
					} else if (commonHelperService.isBoqRow(selectedItem.BoqLineTypeFk) && !activeColumn.isVerticalCompareRows) {
						_.map(boqConfigService.showInSummaryCompareRowsCache, function (summaryRow) {
							let comparingValue = {
								title: summaryRow.DisplayName,
								value: null
							};
							if (summaryRow.Field === boqCompareRows.percentage) {
								comparingValue.value = selectedItem.percentages[visibleColumn.Id];
							} else if (summaryRow.Field === boqCompareRows.rank) {
								comparingValue.value = selectedItem.ranks[visibleColumn.Id];
							} else {
								let quoteItem = _.find(selectedItem.QuoteItems, {QuoteKey: visibleColumn.Id});
								comparingValue.value = quoteItem ? quoteItem[summaryRow.Field] : 0;
							}

							data.comparingValues.push(comparingValue);
						});
					} else if (((commonHelperService.isBoqRow(selectedItem.BoqLineTypeFk) && activeColumn.isVerticalCompareRows) || selectedItem.BoqLineTypeFk === compareLineTypes.compareField) &&
						!_.includes([boqCompareRows.commentContractor, boqCompareRows.commentClient, boqCompareRows.prcItemEvaluationFk, boqCompareRows.alternativeBid], commonHelperService.getBoqCompareField(selectedItem, activeColumn))) {

						let compareField = commonHelperService.getBoqCompareField(selectedItem, activeColumn);
						let summaryRow = _.find(boqConfigService.visibleCompareRowsCache, {Field: compareField});
						let parentItem = commonHelperService.tryGetParentItem(selectedItem, activeColumn.isVerticalCompareRows);
						let quoteItem = null;
						let obj = {
							title: summaryRow ? summaryRow.DisplayName : null,
							value: null
						};
						let isMatched = false;
						if (commonHelperService.isBoqPositionRow(selectedItem.BoqLineTypeFk)) {
							if (compareField === boqCompareRows.percentage) {
								obj.value = parentItem.percentages[visibleColumn.Id];
								isMatched = true;
							} else if (compareField === boqCompareRows.rank) {
								obj.value = parentItem.ranks[visibleColumn.Id];
								isMatched = true;
							} else {
								quoteItem = parentItem ? _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.Id}) : null;
							}
						} else if (commonHelperService.isBoqLevelRow(selectedItem.BoqLineTypeFk)) {
							if (commonHelperService.isIncludedCompareRowOnBoqLevel(compareField)) {
								quoteItem = parentItem ? _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.Id}) : null;
							}
						} else {
							if (commonHelperService.isIncludedCompareRowOnBoqRoot(compareField)) {
								quoteItem = parentItem ? _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.Id}) : null;
							}
						}
						if (quoteItem) {
							obj.value = quoteItem ? quoteItem[compareField] : 0;
							isMatched = true;
						}
						if (isMatched) {
							data.comparingValues.push(obj);
						}
					} else if (_.includes(commonService.boqSummaryFileds, selectedItem.BoqLineTypeFk)) {
						data.comparingValues.push({
							title: selectedItem.CompareDescription,
							value: selectedItem[visibleColumn.Id]
						});
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
			 *   11: [                     //quoteId
			 *          {
			 *               Id: 101,      //FieldName: FeildValue
			 *               Price: 20,    //FieldName: FeildValue
			 *               Discount: 5   //FieldName: FeildValue
			 *          }
			 *       ]
			 *   12: [ {Id: 201, Price: 31, Discount: 10}, {Id: 202, Price: 32, Cost: 200} ]
			 * }
			 *
			 * */
			service.collectQuoteModifiedField = function (argsBeforeValueChanged, args) {
				let column = args.grid.getColumns()[argsBeforeValueChanged.cell];
				collectQuoteModifiedFieldFromEntity(argsBeforeValueChanged.item, args.item, column);
			};

			function collectQuoteModifiedFieldFromEntity(entityBeforeValueChange, entity, column) {

				let ownQuoteKey = null;
				let itemKey = null;
				let itemConfig = null;
				let quoteKey = '';
				let quote = null;
				let calValue = null;
				let parentItem = commonHelperService.tryGetParentItem(entity, service.isVerticalCompareRows());
				let compareField = commonHelperService.getBoqCompareField(entity, column);
				let itemEvalField = null;
				let itemEvalValue = null;

				if (!parentItem || !compareField) {
					return;
				}

				let quoteKeys = parentItem && parentItem.QuoteItems ? _.map(parentItem.QuoteItems, 'QuoteKey') : [];

				quoteKey = service.isVerticalCompareRows() ? column.quoteKey : column.field;
				if (entityBeforeValueChange) {
					let boqList = boqConfigService.boqQtnMatchCache[entityBeforeValueChange.RfqHeaderId];
					itemConfig = _.find(boqList, function (item) {
						return item.QuoteKey === quoteKey && item.OwnQuoteKey;
					});
					ownQuoteKey = itemConfig ? itemConfig.OwnQuoteKey : quoteKey;
					quote = _.find(parentItem.QuoteItems, {QuoteKey: ownQuoteKey});
					itemKey = (quote || {}).BoqItemId; // key
				}

				let field = ownQuoteKey + '.' + itemKey + '.' + compareField;
				let priceOcField = null;
				let priceOcValue = null;
				let value = entity[column.field];
				// collect 'Price' value when item evaluation changed.
				if (compareField === boqCompareRows.prcItemEvaluationFk) {
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.price;
					itemEvalField = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.prcItemEvaluationFk;
					itemEvalValue = service.isVerticalCompareRows() ? entity[ownQuoteKey + '_PrcItemEvaluationFk_$' + commonService.itemCompareFields.prcItemEvaluationFk]
						: entity[ownQuoteKey + '_$' + commonService.itemCompareFields.prcItemEvaluationFk];
					priceOcField = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.priceOc;
					priceOcValue = entity[column.field] * commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, itemEvalField, itemEvalValue);
					commonService.assignValue(localModifiedEntity, priceOcField, priceOcValue);

					let exQtnIsEvaluated = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
					let isEvaluated = !_.includes([1, 2, 8], itemEvalValue);
					commonService.assignValue(localModifiedEntity, exQtnIsEvaluated, isEvaluated);

					let includeChecked = itemEvalValue === 2;
					commonHelperService.setCompareFieldReadOnly(service, commonService.constant.compareType.boqItem, parentItem, quoteKey, entity.Id, boqCompareRows.included, includeChecked);

					let notSubmittedChecked = value === 0;
					commonHelperService.setCompareFieldReadOnly(service, commonService.constant.compareType.boqItem, parentItem, quoteKey, entity.Id, boqCompareRows.notSubmitted, notSubmittedChecked);
				}

				if (entity && compareField === boqCompareRows.bidderComments) {
					let bidCommModified = commonService.boqModifiedData[compareField] || [];
					let bidderCommentId = entity[column.field + '_Id'];
					let bidderComment = _.find(bidCommModified, function (modified) {
						return modified.Field === compareField && modified.BoqItemFk === itemKey &&
							modified.Id === bidderCommentId && modified.ComplCaption === entity.ComplCaption;
					});

					let matchedKey = _.find(quoteKeys, function (key) {
						return entity[key + '_Id'];
					});
					let matchedItem = _.find(parentItem.QuoteItems, function (item) {
						return item.QuoteKey === matchedKey;
					});
					let targetValue = entity[matchedKey + '_Id'];
					let targetItem = matchedItem && matchedItem['TextComplement'] ? _.find(matchedItem['TextComplement'], {Id: targetValue}) : null;
					let assignValues = targetItem ? {
						ComplType: targetItem.ComplType,
						SpecificationType: targetItem.SpecificationType
					} : null;

					if (bidderComment) {
						bidderComment.ComplBody = value;
						Object.assign(bidderComment, assignValues);
					} else {
						bidderComment = {
							BoqHeaderFk: quote ? quote.BoqHeaderId : null,
							BoqItemFk: itemKey,
							Id: bidderCommentId,
							Field: compareField,
							ComplCaption: entity.ComplCaption,
							ComplBody: value
						};
						Object.assign(bidderComment, assignValues);
						bidCommModified.push(bidderComment);
						commonService.boqModifiedData[compareField] = bidCommModified;
					}
					return;
				}
				if (_.includes(commonService.unitRateBreakDownFields, compareField)) {
					// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
					commonService.assignValue(localModifiedEntity, field, value);
					// UrbOc
					field = ownQuoteKey + '.' + itemKey + '.' + compareField + 'Oc';
					calValue = entity[column.field] * commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, field, calValue);
				}

				if (_.includes(reverseCalculateCompareFields, compareField) || _.includes(commonService.unitRateBreakDownFields, compareField)) {
					// priceOc
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.priceOc;
					calValue = quote[boqCompareRows.price] * commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, field, calValue);

					// price
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.price;
					value = quote[boqCompareRows.price];
				}

				if (compareField === boqCompareRows.isLumpsum) {
					let lumpsumField = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.lumpsumPrice;
					let lumpsumValue = quote[boqCompareRows.lumpsumPrice];
					commonService.assignValue(localModifiedEntity, lumpsumField, lumpsumValue);
				}

				// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
				commonService.assignValue(localModifiedEntity, field, value);

				if (compareField === boqCompareRows.price) {
					// priceOc
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.priceOc;
					calValue = entity[column.field] * commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, field, calValue);
				}

				if (compareField === boqCompareRows.priceOc) {
					// price
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.price;
					calValue = entity[column.field] / commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, field, calValue);
				}

				if (compareField === boqCompareRows.discount) {
					// discountOc
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.discountOc;
					calValue = entity[column.field] * commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, field, calValue);
				}

				if (compareField === boqCompareRows.discountOc) {
					// discount
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.discount;
					calValue = entity[column.field] / commonService.getExchangeRate(entityBeforeValueChange.RfqHeaderId, null, quoteKey);
					commonService.assignValue(localModifiedEntity, field, calValue);
				}

				if (value && (compareField === boqCompareRows.notSubmitted || compareField === boqCompareRows.included)) {
					// price
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.price;
					commonService.assignValue(localModifiedEntity, field, 0);

					// priceOc
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.priceOc;
					commonService.assignValue(localModifiedEntity, field, 0);

					if (compareField === boqCompareRows.included) {
						// prcItemEvaluationFk
						field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.prcItemEvaluationFk;
						commonService.assignValue(localModifiedEntity, field, 2);
					}

					// is evaluated
					field = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
					commonService.assignValue(localModifiedEntity, field, 0);
				}

				let Urbs = [boqCompareRows.urBreakdown1, boqCompareRows.urBreakdown2, boqCompareRows.urBreakdown3, boqCompareRows.urBreakdown4, boqCompareRows.urBreakdown5, boqCompareRows.urBreakdown6];
				if (_.includes([boqCompareRows.price, boqCompareRows.priceOc], compareField) || _.includes(Urbs, compareField)) {
					let checked = false;
					if (_.includes(Urbs, compareField)) {
						_.forEach(parentItem.BoqItemChildren, function (item) {
							if (_.indexOf(item.Id, itemKey + '_' + 'Urb') > -1) {
								value = value + item[quoteKey];
							}
						});
					}

					let notSubmittedField = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.notSubmitted;
					commonService.assignValue(localModifiedEntity, notSubmittedField, checked);
					commonHelperService.setCompareFieldReadOnly(service, commonService.constant.compareType.boqItem, parentItem, quoteKey, entity.Id, boqCompareRows.notSubmitted, checked);

					let includedField = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.included;
					commonService.assignValue(localModifiedEntity, includedField, checked);
					commonHelperService.setCompareFieldReadOnly(service, commonService.constant.compareType.boqItem, parentItem, quoteKey, entity.Id, boqCompareRows.included, checked);

					let exQtnIsEvaluated = ownQuoteKey + '.' + itemKey + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
					commonService.assignValue(localModifiedEntity, exQtnIsEvaluated, false);
				}

				let boqModifiedData = _.get(localModifiedEntity, ownQuoteKey + '.' + itemKey);
				let modifiedKeys = _.keys(boqModifiedData);
				if (_.includes(modifiedKeys, boqCompareRows.price) || _.includes(modifiedKeys, boqCompareRows.priceOc)) {
					let extraAssignProps = [boqCompareRows.priceGross, boqCompareRows.priceGrossOc];
					_.each(extraAssignProps, function (prop) {
						let props = prop.split(':');
						commonService.assignValue(localModifiedEntity, ownQuoteKey + '.' + itemKey + '.' + props[0], quote[props[1] || props[0]]);
					});
				}

				if (compareField === boqCompareRows.uomFk) {
					field = ownQuoteKey + '.' + itemKey + '.' + 'BasUomFk';
					commonService.assignValue(localModifiedEntity, field, value);
				}

				if(compareField === boqCompareRows.quantityAdj){
					field = ownQuoteKey + '.' + itemKey + '.' + boqCompareRows.quantityAdjDetail;
					commonService.assignValue(localModifiedEntity, field, value);
				}

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				let boqData = {};
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					boqData[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				if (service.idealQuoteCopiedData) {
					let boqKey = quote ? quote.BoqHeaderId + '_' + itemKey : '';
					_.map(service.idealQuoteCopiedData, function (quoteKeys) {
						_.remove(quoteKeys, function (item) {
							return item.BoqId === boqKey;
						});
					});
				}

				service.modifiedData = boqData;
			}

			service.collectQuoteModifiedFieldFromEntity = collectQuoteModifiedFieldFromEntity;

			/**
			 * @param entity object => currency changed object
			 * @param quoteKey string => base QTN key
			 * @param ownQuoteKey string => own QTN key
			 * @param exchangeRate number
			 * @param updateExchangeRate bool => true: the call function from register
			 */
			service.updateAsExchangeRateChange = function (entity, quoteKey, ownQuoteKey, exchangeRate, updateExchangeRate) {
				let itemTree = service.getTree();
				let currencyRfq = _.find(itemTree, function (item) {
					return item.BoqLineTypeFk === compareLineTypes.rfq && item.RfqHeaderId === entity.RfqHeaderId;
				});

				if (currencyRfq) {
					commonService.updateAsExchangeRateChange(service, currencyRfq, serviceOption.hierarchicalNodeItem.presenter.tree.childProp,
						'BoqLineTypeFk', 'BoqItemId', localModifiedEntity, service.recalculateList, entity, quoteKey, ownQuoteKey, exchangeRate, updateExchangeRate, service.isVerticalCompareRows());

				}
			};

			service.updateDiscountAmountField = function(entity, ownQuoteKey, discountPercent, discountAmount, discountAmountOc){
				let boqTree = service.getTree();
				let boqItemList = commonHelperService.flatTree(boqTree, 'BoqItemChildren')
				let quoteRow = _.find(boqItemList, item => item.Id === entity.ParentId);

				let percentDiscountRow = _.find(quoteRow.BoqItemChildren, item => item.BoqLineTypeFk === compareLineTypes.discountPercent);
				if (percentDiscountRow){
					percentDiscountRow[ownQuoteKey] = discountPercent;
				}
				let discountAmountRow = _.find(quoteRow.BoqItemChildren, item => item.BoqLineTypeFk === compareLineTypes.discountAmount);
				if (discountAmountRow){
					discountAmountRow[ownQuoteKey] = discountAmount;
				}
				let discountAmountOcRow = _.find(quoteRow.BoqItemChildren, item => item.BoqLineTypeFk === compareLineTypes.discountAmountOc);
				if (discountAmountOcRow){
					discountAmountOcRow[ownQuoteKey] = discountAmountOc;
				}
				service.redrawTree(true, service.currentEnterCell);
			}

			/**
			 * save the modified quote data (header plain texts, boq compare fields) to the orginal or a new version quote.
			 */
			service.saveToQuote = function saveToQuote(isNewVersion, qtnSourceTarget, isFromNewVersion, isSaveAll) {
				let allQuoteIds = [];
				if (isNewVersion && isSaveAll) {
					_.forEach(boqConfigService.visibleCompareColumnsCache, function (boq) {
						allQuoteIds.push(boq.QuoteHeaderId);
					});
				}
				return service.checkModifiedState(isNewVersion).then(function (result) {
					if (result.hasModified || (isNewVersion && isSaveAll)) {
						let saveData = result.saveData;
						let modifiedData = service.modifiedData;
						// for save all qtn
						saveData.AllQuoteIds = allQuoteIds;

						if (isNewVersion && commonService.PrcGeneralsToSave) {
							let generalQuoteIds = _.map(commonService.PrcGeneralsToSave, 'QuoteHeaderId');
							saveData.AllQuoteIds = saveData.AllQuoteIds.concat(generalQuoteIds);
						}

						if (_.isObject(qtnSourceTarget)) {
							updateModifiedKeyService.updateModifiedKey(saveData, commonService.constant.compareType.boqItem, qtnSourceTarget);
							modifiedData = saveData.ModifiedData;
						}

						return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/save?isNewVersion=' + isNewVersion, saveData).then(function (response) {
							if (response.data) {
								localModifiedEntity = {};
								localIdealQuoteCopiedEntity = {};
								let otherService = $injector.get('procurementPriceComparisonItemService');
								delete otherService.modifiedData.characteristic;
								service.modifiedData = {}; // clear data when save successfully
								service.idealQuoteCopiedData = {};
								service.originalQuoteItems = [];
								commonService.boqModifiedData = {};
								commonService.clearData();
								service.clearItemEvaluationRecalculateRowCache(saveData.ModifiedData);
								treeStateHelperService.cleanNodesCache(commonService.constant.compareType.boqItem);
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
											commonHelperService.recalculateBillingSchema(service, service.selectedQuote.QtnHeaderId, exchangeRate, {}, {}, otherService.modifiedData, service.modifiedData);
										}
									}
								}

								if (!_.isEmpty(response.data.PrcHeaderBlobToSave)) {
									let headerPlainTextService = $injector.get('procurementPriceComparisonHeaderPlainTextService');
									headerPlainTextService.mergeInUpdateData(response.data);
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

			service.recombineTreeByOptions = function (dataTree) {

				let summaryTypes = service.getCustomSettingsTypeSummaryFields();

				boqHelperService.recombineTreeByOptions(dataTree, summaryTypes, boqDataStructureService, boqConfigService);

				baseTree = dataTree;

				return baseTree;
			};

			function drawTree(itemList, isRedraw) {
				let isVerticalCompareRows = service.isVerticalCompareRows();
				if (!isRedraw) {
					platformGridAPI.grids.columnGrouping(service.gridId, false);
					let configColumns = commonHelperService.getColumnsFromViewConfig(service.gridId);
					let allColumns = boqConfigService.getAllColumns();
					let costGroupColumns = basicsCostGroupAssignmentService.createCostGroupColumns(boqConfigService.costGroupCats || [], false);
					allColumns = allColumns.concat(costGroupColumns);
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

					service.recombineTreeByOptions(itemList);

					platformGridAPI.items.data(service.gridId, baseTree);
					platformGridAPI.grids.resize(service.gridId);
				}
				if (!isRedraw && isVerticalCompareRows) {
					platformGridAPI.grids.columnGrouping(service.gridId, true);
				}
			}

			service.getDefaultColumns = function () {
				let commonColumns = angular.copy(boqConfigService.getCommonColumns());
				let commonColumns2 = angular.copy(boqConfigService.getCommonColumns2());
				let lineNameColumn = angular.copy(boqConfigService.getLineNameColumn());
				// get compare 'description' column (using the custom 'description' value).
				let compareDescriptionColumn = angular.copy(boqConfigService.getCompareDescriptionColumnByCustomSettings());
				let maxMinAverageColumns = angular.copy(boqConfigService.getMaxMinAverageColumns());

				return commonColumns.concat(lineNameColumn).concat(compareDescriptionColumn).concat(maxMinAverageColumns).concat(commonColumns2);
			};

			// when the change of evaluation container Points, reset the qtn evaluation result and rank.Then redraw tree
			service.resetEvaluationValue = function (evaluationHeader, targetQuote, isRefreshGrid) {
				let evaluationPoints = Math.round((evaluationHeader ? evaluationHeader.Points : 0) * 100) / 100;
				let isEvaluationChange = commonService.resetEvaluationValue(service, evaluationPoints, targetQuote, 'BoqItemChildren', 'BoqLineTypeFk', 'RefreshItemEvaluation', true, boqConfigService.visibleCompareColumnsCache);
				if (isEvaluationChange) {
					if (_.isUndefined(isRefreshGrid) || isRefreshGrid) {
						service.redrawTree(true, service.currentEnterCell);
					}
				}
			};

			// when the change of Billing Schema result, reset compare field value.Then redraw tree
			service.resetBillingSchemaValue = function (billingSchemaTypeList, selectedQuote, billingSchemas) {
				commonService.resetBillingSchemaValue(billingSchemaTypeList, selectedQuote, service, boqConfigService.boqQtnMatchCache, 'BoqItemChildren', 'BoqLineTypeFk', 'RefreshItemBillingSchema', true, boqConfigService.visibleCompareColumnsCache, billingSchemas);
			};

			/**
			 * @param isNoNeedRecalculate: for the sub container changed (evaluation and billing schema: true)
			 * @param selectDefaultCell: the selected cell, for the sub container changed (others almost is null)
			 */
			service.redrawTree = function redrawTree(isNoNeedRecalculate, selectDefaultCell) {
				let cell;
				let itemTree = service.getTree();
				let selected = service.getSelected() || service.currentRow;

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

			service.domainFn = function domainFn(row, col) {
				let compareFiled = commonHelperService.getBoqCompareField(row, col);
				if (compareFiled === boqCompareRows.prcItemEvaluationFk) {
					let filterKey = col.isIdealBidder ? 'procurement-pricecomparison-ideal-boq-prcitemevaluationfk-filter' : 'procurement-pricecomparison-boq-prcitemevaluationfk-filter';
					col.editorOptions = {
						lookupDirective: 'procurement-pricecomparison-prc-item-evaluation-combobox',
						lookupOptions: {
							lookupMember: col.field + '_$PrcItemEvaluationFk',
							getPrcItemEvaluation: commonService.getPrcItemEvaluation,
							getPriceByPrcItemEvaluation: function (prcItemEvaluationFk, field, entity) {
								if (!service.hasSelection() && !entity) {
									return;
								}
								// cache the original values of compare field before recalculation by the selected evaluation item
								let selectedRow = service.getSelected() ? service.getSelected() : entity;
								return boqHelperService.getPriceByPrcItemEvaluation(prcItemEvaluationFk, field, selectedRow, boqDataStructureService, service.isVerticalCompareRows());
							},
							updateQuoteItemPrice: function (entity, sourceQuoteItemOrEvalValue, lookupMember, field) {
								updateQuoteItemPriceForEvaluation(entity, sourceQuoteItemOrEvalValue, lookupMember, field, col);
							},
							entityType: 'boq',
							showClearButton: !col.isIdealBidder,
							markAsModified: function (entityBeforeValueChange, entity) {
								collectQuoteModifiedFieldFromEntity(entityBeforeValueChange, entity, col);
							},
							itemEvaluationChanged: itemEvaluationChanged
						}
					};
					col.validator = validatePrice;
					if (filterKey) {
						col.editorOptions.lookupOptions.filterKey = filterKey;
					}
				} else if (row.BoqLineTypeFk === compareLineTypes.quoteRemark) {
					col.editorOptions = {
						lookupDirective: 'show-draw-down-text-directive',
						lookupOptions: {
							lookupMember: col.field
						}
					};
				} else if (compareFiled === boqCompareRows.quantity) {
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
				} else if (compareFiled === boqCompareRows.alternativeBid) {
					col.editorOptions = {
						lookupDirective: 'procurement-price-comparison-basicsitemtype85-combobox',
						lookupType: 'PrcItemType85'
					};
					col.validator = null;
				} else if (_.includes([boqCompareRows.commentContractor, boqCompareRows.commentClient, boqCompareRows.commentClient], compareFiled)) {
					col.validator = null;
					col.editorOptions = null;
				} else if (compareFiled === boqCompareRows.uomFk) {
					col.editorOptions = {
						lookupDirective: 'basics-lookupdata-uom-lookup',
						lookupType: 'PCUom'
					};
					col.validator = validateUomFk;
				} else if (compareFiled === commonService.quoteCompareFields.paymentTermPA || compareFiled === commonService.quoteCompareFields.paymentTermFI
					|| row.BoqLineTypeFk === compareLineTypes.quotePaymentTermPA || row.BoqLineTypeFk === compareLineTypes.quotePaymentTermFI) {
					col.editorOptions = {
						lookupDirective: 'basics-lookupdata-payment-term-lookup',
						lookupType: 'PaymentTerm',
						lookupOptions: {
							showClearButton: true
						}
					};
					col.validator = null;
				} else if (_.includes(commonService.boqAllowEditVisibleFields, compareFiled) && compareFiled !== boqCompareRows.priceOc) {
					col.validator = function (entity, value, field) {
						const parentItem = commonHelperService.tryGetParentItem(entity, col.isVerticalCompareRows);
						const quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: field}) || {};
						const exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
						if(_.includes(commonService.boqNeedRemovePriceConditionFields, compareFiled)) {
							service.onCompareRowsAllowEditVisibleFieldsChanged.fire({
								selectedQuoteBoq: quoteItem,
								exchangeRate: exchangeRate
							});
						}
						validatePrice(entity, value, field);
					};
					col.editorOptions = null;
				} else if (_.includes(commonService.boqEditableCompareFields, compareFiled)) {
					col.validator = validatePrice;
					col.editorOptions = null;
				}
			};

			function handlePriceConditionChanged(entity, field, lookupMember, selectedItem, isFromEvaluation, sourceItem4Copy, column) {
				$timeout.cancel(service._loadTimerId);
				let exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
				service._loadTimerId = $timeout(function () {
					let value = null,
						parentItem = commonHelperService.tryGetParentItem(entity, column.isVerticalCompareRows);
					if (selectedItem) {
						value = selectedItem[lookupMember];
					}
					let quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: field}) || {};

					service.setNewConditionFk(quoteItem.BoqItemId, value);

					if (quoteItem && !quoteItem.IsIdealBidder) {
						let idealQuoteItems = _.filter(parentItem.QuoteItems, function (i) {
							return i.IsIdealBidder && quoteItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && quoteItem.BoqItemId === i[commonService.itemEvaluationRelatedFields.sourcePrcItemId];
						});
						if (angular.isArray(idealQuoteItems) && idealQuoteItems.length > 0) {
							_.forEach(idealQuoteItems, function (idealQuoteItem) {
								idealQuoteItem.PrcPriceConditionFk = value;
								service.setNewConditionFk(idealQuoteItem.BoqItemId, value);
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

			function appendDataToSaveOriginal(entity, originalQuoteItems, field, evaluationFk) {
				if (entity.BoqLineTypeFk !== 0 && entity.parentItem && entity.parentItem.BoqItemChildren) {
					let childBoQs = _.filter(entity.parentItem.BoqItemChildren, function (item) {
						return item.BoqLineTypeFk === 0;
					});
					let boqIdInQuote = [];
					if (childBoQs) {
						_.forEach(childBoQs, function (boq) {
							if (boq.QuoteItems) {
								let quote = _.find(boq.QuoteItems, function (quote) {
									if (quote.QuoteKey === field) {
										return quote;
									}
								});
								if (quote) {
									boqIdInQuote.push(quote.BoqItemId);
								}
							}
						});
					}
					if (boqIdInQuote && boqIdInQuote.length > 0) {
						_.forEach(boqIdInQuote, function (id) {
							_.forEach(originalQuoteItems, function (originalQuote) {
								if (originalQuote.BoqItemId === id) {
									let boqId = originalQuote.BoqHeaderId + '_' + originalQuote.BoqItemId;
									let boqItemIdToBeCopied = originalQuote['EvaluationSourceBoqHeaderId'] + '_' + originalQuote['EvaluationSourceBoqItemId'];
									if (!Object.hasOwn(service.idealQuoteCopiedData, originalQuote.QtnHeaderId)) {
										service.idealQuoteCopiedData[originalQuote.QtnHeaderId] = [{
											'BoqId': boqId,
											'BoqItemIdToBeCopied': boqItemIdToBeCopied,
											'PrcItemEvaluationFk': evaluationFk
										}];
									} else {
										if (!_.some(service.idealQuoteCopiedData[originalQuote.QtnHeaderId], function (had) {
											return had.BoqId === boqId && had.BoqItemIdToBeCopied === boqItemIdToBeCopied;
										})) {
											service.idealQuoteCopiedData[originalQuote.QtnHeaderId].push({
												'BoqId': boqId,
												'BoqItemIdToBeCopied': boqItemIdToBeCopied,
												'PrcItemEvaluationFk': evaluationFk
											});
										}
									}
								}
							});
						});
					}
				}
			}

			function validatePrice(entity, value, field) {
				// collect the modified quote item.
				let columnInfo = commonHelperService.extractCompareInfoFromFieldName(field);
				let isVerticalCompareRows = columnInfo.isVerticalCompareRows;
				let compareField = isVerticalCompareRows ? columnInfo.field : commonHelperService.getBoqCompareField(entity);
				let parentItem = commonHelperService.tryGetParentItem(entity, isVerticalCompareRows);
				let modifiedItems = commonService.getCompareModifications(entity, value, columnInfo.quoteKey, serviceOption.hierarchicalNodeItem.presenter.tree.childProp, field, compareField, isVerticalCompareRows)(service.getTree());
				let modifiedItem = _.find(modifiedItems, {QuoteKey: field});

				// change PrcItemEvaluationFk row value to 'Guessed' (id = 8) because user changed the Price now.
				if (compareField === boqCompareRows.price || _.includes(commonService.boqDataToPriceFields, compareField) && !!parentItem) {
					let hasItemEvaluation = _.find(boqConfigService.visibleCompareRowsCache, {Field: boqCompareRows.prcItemEvaluationFk});
					if (hasItemEvaluation) {
						const validRow = (parentItem.BoqItemChildren ? _.find(parentItem.BoqItemChildren, {rowType: boqCompareRows.prcItemEvaluationFk}) : null);
						let prcItemEvalRow = isVerticalCompareRows ? entity : validRow;
						if (prcItemEvalRow) {
							let item = _.find(parentItem.QuoteItems, {QuoteKey: columnInfo.quoteKey});
							let property = (isVerticalCompareRows ? commonHelperService.getCombineCompareField(columnInfo.quoteKey, boqCompareRows.prcItemEvaluationFk) : field) + '_$PrcItemEvaluationFk';
							if (!Object.hasOwn(prcItemEvalRow, property) || prcItemEvalRow[property] !== 8) {
								prcItemEvalRow[property] = 8;
								if (item) {
									item.PrcItemEvaluationId = 8;
									collectItemEvaluationModifiedFromCompareFields(columnInfo.quoteKey, item.BoqItemId, 8);
								}
							}
						}
					}

					// update modifiedItems prcItemEvaluationId
					if (modifiedItem){
						modifiedItem.PrcItemEvaluationId = 8;
						modifiedItem.ExQtnIsEvaluated = false;

						modifiedItem.EvaluationQuoteId = 0;
						modifiedItem.EvaluationSourceBoqHeaderId = 0;
						modifiedItem.EvaluationSourceBoqItemId = 0;
						modifiedItem.EvaluationQuoteCode = null;
					}
				}

				if (compareField === boqCompareRows.prcItemEvaluationFk && value === 0 && !!parentItem) {
					if (modifiedItem && modifiedItem.PrcItemEvaluationId === 1) { // empty
						modifiedItem.ExQtnIsEvaluated = false;
					}
				}

				if (compareField === boqCompareRows.notSubmitted || compareField === boqCompareRows.included){
					if (value){
						if (modifiedItem) { // empty
							modifiedItem.ExQtnIsEvaluated = false;

							modifiedItem.EvaluationQuoteId = 0;
							modifiedItem.EvaluationSourceBoqHeaderId = 0;
							modifiedItem.EvaluationSourceBoqItemId = 0;
							modifiedItem.EvaluationQuoteCode = null;
						}
					}
				}

				// recalculate the old boq tree in server-side, then update the old boq tree.
				if (modifiedItems && modifiedItems.length && value !== null && value !== undefined) {
					let itemTree = service.getTree();
					let quoteItems = parentItem.QuoteItems;
					let originalQuoteItems = _.filter(commonService.getAllQuoteItems(itemTree, serviceOption.hierarchicalNodeItem.presenter.tree.childProp), function (i) {
						return i.QuoteKey === columnInfo.quoteKey;
					});
					service.originalQuoteItems = originalQuoteItems;

					let idealQuoteItems = [];
					let idealItemsFromParent = _.filter(parentItem.QuoteItems, function (item) {
						return item.IsIdealBidder;
					});
					let idealBidderItem = _.isArray(idealItemsFromParent) && idealItemsFromParent.length > 0 ? idealItemsFromParent[0] : null;

					if (_.includes(commonService.boqDataToPriceFields, compareField)) {
						_.each(modifiedItems, function (modifyItem) {
							if (_.includes([boqCompareRows.priceGross, boqCompareRows.priceGrossOc], compareField)) {
								let quoteHeader = commonHelperService.tryGetQuoteHeader(modifyItem.QtnHeaderId);
								if (quoteHeader) {
									let taxCodeFk = commonHelperService.tryGetTaxCodeFK(entity, itemTree, columnInfo.quoteKey, 'BoqItemChildren', quoteHeader.TaxCodeFk);
									let currTaxCode = commonHelperService.tryGetTaxCodeFromMatrix(taxCodeFk, quoteHeader.BpdVatGroupFk);
									let vatPercent = currTaxCode ? currTaxCode.VatPercent : 0;
									if (compareField === boqCompareRows.priceGross) {
										boqHelperService.calPriceOrPriceOcByGross(modifyItem, vatPercent, quoteHeader.ExchangeRate, true);
									}
									if (compareField === boqCompareRows.priceGrossOc) {
										boqHelperService.calPriceOrPriceOcByGross(modifyItem, vatPercent, quoteHeader.ExchangeRate, false);
									}
								}
							}
							let source = _.find(originalQuoteItems, {
								QuoteKey: modifyItem.QuoteKey,
								BoqItemId: modifyItem.BoqItemId
							});
							if (source) {
								source.Price = modifyItem.Price;
							}
						});
					}

					// collapse other item
					_.forEach(itemTree, function (item) {
						if (item.RfqHeaderId !== parentItem.RfqHeaderId) {
							item.nodeInfo.collapsed = true;
						}
					});

					// recalculate Boq Item tree.
					service.beforeRecalculateTree.fire(modifiedItems);
					let calModifiedPromise = boqHelperService.recalculateNoSave(service, modifiedItems, originalQuoteItems, itemTree, boqDataStructureService, service.isCalculateAsPerAdjustedQuantity());
					updateUI(calModifiedPromise).then(function () {
						parentItem = commonHelperService.tryGetParentItem(entity, isVerticalCompareRows);
						modifiedItems = commonService.getCompareModifications(entity, value, columnInfo.quoteKey, serviceOption.hierarchicalNodeItem.presenter.tree.childProp, field, compareField, isVerticalCompareRows)(service.getTree());

						_.each(modifiedItems, function (modifyItem) {
							if (!modifyItem.IsIdealBidder) {

								let idealQuoteItemOfItemModified = modifyItem.IsIdealBidder ? null : _.find(quoteItems, function (i) {
									return i.IsIdealBidder &&
										modifyItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] &&
										modifyItem.BoqHeaderId === i[commonService.itemEvaluationRelatedFields.sourceBoqHeaderId] &&
										modifyItem.BoqItemId === i[commonService.itemEvaluationRelatedFields.sourceBoqItemId];
								});

								getSourceItem4IdealItem(entity, modifyItem, parentItem.QuoteItems).then(function (response) {
									if (!response || !response.data || !response.data['QuoteItemInfo']) {
										return;
									}

									// case 1: the item modified is assigned to ideal bidder. And the source item and ideal item are on UI.
									// case 2: the item modified is not assigned to ideal item but the ideal item is on UI;
									// case 3: the ideal bidder is not shown on UI;
									// case 4: no ideal bidder exists.
									let sourceQuoteItem = response.data['QuoteItemInfo'];
									let idealInfo = response.data['IdealBidderItemInfo']; // null - no new source item needs to assign to ideal bidder item; not null - new source item needs to assign to ideal bidder item

									if (idealQuoteItemOfItemModified) { // case 1: the item modified is assigned to ideal bidder. And the source item and ideal item are on UI.

										if (!idealInfo) { // no new source item needs to assign to ideal bidder item
											mergeIdealFromSourceItem(idealBidderItem, modifyItem);
											idealQuoteItems.push(idealBidderItem);
										} else {  // new source item needs to assign to ideal bidder item
											mergeIdealFromSourceItem(idealBidderItem, sourceQuoteItem, true);
											idealQuoteItems.push(idealBidderItem);
											collectBoqItemIdToBeCopiedByItemEvaluation(idealBidderItem, idealInfo.BoqHeaderIdToBeCopied + '_' + idealInfo.BoqItemIdToBeCopied);
											collectItemEvaluation4IdealBidder(idealBidderItem, idealBidderItem.PrcItemEvaluationId);
										}
									} else {
										if (idealBidderItem) { // case 2: the item modified is not assigned to ideal item but the ideal item is on UI
											if (idealInfo) { // new source item needs to assign to ideal bidder item
												mergeIdealFromSourceItem(idealBidderItem, sourceQuoteItem, true);
												idealQuoteItems.push(idealBidderItem);
												collectBoqItemIdToBeCopiedByItemEvaluation(idealBidderItem, idealInfo.BoqHeaderIdToBeCopied + '_' + idealInfo.BoqItemIdToBeCopied);
												collectItemEvaluation4IdealBidder(idealBidderItem, idealBidderItem.PrcItemEvaluationId);
											}
										} else if (idealInfo) { // case 3: the ideal bidder is not shown on UI and the ideal bidder item exist.
											collectBoqItemIdToBeCopiedByItemEvaluation(idealInfo, idealInfo.BoqHeaderIdToBeCopied + '_' + idealInfo.BoqItemIdToBeCopied);
											collectItemEvaluation4IdealBidder(idealBidderItem, idealBidderItem.PrcItemEvaluationId);
										}
									}
								}).finally(function () {
									let calIdealPromise = null;
									if (idealQuoteItems && idealQuoteItems.length > 0) {
										let idealQuoteKey = idealQuoteItems[0].QuoteKey;
										let idealOriginalQuoteItems = _.filter(commonService.getAllQuoteItems(itemTree, serviceOption.hierarchicalNodeItem.presenter.tree.childProp), function (i) {
											return i.QuoteKey === idealQuoteKey;
										});
										calIdealPromise = boqHelperService.recalculateNoSave(service, idealQuoteItems, idealOriginalQuoteItems, itemTree, boqDataStructureService, service.isCalculateAsPerAdjustedQuantity());
										updateUI(calIdealPromise);
									}
								});
							}
						});
					});
				}

				if(compareField === boqCompareRows.quantityAdj) {
					if (modifiedItem) {
						modifiedItem.QuantityAdjDetail = value ? value.toString() : '';
					}
				}

				function updateUI(promise) {
					return promise.then(function (itemTreeAfterHandle) {
						if (itemTreeAfterHandle) {
							let selected = service.getSelected();

							drawTree(itemTreeAfterHandle, true);
							// keep the selected item and selected cell after the tree redraw
							if (selected) {
								platformGridAPI.rows.selection({
									gridId: service.gridId,
									rows: [selected],
									nextEnter: service.currentEnterCell
								});
							}
						}
						return true;
					});
				}
			}

			function validateUomFk(entity, value, field) {
				let columnInfo = commonHelperService.extractCompareInfoFromFieldName(field),
					isVerticalCompareRows = columnInfo.isVerticalCompareRows,
					compareField = isVerticalCompareRows ? columnInfo.field : commonHelperService.getBoqCompareField(entity);
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
							BoqItemId: modifyItem.BoqItemId
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
			 * @param field
			 * @param customBoqItems
			 */
			service.recalculateList = function recalculateList(field, customBoqItems) {
				let itemTree = service.getTree();
				let originalQuoteItems = _.filter(commonService.getAllQuoteItems(itemTree, serviceOption.hierarchicalNodeItem.presenter.tree.childProp), function (i) {
					return i.QuoteKey === field;
				});
				if (!originalQuoteItems || originalQuoteItems.length === 0) {
					drawTree(itemTree, true);
					return;
				}
				if (!customBoqItems) {
					customBoqItems = originalQuoteItems;
				}
				boqHelperService.recalculateNoSave(service, customBoqItems, originalQuoteItems, itemTree, boqDataStructureService, service.isCalculateAsPerAdjustedQuantity()).then(function (itemTreeAfterHandle) {
					let selected = service.getSelected();

					drawTree(itemTreeAfterHandle, true);

					// keep the selected item and selected cell after the tree redraw
					if (selected) {
						platformGridAPI.rows.selection({
							gridId: service.gridId,
							rows: [selected],
							nextEnter: service.currentEnterCell
						});
					}
				});
			};

			function getSelectedItemConfigurationFk() {
				let configurationFk = null, selectItem = mainDataService.getSelected();
				if (selectItem) {
					configurationFk = selectItem.PrcConfigurationFk;
				}
				return configurationFk;
			}

			boqConfigService.needUpdate.register(onNeedUpdate);

			service.checkModifiedState = function (isNewVersion) {
				let result = {
					hasModified: false,
					modifiedData: service.modifiedData,
					saveData: null
				};
				let updateData = platformDataServiceModificationTrackingExtension.getModifications(mainDataService);
				if (mainDataService.doPrepareUpdateCall) {
					result.saveData = mainDataService.doPrepareUpdateCall(updateData, result.modifiedData, service.idealQuoteCopiedData);
				}

				if (!result.saveData || _.isEmpty(result.saveData)) {
					return $q.when(result);
				}

				let emptyCheckItems = [
					result.saveData.BoqItemToSave,
					result.saveData.PrcHeaderBlobToSave,
					result.saveData.PrcHeaderBlobToDelete,
					result.saveData.ModifiedData,
					result.saveData.IdealQuoteCopiedData,
					result.saveData.BillingSchemaToSave,
					result.saveData.BillingSchemaToDelete,
					commonService.boqModifiedData,
					result.saveData.ModifiedQuote,
					result.saveData.PrcGeneralsToSave
				];

				let emptyCheckItemsForOriginalVersion = [
					result.saveData.BusinessPartnerEvaluationToSave,
					result.saveData.BusinessPartnerEvaluationToDelete,
					result.saveData.EvaluationDocumentToSave,
					result.saveData.EvaluationDocumentToDelete,
					result.saveData.PrcGeneralsToSave
				];

				if (_.some(emptyCheckItems, v => !_.isEmpty(v)) || (!isNewVersion && _.some(emptyCheckItemsForOriginalVersion, v => !_.isEmpty(v)))) {
					result.hasModified = true;
				}
				return $q.when(result);
			};

			service.trySyncQuoteEvaluation = function () {
				let selectedRfq = mainDataService.getSelected();
				if (!selectedRfq) {
					return;
				}
				let quotes = boqConfigService.boqQtnMatchCache[selectedRfq.Id];
				let evaluationSchemaFk = selectedRfq.EvaluationSchemaFk;
				let isChanged = false;
				_.each(quotes, function (quote) {
					if (checkBidderService.boq.isNotReference(quote.QuoteKey)) {
						let syncResult = mainDataService.trySyncQuoteEvaluation(quote.QtnHeaderId, evaluationSchemaFk, quote.EvaluationList);
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

			service.initGridConfiguration = function (configColumns) {
				let isVerticalCompareRows = service.isVerticalCompareRows();
				let isLineValueColumn = service.isLineValueColumnVisible();
				let isFinalShowInTotal = service.isFinalShowInTotal();

				let columns = boqHelperService.loadColumns(boqConfigService, boqDataStructureService, configColumns, {
					columnDomainFn: service.domainFn,
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

			service.saveToRequisition = function (isOnlyRequisition, row, field) {
				let saveData = {
					HeaderId: row.ReqHeaderId,
					BoqItemToSave: []
				};
				let targetItem = _.find(row.QuoteItems, item => {
					return item.QuoteKey === 'QuoteCol_-1_-1_-1';
				});
				if (targetItem) {
					let saveItem = {
						BoqItemId: targetItem.BoqItemId
					};
					saveItem[field] = row[field];
					saveData.BoqItemToSave.push(saveItem);
				}
				$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/saveRequisition', saveData).then(function (response) {
					if (response.data) {
						if (!isOnlyRequisition) {
							service.collectRequisitionQuoteModifiedData(row, field);
						} else {
							let targetRow = _.find(row.BoqItemChildren, item => {
								return item.rowType === field;
							});
							if (targetRow) {
								validatePrice(targetRow, row[field], 'QuoteCol_-1_-1_-1');
							}
						}
					}
				});
			};

			service.collectRequisitionQuoteModifiedData = function (row, field){
				let boqItems = _.filter(row.QuoteItems, item => {
					return checkBidderService.boq.isNotReference(item.QuoteKey);
				});
				_.forEach(boqItems, boqItem => {
					boqItem[field] = row[field];
					let modifiedField = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + field;
					commonService.assignValue(localModifiedEntity, modifiedField, row[field]);
					if (field === 'UomFk'){
						modifiedField = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + 'BasUomFk';
						commonService.assignValue(localModifiedEntity, modifiedField, row[field]);
					}
				});

				let data = {};
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});
				service.modifiedData = data;

				boqItems = boqItems.concat(_.filter(row.QuoteItems, item => {
					return checkBidderService.boq.isTarget(item.QuoteKey);
				}));

				// recalculate all boqItems
				let targetRow = _.find(row.BoqItemChildren, item => {
					return item.rowType === field;
				});
				if (targetRow) {
					_.forEach(boqItems, quoteItem => {
						validatePrice(targetRow, row[field], quoteItem.QuoteKey);
					});
				}
			};

			service.collectBoqEvaluationModifiedDataFromWizard = function (boqItem, rfqHeaderId) {
				let field = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + commonService.itemCompareFields.price;
				commonService.assignValue(localModifiedEntity, field, boqItem.Price);

				field = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + commonService.itemCompareFields.prcItemEvaluationFk;
				commonService.assignValue(localModifiedEntity, field, boqItem.PrcItemEvaluationId);

				field = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + commonService.itemCompareFields.exQtnIsEvaluated;
				commonService.assignValue(localModifiedEntity, field, boqItem.ExQtnIsEvaluated);

				field = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + boqCompareRows.priceOc;
				let priceOcValue = boqItem.Price * commonService.getExchangeRate(rfqHeaderId, null, boqItem.QuoteKey);
				commonService.assignValue(localModifiedEntity, field, priceOcValue);

				field = boqItem.QuoteKey + '.' + boqItem.BoqItemId + '.' + boqCompareRows.included;
				commonService.assignValue(localModifiedEntity, field, boqItem.Included);

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
				let itemEvaluationNodes = commonService.getAllPrcItemEvaluation(itemTree, 'BoqItemChildren', function (item) {
					return isVerticalCompareRows ? commonHelperService.isBoqPositionRow(item.BoqLineTypeFk) : commonHelperService.getBoqCompareField(item) === commonService.itemCompareFields.prcItemEvaluationFk;
				});
				commonHelperService.clearItemEvaluationRecalculateRowCache(itemEvaluationNodes, modifiedData, isVerticalCompareRows);
			};

			service._conditionCache = {};
			service.setNewConditionFk = function (boqItemId, value) {
				service._conditionCache[boqItemId] = value;
			};
			service.getNewConditionFk = function (boqItemId) {
				return service._conditionCache[boqItemId];
			};
			service.clearNewConditionFk = function () {
				service._conditionCache = {};
			};
			service.collectFieldValueByPriceConditions = function (customQuoteItem, fieldValue, columnField) {
				let field = customQuoteItem.QuoteKey + '.' + customQuoteItem.BoqItemId + '.' + columnField;
				commonService.assignValue(localModifiedEntity, field, fieldValue);
				let data = {};
				_.map(localModifiedEntity, function(quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function(itemField, itemId) {
						return angular.extend({ Id: itemId }, itemField);
					});
				});
				service.modifiedData = data;
			};

			mainDataService.registerListLoadStarted(function(){
				baseTree = [];
			});

			return service;

			function onNeedUpdate() {
				service.loadData();
			}

			function registerLookupFilter() {
				let filter = [
					{
						key: 'procurement-pricecomparison-ideal-boq-prcitemevaluationfk-filter',
						serverSide: true,
						fn: function () {
							return 'Id == 6 || Id == 7 || Id == 9'; // id == 6 --> Minimum; id == 7 --> Maximum
						}
					},
					{
						key: 'procurement-pricecomparison-boq-prcitemevaluationfk-filter',
						serverSide: true,
						fn: function () {
							return 'Id != 9';
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}

			function updateQuoteItemPriceForEvaluation(entity, sourceQuoteItemOrEvalValue, lookupMember, field, column) {
				let target = getQuoteFromEntity(entity, field, column);

				if (!sourceQuoteItemOrEvalValue || !target) {
					return;
				}

				let sourceQuoteItem = null;
				if (_.isObject(sourceQuoteItemOrEvalValue)) {
					sourceQuoteItem = sourceQuoteItemOrEvalValue;
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteCode, sourceQuoteItem.QtnCode);
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteId, sourceQuoteItem.Id);
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.sourceBoqHeaderId, sourceQuoteItem.BoqHeaderId);
					platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.sourceBoqItemId, sourceQuoteItem.BoqItemId);
					let tempItemOnUI = getQuoteFromEntity(entity, sourceQuoteItem.QuoteKey, {
						isVerticalCompareRows: column.isVerticalCompareRows,
						quoteKey: sourceQuoteItem.QuoteKey
					});
					if (tempItemOnUI) {
						tempItemOnUI = angular.copy(tempItemOnUI);
						tempItemOnUI.QtnCode = sourceQuoteItem.QtnCode;
						tempItemOnUI.Id = sourceQuoteItem.Id;
						tempItemOnUI.BoqHeaderId = sourceQuoteItem.BoqHeaderId;
						tempItemOnUI.BoqItemId = sourceQuoteItem.BoqItemId;
					}
					updatePrice(entity, tempItemOnUI || sourceQuoteItem, lookupMember, field, null);
				} else if (_.isNumber(sourceQuoteItemOrEvalValue)) {
					let evaluation = sourceQuoteItemOrEvalValue;
					let dataService = $injector.get('procurementPriceComparisonOtherQuoteItemDialogDataService');
					let quoteItemService = dataService.getService('boq');
					let filter = {
						boqHeaderId: target.BoqHeaderId,
						boqItemId: target.BoqItemId,
						reqHeaderId: target.ReqHeaderId,
						rfqHeaderId: entity.RfqHeaderId
					};
					quoteItemService.loadByFilter(filter).then(function (quoteItems) {
						if (!quoteItems) {
							return;
						}
						let additional = '';
						let tempQuoteItems = [];

						_.forEach(quoteItems, function (item) {
							let itemOnUI = getQuoteFromEntity(entity, item.QuoteKey, {
								isVerticalCompareRows: column.isVerticalCompareRows,
								quoteKey: item.Quote
							});
							if (itemOnUI) {
								let tempItemOnUI = angular.copy(itemOnUI);
								tempItemOnUI.QtnCode = item.QtnCode;
								tempItemOnUI.Id = item.Id;
								tempItemOnUI.BoqHeaderId = item.BoqHeaderId;
								tempItemOnUI.BoqItemId = item.BoqItemId;
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
							sourceQuoteItem = _.maxBy(quoteItemsToCompare, 'Price');
							additional = $translate.instant('procurement.pricecomparison.prcItemEvaluationMax');
						} else if (evaluation === 9 && target.IsIdealBidder) { // min Discounted Unit Price
							quoteItemsToCompare = _.filter(tempQuoteItems, function (item) {
								return item.TotalPrice !== 0;
							});
							sourceQuoteItem = _.minBy(quoteItemsToCompare, 'DiscountedUnitprice');
							additional = $translate.instant('procurement.pricecomparison.prcItemEvaluationMinDiscounted');
						}
						if (sourceQuoteItem) {
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteCode, sourceQuoteItem.QtnCode + additional);
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.quoteId, sourceQuoteItem.Id);
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.sourceBoqHeaderId, sourceQuoteItem.BoqHeaderId);
							platformObjectHelper.setValue(target, commonService.itemEvaluationRelatedFields.sourceBoqItemId, sourceQuoteItem.BoqItemId);
						}
						updatePrice(entity, sourceQuoteItem, lookupMember, field, evaluation);
					});
				}

				function updatePrice(entity, sourceQuoteItem, lookupMember, field, evaluation) {
					if (!entity || !sourceQuoteItem) {
						return;
					}

					let newValue = sourceQuoteItem['BoqItemPrice'] || sourceQuoteItem.Price || 0;
					target.PriceOc = sourceQuoteItem['BoqItemPriceOc'] || sourceQuoteItem.PriceOc || 0;
					target.Price = sourceQuoteItem['BoqItemPrice'] || sourceQuoteItem.Price || 0;

					if (target && target.IsIdealBidder) {
						platformObjectHelper.setValue(entity, lookupMember, null);
						target.PrcItemEvaluationId = evaluation;
					} else {
						platformObjectHelper.setValue(entity, lookupMember, evaluation);
						target.PrcItemEvaluationId = evaluation;
					}
					platformObjectHelper.setValue(entity, field, newValue);

					if (!target.IsIdealBidder) {
						itemEvaluationChanged(entity, newValue, field);
						collectQuoteModifiedFieldFromEntity(entity, entity, column);
					} else {
						itemEvaluationChanged(entity, newValue, field, true);
					}
					collectBoqItemIdToBeCopiedByItemEvaluation(target, sourceQuoteItem.BoqHeaderId + '_' + sourceQuoteItem.BoqItemId);
					collectItemEvaluation4IdealBidder(target, evaluation);
					// #132749
					appendDataToSaveOriginal(entity, service.originalQuoteItems, field, evaluation);
				}
			}

			function getQuoteFromEntity(entity, field, column) {
				if (entity) {
					let parentItem = commonHelperService.tryGetParentItem(entity, column.isVerticalCompareRows);
					if (parentItem && parentItem.QuoteItems) {
						let quoteItems = parentItem.QuoteItems;
						return _.find(quoteItems, {QuoteKey: column.isVerticalCompareRows ? column.quoteKey : field});
					}
				}
				return null;
			}

			function itemEvaluationChanged(entity, value, field, cannotRedraw) {
				validatePrice(entity, value, field, cannotRedraw);
			}

			function collectBoqItemIdToBeCopiedByItemEvaluation(customQuoteItem, fieldValue) {
				if (!customQuoteItem) {
					return;
				}
				let boqKey = customQuoteItem.BoqHeaderId + '_' + customQuoteItem.BoqItemId;
				let field = customQuoteItem.QuoteKey + '.' + boqKey + '.BoqItemIdToBeCopied';

				// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
				_.map(localModifiedEntity, function (quoteKeys) {
					_.map(quoteKeys, function (itemField, itemId) {
						if (itemId === customQuoteItem.BoqItemId) {
							delete quoteKeys[customQuoteItem.BoqItemId];
						}
					});
				});
				commonService.assignValue(localIdealQuoteCopiedEntity, field, fieldValue);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				let data = {};
				_.map(localIdealQuoteCopiedEntity, function (quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({BoqId: itemId}, itemField);
					});
				});

				service.idealQuoteCopiedData = data;
			}

			function collectItemEvaluation4IdealBidder(customQuoteItem, fieldValue) {
				if (!customQuoteItem || !customQuoteItem.IsIdealBidder) {
					return;
				}
				let boqKey = customQuoteItem.BoqHeaderId + '_' + customQuoteItem.BoqItemId;
				let field = customQuoteItem.QuoteKey + '.' + boqKey + '.PrcItemEvaluationFk';

				// assign the field value to the object (a.b.c) ==> entity = quoteId.itemId.field = 20
				_.map(localModifiedEntity, function (quoteKeys) {
					_.map(quoteKeys, function (itemField, itemId) {
						if (itemId === customQuoteItem.BoqItemId) {
							delete quoteKeys[customQuoteItem.BoqItemId];
						}
					});
				});

				commonService.assignValue(localIdealQuoteCopiedEntity, field, fieldValue);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				let data = {};
				_.map(localIdealQuoteCopiedEntity, function (quoteKeys, quoteKey) {
					var quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({BoqId: itemId}, itemField);
					});
				});

				service.idealQuoteCopiedData = data;
			}

			function mergeIdealFromSourceItem(idealBidderItem, sourceQuoteItem, isUpdateQtn) {
				if (!idealBidderItem || !sourceQuoteItem) {
					return;
				}
				idealBidderItem.Price = sourceQuoteItem.BoqItemPrice || sourceQuoteItem.Price;
				idealBidderItem[boqCompareRows.priceOc] = sourceQuoteItem.BoqItemPriceOc || sourceQuoteItem.PriceOc;
				idealBidderItem[boqCompareRows.finalPrice] = sourceQuoteItem[boqCompareRows.finalPrice];
				idealBidderItem[boqCompareRows.finalPriceOc] = sourceQuoteItem[boqCompareRows.finalPriceOc];
				idealBidderItem[boqCompareRows.urBreakdown1] = sourceQuoteItem[boqCompareRows.urBreakdown1];
				idealBidderItem[boqCompareRows.urBreakdown2] = sourceQuoteItem[boqCompareRows.urBreakdown2];
				idealBidderItem[boqCompareRows.urBreakdown3] = sourceQuoteItem[boqCompareRows.urBreakdown3];
				idealBidderItem[boqCompareRows.urBreakdown4] = sourceQuoteItem[boqCompareRows.urBreakdown4];
				idealBidderItem[boqCompareRows.urBreakdown5] = sourceQuoteItem[boqCompareRows.urBreakdown5];
				idealBidderItem[boqCompareRows.urBreakdown6] = sourceQuoteItem[boqCompareRows.urBreakdown6];
				idealBidderItem[boqCompareRows.cost] = sourceQuoteItem[boqCompareRows.cost];
				idealBidderItem[boqCompareRows.quantity] = sourceQuoteItem[boqCompareRows.quantity];
				idealBidderItem[boqCompareRows.discountPercent] = sourceQuoteItem[boqCompareRows.discountPercent];
				idealBidderItem[boqCompareRows.unitRateFrom] = sourceQuoteItem[boqCompareRows.unitRateFrom];
				idealBidderItem[boqCompareRows.unitRateTo] = sourceQuoteItem[boqCompareRows.unitRateTo];
				idealBidderItem[boqCompareRows.discount] = sourceQuoteItem[boqCompareRows.discount];
				idealBidderItem[boqCompareRows.discountPercentIT] = sourceQuoteItem[boqCompareRows.discountPercentIT];
				idealBidderItem[boqCompareRows.lumpsumPrice] = sourceQuoteItem[boqCompareRows.lumpsumPrice];
				idealBidderItem[boqCompareRows.isLumpsum] = sourceQuoteItem[boqCompareRows.isLumpsum];
				idealBidderItem[boqCompareRows.discountedUnitPrice] = sourceQuoteItem[boqCompareRows.discountedUnitPrice];
				idealBidderItem.DiscountedUnitpriceOc = sourceQuoteItem.DiscountedUnitpriceOc;
				if (isUpdateQtn) {
					platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.quoteCode, sourceQuoteItem.QtnCode);
					platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.quoteId, sourceQuoteItem.Id);
					platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.sourceBoqHeaderId, sourceQuoteItem.BoqHeaderId);
					platformObjectHelper.setValue(idealBidderItem, commonService.itemEvaluationRelatedFields.sourceBoqItemId, sourceQuoteItem.BoqItemId);
				}
			}

			function getSourceItem4IdealItem(entity, sourceItem, quoteItemsFromParent) {
				let quoteItemsWithoutIdeal = _.map(_.filter(quoteItemsFromParent, function (item) {
					return item.QtnHeaderId > 0 && !item.IsIdealBidder;
				}), function (item) {
					return {
						QuoteId: item.QtnHeaderId,
						PriceOc: item.PriceOc,
						Price: item.Price,
						BoqHeaderId: item.BoqHeaderId,
						BoqItemId: item.BoqItemId,
						Finalprice: item[boqCompareRows.finalPrice],
						FinalpriceOc: item[boqCompareRows.finalPriceOc],
						Urb1: item[boqCompareRows.urBreakdown1],
						Urb2: item[boqCompareRows.urBreakdown2],
						Urb3: item[boqCompareRows.urBreakdown3],
						Urb4: item[boqCompareRows.urBreakdown4],
						Urb5: item[boqCompareRows.urBreakdown5],
						Urb6: item[boqCompareRows.urBreakdown6],
						Cost: item[boqCompareRows.cost],
						Quantity: item[boqCompareRows.quantity],
						PrcItemEvaluationFk: item.PrcItemEvaluationId,
						DiscountPercent: item[boqCompareRows.discountPercent],
						UnitRateFrom: item[boqCompareRows.unitRateFrom],
						UnitRateTo: item[boqCompareRows.unitRateTo],
						Discount: item[boqCompareRows.discount],
						DiscountPercentIt: item[boqCompareRows.discountPercentIT],
						LumpsumPrice: item[boqCompareRows.lumpsumPrice],
						IsLumpsum: item[boqCompareRows.isLumpsum],
						DiscountedUnitprice: item[boqCompareRows.discountedUnitPrice],
						DiscountedUnitpriceOc: item.DiscountedUnitpriceOc
					};
				});

				let idealItemsFromParent = _.map(_.filter(quoteItemsFromParent, function (item) {
					return item.IsIdealBidder;
				}), function (item) {
					return {
						QuoteId: item.QtnHeaderId,
						BoqHeaderId: item.BoqHeaderId,
						BoqItemId: item.BoqItemId,
						PrcItemEvaluationFk: item.PrcItemEvaluationId,
						BoqHeaderIdToBeCopied: item[commonService.itemEvaluationRelatedFields.sourceBoqHeaderId],
						BoqItemIdToBeCopied: item[commonService.itemEvaluationRelatedFields.sourceBoqItemId],
						QuoteKey: item.QuoteKey
					};
				});

				let idealBidderItem = idealItemsFromParent.length > 0 ? idealItemsFromParent[0] : null;
				let request = {
					RfqHeaderId: entity.RfqHeaderId,
					BoqHeaderId: sourceItem.BoqHeaderId,
					BoqItemId: sourceItem.BoqItemId,
					PriceModifiedItemList: quoteItemsWithoutIdeal,
					IdealQuoteItemInfo: idealBidderItem
				};
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/getquoteiteminfo4pricemodified', request);
			}

			function collectItemEvaluationModifiedFromCompareFields(quoteKey, itemKey, value) {
				let field = quoteKey + '.' + itemKey + '.' + boqCompareRows.prcItemEvaluationFk;
				commonService.assignValue(localModifiedEntity, field, value);

				// convert entity (quoteId.itemId.field = 20) to the needed data format definition.
				let data = {};
				_.map(localModifiedEntity, function (quoteKeys, quoteKey) {
					let quoteId = quoteKey.split('_')[1];
					data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
						return angular.extend({Id: itemId}, itemField);
					});
				});

				service.modifiedData = data;
			}
		}
	]);
})(angular);
