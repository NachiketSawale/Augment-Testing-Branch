/*
 * created by miu on 07/18 2022
*/
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonItemEvaluationService', ['_', '$http', 'globals', '$translate', 'platformGridAPI',
		'platformModalService', 'platformDataServiceFactory', 'procurementContextService', 'procurementPriceComparisonMainService',
		'procurementPriceComparisonCommonHelperService', 'procurementPriceComparisonCheckBidderService', 'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonBoqDataStructureService',
		'procurementPriceComparisonItemDataStructureService',
		'prcCommonGetVatPercent', 'prcCommonItemCalculationHelperService',
		'procurementPriceComparisonLineTypes',
		'platformRuntimeDataService',
		function (_, $http, globals, $translate, platformGridAPI, platformModalService, platformDataServiceFactory, moduleContext,
			procurementPriceComparisonMainService, commonHelperService, checkBidderService, lookupDescriptorService,
			commonService, boqService, itemService, boqHelperService, itemHelperService, boqDataStructureService, itemDataStructureService,
			prcCommonGetVatPercent, itemCalculationHelper, compareLineTypes, platformRuntimeDataService) {
			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonItemEvaluationService',
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: '',
						childProp: 'Children',
						incorporateDataRead: incorporateDataRead
					}
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/',
					endRead: 'quotes4wizarditemevaluation',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.rfqHeaderFk = procurementPriceComparisonMainService.getIfSelectedIdElse(-1);
						readData.compareType = getCompareType(); // (1:Item; 2: Boq; 3: both; 0: nothing)
					}
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},
				isInitialSorted: false
			};

			let service = platformDataServiceFactory.createNewComplete(serviceOption).service;
			let selectedQuoteHeaders = [];
			let selectedPrcItems = [];
			let selectedBoqItems = [];

			function itemGridId() {
				return 'ef496d027ad34b1f8fe282b1d6692ded';
			}

			function boqGridId() {
				return '8b9a53f0a1144c03b8447a99f7b38448';
			}

			function quoteHeaders(selectItems) {
				if (selectItems) {
					selectedQuoteHeaders = selectItems;
				} else {
					return selectedQuoteHeaders;
				}
			}

			function getCompareType() {
				let itemExist = platformGridAPI.grids.exist(itemGridId()) ? 1 : 0;
				let boqExist = platformGridAPI.grids.exist(boqGridId()) ? 2 : 0;
				return itemExist + boqExist;
			}

			function incorporateDataRead(readData, data) {
				let reqCounts = readData.QtnReqCount || [],
					totals = readData.Totals || [],
					baseQuotes = [],
					changeQuotes = [];
				// distinct by 'QuoteHeaderId' and remove base and target quote
				readData.Main = _.uniq(readData.Main || [], 'QuoteHeaderId').filter(function (item) {
					return checkBidderService.item.isNotReference(parseInt(item.QuoteHeaderId)) && !item.IsIdealBidder;
				}).map(function (item) {
					// add a checkbox, req-count, grand-total column to the data
					item.IsChecked = true;
					item.ReqCount = commonHelperService.getReqCount(reqCounts, item.QuoteHeaderId);
					item.subTotal = commonHelperService.getSubTotal(totals, item.QuoteHeaderId);
					item.grandTotal = commonHelperService.getGrandTotal(readData.Quote, totals, item.BusinessPartnerId, item.QuoteVersion);
					item.Children = []; // is hierarchy now (Base quote has change quotes now)
					selectedQuoteHeaders.push(item);
					return item;
				});
				// rebuild tree
				_.forEach(readData.Main, function (item) {
					if (!item.CompareColumnFk) {
						baseQuotes.push(item);
					} else {
						changeQuotes.push(item);
					}
				});
				_.forEach(baseQuotes, function (base) {
					base.Children = [];
					_.forEach(changeQuotes, function (child) {
						child.Children = [];
						if (child.CompareColumnFk === base.Id) {
							child.ReqCount = commonHelperService.getReqCount(reqCounts, child.QuoteHeaderId);
							child.subTotal = commonHelperService.getSubTotal(totals, child.QuoteHeaderId);
							child.grandTotal = commonHelperService.getGrandTotal(readData.Quote, totals, child.BusinessPartnerId, child.QuoteVersion);
							base.Children.push(child);
						}
					});
				});
				return data.handleReadSucceeded(baseQuotes, data, true);
			}

			function doEvaluate(evaluateOption) {
				let selectedQuoteHeaders = _.filter(service.getList(), function (item) {
					return item.IsChecked;
				});

				_.forEach(selectedQuoteHeaders, function (quote) {
					if (isEvaluateItem()) {
						evaluateItem(quote, evaluateOption);
					}
					if (isEvaluateBoq()) {
						evaluateBoq(quote, evaluateOption);
					}
				});
				if (isEvaluateBoq()) {
					service.selectedBoqItems([]);
					boqService.redrawTree(false, null);
				}
				if (isEvaluateItem()) {
					service.selectedPrcItems([]);
					itemService.redrawTree(false, null);
				}
			}

			function isEvaluateItem(){
				return platformGridAPI.grids.exist(itemGridId()) && itemService.getTree() && itemService.getTree().length > 0;
			}

			function isEvaluateBoq(){
				return platformGridAPI.grids.exist(boqGridId()) && boqService.getTree() && boqService.getTree().length > 0;
			}

			function evaluateItem(quote, evaluateOption) {
				let itemTree = itemService.getTree();
				if (itemTree && itemTree.length > 0) {
					let rfqRow = _.find(itemTree, {LineType: -12});
					let reqRows = _.filter(rfqRow.Children, {LineType: compareLineTypes.requisition});
					_.forEach(reqRows, reqRow => {
						_.forEach(reqRow.Children, reqItem => {
							let quoteItems = _.filter(reqItem.QuoteItems, {QuoteKey: quote.Id});
							let targetItems = [];
							let selectedPrcItems = service.selectedPrcItems();
							if (selectedPrcItems && selectedPrcItems.length > 0) {
								let selectedPrcItemIds = selectedPrcItems.map(e => e.Id);
								targetItems = targetItems.concat(_.filter(quoteItems, function(item){
									return _.indexOf(selectedPrcItemIds, item.PrcItemId) > -1;
								}));
								_.forEach(targetItems, item => {
									let vatPercent = prcCommonGetVatPercent.getVatPercent(item.TaxCodeFk, item.QtnHeaderVatGroupFk);
									let currentQuote = _.find(lookupDescriptorService.getData('quote'), { Id: item.QtnHeaderId });
									let exchangeRate = currentQuote ? commonService.getExchangeRate(currentQuote.RfqHeaderFk, currentQuote.Id) : 1;
									let isVerticalCompareRows = itemService.isVerticalCompareRows();
									let priceRow = _.find(reqItem.Children, { Id: reqItem.PrcItemId + '_Price' });
									let targetValue = getItemEvaluationValue(evaluateOption.itemEvaluation, isVerticalCompareRows, priceRow, item, 'PrcItemId', reqItem);
									if (targetValue !== undefined && targetValue !== -1 && targetValue !== '-') {
										let allQuoteItems = commonService.getAllQuoteItems(itemTree, 'Children');
										let originalQuoteItems = _.filter(allQuoteItems, function(i) {
											return i.PrcItemId === item.PrcItemId && i.QtnHeaderId === item.QtnHeaderId;
										});
										_.each(originalQuoteItems.concat(item), function(entity) {
											entity.Price = targetValue;
											entity.PrcItemEvaluationId = evaluateOption.itemEvaluation;
											entity.ExQtnIsEvaluated = true;
											itemCalculationHelper.setPricePriceOcPriceGrossPriceGrossOc(entity, entity.Price, 'Price', vatPercent, exchangeRate);
										});
										if (item.Price > 0) {
											item.NotSubmitted = false;
											if (!isVerticalCompareRows) {
												let notSubmittedItem = _.find(reqItem.Children, { Id: reqItem.Id + '_NotSubmitted' });
												if (notSubmittedItem) {
													platformRuntimeDataService.readonly(notSubmittedItem, [{
														field: item.QuoteKey,
														readonly: false
													}]);
												}
											} else {
												platformRuntimeDataService.readonly(reqItem, [{
													field: item.QuoteKey + '_NotSubmitted',
													readonly: false
												}]);
											}
										}
										commonService.assignItemEvaluation(evaluateOption.itemEvaluation, isVerticalCompareRows, item, reqItem, 'Children');

										// if modified data to save
										itemService.collectItemEvaluationModifiedDataFromWizard(item);

										itemHelperService.recalculatePrcItem(originalQuoteItems, item, false);
									}
								});
							}
						});
					});
				}
			}

			function evaluateBoq(quote, evaluateOption) {
				let modifiedData = {
					modifiedItems: [],
					originalQuoteItems: []
				};
				let boqTree = boqService.getTree();
				if (boqTree && boqTree.length > 0) {
					let rfqRow = _.find(boqTree, {BoqLineTypeFk: -12});
					if (rfqRow) {
						let requisitions = _.filter(rfqRow.BoqItemChildren, {BoqLineTypeFk: compareLineTypes.requisition});
						_.forEach(requisitions, requisition => {
							_.forEach(requisition.BoqItemChildren, root => {
								evaluatePositionBoqItems(root.BoqItemChildren, quote, evaluateOption, modifiedData);
							});
						});
						if (modifiedData.modifiedItems.length > 0) {
							boqService.recalculateList(quote.Id, modifiedData.modifiedItems);
						}
					}
				}
			}

			function evaluatePositionBoqItems(boqItems, quote, evaluateOption, modifiedData) {
				_.forEach(boqItems, parent => {
					if (commonHelperService.isBoqPositionRow(parent.BoqLineTypeFk)) {
						evaluatePositionBoqItem(parent, quote, evaluateOption, modifiedData);
					} else {
						if (parent && isPositionBoqItemParent(parent)) {
							_.forEach(parent.BoqItemChildren, childItem => {
								if (commonHelperService.isBoqPositionRow(childItem.BoqLineTypeFk)) {
									evaluatePositionBoqItem(childItem, quote, evaluateOption, modifiedData);
								}
							});
						} else {
							if (parent && Object.hasOwn(parent, 'BoqItemChildren')) {
								evaluatePositionBoqItems(parent.BoqItemChildren, quote, evaluateOption, modifiedData);
							}
						}
					}
				});
			}

			function evaluatePositionBoqItem(positionBoqItem, quote, evaluateOption, modifiedData) {
				let quoteItems = _.filter(positionBoqItem.QuoteItems, {QuoteKey: quote.Id});
				let targetItems = [];
				let selectedBoqItems = service.selectedBoqItems();
				if (selectedBoqItems && selectedBoqItems.length > 0) {
					let selectedBoqItemIds = selectedBoqItems.map(e => e.Id);
					targetItems = targetItems.concat(_.filter(quoteItems, function(item){
						return _.indexOf(selectedBoqItemIds, item.BoqItemId) > -1;
					}));
					_.forEach(targetItems, boqItem => {
						let isVerticalCompareRows = boqService.isVerticalCompareRows();
						let priceRow = _.find(positionBoqItem.BoqItemChildren, { Id: positionBoqItem.BoqItemId + '_Price' });
						let targetValue = getItemEvaluationValue(evaluateOption.itemEvaluation, isVerticalCompareRows, priceRow, boqItem, 'BoqItemId', positionBoqItem);
						if (targetValue !== undefined && targetValue !== -1 && targetValue !== '-') {
							modifiedData.originalQuoteItems.push(angular.copy(boqItem));
							boqItem.Price = targetValue;
							boqItem.PrcItemEvaluationId = evaluateOption.itemEvaluation;
							boqItem.ExQtnIsEvaluated = true;
							if (boqItem.Price > 0) {
								boqItem.NotSubmitted = false;
								if (!isVerticalCompareRows) {
									let notSubmittedItem = _.find(positionBoqItem.BoqItemChildren, { Id: positionBoqItem.Id + '_NotSubmitted' });
									if (notSubmittedItem) {
										platformRuntimeDataService.readonly(notSubmittedItem, [{ field: boqItem.QuoteKey, readonly: false }]);
									}
								} else {
									platformRuntimeDataService.readonly(positionBoqItem, [{
										field: boqItem.QuoteKey + '_NotSubmitted',
										readonly: false
									}]);
								}

								boqItem.Included = false;
								if (!isVerticalCompareRows) {
									let includedItem = _.find(positionBoqItem.BoqItemChildren, { Id: positionBoqItem.Id + '_Included' });
									if (includedItem) {
										platformRuntimeDataService.readonly(includedItem, [{ field: boqItem.QuoteKey, readonly: false }]);
									}
								} else {
									platformRuntimeDataService.readonly(positionBoqItem, [{
										field: boqItem.QuoteKey + '_Included',
										readonly: false
									}]);
								}
							}
							commonService.assignItemEvaluation(evaluateOption.itemEvaluation, isVerticalCompareRows, boqItem, positionBoqItem, 'BoqItemChildren');

							// if modified data to save
							boqService.collectBoqEvaluationModifiedDataFromWizard(boqItem, quote.RfqHeaderId);

							modifiedData.modifiedItems.push(angular.copy(boqItem));
						}
					});
				}
			}

			function isPositionBoqItemParent(boqItem) {
				if (Object.hasOwn(boqItem, 'BoqItemChildren')) {
					let boqItemChildren = _.filter(boqItem.BoqItemChildren, {BoqLineTypeFk: 0});
					return boqItemChildren && boqItemChildren.length > 0;
				} else {
					return false;
				}
			}

			function getItemEvaluationValue(itemEvaluation, isVerticalCompareRows, priceRow, currentItem, idField, parentItem) {
				let currentFieldValues = [];
				let targetItems = _.filter(parentItem.originPriceExcludeTarget, function (item) {
					return item[idField] !== currentItem[idField] && !item.NotSubmitted;
				});

				_.forEach(targetItems,
					function (quoteItem) {
						currentFieldValues.push(quoteItem.Price);
					});

				let targetValue = -1;
				switch (itemEvaluation) {
					case 4: {// requisition price
						if (!isVerticalCompareRows && priceRow) {
							targetValue = priceRow['QuoteCol_-1_-1_-1'];
						} else {
							targetValue = parentItem['QuoteCol_-1_-1_-1_Price'];
						}
						break;
					}
					case 5: {// average
						targetValue = commonService.calculateAverageValue(currentFieldValues) || 0;
						break;
					}
					case 6: {// minimum
						targetValue = commonHelperService.getRepairNumeric(_.min(currentFieldValues));
						break;
					}
					case 7: {// maximum
						targetValue = commonHelperService.getRepairNumeric(_.max(currentFieldValues));
						break;
					}
					case 10: {// requisition budget unit
						targetValue = parentItem.BudgetPerUnit;
						break;
					}
					default: {
						break;
					}
				}
				return targetValue;
			}

			service.quoteHeaders = quoteHeaders;
			service.doEvaluate = doEvaluate;
			service.isEvaluateItem = isEvaluateItem;
			service.isEvaluateBoq = isEvaluateBoq;

			service.selectedPrcItems = function(selectItems){
				if (selectItems) {
					selectedPrcItems = selectItems;
				} else {
					return selectedPrcItems;
				}
			}

			service.selectedBoqItems = function(selectItems){
				if (selectItems) {
					selectedBoqItems = selectItems;
				} else {
					return selectedBoqItems;
				}
			}

			return service;
		}]);
})(angular);