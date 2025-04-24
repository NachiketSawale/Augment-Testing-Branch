/**
 * Created by wed on 9/27/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemHelperService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$timeout',
		'PlatformMessenger',
		'basicsLookupdataTreeHelper',
		'platformObjectHelper',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonPrintCommonService',
		'prcCommonItemCalculationHelperService',
		'procurementPriceComparisonCheckBidderService',
		'prcCommonGetVatPercent',
		'$injector',
		'ServiceDataProcessDatesExtension',
		function (
			_,
			globals,
			$q,
			$http,
			$timeout,
			PlatformMessenger,
			basicsLookupdataTreeHelper,
			platformObjectHelper,
			platformRuntimeDataService,
			lookupDescriptorService,
			commonService,
			commonHelperService,
			compareLineTypes,
			printCommonService,
			itemCalculateHelperService,
			checkBidderService,
			prcCommonGetVatPercent,
			$injector,
			ServiceDataProcessDatesExtension) {

			var service = {};
			const _dataRowProcessors = [];
			service.onPriceChanged = new PlatformMessenger();

			/**
			 * dynamically create compare 'bizPartner' columns (using the custom 'description' value or bizPartner 'name1' by default)
			 */
			function createQuoteColumns(itemConfigService, itemDataStructureService, columnDomainFn, isVerticalCompareRows, isLineValueColumn, configColumns) {
				var quoteColumns = [],
					compareColumns = itemConfigService.visibleCompareColumnsCache,
					compareRows = itemConfigService.visibleCompareRowsCache;

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
						hidden: isVerticalCompareRows && !isLineValueColumn,
						isDynamic: true,     // dynamic column
						isLineValue: true,
						isIdealBidder: quoteColumn.IsIdealBidder,
						backgroundColor: quoteColumn.BackgroundColor,
						groupIndex: index
					};
					updateQuoteColumnRowCellEditor(quoteColumn, columnDef, itemConfigService, itemDataStructureService, columnDomainFn);
					itemConfigService.setFormatterForQuoteColumn(columnDef, itemConfigService.allRfqCharacteristicCache, itemConfigService.allQuoteCharacteristicCache);

					compareColumns.push(columnDef);

					// Vertical additional columns
					if (isVerticalCompareRows) {
						_.each(compareRows, function (row) {
							if (commonHelperService.isExcludedCompareRowInVerticalMode(row.Field)) {
								return;
							}
							let quoteKey = quoteColumn.Id;
							let columnField = commonHelperService.getCombineCompareField(quoteKey, row.Field);
							let compareColumn = {
								id: columnField,
								groupName: quoteColumn.Description || commonService.translateTargetOrBaseBoqName(quoteColumn.Id),
								name: row.DisplayName ? row.DisplayName : row.Description,
								field: columnField,
								quoteKey: quoteKey,
								originalField: row.Field,
								isVerticalCompareRows: true,
								width: 100,
								searchable: true,
								sortable: false,
								hidden: false,
								isDynamic: true,
								isIdealBidder: quoteColumn.IsIdealBidder,
								backgroundColor: quoteColumn.BackgroundColor,
								groupIndex: index
							};
							updateQuoteColumnRowCellEditor(quoteColumn, compareColumn, itemConfigService, itemDataStructureService, columnDomainFn);
							itemConfigService.setFormatterForQuoteColumn(compareColumn, itemConfigService.allRfqCharacteristicCache, itemConfigService.allQuoteCharacteristicCache);
							compareColumns.push(compareColumn);
						});
						compareColumns = commonHelperService.sortQuoteColumns(compareColumns, columnBidder);
					}

					quoteColumns = quoteColumns.concat(compareColumns);
				});

				return quoteColumns;
			}

			/**
			 * add an editor for the cell (compare fields) according to the dynamic row and dynamic quote column.
			 */
			function updateQuoteColumnRowCellEditor(item, columnDef, itemConfigService, itemDataStructureService, columnDomainFn) {
				columnDef.editor = 'dynamic';
				columnDef.formatter = 'dynamic';
				columnDef.domain = function (row, col) {
					let domain = null, compareFiled = commonHelperService.getPrcCompareField(row, col);

					switch (compareFiled) {
						case commonService.itemCompareFields.prcItemEvaluationFk:
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
							break;
						case commonService.itemCompareFields.quantity:
						case commonService.itemCompareFields.priceUnit:
						case commonService.itemCompareFields.factoredQuantity:
							domain = 'quantity';
							break;
						case  commonService.itemCompareFields.prcPriceConditionFk:
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
							break;
						case commonService.itemCompareFields.alternativeBid:
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
							break;
						case  commonService.itemCompareFields.userDefined1:
						case  commonService.itemCompareFields.userDefined2:
						case  commonService.itemCompareFields.userDefined3:
						case  commonService.itemCompareFields.userDefined4:
						case  commonService.itemCompareFields.userDefined5:
						case  commonService.itemCompareFields.discountComment:
							domain = 'description';
							break;
						case commonService.itemCompareFields.commentClient:
						case commonService.itemCompareFields.commentContractor:
							domain = 'remark';
							break;
						case commonService.itemCompareFields.isFreeQuantity:
							domain = 'boolean';
							break;
						case commonService.itemCompareFields.exQtnIsEvaluated:
							domain = 'boolean';
							break;
						case commonService.itemCompareFields.uomFk:
							domain = 'lookup';
							col.formatterOptions = {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupType: 'PCUom',
								lookupMember: 'Id',
								dynamicField: col.field
							};
							col.dynamicFormatterFn = function (entity) {
								let uomFk = platformObjectHelper.getValue(entity, col.formatterOptions.dynamicField);
								if (uomFk) {
									let items = lookupDescriptorService.getData('PCUom') || [];
									return platformObjectHelper.getValue(items[uomFk], 'DescriptionInfo.Translated') || '';
								}
								return '';
							};
							break;
						case commonService.itemCompareFields.paymentTermPaFk:
						case commonService.itemCompareFields.paymentTermFiFk:
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
							break;
						default :
							if (row.LineType === compareLineTypes.characteristic) {
								domain = commonService.characteristicDomain(itemConfigService, itemConfigService.itemQtnMatchCache, row, col);
							} else if (row.LineType === compareLineTypes.quoteExchangeRate) {
								domain = 'quantity';
							} else if (row.LineType === compareLineTypes.quoteUserDefined) {
								domain = 'description';
							} else if (_.includes(commonService.itemEditableCompareFields, compareFiled) || row.LineType === compareLineTypes.generalItem) {
								domain = 'money';
							} else if (row.LineType === compareLineTypes.quoteRemark) {
								domain = 'lookup';
								col.dynamicFormatterFn = function (entity) {
									return entity[col.id];
								};
							} else if (row.LineType === compareLineTypes.quotePaymentTermPA || row.LineType === compareLineTypes.quotePaymentTermFI){
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
					}

					if (angular.isFunction(columnDomainFn)) {
						var result = columnDomainFn(row, col);
						if (result) {
							domain = result;
						}
					}

					return domain;
				};
			}

			service.getPriceByPrcItemEvaluation = function (prcItemEvaluationFk, field, itemEvaluationNode, itemDataStructureService, isVerticalCompareRows) { // jshint ignore: line
				// cache the original values of compare field before recalculation by the selected evaluation item
				var selectedRow = itemEvaluationNode,
					positionNode = commonHelperService.tryGetParentItem(selectedRow, selectedRow.LineType === compareLineTypes.prcItem),
					columnInfo = commonHelperService.extractCompareInfoFromFieldName(field);
				if (!selectedRow.allRecaluclateRows) {
					selectedRow.allRecaluclateRows = itemDataStructureService.getColumnValuesForCompareFieldRow(positionNode, {Field: commonService.itemCompareFields.price}, {});
				}
				selectedRow.dataBeforeRecaluclate = itemDataStructureService.recalcuateExcludedCurrentBidder(selectedRow.allRecaluclateRows, columnInfo.quoteKey);

				// 1:Empty(0.00), 2:Included(0.00), 3: Base BoQ Price (not used here), 4:Requisition Price (Target),
				// 5:Average(Average of quotes), 6:Min(Minimum of quotes), 7:Max(Maximum of quotes), 8:Guessed(Free Edit), 10:Requisition budget per unit, 11:Requisition budget total
				switch (prcItemEvaluationFk) {
					case 1:
					case 2:
						return 0.00;
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

			service.setFirstEvaluation = function (itemTree, itemConfigService, itemDataStructureService, childProp, isVerticalCompareRows) {
				// ALM 140668 # Wrong totals are shown in "Create Contract" Wizard - seems like they are caused by evaluated items (it seems unnecessary to recalculate price by item evaluation)
				/* var flag = false; */
				var itemEvaluationNodes = commonService.getAllPrcItemEvaluation(itemTree, childProp, function (item) {
					return isVerticalCompareRows ? item.LineType === compareLineTypes.prcItem : item.rowType === commonService.itemCompareFields.prcItemEvaluationFk;
				});

				_.forEach(itemEvaluationNodes, function (item) {
					_.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						var itemEvaluationPropPrefix = visibleColumn.Id + (isVerticalCompareRows ? '_' + commonService.itemCompareFields.prcItemEvaluationFk : '');
						var prcItemEvaluationFk = platformObjectHelper.getValue(item, itemEvaluationPropPrefix + '_$FirstEvaluationFk');
						if (prcItemEvaluationFk !== null && prcItemEvaluationFk >= 0) {

							item[itemEvaluationPropPrefix + '_$PrcItemEvaluationFk'] = prcItemEvaluationFk;

							// ALM 140668 # Wrong totals are shown in "Create Contract" Wizard - seems like they are caused by evaluated items (it seems unnecessary to recalculate price by item evaluation)
							/* var value = service.getPriceByPrcItemEvaluation(prcItemEvaluationFk, itemEvaluationPropPrefix, item, itemDataStructureService, isVerticalCompareRows);
							if (value !== null && value !== undefined) {
								var parentItem = commonHelperService.tryGetParentItem(item, isVerticalCompareRows);
								var evaluationItems = _.filter(parentItem.QuoteItems, {'QuoteKey': visibleColumn.Id}) || [];
								_.forEach(evaluationItems, function (evalItem) {
									flag = true;
									evalItem.Price = value || 0;
									var originalQuoteItems = _.filter(commonService.getAllQuoteItems(itemTree, childProp), function (i) {
										return i.PrcItemId === evalItem.PrcItemId;
									});
									service.recalculatePrcItem(originalQuoteItems, evalItem, false);
								});
							} */
						}
					});
				});

				// ALM 140668 # Wrong totals are shown in "Create Contract" Wizard - seems like they are caused by evaluated items (it seems unnecessary to recalculate price by item evaluation)
				/* if (itemEvaluationNodes && flag) {
					itemDataStructureService.recalculateTreeByModifiedPrcItemEvaluation(itemTree);
				} */
			};

			service.reorderCompareColumns = function (itemConfigService, itemsSource) {
				itemConfigService.visibleCompareColumnsCache = commonHelperService.reorderCompareColumns(itemConfigService.visibleQuoteCompareRowsCache, itemConfigService.visibleCompareColumnsCache, itemsSource, commonService.constant.compareType.prcItem);
			};

			service.onCalculateCompleted = new PlatformMessenger();

			/**
			 * recalculate PrcItem according to the modified compare fields (e.g. Price, Quantity...)
			 * (todo: PriceExtra is calculated by price conditions which will be supported later)
			 */
			service.recalculatePrcItem = function (originalQuoteItems, item, isExchangeRateChange, isPriceChanged, asyncAction) {
				let currentQuote = _.find(lookupDescriptorService.getData('quote'), {Id: item.QtnHeaderId});
				let exchangeRate = currentQuote ? commonService.getExchangeRate(currentQuote.RfqHeaderFk, currentQuote.Id) : 1;
				let priceConditionParams = [];
				let isDiscountModified = !_.isEmpty(originalQuoteItems) && !_.isEqual(originalQuoteItems[0].Discount, item.Discount);
				let isDiscountAbsoluteModified = !_.isEmpty(originalQuoteItems) && !_.isEqual(originalQuoteItems[0].DiscountAbsolute, item.DiscountAbsolute);

				_.forEach(originalQuoteItems, function (originalItem) {
					let newPrice = _.toNumber(item.Price);
					newPrice = newPrice === Infinity || newPrice === -Infinity || _.isNaN(newPrice) ? 0 : newPrice;
					let vatPercent = prcCommonGetVatPercent.getVatPercent(originalItem.TaxCodeFk, originalItem['QtnHeaderVatGroupFk']);
					let originalPrice = originalItem.Price;
					isPriceChanged = isPriceChanged || originalItem.Price !== newPrice;
					originalItem.Price = newPrice;
					originalItem.PriceOc = newPrice * (exchangeRate || 1);

					if (!originalItem.IsIdealBidder || item.IsIdealBidder) {
						originalItem.PriceExtra = item.PriceExtra;
						originalItem.PriceExtraOc = item.PriceExtraOc;
					}

					if (originalItem.IsIdealBidder) {
						originalItem.PriceOc = item.PriceOc;
						originalItem.PriceGross = item.PriceGross;
						originalItem.PriceGrossOc = item.PriceGrossOc;
					}

					originalItem.Quantity = item.Quantity;
					originalItem.PriceUnit = item.PriceUnit;
					if (isExchangeRateChange) {
						originalItem.PriceExtra = originalItem.PriceExtraOc / (exchangeRate || 1);
					}

					let recalculateDiscountAbsoluteFields = (item, vatPercent) => {
						item.DiscountAbsolute = itemCalculateHelperService.getDiscountAbsolute(item);
						item.DiscountAbsoluteOc = itemCalculateHelperService.getDiscountAbsoluteOc(item);
						item.DiscountAbsoluteGross = itemCalculateHelperService.getDiscountAbsoluteGrossByDA(item, vatPercent);
						item.DiscountAbsoluteGrossOc = itemCalculateHelperService.getDiscountAbsoluteGrossOcByOc(item, vatPercent);
					};
					let syncDiscountAbsoluteFields = (originalItem, item) => {
						originalItem.DiscountAbsolute = item.DiscountAbsolute;
						originalItem.DiscountAbsoluteOc = item.DiscountAbsoluteOc;
						originalItem.DiscountAbsoluteGross = item.DiscountAbsoluteGross;
						originalItem.DiscountAbsoluteGrossOc = item.DiscountAbsoluteGrossOc;
						originalItem.Discount = item.Discount;
					};
					if (isDiscountModified) {
						recalculateDiscountAbsoluteFields(item, vatPercent);
						syncDiscountAbsoluteFields(originalItem, item);
					} else if (isDiscountAbsoluteModified) {
						item.DiscountAbsoluteOc = itemCalculateHelperService.getDiscountAbsoluteOcByDA(item, exchangeRate);
						item.DiscountAbsoluteGross = itemCalculateHelperService.getDiscountAbsoluteGrossByDA(item, vatPercent);
						item.DiscountAbsoluteGrossOc = itemCalculateHelperService.getDiscountAbsoluteGrossOcByOc(item, vatPercent);
						item.Discount = itemCalculateHelperService.getDiscount(item);
						syncDiscountAbsoluteFields(originalItem, item);
					} else {
						item.Discount = itemCalculateHelperService.getDiscount(item);
						syncDiscountAbsoluteFields(originalItem, item);
					}

					// Co2Project
					item.Co2ProjectTotal = (!_.isUndefined(item.Co2Project) ? item.Co2Project : 0) * item.Quantity;
					originalItem.Co2Project = item.Co2Project;
					originalItem.Co2ProjectTotal = item.Co2ProjectTotal;

					// charge
					originalItem.Charge = item.Charge;
					originalItem.ChargeOc = item.ChargeOc;

					if (!itemCalculateHelperService.isCalculateOverGross()) {
						originalItem.TotalPrice = itemCalculateHelperService.getTotalPrice(originalItem, vatPercent);
						originalItem.TotalPriceOc = itemCalculateHelperService.getTotalPriceOc(originalItem, vatPercent);
						originalItem.FactoredTotalPrice = itemCalculateHelperService.getFactoredTotalPrice(originalItem, vatPercent);

						if (!itemCalculateHelperService.setTotalFieldsZeroIfOptionalOrAlternativeItem(originalItem)) {
							originalItem.Total = itemCalculateHelperService.getTotal(originalItem, vatPercent);
							originalItem.TotalOc = itemCalculateHelperService.getTotalOc(originalItem, vatPercent);
							originalItem.TotalNoDiscount = itemCalculateHelperService.getTotalNoDiscount(originalItem, vatPercent);
							originalItem.TotalCurrencyNoDiscount = itemCalculateHelperService.getTotalOcNoDiscount(originalItem, vatPercent);
							originalItem.PriceGross = itemCalculateHelperService.getPriceGross(originalItem, vatPercent);
							originalItem.PriceGrossOc = itemCalculateHelperService.getPriceGrossOc(originalItem, vatPercent);
							originalItem.TotalPriceGrossOc = itemCalculateHelperService.getTotalPriceOCGross(originalItem, vatPercent);
							originalItem.TotalPriceGross = itemCalculateHelperService.getTotalPriceGross(originalItem, vatPercent, exchangeRate);
							originalItem.TotalGrossOc = itemCalculateHelperService.getTotalGrossOc(originalItem, vatPercent);
							originalItem.TotalGross = itemCalculateHelperService.getTotalGross(originalItem, vatPercent, exchangeRate);
						}
					} else {
						// originalItem.Price = itemCalculateHelperService.getPrice(originalItem, vatPercent);
						// originalItem.PriceOc = itemCalculateHelperService.getPriceOc(originalItem, vatPercent);

						originalItem.TotalPriceGrossOc = itemCalculateHelperService.getTotalPriceOCGross(originalItem, vatPercent);
						originalItem.TotalPriceGross = itemCalculateHelperService.getTotalPriceGross(originalItem, vatPercent, exchangeRate);
						originalItem.TotalPrice = itemCalculateHelperService.getTotalPrice(originalItem, vatPercent);
						originalItem.TotalPriceOc = itemCalculateHelperService.getTotalPriceOc(originalItem, vatPercent);
						originalItem.FactoredTotalPrice = itemCalculateHelperService.getFactoredTotalPrice(originalItem, vatPercent);
						originalItem.TotalGrossOc = itemCalculateHelperService.getTotalGrossOc(originalItem, vatPercent);
						originalItem.TotalGross = itemCalculateHelperService.getTotalGross(originalItem, vatPercent, exchangeRate);
						originalItem.Total = itemCalculateHelperService.getTotal(originalItem, vatPercent);
						originalItem.TotalOc = itemCalculateHelperService.getTotalOc(originalItem, vatPercent);
						originalItem.TotalNoDiscount = itemCalculateHelperService.getTotalNoDiscount(originalItem, vatPercent);
						originalItem.TotalCurrencyNoDiscount = itemCalculateHelperService.getTotalOcNoDiscount(originalItem, vatPercent);
					}
					if (isPriceChanged && !originalItem.IsIdealBidder && !isExchangeRateChange) {
						let currPriceConditionParam = _.find(priceConditionParams, function (currItem) {
							return currItem.originalItem.QtnHeaderId === originalItem.QtnHeaderId && currItem.originalItem.PrcItemId === originalItem.PrcItemId;
						});
						if (!currPriceConditionParam) {
							let priceConditionParam = {
								// IsIdealBidder: originalItem.IsIdealBidder,
								// isPriceChanged: isPriceChanged,
								originalItem: originalItem,
								originalPrice: originalPrice,
								exchangeRate: exchangeRate,
								rfqHeaderId: currentQuote ? currentQuote.RfqHeaderFk : null,
								originalQuoteItems: originalQuoteItems
							};
							priceConditionParams.push(priceConditionParam);
						}
					}
				});

				_.forEach(priceConditionParams, function (currItem) {
					service.onPriceChanged.fire({
						originalItem: currItem.originalItem,
						originalPrice: currItem.originalPrice,
						exchangeRate: currItem.exchangeRate,
						rfqHeaderId: currItem.rfqHeaderId,
						originalQuoteItems: originalQuoteItems
					});
				});

				if (!item.IsIdealBidder) {
					let currPriceConditionParam = _.find(priceConditionParams, function (currItem) {
						return currItem.originalItem.QtnHeaderId === item.QtnHeaderId && currItem.originalItem.PrcItemId === item.PrcItemId;
					});
					if (!currPriceConditionParam) {
						const actionArgs = {
							exchangeRate: exchangeRate,
							qtnHeaderId: item.QtnHeaderId,
							currentItem: item,
							originalQuoteItems: originalQuoteItems
						};
						if (asyncAction) {
							asyncAction(actionArgs).then(() => {
								service.onCalculateCompleted.fire(actionArgs);
							});
						} else {
							service.onCalculateCompleted.fire(actionArgs);
						}
					}
				}
			};

			service.getDefaultColumns = function (itemConfigService) {
				var commonColumns = angular.copy(itemConfigService.getCommonColumns());
				var commonColumns2 = angular.copy(itemConfigService.getCommonColumns2());
				var lineNameColumn = angular.copy(itemConfigService.getLineNameColumn());
				// get compare 'description' column (using the custom 'description' value).
				var compareDescriptionColumn = angular.copy(itemConfigService.getCompareDescriptionColumnByCustomSettings());
				var maxMinAverageColumns = angular.copy(itemConfigService.getMaxMinAverageColumns());

				return commonColumns.concat(lineNameColumn).concat(compareDescriptionColumn).concat(maxMinAverageColumns).concat(commonColumns2);
			};

			service.loadColumns = function (itemConfigService, itemStructureService, configColumns, options) {
				var opts = printCommonService.merge2({
					columnDomainFn: null,
					isVerticalCompareRows: false,
					isLineValueColumn: false,
					isFinalShowInTotal: false
				}, options);

				var quoteColumns = createQuoteColumns(itemConfigService, itemStructureService, opts.columnDomainFn, opts.isVerticalCompareRows, opts.isLineValueColumn, configColumns);

				itemConfigService.applyCustomCssStyleForQuoteColumnCell(quoteColumns);

				var defaultColumns = service.getDefaultColumns(itemConfigService);

				var columns = commonService.getGridConfigColumns(configColumns, defaultColumns, quoteColumns);
				_.each(columns, function (column, index) {
					if (!column.pinned && !column.isDynamic) {
						column.groupName = commonHelperService.textPadding('', ' ', index + 1);
					}
				});
				return columns;
			};

			service.loadData = function (readData, itemConfigService, itemDataStructureService, options) {
				itemConfigService = itemConfigService ? itemConfigService : $injector.get('procurementPriceComparisonItemConfigService');
				itemDataStructureService = itemDataStructureService ? itemDataStructureService : $injector.get('procurementPriceComparisonItemDataStructureService');
				itemConfigService.itemQtnMatchCache = {};
				var opts = printCommonService.merge2({
					serviceData: null,
					childProp: 'Children',
					onReadSuccess: null,
					isVerticalCompareRows: false
				}, options);
				itemDataStructureService.setCompareDirections({
					isVerticalCompareRows: opts.isVerticalCompareRows,
					isFinalShowInTotal: opts.isFinalShowInTotal
				});
				itemConfigService.setCompareDirections({
					isVerticalCompareRows: opts.isVerticalCompareRows,
					isFinalShowInTotal: opts.isFinalShowInTotal
				});
				commonHelperService.killRunningReadRequest(opts.serviceData);
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/list', readData, {
					timeout: commonHelperService.provideReadRequestToken(opts.serviceData)
				}).then(function (response) {
					if (angular.isFunction(opts.onReadSuccess)) {
						opts.onReadSuccess(response.data);
					}
					var itemsSource = [];
					commonHelperService.endRunningReadRequest(opts.serviceData);
					if (_.isEmpty(response.data)) {
						return itemsSource;
					}
					for (var i = 0; i < response.data.length; i++) {
						var rfqCompareData = angular.copy(response.data[i]);
						var isChangeOrder = true;
						if (i === 0) {
							isChangeOrder = false;
							service.cacheCustomSettings(rfqCompareData, itemConfigService);

							itemConfigService.rfqHeadersCache = rfqCompareData.RfqHeader;

							if (rfqCompareData.Quote) {
								commonHelperService.processQuote(rfqCompareData.Quote);
							}

							lookupDescriptorService.attachData(rfqCompareData);
							itemConfigService.generalTypesCache = lookupDescriptorService.getData('PrcGeneralsType');
							itemConfigService.quoteItemAddressCache = lookupDescriptorService.getData('Address');
						}

						var rfqRow = itemDataStructureService.restructureCompareData(rfqCompareData, isChangeOrder);
						itemsSource.push(rfqRow);
					}

					commonHelperService.addTotalTypeRows(itemConfigService.visibleCompareColumnsCache, itemsSource, commonService.constant.compareType.prcItem, response.data[0].PrcTotalTypes, response.data[0].QtnTotals);

					if (commonHelperService.isEvaluatedTotalVisible(itemConfigService.visibleQuoteCompareRowsCache)) {
						itemDataStructureService.addEvaluatedTotalRowAndSetColumnValues(itemsSource);
					}
					if (commonHelperService.isOfferedTotalVisible(itemConfigService.visibleQuoteCompareRowsCache)) {
						itemDataStructureService.addOfferedTotalRowAndSetColumnValues(itemsSource);
					}
					itemDataStructureService.addGrandTotalRowAndSetColumnValues(itemsSource);
					commonHelperService.setRowValuesForStructureColumn(itemsSource, null, commonService.constant.compareType.prcItem);
					itemDataStructureService.setRowValuesForLineNameColumn(itemsSource);
					commonHelperService.attachExtraValueToTreeRows(itemsSource, service.getRowDataProcessors(), opts.childProp);
					return itemsSource;
				});
			};

			service.cacheCustomSettings = function (itemList, itemConfigService) {

				// convert base /change columns into a tree (always using base custom columns)
				var context = {
					treeOptions: {
						parentProp: 'CompareColumnFk',
						childProp: 'Children'
					},
					IdProperty: 'Id'
				};
				itemConfigService.visibleCompareColumnsCache = basicsLookupdataTreeHelper.buildTree(itemList.ItemCustomColumn || [], context);

				/** @namespace itemList.ItemCustomRow */
				var customCompareRows = itemList.ItemCustomRow || [];
				if (customCompareRows.length > 0) {
					itemConfigService.showInSummaryCompareRowsCache = _.filter(customCompareRows, {
						CompareType: commonService.constant.compareType.prcItem,
						ShowInSummary: true
					});

					itemConfigService.visibleCompareRowsCache = _.filter(customCompareRows, {
						CompareType: commonService.constant.compareType.prcItem,
						Visible: true
					});

					var leadingFields = _.map(_.filter(customCompareRows, {
						CompareType: commonService.constant.compareType.prcItem,
						IsLeading: true
					}), 'Field');
					if (angular.isArray(leadingFields) && leadingFields.length > 0) {
						itemConfigService.leadingFieldCache = leadingFields[0];
					}
				}

				// custom quote compare field rows
				/** @namespace itemList.ItemCustomQuoteRow */
				itemConfigService.visibleQuoteCompareRowsCache = _.filter(itemList.ItemCustomQuoteRow, {
					CompareType: commonService.constant.compareType.prcItem,
					Visible: true
				});

				// custom quote compare field rows
				/** @namespace itemList.ItemCustomSchemaRow */
				itemConfigService.visibleSchemaCompareRowsCache = _.filter(itemList.ItemCustomSchemaRow, {
					CompareType: commonService.constant.compareType.prcItem,
					Visible: true
				});

				commonService.finalBillingSchemaCache = itemList.FinalBillingSchemas || [];
			};

			service.restructureQuoteCompareColumns = function (mainDtos, rfqQuotes, enableBoqTarget, baseColumns) {
				return commonHelperService.restructureQuoteCompareColumns(mainDtos, rfqQuotes, enableBoqTarget, baseColumns);
			};

			service.isPrcItemOrCompareRow = function (lineType) {
				return lineType === compareLineTypes.compareField || lineType === compareLineTypes.prcItem;
			};

			service.getRowDataProcessors = function getRowDataProcessors() {
				if (!_.isEmpty(_dataRowProcessors)) {
					return _dataRowProcessors;
				}

				let dateProcess = new ServiceDataProcessDatesExtension(['OnHire', 'OffHire', 'DateRequired']);

				_dataRowProcessors.push(commonHelperService.createRowProcessor('QuoteCol_-1_-1_-1', [
					{rowProp: 'UserDefined1', targetProp: 'Userdefined1'},
					{rowProp: 'UserDefined2', targetProp: 'Userdefined2'},
					{rowProp: 'UserDefined3', targetProp: 'Userdefined3'},
					{rowProp: 'UserDefined4', targetProp: 'Userdefined4'},
					{rowProp: 'UserDefined5', targetProp: 'Userdefined5'},
					{rowProp: 'BudgetPerUnit', targetProp: 'BudgetPerUnit'},
					{rowProp: 'BudgetTotal', targetProp: 'BudgetTotal'},
					'ExternalCode',
					'UomFk',
					'TaxCodeFk',
					'StructureFk',
					'Specification',
					'DateRequired',
					'PaymentTermFiFk',
					'PaymentTermPaFk',
					'OnHire',
					'OffHire',
					'MdcMaterialFk',
					'ItemAlt',
					'PrcIncotermFk',
					'Description1',
					'Description2',
					'AddressFk',
					'ControllingUnitFk',
					'Quantity',
					'ItemTypeFk',
					'ItemType2Fk'
				], function (row) {
					return commonHelperService.isPrcItemRow(row.LineType);
				}, function (row) {
					let target = _.find(row.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});
					if (!target) {
						target = _.find(row.QuoteItems, function (item) {
							return item.QtnHeaderId > 0;
						});
						// target = row.QuoteItems[0];
					}
					return target;
				}));

				_dataRowProcessors.push({
					isMatched: function (row) {
						return commonHelperService.isPrcItemRow(row.LineType);
					},
					process: function (row) {
						dateProcess.processItem(row);
					}
				});

				return _dataRowProcessors;

			};

			return service;

		}]);

})(angular);