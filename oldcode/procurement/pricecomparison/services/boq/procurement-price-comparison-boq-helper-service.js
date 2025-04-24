/**
 * Created by wed on 9/30/2018.
 */

(function (angular) {

	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqHelperService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$timeout',
		'basicsLookupdataTreeHelper',
		'platformObjectHelper',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonPrintCommonService',
		'boqMainLineTypes',
		'procurementPriceComparisonCheckBidderService',
		'$injector',
		'basicsCostGroupAssignmentService',
		function (
			_,
			globals,
			$q,
			$http,
			$timeout,
			basicsLookupdataTreeHelper,
			platformObjectHelper,
			platformRuntimeDataService,
			lookupDescriptorService,
			commonService,
			commonHelperService,
			compareLineTypes,
			boqCompareRows,
			printCommonService,
			boqMainLineTypes,
			checkBidderService,
			$injector,
			basicsCostGroupAssignmentService) {

			var service = {};
			const _dataRowProcessors = [];
			var boqModifiedItems = [];
			service.setFirstEvaluation = function setFirstEvaluation(itemTree, boqConfigService, boqDataStructureService, childProp, recalculateCallback, isVerticalCompareRows) {

				// ALM 140668 # Wrong totals are shown in "Create Contract" Wizard - seems like they are caused by evaluated items (it seems unnecessary to recalculate price by item evaluation)
				/* var evaluationItems = [];
				var originalQuoteItems = []; */
				var itemEvaluationNodes = commonService.getAllPrcItemEvaluation(itemTree, childProp, function (item) {
					return isVerticalCompareRows ? commonHelperService.isBoqPositionRow(item.BoqLineTypeFk) : commonHelperService.getBoqCompareField(item) === commonService.itemCompareFields.prcItemEvaluationFk;
				});

				_.forEach(itemEvaluationNodes, function (item) {
					_.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						var itemEvaluationPropPrefix = visibleColumn.Id + (isVerticalCompareRows ? '_' + commonService.itemCompareFields.prcItemEvaluationFk : ''),
							columnField = itemEvaluationPropPrefix + '_$FirstEvaluationFk';
						var prcItemEvaluationFk = platformObjectHelper.getValue(item, columnField);

						if (prcItemEvaluationFk !== null && prcItemEvaluationFk >= 0) {
							item[itemEvaluationPropPrefix + '_$PrcItemEvaluationFk'] = prcItemEvaluationFk;

							// ALM 140668 # Wrong totals are shown in "Create Contract" Wizard - seems like they are caused by evaluated items (it seems unnecessary to recalculate price by item evaluation)
							/* var value = service.getPriceByPrcItemEvaluation(prcItemEvaluationFk, itemEvaluationPropPrefix, item, boqDataStructureService, isVerticalCompareRows);
							var modifiedItems = commonService.getCompareModifications(item, value, visibleColumn.Id, childProp, columnField, commonService.itemCompareFields.prcItemEvaluationFk, isVerticalCompareRows)(itemTree);

							evaluationItems.push.apply(evaluationItems, modifiedItems);
							originalQuoteItems.push.apply(originalQuoteItems,
								_.filter(commonService.getAllQuoteItems(itemTree, childProp), function (i) {
									return i.QuoteKey === visibleColumn.Id;
								})
							); */
						}
					});
				});
				// ALM 140668 # Wrong totals are shown in "Create Contract" Wizard - seems like they are caused by evaluated items (it seems unnecessary to recalculate price by item evaluation)
				/* if (evaluationItems && evaluationItems.length) {
					var boqService = $injector.get('procurementPriceComparisonBoqService');
					service.recalculateNoSave(boqService, evaluationItems, originalQuoteItems, itemTree, boqDataStructureService).then(function (itemTreeAfterHandle) {
						if (_.isFunction(recalculateCallback)) {
							recalculateCallback(itemTreeAfterHandle);
						}
					});
				} */
			};

			function createQuoteColumns(boqConfigService, boqDataStructureService, columnDomainFn, isVerticalCompareRows, isLineValueColumn, configColumns) {
				let quoteColumns = [],
					compareColumns = boqConfigService.visibleCompareColumnsCache,
					compareRows = boqConfigService.visibleCompareRowsCache;

				let bidderCol = _.find(configColumns, function (item) {
					return item.id === '_rt$bidder' && !item.hidden;
				});

				let columnBidder = _.find(configColumns, {id: '_rt$bidder'});
				let lineValue = columnBidder && columnBidder.children ? _.find(columnBidder.children, {field: 'LineValue'}) : null;
				if (!lineValue) {
					lineValue = _.find(configColumns, {isLineValue: true});
				}

				angular.forEach(compareColumns, function (quoteColumn, index) {
					let compareColumns = [];

					let columnDef = {
						id: quoteColumn.Id,
						groupName: quoteColumn.Description || commonService.translateTargetOrBaseBoqName(quoteColumn.Id),
						name: isVerticalCompareRows ? 'Line Value' : quoteColumn.Description || commonService.translateTargetOrBaseBoqName(quoteColumn.Id),
						name$tr$: isVerticalCompareRows ? 'procurement.pricecomparison.lineValue' : '',
						userLabelName: isVerticalCompareRows && lineValue && lineValue.userLabelName ? lineValue.userLabelName : '',
						field: quoteColumn.Id,
						width: 100,
						searchable: true,
						sortable: false,
						hidden: isVerticalCompareRows && !isLineValueColumn || !!bidderCol,
						isDynamic: true,
						isLineValue: true,
						isIdealBidder: quoteColumn.IsIdealBidder,
						backgroundColor: quoteColumn.BackgroundColor,
						groupIndex: index
					};
					updateQuoteColumnRowCellEditor(quoteColumn, columnDef, boqConfigService, boqDataStructureService, columnDomainFn);
					boqConfigService.setFormatterForQuoteColumn(columnDef, boqConfigService.allRfqCharacteristicCache, boqConfigService.allQuoteCharacteristicCache);

					compareColumns.push(columnDef);

					// Vertical additional columns
					if (isVerticalCompareRows) {
						let boqCompareRows = _.filter(compareRows, function (row) {
							return !commonHelperService.isExcludedCompareRowInVerticalMode(row.Field);
						});

						_.each(boqCompareRows, function (row) {
							let quoteKey = quoteColumn.Id;
							let columnField = commonHelperService.getCombineCompareField(quoteKey, row.Field);
							let displayName = _.includes(commonService.unitRateBreakDownFields, row.Field) ? (row.UserLabelName || boqDataStructureService.getUrbDisplayName(row.Field, row.DisplayName)) : row.DisplayName;
							let compareColumn = {
								id: columnField,
								groupName: quoteColumn.Description || commonService.translateTargetOrBaseBoqName(quoteColumn.Id),
								name: displayName,
								field: columnField,
								quoteKey: quoteKey,
								originalField: row.Field,
								isVerticalCompareRows: true,
								width: 100,
								searchable: true,
								sortable: false,
								hidden: !!bidderCol,
								isDynamic: true,
								isIdealBidder: quoteColumn.IsIdealBidder,
								backgroundColor: quoteColumn.BackgroundColor,
								groupIndex: index
							};
							updateQuoteColumnRowCellEditor(quoteColumn, compareColumn, boqConfigService, boqDataStructureService, columnDomainFn);
							boqConfigService.setFormatterForQuoteColumn(compareColumn, boqConfigService.allRfqCharacteristicCache, boqConfigService.allQuoteCharacteristicCache);
							compareColumns.push(compareColumn);
						});

						compareColumns = commonHelperService.sortQuoteColumns(compareColumns, columnBidder);
					}
					quoteColumns = quoteColumns.concat(compareColumns);
				});

				return quoteColumns;
			}

			function updateQuoteColumnRowCellEditor(item, columnDef, boqConfigService, boqStructureService, columnDomainFn) {

				columnDef.editor = 'dynamic';
				columnDef.formatter = 'dynamic';
				columnDef.domain = function (row, col) {
					let domain = null, compareFiled = commonHelperService.getBoqCompareField(row, col);

					if (compareFiled === boqCompareRows.prcItemEvaluationFk) {
						domain = 'lookup';
						col.dynamicFormatterFn = function getEvaluationText(entity) {
							let isIdealQuote = false,
								parentItem = commonHelperService.tryGetParentItem(row, col.isVerticalCompareRows);
							if (parentItem && parentItem.QuoteItems) {
								let quote = _.find(parentItem.QuoteItems, {
									QuoteKey: col.isVerticalCompareRows ? col.quoteKey : col.field,
									IsIdealBidder: true
								});
								if (quote) {
									isIdealQuote = true;
								}
							}
							let prcItemValFk = platformObjectHelper.getValue(entity, col.field + '_$PrcItemEvaluationFk');
							if (!prcItemValFk) {
								prcItemValFk = platformObjectHelper.getValue(entity, col.field + '_$FirstEvaluationFk');
							}
							let Evaluation_QuoteId = platformObjectHelper.getValue(entity, col.field + '_$Evaluation_QuoteId');
							if (prcItemValFk && !Evaluation_QuoteId) {
								let items = lookupDescriptorService.getData('PrcItemEvaluation') || [];
								return platformObjectHelper.getValue(items[prcItemValFk], 'DescriptionInfo.Translated') || '';
							} else if (isIdealQuote || Evaluation_QuoteId) {
								let value = platformObjectHelper.getValue(entity, col.field + '_$Evaluation_QuoteCode');
								return value ? value : '';
							}
							return '';
						};
					} else if (compareFiled === boqCompareRows.quantity) {
						domain = 'quantity';
					} else if (compareFiled === boqCompareRows.uomFk) {
						domain = 'lookup';
					} else if (compareFiled === boqCompareRows.isLumpsum || compareFiled === boqCompareRows.included || compareFiled === boqCompareRows.notSubmitted) {
						domain = 'boolean';
					} else if (compareFiled === boqCompareRows.alternativeBid) {
						domain = 'lookup';
						col.formatterOptions = {
							lookupType: 'PrcItemType85',
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id',
							dynamicField: col.field
						};
						col.dynamicFormatterFn = function (entity) {
							let itemTypeFk = platformObjectHelper.getValue(entity, col.formatterOptions.dynamicField);
							if (itemTypeFk) {
								let items = lookupDescriptorService.getData('basics.itemtype85') || [];
								let itemType = items[itemTypeFk];
								if (itemType) {
									let value = itemType.DescriptionInfo ? itemType.DescriptionInfo.Translated : itemType.Description;
									return value || '';
								}
							}
							return '';
						};
					} else if(compareFiled === boqCompareRows.prcPriceConditionFk){
						domain = 'lookup';
						col.formatterOptions = {
							lookupDirective: 'basics-material-price-condition-simple-combobox',
							lookupType: 'prcpricecondition',
							lookupMember: 'Id',
							dynamicField: col.field
						};
						col.dynamicFormatterFn = function (entity) {
							let conditionFk = platformObjectHelper.getValue(entity, col.formatterOptions.dynamicField);
							if (conditionFk) {
								let items = lookupDescriptorService.getData('prcpricecondition') || [];
								return platformObjectHelper.getValue(items[conditionFk], 'DescriptionInfo.Translated') || '';
							}
							return '';
						};
					} else if (_.includes([boqCompareRows.commentContractor, boqCompareRows.commentClient, boqCompareRows.bidderComments], compareFiled)) {
						domain = 'remark';
					} else if (_.includes(commonService.boqEditableCompareFields, compareFiled) || row.BoqLineTypeFk === compareLineTypes.generalItem) {
						domain = 'money';
					} else if (row.BoqLineTypeFk === compareLineTypes.characteristic) {
						domain = commonService.characteristicDomain(boqConfigService, boqConfigService.boqQtnMatchCache, row, col);
					} else if (row.BoqLineTypeFk === compareLineTypes.quoteExchangeRate) {
						domain = 'quantity';
					} else if (row.BoqLineTypeFk === compareLineTypes.quoteUserDefined) {
						domain = 'description';
					} else if (row.BoqLineTypeFk === compareLineTypes.quoteRemark) {
						domain = 'lookup';
						col.dynamicFormatterFn = function (entity) {
							return entity[col.id];
						};
					} else if (row.BoqLineTypeFk === compareLineTypes.quotePaymentTermPA || row.BoqLineTypeFk === compareLineTypes.quotePaymentTermFI){
						domain = 'lookup';
						col.formatterOptions = {
							lookupDirective: 'basics-lookupdata-payment-term-lookup',
							lookupType: 'PaymentTerm',
							lookupMember: 'Id',
							dynamicField: col.field
						};
						col.dynamicFormatterFn = function (entity) {
							let paymentTermFk = platformObjectHelper.getValue(entity, col.formatterOptions.dynamicField);
							if (paymentTermFk) {
								let items = lookupDescriptorService.getData('PaymentTerm') || [];
								return platformObjectHelper.getValue(items[paymentTermFk], 'Code') || '';
							}
							return '';
						};
					}
					if (_.isFunction(columnDomainFn)) {
						let result = columnDomainFn(row, col);
						if (result) {
							domain = result;
						}
					}

					return domain;
				};
			}

			service.reorderCompareColumns = function reorderCompareColumns(boqConfigService, itemsSource) {
				boqConfigService.visibleCompareColumnsCache = commonHelperService.reorderCompareColumns(boqConfigService.visibleQuoteCompareRowsCache, boqConfigService.visibleCompareColumnsCache, itemsSource, commonService.constant.compareType.boqItem);
			};

			/**
			 * recalculate boq item and it's parent and parent.
			 *
			 * @param customBoqItems { array } the modified quote items
			 * @param originalQuoteItems all quote items
			 * @param itemTree comapre data of this container
			 * @param boqDataStructureService data structure service
			 */
			service.recalculateNoSave = function (dataService, customBoqItems, originalQuoteItems, itemTree, boqDataStructureService, isCalculateAsPerAdjustedQuantity) {
				let quoteId = customBoqItems[0].QtnHeaderId;
				let currentQuote = _.find(lookupDescriptorService.getData('quote'), {Id: quoteId});
				// eslint-disable-next-line no-tabs
				//	var exchangeRate = currentQuote ? currentQuote.ExchangeRate || 1 : 1;
				let exchangeRate = currentQuote ? commonService.getExchangeRate(currentQuote.RfqHeaderFk, currentQuote.Id) : 1;
				// var selected = service.getSelected();

				let isBaseOnOcValue = false;
				/* if (dataService.currentRow.rowType === 'Price'){
					isBaseOnOcValue = false;
				} */

				_.forEach(customBoqItems, function (item) {
					if (!item.IsIdealBidder) {
						if (item.PrcItemEvaluationFk) {
							item.PrcItemEvaluationFk = _.toInteger(item.PrcItemEvaluationFk);
						}
					}
					else {
						item.PrcItemEvaluationFk = null;
					}
				});

				// if price equal 0 and PrcItemEvaluation is not manual input,set not submitted to true default
				_.forEach(customBoqItems, function (item) {
					if (item.Price === 0) {
						if (item.PrcItemEvaluationId !== 8 && item.PrcItemEvaluationId !== 2) {
							item.NotSubmitted = true;
						} else {
							item.NotSubmitted = false;
						}
						if (item.PrcItemEvaluationId && item.PrcItemEvaluationId === 2) { // included
							item.Included = true;
						} else {
							item.Included = false;
						}
					} else {
						item.NotSubmitted = false;
						item.Included = false;
					}
					item.ExQtnIsEvaluated = !_.includes([1, 2, 8], item.PrcItemEvaluationId);
				});
				let billingSchemaService = $injector.get('priceComparisonBillingSchemaService');

				if (boqModifiedItems.length === 0) {
					boqModifiedItems = boqModifiedItems.concat(customBoqItems);
				} else {
					if (customBoqItems.length > 0) {
						_.forEach(customBoqItems, function (item) {
							let boq = _.find(boqModifiedItems, {BoqItemId: item.BoqItemId});
							if (!boq) {
								boqModifiedItems.push(item);
							} else {
								_.remove(boqModifiedItems, {BoqItemId: item.BoqItemId});
								boqModifiedItems.push(item);
							}
						});
					}
				}

				// update modifiedItem's uomFk from modifiedData
				_.forEach(dataService.modifiedData, function (data) {
					_.forEach(data, dataItem=>{
						if (dataItem['Id']){
							let modifiedItem = _.find(boqModifiedItems, item => {
								return item.BoqItemId === _.toInteger(dataItem['Id']);
							});
							if (modifiedItem) {
								if (dataItem['UomFk']) {
									modifiedItem.UomFk = dataItem['UomFk'];
								}
								if (dataItem['PrcItemEvaluationFk']) {
									modifiedItem.PrcItemEvaluationFk = dataItem['PrcItemEvaluationFk'];
								}
							}
						}
					});
				});

				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/recalculateboqtree', {
					boqModifiedItems: boqModifiedItems,
					boqModifiedData: dataService.modifiedData, // update the modified field of the same quote changed last time to avoid losting the updated field value last time.
					exchangeRate: exchangeRate,
					quoteHeaderId: quoteId,
					prcItemModifiedData: getItemModifiedData(),
					billingSchema: billingSchemaService.getList(),
					prcGenerals: commonService.PrcGeneralsToSave ? commonService.PrcGeneralsToSave : [],
					isBaseOnOcValue: isBaseOnOcValue,
					originalQuoteItems: originalQuoteItems,
					isCalculateAsPerAdjustedQuantity: isCalculateAsPerAdjustedQuantity
				}).then(function (response) {
					let uiFields = ['QtnHeaderId', 'BusinessPartnerId', 'QtnVersion', 'ReqHeaderId', 'PrcHeaderId',
						'EvaluationSourceBoqHeaderId', 'EvaluationSourceBoqItemId', 'PrcItemEvaluationFk', 'PrcItemEvaluationId', 'IsIdealBidder'];
					_.each(response.data.RecalculatedItems, function (recalculatedItem) {
						_.each(originalQuoteItems, function (originalItem) {
							let fields = uiFields;
							if (originalItem.IsIdealBidder){
								fields = _.concat(uiFields, ['EvaluationQuoteCode', 'EvaluationQuoteId']);
							}
							if (originalItem.BoqItemId === recalculatedItem.BoqItemId) {

								_.forEach(fields, function (field) {
									recalculatedItem[field] = originalItem[field];
								});

								// keep the QuoteKey and OwnQuoteKey for change order quote to make sure to show it's value correctly.
								recalculatedItem.QuoteKey = originalItem.QuoteKey;
								if (originalItem.OwnQuoteKey) {
									recalculatedItem.OwnQuoteKey = originalItem.OwnQuoteKey;
								}
								angular.extend(originalItem, recalculatedItem); // use calculated value
							}

							let modifiedItem = _.find(boqModifiedItems, item => item.BoqItemId === originalItem.BoqItemId);

							if (modifiedItem && !originalItem.IsIdealBidder){
								// 1. quote to max/min/average
								if (modifiedItem.PrcItemEvaluationId && modifiedItem.PrcItemEvaluationFk) {
									// originalItem.PrcItemEvaluationId = modifiedItem.PrcItemEvaluationId;
									// originalItem.PrcItemEvaluationFk = modifiedItem.PrcItemEvaluationFk;
									originalItem.EvaluationQuoteId = 0;
									originalItem.EvaluationSourceBoqHeaderId = 0;
									originalItem.EvaluationSourceBoqItemId = 0;
									originalItem.EvaluationQuoteCode = null;
								} // 2. max/min/average to quote
								else if (!modifiedItem.PrcItemEvaluationFk) {
									originalItem.EvaluationQuoteId = modifiedItem.EvaluationQuoteId;
									originalItem.EvaluationSourceBoqHeaderId = modifiedItem.EvaluationSourceBoqHeaderId;
									originalItem.EvaluationSourceBoqItemId = modifiedItem.EvaluationSourceBoqItemId;
									originalItem.EvaluationQuoteCode = modifiedItem.EvaluationQuoteCode;
								}
							}
						});
					});
					// boqModifiedItems = [];
					// recalculate boq comparison data tree
					boqDataStructureService.recalculateTreeByModifiedPrcItemEvaluation(itemTree);
					refreshBillingSchemas(response.data.BillingSchemas, response.data.BillingSchemaTypes);
					return itemTree;
				});
			};

			function getItemModifiedData() {
				var otherService = $injector.get('procurementPriceComparisonItemService');
				return otherService.modifiedData;
			}

			function refreshBillingSchemas(billingSchemas, billingSchemaTypes) {
				var dataService = $injector.get('procurementPriceComparisonBoqService');
				var billingSchemaService = $injector.get('priceComparisonBillingSchemaService');
				var selectedQuote = dataService.selectedQuote || dataService.lastSelectedQuote;
				if (billingSchemas) {
					billingSchemaService.updateBillingSchemaData(billingSchemas);
					dataService.resetBillingSchemaValue(billingSchemaTypes, selectedQuote, billingSchemas);
				}
			}

			service.getPriceByPrcItemEvaluation = function (prcItemEvaluationFk, field, itemEvaluationNode, boqDataStructureService, isVerticalCompareRows) {

				// always use the original values (before calculation to recalculate by the selected item
				var selectedRow = itemEvaluationNode,
					positionNode = commonHelperService.tryGetParentItem(selectedRow, commonHelperService.isBoqPositionRow(selectedRow.BoqLineTypeFk)),
					columnInfo = commonHelperService.extractCompareInfoFromFieldName(field);
				if (!selectedRow.allRecaluclateRows) {
					selectedRow.allRecaluclateRows = boqDataStructureService.getColumnValuesForCompareFieldRow(positionNode, {Field: boqCompareRows.discountedUnitPrice}, {});
				}
				selectedRow.dataBeforeRecaluclate = boqDataStructureService.recalcuateExcludedCurrentBidder(selectedRow.allRecaluclateRows, columnInfo.quoteKey);

				// 1:Empty(0.00), 2:Included(0.00), 3:Base BoQ Price(Base BoQ Price), 4:Requisition Price (Target),
				// 5:Average(Average of quotes), 6:Min(Minimum of quotes), 7:Max(Maximum of quotes), 8:Guessed(Free Edit), 10:Requisition budget per unit, 11:Requisition budget total
				switch (prcItemEvaluationFk) {
					case 1:
					case 2:
						return 0.00;
					case 3:
						return selectedRow.dataBeforeRecaluclate[checkBidderService.constant.baseBoqKey];
					case 4:
						return selectedRow.dataBeforeRecaluclate[checkBidderService.constant.targetKey];
					case 5:
						return selectedRow.dataBeforeRecaluclate[commonService.constant.averageValueExcludeTarget];
					case 6:
						return selectedRow.dataBeforeRecaluclate[commonService.constant.minValueExcludeTarget];
					case 7:
						return selectedRow.dataBeforeRecaluclate[commonService.constant.maxValueExcludeTarget];
					case 8:
						return null;
					case 10: {
						let budgetPerUnit = isVerticalCompareRows ? selectedRow.BudgetPerUnit : selectedRow.parentItem.BudgetPerUnit;
						return budgetPerUnit ? budgetPerUnit : 0;
					}
					case 11: {
						let budgetTotal = isVerticalCompareRows ? selectedRow.BudgetTotal : selectedRow.parentItem.BudgetTotal;
						return budgetTotal ? budgetTotal : 0;
					}
					default:
						return selectedRow.dataBeforeRecaluclate[columnInfo.quoteKey];
				}
			};

			service.getDefaultColumns = function (boqConfigService) {
				var commonColumns = angular.copy(boqConfigService.getCommonColumns());
				var commonColumns2 = angular.copy(boqConfigService.getCommonColumns2());
				var lineNameColumn = angular.copy(boqConfigService.getLineNameColumn());
				// get compare 'description' column (using the custom 'description' value).
				var compareDescriptionColumn = angular.copy(boqConfigService.getCompareDescriptionColumnByCustomSettings());
				var maxMinAverageColumns = angular.copy(boqConfigService.getMaxMinAverageColumns());

				return commonColumns.concat(lineNameColumn).concat(compareDescriptionColumn).concat(maxMinAverageColumns).concat(commonColumns2);
			};

			service.loadColumns = function (boqConfigService, boqStructureService, configColumns, options) {

				var opts = printCommonService.merge2({
					columnDomainFn: null,
					isVerticalCompareRows: false,
					isLineValueColumn: false,
					isFinalShowInTotal: false
				}, options);

				var quoteColumns = createQuoteColumns(boqConfigService, boqStructureService, opts.columnDomainFn, opts.isVerticalCompareRows, opts.isLineValueColumn, configColumns);

				boqConfigService.applyCustomCssStyleForQuoteColumnCell(quoteColumns);

				var defaultColumns = service.getDefaultColumns(boqConfigService);

				let costGroupColumns = basicsCostGroupAssignmentService.createCostGroupColumns(boqConfigService.costGroupCats || [], false);

				let columns = commonService.getGridConfigColumns(configColumns, defaultColumns, quoteColumns, costGroupColumns);
				_.each(columns, function (column, index) {
					if (column && !column.pinned && !column.isDynamic) {
						column.groupName = commonHelperService.textPadding('', ' ', index + 1);
					}
				});
				return columns;
			};

			service.loadData = function (readData, boqConfigService, boqDataStructureService, options) {
				boqConfigService = boqConfigService ? boqConfigService : $injector.get('procurementPriceComparisonBoqConfigService');
				boqDataStructureService = boqDataStructureService ? boqDataStructureService : $injector.get('procurementPriceComparisonBoqDataStructureService');
				boqConfigService.boqQtnMatchCache = {};
				let opts = printCommonService.merge2({
					serviceData: null,
					childProp: 'BoqItemChildren',
					onReadSuccess: null,
					isVerticalCompareRows: false
				}, options);
				boqDataStructureService.setCompareDirections({
					isVerticalCompareRows: opts.isVerticalCompareRows,
					isFinalShowInTotal: opts.isFinalShowInTotal
				});
				boqConfigService.setCompareDirections({
					isVerticalCompareRows: opts.isVerticalCompareRows,
					isFinalShowInTotal: opts.isFinalShowInTotal
				});
				commonHelperService.killRunningReadRequest(opts.serviceData);
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/list', readData, {
					timeout: commonHelperService.provideReadRequestToken(opts.serviceData)
				}).then(function (response) {
					if (_.isFunction(opts.onReadSuccess)) {
						opts.onReadSuccess(response.data);
					}
					return service.processRequestData(response, boqConfigService, boqDataStructureService, opts);
				});
			};

			service.processRequestData = function processRequestData(response, boqConfigService, boqDataStructureService, opts) {
				let itemsSource = [];
				commonHelperService.endRunningReadRequest(opts.serviceData);
				if (_.isEmpty(response.data)) {
					return itemsSource;
				}
				for (let i = 0; i < response.data.length; i++) {
					let rfqCompareData = angular.copy(response.data[i]);

					// cache data used for all RFQs (base and change RFQs).
					let isChangeOrder = true;
					if (i === 0) {
						isChangeOrder = false;
						service.cacheCustomSettings(rfqCompareData, boqConfigService);

						boqConfigService.rfqHeadersCache = rfqCompareData.RfqHeader;

						if (rfqCompareData.Quote) {
							commonHelperService.processQuote(rfqCompareData.Quote);
						}

						lookupDescriptorService.attachData(rfqCompareData);
						boqConfigService.boqLineTypeNameCache = lookupDescriptorService.getData('BoqLineType');
						boqConfigService.generalTypesCache = lookupDescriptorService.getData('PrcGeneralsType');
						boqConfigService.costGroupCats = rfqCompareData['BoqItemCostGroupCats'];
						boqConfigService.boqItem2CostGroups = rfqCompareData['BoqItem2CostGroups'];
					}

					commonHelperService.attachCostGroupValueToEntity(rfqCompareData.Main, boqConfigService.boqItem2CostGroups, opts.childProp, function (costGroup) {
						return {
							ReqBoqHeaderId: costGroup.RootItemId,
							ReqBoqItemId: costGroup.MainItemId
						};
					}, function (item) {
						return commonHelperService.isBoqRow(item.BoqLineTypeFk);
					});

					// restructure RFQ comparison data
					let rfqRow = boqDataStructureService.restructureCompareData(rfqCompareData, isChangeOrder);
					itemsSource.push(rfqRow);
				}

				commonHelperService.addTotalTypeRows(boqConfigService.visibleCompareColumnsCache, itemsSource, commonService.constant.compareType.boqItem, response.data[0].PrcTotalTypes, response.data[0].QtnTotals);

				if (commonHelperService.isEvaluatedTotalVisible(boqConfigService.visibleQuoteCompareRowsCache)) {
					boqDataStructureService.addEvaluatedTotalRowAndSetColumnValues(itemsSource);
				}
				if (commonHelperService.isOfferedTotalVisible(boqConfigService.visibleQuoteCompareRowsCache)) {
					boqDataStructureService.addOfferedTotalRowAndSetColumnValues(itemsSource);
				}
				boqDataStructureService.addGrandTotalRowAndSetColumnValues(itemsSource);
				commonHelperService.setRowValuesForStructureColumn(itemsSource, null, commonService.constant.compareType.boqItem);
				boqDataStructureService.setRowValuesForLineNameColumn(itemsSource);
				commonHelperService.attachExtraValueToTreeRows(itemsSource, service.getRowDataProcessors(), 'BoqItemChildren');

				// Process ItemType & ItemType2 lookup merge with setting.
				service.mergeItemTypes();

				return itemsSource;
			};

			service.cacheCustomSettings = function (itemList, boqConfigService) {
				// convert base /change columns into a tree (always using base custom columns)
				var context = {treeOptions: {parentProp: 'CompareColumnFk', childProp: 'Children'}, IdProperty: 'Id'};
				boqConfigService.visibleCompareColumnsCache = basicsLookupdataTreeHelper.buildTree(itemList.BoqCustomColumn || [], context);

				var customCompareRows = itemList.BoqCustomRow || [];
				if (customCompareRows.length > 0) {
					boqConfigService.showInSummaryCompareRowsCache = _.filter(customCompareRows, {
						CompareType: commonService.constant.compareType.boqItem,
						ShowInSummary: true
					});

					boqConfigService.visibleCompareRowsCache = _.filter(customCompareRows, {
						CompareType: commonService.constant.compareType.boqItem,
						Visible: true
					});

					var leadingFields = _.map(_.filter(customCompareRows, {
						CompareType: commonService.constant.compareType.boqItem,
						IsLeading: true
					}), 'Field');
					if (_.isArray(leadingFields) && leadingFields.length > 0) {
						boqConfigService.leadingFieldCache = leadingFields[0];
					}
				}

				// custom quote comapre field rows
				boqConfigService.visibleQuoteCompareRowsCache = _.filter(itemList.BoqCustomQuoteRow, {
					CompareType: commonService.constant.compareType.boqItem,
					Visible: true
				});

				// custom quote compare field rows
				boqConfigService.visibleSchemaCompareRowsCache = _.filter(itemList.BoqCustomSchemaRow, {
					CompareType: commonService.constant.compareType.boqItem,
					Visible: true
				});

				commonService.finalBillingSchemaCache = itemList.FinalBillingSchemas || [];
			};

			service.restructureQuoteCompareColumns = function (mainDtos, rfqQuotes, enableBoqTarget, baseColumns) {
				return commonHelperService.restructureQuoteCompareColumns(mainDtos, rfqQuotes, enableBoqTarget, baseColumns);
			};

			service.getRowDataProcessors = function getRowDataProcessors() {
				if (!_.isEmpty(_dataRowProcessors)) {
					return _dataRowProcessors;
				}

				_dataRowProcessors.push(commonHelperService.createRowProcessor('QuoteCol_-1_-1_-1', [
					{rowProp: 'UserDefined1', targetProp: 'Userdefined1'},
					{rowProp: 'UserDefined2', targetProp: 'Userdefined2'},
					{rowProp: 'UserDefined3', targetProp: 'Userdefined3'},
					{rowProp: 'UserDefined4', targetProp: 'Userdefined4'},
					{rowProp: 'UserDefined5', targetProp: 'Userdefined5'},
					'ExternalCode'
				], function (row) {
					return commonHelperService.isBoqRow(row.BoqLineTypeFk);
				}));

				// Budget
				_dataRowProcessors.push({
					isMatched: function (row) {
						return commonHelperService.isBoqRow(row.BoqLineTypeFk);
					},
					process: function (row) {
						let target = _.find(row.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});
						if (target) {
							if (commonHelperService.isBoqPositionRow(row.BoqLineTypeFk)) {
								row.BudgetPerUnit = target.BudgetPerUnit;
							}
							if (commonHelperService.isBoqRootRow(row.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(row.BoqLineTypeFk)) {
								row.BudgetDifference = target.BudgetDifference;
							} else {
								row.BudgetDifference = null;
							}
							row.BudgetTotal = target.BudgetTotal;
						}
					}
				});

				return _dataRowProcessors;

			};

			service.calPriceOrPriceOcByGross = function calPriceOrPriceOcByGross(boqItem, vatPercent, exchangeRate, isPriceGross) {
				if (isPriceGross) {
					boqItem.DiscountedUnitprice = boqItem.Pricegross / ((100 + vatPercent) / 100);
					boqItem.Price = boqItem.DiscountedUnitprice / ((100 - boqItem.DiscountPercent) / 100);
				} else {
					boqItem.DiscountedUnitpriceOc = boqItem.PricegrossOc / ((100 + vatPercent) / 100);
					boqItem.PriceOc = boqItem.DiscountedUnitpriceOc / ((100 - boqItem.DiscountPercent) / 100);
					boqItem.Price = boqItem.PriceOc / (exchangeRate && exchangeRate !== 0 ? exchangeRate : 1);
				}
			};

			service.mergeItemTypes = function mergeItemTypes() {
				let itemTypes = lookupDescriptorService.getData('itemTypes');
				if (itemTypes) {
					_.each(itemTypes, function itemTypesIterator(itemType) {
						itemType.DisplayName = itemType.DescriptionInfo ? itemType.DescriptionInfo.Translated : (itemType.DisplayMember ?? itemType.Description);
					});
				}

				let itemTypes2 = lookupDescriptorService.getData('itemTypes2');
				if (itemTypes2) {
					_.each(itemTypes2, function itemTypes2Iterator(itemType) {
						itemType.DisplayName = itemType.DescriptionInfo ? itemType.DescriptionInfo.Translated : (itemType.DisplayMember ?? itemType.Description);
					});
				}
			};

			service.recombineTreeByOptions = function (dataTree, summaryTypes, boqDataStructureService, boqConfigService) {

				boqDataStructureService.clearSummaryDataRows(dataTree);

				boqDataStructureService.addSummaryDataRows(dataTree, boqConfigService.visibleCompareColumnsCache, summaryTypes);

				// Item Type options
				boqDataStructureService.removeBoQDataRowsByItemTypes(dataTree, summaryTypes.checkedBoqItemTypes || [], summaryTypes.checkedBoqItemTypes2 || [], true);

				// BoQ Range options
				boqDataStructureService.removeBoQDataRowsByRanges(dataTree, [], true);

				// Summary options
				boqDataStructureService.removeSummaryDataRows(dataTree, summaryTypes.checkedLineTypes || [], boqConfigService.visibleCompareColumnsCache, true);

				// Zero value options
				if (summaryTypes.hideZeroValueLines) {
					boqDataStructureService.removeZeroValueRows(dataTree, boqConfigService.visibleCompareColumnsCache, true);
				}

				return dataTree;
			};

			return service;

		}]);

})(angular);