/**
 * Created by wed on 9/27/2018.
 */
(function (angular) {

	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemDataStructureServiceFactory', [
		'_', '$injector', '$translate', 'basicsLookupdataLookupDescriptorService', 'procurementPriceComparisonCommonService', 'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonCommonHelperService', 'procurementPriceComparisonCheckBidderService',
		function (_, $injector, $translate, lookupDescriptorService, commonService, compareLineTypes, commonHelperService, checkBidderService) {

			let serviceCache = {};

			function createService(itemConfigService, serviceName) {

				if (serviceName && serviceCache[serviceName]) {
					return serviceCache[serviceName];
				}

				let service = {}, compareDirections = {
					isVerticalCompareRows: false,
					isFinalShowInTotal: true
				};

				// store the local data required for item comparison used only by one Rfq
				let rfqCharacteristicGroupTreeCache = [];
				let rfqCharacteristicGroupListCache = [];

				/**
				 * restructure rfq's original comparison data according to user's custom settings.
				 * @param { object } rfqData The rfq's original comaprison data.
				 * @param { bool } isChangeOrder: if true, we need reset the rows (Status/QuoteDate/Version) value from change order quote.
				 * @returns { object } The finalcomparsion data of Rfq.
				 */
				service.restructureCompareData = function restructureCompareData(rfqData, isChangeOrder) {
					// clear data.
					// rfqCharacteristicGroupTreeCache = [];
					rfqCharacteristicGroupListCache = [];
					itemConfigService.rfqCharacteristicCache = [];
					itemConfigService.quoteCharacteristicCache = [];
					commonService.generalItems = {};

					// characteristic data for compare
					rfqCharacteristicGroupTreeCache = rfqData[commonService.constant.rfqCharacteristicGroup] || [];
					commonService.flatCharacteristicGroupTree(rfqCharacteristicGroupTreeCache, rfqCharacteristicGroupListCache);

					itemConfigService.rfqCharacteristicCache = rfqData[commonService.constant.rfqCharacteristic] || [];
					itemConfigService.quoteCharacteristicCache = rfqData[commonService.constant.quoteCharacteristic] || [];
					itemConfigService.allRfqCharacteristicCache = itemConfigService.allRfqCharacteristicCache.concat(rfqData[commonService.constant.rfqCharacteristic] || []);
					itemConfigService.allQuoteCharacteristicCache = itemConfigService.allQuoteCharacteristicCache.concat(rfqData[commonService.constant.quoteCharacteristic] || []);

					cacheOriginalFields(rfqData.Main);
					let qtnKeyMatch = [];
					_.forEach(rfqData.Main, function (requisition) {
						requisition.cssClass = 'font-bold'; // set font format for Requisition Row
						setChangeOrderQuoteKey2BaseOrderQuoteKey(requisition);
						qtnKeyMatch = qtnKeyMatch.concat(retrieveComboQuotes(requisition.QuoteItems, rfqData['ItemCustomColumn']));
						commonService.generalItems[requisition.RfqHeaderId] = requisition.QuoteGeneralItems;

						setReplacementItemsForPrcItem(requisition);
						commonHelperService.addGeneralTotalRow2RequisitionRow(requisition, itemConfigService.visibleCompareRowsCache, itemConfigService, 'LineType', 'Children');

						setColumnValuesForRequisitionRow(requisition);
					});
					itemConfigService.itemQtnMatchCache[rfqData.Main[0].RfqHeaderId] = qtnKeyMatch;
					let rfqRow = addRfqRow(rfqData.Main);
					setColumnValuesForRfqRow(rfqRow);

					commonService.addCharacteristicTotalRow2RfqRow(itemConfigService, itemConfigService.itemQtnMatchCache, rfqRow.Children, rfqCharacteristicGroupTreeCache, 'Children', 'LineType', itemConfigService.visibleQuoteCompareRowsCache);

					// add billing schema compare field
					commonService.addSchemaCompareFieldRows(rfqRow.Children, rfqRow.RfqHeaderId, rfqRow.ReqHeaderId, itemConfigService, 'Children', 'LineType');
					// add quote compare field
					commonHelperService.addQuoteCompareFieldRows(itemConfigService, itemConfigService.visibleQuoteCompareRowsCache, commonService.constant.compareType.prcItem, rfqRow.Children, isChangeOrder, rfqRow.RfqHeaderId, rfqRow.ReqHeaderId, compareDirections.isVerticalCompareRows);

					commonHelperService.attachValueFromParent(rfqRow, 'Children', [{
						sourceProp: 'Id',
						targetProp: 'ParentId'
					}]);

					return rfqRow;
				};

				function retrieveComboQuotes(QuoteItems, bidderQuotes) {
					let comboQuotes = [];
					_.forEach(QuoteItems, function (item) {
						let quote = {
							QuoteKey: item.QuoteKey,
							OwnQuoteKey: item.OwnQuoteKey,
							BusinessPartnerId: item.BusinessPartnerId,
							QtnVersion: item.QtnVersion,
							ReqHeaderId: item.ReqHeaderId,
							PrcHeaderId: item.PrcHeaderId,
							PrcItemId: item.PrcItemId,
							QtnHeaderId: item.QtnHeaderId,
							ConfigurationId: commonHelperService.tryGetQuoteConfigurationId(item.QtnHeaderId),
							type: 'item'
						};

						let quoteId = _.parseInt((quote.OwnQuoteKey ? quote.OwnQuoteKey : quote.QuoteKey).split('_')[1]);
						let quoteList = lookupDescriptorService.getData('quote');
						let originalQuote = _.find(quoteList, {Id: quoteId});
						if (originalQuote) {
							quote.Id = originalQuote.Id;
							quote.RfqHeaderId = originalQuote.RfqHeaderFk;
							quote.ExchangeRate = originalQuote.ExchangeRate || 1;
							quote.BillingSchemaFk = originalQuote.BillingSchemaFk || null;
							quote.RubricCategoryFk = originalQuote.RubricCategoryFk || null;
							quote.ProjectId = originalQuote.ProjectFk || null;
							quote.IsIdealBidder = originalQuote.IsIdealBidder || false;
						}

						let bidderQuote = _.find(bidderQuotes, {Id: quote.QuoteKey});
						if (bidderQuote) {
							quote.EvaluationList = bidderQuote.EvaluationList;
						}

						comboQuotes.push(quote);
					});
					return comboQuotes;
				}

				/**
				 * change quote key of change order quote items, otherwise, the change order will not find the quote item values correctly.
				 * Because dynamic column definition (field) always use Base Order's quote key.
				 */
				function setChangeOrderQuoteKey2BaseOrderQuoteKey(row) {
					_.each(itemConfigService.visibleCompareColumnsCache, function (baseOrderCol) {
						_.each(baseOrderCol.Children || [], function (changeOrderCol) {
							_.each(row.QuoteItems || [], function (item) {
								// only reset change order quote item's quoteKey into base order quote item's quoteKey.
								if (item.QuoteKey === changeOrderCol.Id) {
									let newItem = angular.copy(item);
									newItem.OwnQuoteKey = item.QuoteKey;// keep original quoteKey
									newItem.QuoteKey = baseOrderCol.Id;   // set base order quoteKey
									row.QuoteItems.push(newItem);
								}
							});
						});
					});
					_.each(row.Children, function (item) {
						setChangeOrderQuoteKey2BaseOrderQuoteKey(item);
					});
				}

				/**
				 * add 'Grand Total' row and set values for it's columns.
				 */
				service.addGrandTotalRowAndSetColumnValues = function addGrandTotalRowAndSetColumnValues(itemList) {
					if (_.isEmpty(itemList)) {
						return;
					}

					let grandTotalRow = addGrandTotalRow(itemList);
					commonHelperService.setColumnValuesForGrandTotalRow(itemConfigService.visibleCompareColumnsCache, grandTotalRow, itemList, commonService.constant.compareType.prcItem);

					// put 'grand total row' in the first
					itemList.unshift(grandTotalRow);
				};

				/**
				 * add 'Evaluated Total' row and set values for it's columns.
				 */
				service.addEvaluatedTotalRowAndSetColumnValues = function addEvaluatedTotalRowAndSetColumnValues(rfqRows) {
					let evaluatedTotalRow = addEvaluatedTotalRow(rfqRows);
					commonHelperService.setColumnValuesForEvaluatedTotalRow(itemConfigService.visibleCompareColumnsCache, evaluatedTotalRow, rfqRows, commonService.constant.compareType.prcItem);
					rfqRows.unshift(evaluatedTotalRow);
				};

				/**
				 * add 'Offered Total' row and set values for it's columns.
				 */
				service.addOfferedTotalRowAndSetColumnValues = function addOfferedTotalRowAndSetColumnValues(rfqRows) {
					let offeredTotalRow = addOfferedTotalRow(rfqRows);
					commonHelperService.setColumnValuesForOfferedTotalRow(itemConfigService.visibleCompareColumnsCache, offeredTotalRow, rfqRows, commonService.constant.compareType.prcItem);
					rfqRows.unshift(offeredTotalRow);
				};

				function addGrandTotalRow(itemList) {
					let grandTotalRow = {};
					grandTotalRow.Id = 'grand_total_row';
					grandTotalRow.LineType = compareLineTypes.grandTotal;
					grandTotalRow.HasChildren = false;
					grandTotalRow.Children = [];
					grandTotalRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareGrandTotal');

					// the Grand Total row's font format
					grandTotalRow.cssClass = 'font-bold';
					// when there is one rfq_header, it allows GrandTotal Row to show billingSchema.
					if (itemList && itemList.length === 1) {
						grandTotalRow.RfqHeaderId = itemList[0].RfqHeaderId;
					}
					commonHelperService.addGrantTotalCompareRows(itemConfigService.visibleQuoteCompareRowsCache, grandTotalRow, commonService.constant.compareType.prcItem);
					return grandTotalRow;
				}

				/**
				 * add 'Evaluated Total' row.
				 */
				function addEvaluatedTotalRow(itemList) {
					let newRow = {};
					newRow.Id = 'evaluated_total_row';
					newRow.LineType = compareLineTypes.evaluatedTotal;
					newRow.HasChildren = false;
					newRow.Children = [];
					newRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareEvaluatedTotal');

					if (itemList && itemList.length === 1) {
						newRow.RfqHeaderId = itemList[0].RfqHeaderId;
					}

					return newRow;
				}

				/**
				 * add 'Offered Total' row.
				 */
				function addOfferedTotalRow(itemList) {
					let newRow = {};
					newRow.Id = 'offered_total_row';
					newRow.LineType = compareLineTypes.offeredTotal;
					newRow.HasChildren = false;
					newRow.Children = [];
					newRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareOfferedTotal');

					if (itemList && itemList.length === 1) {
						newRow.RfqHeaderId = itemList[0].RfqHeaderId;
					}

					return newRow;
				}

				/**
				 * set row values for the column 'LineName'.
				 */
				service.setRowValuesForLineNameColumn = function setRowValuesForLineNameColumn(itemList) {
					angular.forEach(itemList, function (item) {
						switch (item.LineType) {
							case compareLineTypes.grandTotal:
								item.LineName = $translate.instant('procurement.pricecomparison.compareGrandTotal');
								break;
							case compareLineTypes.evaluatedTotal:
								item.LineName = $translate.instant('procurement.pricecomparison.compareEvaluatedTotal');
								break;
							case compareLineTypes.offeredTotal:
								item.LineName = $translate.instant('procurement.pricecomparison.compareOfferedTotal');
								break;
							case compareLineTypes.rfq:
								item.LineName = $translate.instant('procurement.pricecomparison.compareRfqTotal');
								break;
							case compareLineTypes.characteristicTotal:
								item.LineName = _.result(_.find(itemConfigService.visibleCompareRowsCache, {Field: commonService.constant.Characteristics}), 'DisplayName');
								break;
							case compareLineTypes.characteristicGroup:
								item.LineName = _.result(_.find(rfqCharacteristicGroupListCache, {Id: item.GroupId}), 'Description');
								break;
							case compareLineTypes.characteristic:
								item.LineName = _.result(_.find(itemConfigService.rfqCharacteristicCache, {Id: item.CharacteristicDataId}), 'Description');
								break;
							case compareLineTypes.requisition:
								item.LineName = $translate.instant('procurement.pricecomparison.compareRequisitionTotal');
								break;
							case compareLineTypes.generalTotal:
								item.LineName = _.result(_.find(itemConfigService.visibleCompareRowsCache, {Field: commonService.constant.Generals}), 'DisplayName');
								break;
							case compareLineTypes.generalItem:
								item.LineName = '';
								break;
							case compareLineTypes.quoteNewItemTotal:
								item.LineName = $translate.instant('procurement.pricecomparison.compareNewItemTotal');
								break;
							case compareLineTypes.quoteNewItem:
								item.LineName = $translate.instant('procurement.pricecomparison.compareNewItem');
								break;
							case compareLineTypes.prcItem: {
								item.LineName = $translate.instant('procurement.pricecomparison.compareItem');
								let reqItem = _.filter(item.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});
								if (reqItem.length === 0) {
									item.LineName = $translate.instant('procurement.pricecomparison.compareNewItem');
								}
								break;
							}

							default:
								break;
						}

						if (item.Children && item.Children.length > 0 && item.LineType !== compareLineTypes.compareField) {
							service.setRowValuesForLineNameColumn(item.Children);
						}
					});
				};

				/**
				 * get recalculate column values for 'compare field row'.
				 */
				service.getColumnValuesForCompareFieldRow = function getColumnValuesForCompareFieldRow(parentItem, visibleRow, newRow) {
					if (!parentItem) {
						return;
					}
					// set max/min/average column's compare row's (compare fields) value.
					let fieldValues = [];
					_.each(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						let quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
						if (quoteItem) {
							newRow[visibleColumn.Id] = (quoteItem && quoteItem[visibleRow.Field]) ? quoteItem[visibleRow.Field] : 0;
							let fieldObject = {};
							fieldObject.id = visibleColumn.Id;
							fieldObject.value = newRow[visibleColumn.Id];
							fieldObject.PrcItemEvaluationId = quoteItem.PrcItemEvaluationFk;
							fieldObject.IsCountInTarget = visibleColumn.IsCountInTarget;
							fieldObject.IsIdealBidder = visibleColumn.IsIdealBidder;
							fieldValues.push(fieldObject);
						}
					});
					newRow.fieldValues = fieldValues;

					return newRow; // return object only used in recalculation by the changed 'PrcItemEvaluationFk' value.
				};

				service.recalcuateExcludedCurrentBidder = function excludedCurrentBidder(newRow, field) {
					// set max/min/average column's compare row's (compare fields) value.
					let currentFieldValues = [],
						currentFieldValuesExcludeTarget = [],
						columnInfo = commonHelperService.extractCompareInfoFromFieldName(field);
					_.forEach(newRow.fieldValues, function (item) {
						if (item.id !== columnInfo.quoteKey) {
							commonHelperService.concludeTargetValue(item.id, currentFieldValues, currentFieldValuesExcludeTarget, item.value, commonService.constant.compareType.prcItem, newRow.fieldValues);
						}
					});

					newRow[commonService.constant.maxValueIncludeTarget] = commonHelperService.getRepairNumeric(_.max(currentFieldValues));
					newRow[commonService.constant.minValueIncludeTarget] = commonHelperService.getRepairNumeric(_.min(currentFieldValues));
					newRow[commonService.constant.averageValueIncludeTarget] = commonHelperService.getRepairNumeric(commonService.calculateAverageValue(currentFieldValues));
					newRow[commonService.constant.maxValueExcludeTarget] = commonHelperService.getRepairNumeric(_.max(currentFieldValuesExcludeTarget));
					newRow[commonService.constant.minValueExcludeTarget] = commonHelperService.getRepairNumeric(_.min(currentFieldValuesExcludeTarget));
					newRow[commonService.constant.averageValueExcludeTarget] = commonHelperService.getRepairNumeric(commonService.calculateAverageValue(currentFieldValuesExcludeTarget));

					return newRow; // return object only used in recalculation by the changed 'PrcItemEvaluationFk' value.
				};

				/***
				 * cache the original fields (original info of quote: QtnHeaderId + BusinesspartnerId  + QtnVersion + PrcHeaderId)
				 */
				function cacheOriginalFields(itemList) {
					_.forEach(itemList, function (item) {
						/** @namespace item.OriginalFields */
						if (item.OriginalFields) {
							_.forEach(item.OriginalFields, function (originalObj) {
								itemConfigService.originalFieldsCache.push(originalObj);
							});
						}
					});
				}

				/**
				 * add 'rfq row'.
				 */
				function addRfqRow(requisitionRows) {
					let rfqRow = {};
					let rfqId = requisitionRows[0].RfqHeaderId;

					rfqRow.Id = 'rfq_row_' + rfqId;
					rfqRow.LineType = compareLineTypes.rfq;
					rfqRow.RfqHeaderId = rfqId;
					rfqRow.rfqHeaderId = rfqId;
					rfqRow.ReqHeaderId = requisitionRows[0].ReqHeaderId;
					rfqRow.ChosenBusinessPartner = true; // show button to create contract

					let rfqHeader = _.find(itemConfigService.rfqHeadersCache, {Id: rfqId});
					if (rfqHeader) {
						rfqRow.StatusFk = rfqHeader.RfqStatusFk;
						rfqRow.ItemNo = rfqHeader.Code;
						rfqRow.Description1 = rfqHeader.Description;
						rfqRow.PaymentTermFiFk = rfqHeader.PaymentTermFiFk;
						rfqRow.PaymentTermPaFk = rfqHeader.PaymentTermPaFk;
					}

					rfqRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareRfqTotal');
					rfqRow.HasChildren = true;
					rfqRow.Children = requisitionRows;
					rfqRow.parentItem = null;

					return rfqRow;
				}

				/**
				 * and set column values for 'rfq row'.
				 */
				function setColumnValuesForRfqRow(rfqRow) {
					rfqRow.totals = {};
					rfqRow.ranks = {};
					rfqRow.percentages = {};
					rfqRow.finalBillingSchemas = {};
					rfqRow.totalValues = [];
					rfqRow.totalValuesExcludeTarget = [];

					_.each(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						let requisitionRow = _.filter(rfqRow.Children, function (item) {
							return item.LineType === compareLineTypes.requisition;
						});
						let sum = _.sumBy(requisitionRow, function (item) {
							return item.totals[visibleColumn.Id] === commonService.constant.tagForNoQuote ? 0 : item.totals[visibleColumn.Id];
						});
						let quoteItemList = [];
						_.forEach(requisitionRow, function (item) {
							let quoteItem = _.find(item.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem) {
								quoteItemList.push(quoteItem);
							}
						});

						if (quoteItemList && quoteItemList.length > 0) {
							rfqRow.totals[visibleColumn.Id] = sum;
							let ownQuoteKey = commonService.getOwnQuoteKey(itemConfigService.itemQtnMatchCache, visibleColumn.Id, rfqRow.RfqHeaderId);
							let currentQuoteId = _.parseInt(commonService.getQuoteId(ownQuoteKey));
							let finalBillingSchema = commonService.getFinalBillingSchema(currentQuoteId);
							if (compareDirections.isFinalShowInTotal && finalBillingSchema) {
								sum = finalBillingSchema.Result;
								rfqRow.totals[visibleColumn.Id] = finalBillingSchema.Result;
								rfqRow.finalBillingSchemas[visibleColumn.Id] = finalBillingSchema;
							}
							// exclude ideal bidders.
							if (!visibleColumn.IsIdealBidder) {
								commonHelperService.concludeTargetValue(visibleColumn.Id, rfqRow.totalValues, rfqRow.totalValuesExcludeTarget, sum, commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
							}
						} else {
							rfqRow.totals[visibleColumn.Id] = commonService.constant.tagForNoQuote;
						}
					});

					rfqRow.totalValues = _.sortBy(rfqRow.totalValues);
					rfqRow.totalValuesExcludeTarget = _.sortBy(rfqRow.totalValuesExcludeTarget); // sort by ascending for calculate rank.

					// set Max/ Min/ Average value
					rfqRow[commonService.constant.maxValueIncludeTarget] = 0;
					rfqRow[commonService.constant.minValueIncludeTarget] = 0;
					rfqRow[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(rfqRow.totalValues) || 0;
					rfqRow[commonService.constant.maxValueExcludeTarget] = 0;
					rfqRow[commonService.constant.minValueExcludeTarget] = 0;
					rfqRow[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(rfqRow.totalValuesExcludeTarget) || 0;

					// set Percentage/ Rank value (currently they don't needed, just only for using in the feature).

					let minValueField = _.min(rfqRow.totalValuesExcludeTarget) || 0;
					// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
					angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						if (checkBidderService.item.isNotReference(visibleColumn.Id)) {
							if (minValueField === 0) {
								rfqRow.percentages[visibleColumn.Id] = 0;
							} else {
								rfqRow.percentages[visibleColumn.Id] = rfqRow.totals[visibleColumn.Id] / minValueField * 100;
							}
						}
					});

					// set Rank value
					angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						if (checkBidderService.item.isNotReference(visibleColumn.Id)) {
							let rank = _.indexOf(rfqRow.totalValuesExcludeTarget, rfqRow.totals[visibleColumn.Id]);
							rfqRow.ranks[visibleColumn.Id] = rank + 1;
						}
					});

					// set Max/ Min/ Average value
					if (rfqRow && rfqRow.Children && rfqRow.Children.length > 0) {
						let children = _.filter(rfqRow.Children, {LineType: compareLineTypes.requisition});
						commonService.combinedMaxMin(rfqRow, children);
					}

					return rfqRow;
				}

				/**
				 * set ReplacementItems For PrcItem
				 */
				function setReplacementItemsForPrcItem(currentItem) {
					if (currentItem.LineType === compareLineTypes.requisition) {

						let total = 0, price = 0, totalPrice = 0, priceUnit = 0, priceExtra = 0, priceOc = 0;
						_.forEach(currentItem.Children, function (prcItemRow) {
							_.forEach(prcItemRow.QuoteItems, function (item) {
								// if the prcitem has replacement items, use them to calculate.
								if (!_.isEmpty(item.ReplacementItems)) {
									total = _.sumBy(item.ReplacementItems, commonService.itemCompareFields.total);
									price = _.sumBy(item.ReplacementItems, commonService.itemCompareFields.price) / item.ReplacementItems.length;
									totalPrice = _.sumBy(item.ReplacementItems, commonService.itemCompareFields.totalPrice) / item.ReplacementItems.length;
									priceUnit = _.sumBy(item.ReplacementItems, commonService.itemCompareFields.priceUnit) / item.ReplacementItems.length;
									priceExtra = _.sumBy(item.ReplacementItems, commonService.itemCompareFields.priceExtra) / item.ReplacementItems.length;
									priceOc = _.sumBy(item.ReplacementItems, commonService.itemCompareFields.priceOc) / item.ReplacementItems.length;

									item.Total = total;
									item.Price = price;
									item.TotalPrice = totalPrice;
									item.PriceUnit = priceUnit;
									item.PriceExtra = priceExtra;
									item.PriceOc = priceOc;
									item.FactoredTotalPrice = getFactoredTotalPrice(item);

									let factoredTotalPrice = item.FactoredTotalPrice;
									let parent = _.find(currentItem.QuoteItems, {'PrcItemId': item.PrcItemId});
									if (parent) {
										parent.Total = total;
										parent.Price = price;
										parent.TotalPrice = totalPrice;
										parent.PriceUnit = priceUnit;
										parent.PriceExtra = priceExtra;
										parent.PriceOc = priceOc;
										parent.FactoredTotalPrice = factoredTotalPrice;
									}
								}
							});
						});
					}
				}

				/**
				 * set bidder's quote value for requisition row.
				 */
				function setColumnValuesForRequisitionRow(currentItem) {
					if (currentItem.LineType === compareLineTypes.requisition) {
						currentItem.totals = {};                      // store quote keys/values for bidders (includeing Target)
						currentItem.totalValues = [];                 // store quote values for bidders (includeing Target)
						currentItem.totalValuesExcludeTarget = [];    // store quote values for bidders (Exclude Target)
						currentItem.ranks = {};
						currentItem.percentages = {};
						currentItem.leadingFields = {};                     // store quote keys/values for bidders (include Target)

						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							currentItem[visibleColumn.Id] = null;
							let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem) {
								// sum quote items
								let quoteSum = _.sumBy(_.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id}), commonService.itemCompareFields.total) || 0;

								// sum quote new items
								let quoteNewItemsSum = 0;
								let quoteNewItemTotal = _.find(currentItem.Children, {LineType: compareLineTypes.quoteNewItemTotal});
								if (quoteNewItemTotal) {
									quoteNewItemsSum = _.sumBy(_.filter(quoteNewItemTotal.Children, {QuoteKey: visibleColumn.Id}), commonService.itemCompareFields.total) || 0;
								}
								let totalSum = quoteSum + quoteNewItemsSum;

								currentItem.totals[visibleColumn.Id] = totalSum;
								// exclude ideal bidders.
								if (!quoteItem.IsIdealBidder) {
									commonHelperService.concludeTargetValue(visibleColumn.Id, currentItem.totalValues, currentItem.totalValuesExcludeTarget, totalSum, commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
								}
							} else {
								currentItem.totals[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}

							// set leading value
							let quoteItems = _.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItems.length > 0) {
								currentItem.leadingFields[visibleColumn.Id] = _.sumBy(quoteItems, itemConfigService.leadingFieldCache);
							} else {
								currentItem.leadingFields[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}

						});

						// sort by ascending for calculate rank.
						currentItem.totalValues = _.sortBy(currentItem.totalValues);
						currentItem.totalValuesExcludeTarget = _.sortBy(currentItem.totalValuesExcludeTarget);

						// add max/min/average vlue
						currentItem[commonService.constant.maxValueIncludeTarget] = 0;
						currentItem[commonService.constant.minValueIncludeTarget] = 0;
						currentItem[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(currentItem.totalValues) || 0;
						currentItem[commonService.constant.maxValueExcludeTarget] = 0;
						currentItem[commonService.constant.minValueExcludeTarget] = 0;
						currentItem[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(currentItem.totalValuesExcludeTarget) || 0;

						// get the min leading Field Values Exclude Target
						let minLeadingField = _.min(currentItem.totalValuesExcludeTarget) || 0;
						let differentFields = commonService.checkHighlightQtn(itemConfigService.visibleCompareColumnsCache, currentItem.QuoteItems);
						let absoluteDiffColumn = _.find(itemConfigService.visibleCompareRowsCache, row => row.Field === commonService.itemCompareFields.absoluteDifference || row.Field === commonService.itemCompareFields.percentage);
						// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (checkBidderService.item.isNotReference(visibleColumn.Id) && quoteItem) {
								if (absoluteDiffColumn && absoluteDiffColumn.DeviationReference > 0) {
									let percentageBasicQuote = commonService.getBasicQuote(currentItem, absoluteDiffColumn, visibleColumn.Id, differentFields.markFieldQtn, itemConfigService.leadingFieldCache, commonService.constant.compareType.prcItem);
									currentItem.percentages[visibleColumn.Id] = percentageBasicQuote.basicPercentage;
								} else {
									if (minLeadingField === 0) {
										currentItem.percentages[visibleColumn.Id] = 0;
									} else {
										currentItem.percentages[visibleColumn.Id] = currentItem.leadingFields[visibleColumn.Id] / minLeadingField * 100;
									}
								}
							}
							if (!quoteItem) {
								currentItem.percentages[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}
						});

						// set rank value
						_.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							if (checkBidderService.item.isNotReference(visibleColumn.Id)) {
								let rank = _.indexOf(currentItem.totalValuesExcludeTarget, currentItem.totals[visibleColumn.Id]);
								currentItem.ranks[visibleColumn.Id] = rank + 1;
							}
						});

						// set value for children (general total/ prcItem).
						if (currentItem.Children && currentItem.Children.length > 0) {
							_.forEach(currentItem.Children, function (item) {
								setColumnValuesForGeneralTotalRow(item);
								setColumnValuesForPrcItemRow(item);
								item.parentItem = currentItem;
							});
							let children = _.filter(currentItem.Children, {LineType: compareLineTypes.prcItem});
							commonService.combinedMaxMin(currentItem, children);
						}

						// set budget total
						let budgetTotalSum = 0;
						if (currentItem.QuoteItems && currentItem.QuoteItems.length > 0) {
							budgetTotalSum = _.sumBy(_.filter(currentItem.QuoteItems, quoteItem => {
								return quoteItem.QuoteKey === 'QuoteCol_-1_-1_-1';
							}), commonService.itemCompareFields.budgetTotal) || 0;
						}
						currentItem.BudgetTotal = budgetTotalSum;
					}
				}

				/**
				 * set bidder's quote value for prcItem row.
				 */
				function setColumnValuesForPrcItemRow(itemRow) {
					// prcItem row.
					if (itemRow.LineType === compareLineTypes.prcItem) {
						itemRow.ChosenBusinessPartner = null;           // only this row need it as a lookup value
						itemRow.ChosenBusinessPartnerPrice = null;      // value for the chosen field 'ChosenBusinessPartner'
						itemRow.leadingFields = {};                     // store quote keys/values for bidders (include Target)
						itemRow.leadingFieldValues = [];                // store quote values for bidders (include Target)
						itemRow.leadingFieldValuesExcludeTarget = [];   // store quote values for bidders (Exclude Target)
						itemRow.ranks = {};
						itemRow.percentages = {};
						let finalPriceValues = [];
						let finalPriceValuesExcludeTarget = [];

						itemRow.originPriceExcludeTarget = [];  // store quote values for bidders (Exclude Target)

						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							itemRow[visibleColumn.Id] = null;

							let quoteItem = _.find(itemRow.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem && !_.isUndefined(quoteItem[itemConfigService.leadingFieldCache])) {
								let leadingFieldValue = (quoteItem && quoteItem[itemConfigService.leadingFieldCache]) ? quoteItem[itemConfigService.leadingFieldCache] : 0;
								itemRow.leadingFields[visibleColumn.Id] = leadingFieldValue;
								// exclude ideal bidders.
								if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
									commonHelperService.concludeTargetValue(visibleColumn.Id, itemRow.leadingFieldValues, itemRow.leadingFieldValuesExcludeTarget, leadingFieldValue, commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);

									// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
									let finalPriceValue = (quoteItem && quoteItem[commonService.itemCompareFields.total]) ? quoteItem[commonService.itemCompareFields.total] : 0;
									commonHelperService.concludeTargetValue(visibleColumn.Id, finalPriceValues, finalPriceValuesExcludeTarget, finalPriceValue, commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
								}
							} else {
								itemRow.leadingFields[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}
						});

						// sort by ascending for calculate rank.
						itemRow.leadingFieldValues = _.sortBy(itemRow.leadingFieldValues);
						itemRow.leadingFieldValuesExcludeTarget = _.sortBy(itemRow.leadingFieldValuesExcludeTarget);

						// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
						itemRow[commonService.constant.maxValueIncludeTarget] = _.max(finalPriceValues) || 0;
						itemRow[commonService.constant.minValueIncludeTarget] = _.min(finalPriceValues) || 0;
						itemRow[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(finalPriceValues) || 0;
						itemRow[commonService.constant.maxValueExcludeTarget] = _.max(finalPriceValuesExcludeTarget) || 0;
						itemRow[commonService.constant.minValueExcludeTarget] = _.min(finalPriceValuesExcludeTarget) || 0;
						itemRow[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(finalPriceValuesExcludeTarget) || 0;

						let minLeadingField = _.min(itemRow.leadingFieldValuesExcludeTarget) || 0;
						let differentFields = commonService.checkHighlightQtn(itemConfigService.visibleCompareColumnsCache, itemRow.QuoteItems);
						let absoluteDiffColumn = _.find(itemConfigService.visibleCompareRowsCache, row => row.Field === commonService.itemCompareFields.absoluteDifference || row.Field === commonService.itemCompareFields.percentage);
						// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							let quoteItem = _.find(itemRow.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (checkBidderService.item.isNotReference(visibleColumn.Id) && quoteItem) {
								if (itemRow.LineType === compareLineTypes.prcItem && absoluteDiffColumn && absoluteDiffColumn.DeviationReference > 0) {
									let percentageBasicQuote = commonService.getBasicQuote(itemRow, absoluteDiffColumn, visibleColumn.Id, differentFields.markFieldQtn, itemConfigService.leadingFieldCache, commonService.constant.compareType.prcItem);
									itemRow.percentages[visibleColumn.Id] = percentageBasicQuote.basicPercentage;
								} else {
									if (minLeadingField === 0) {
										itemRow.percentages[visibleColumn.Id] = 0;
									} else {
										itemRow.percentages[visibleColumn.Id] = itemRow.leadingFields[visibleColumn.Id] / minLeadingField * 100;
									}
								}
							}
							if (!quoteItem) {
								itemRow.percentages[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}
						});

						// set Rank value
						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							let quoteItem = _.find(itemRow.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (checkBidderService.item.isNotReference(visibleColumn.Id) && quoteItem && !_.isUndefined(itemRow.leadingFields[visibleColumn.Id])) {
								let rank = _.indexOf(itemRow.leadingFieldValuesExcludeTarget, itemRow.leadingFields[visibleColumn.Id]);
								itemRow.ranks[visibleColumn.Id] = rank + 1;
							}
							if (!quoteItem) {
								itemRow.ranks[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}
						});

						// add dynamic compare row (compare fields) for item (Position) and set values for the row's corresponding compare columns (quote bizpartners).
						if (itemRow && itemRow.LineType === compareLineTypes.prcItem && itemConfigService.visibleCompareRowsCache.length > 0) {
							if (!compareDirections.isVerticalCompareRows) {
								setColumnValuesForPrcItemCompareFieldRow(itemRow);
							} else {
								_.forEach(itemConfigService.visibleCompareRowsCache, function (visibleRow) {
									if (visibleRow.Field !== commonService.constant.Generals && visibleRow.Field !== commonService.constant.Characteristics) {
										recalculatePrcItemCompareFieldRow(itemRow, visibleRow, itemRow);
									}
								});
							}
						}

						// store price origin Value
						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							let quoteItem = _.find(itemRow.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (checkBidderService.item.isNotReference(visibleColumn.Id) && quoteItem && !quoteItem.IsIdealBidder) {
								itemRow.originPriceExcludeTarget.push({
									QuoteKey: quoteItem.QuoteKey,
									PrcItemId: quoteItem.PrcItemId,
									Price: quoteItem.Price,
									NotSubmitted: quoteItem.NotSubmitted
								});
							}
						});
					}
				}

				/**
				 * set bidder's quote value for general total row.
				 */
				function setColumnValuesForGeneralTotalRow(currentItem) {
					if (currentItem.LineType === compareLineTypes.generalTotal) {
						// set value for children.
						angular.forEach(currentItem.Children || [], function (item) {
							setColumnValuesForGeneralItemRow(item);
						});
					}
				}

				/**
				 * set bidder's quote value for general item row.
				 */
				function setColumnValuesForGeneralItemRow(currentItem) {
					if (currentItem.LineType === compareLineTypes.generalItem) {
						currentItem.totals = {};
						currentItem.totalValues = [];
						currentItem.totalValuesExcludeTarget = [];

						angular.forEach(itemConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							// currentItem[visibleColumn.Id] = null;

							let generalItem = _.find(currentItem.parentItem.parentItem.QuoteGeneralItems, {
								QuoteKey: visibleColumn.Id,
								ReqHeaderId: currentItem.parentItem.parentItem.ReqHeaderId,
								GeneralTypeId: currentItem.GeneralTypeId
							});

							let value = (generalItem && generalItem.Value) ? generalItem.Value : 0;  // 'Value' is an entity's property

							currentItem.totals[visibleColumn.Id] = value;
							currentItem[visibleColumn.Id] = value;
							commonHelperService.concludeTargetValue(visibleColumn.Id, currentItem.totalValues, currentItem.totalValuesExcludeTarget, value, commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
						});

						currentItem.totalValues = _.sortBy(currentItem.totalValues); // sort by ascending for calculate rank.

						// set max/min/average column's value.
						currentItem[commonService.constant.maxValueIncludeTarget] = _.max(currentItem.totalValues);
						currentItem[commonService.constant.minValueIncludeTarget] = _.min(currentItem.totalValues);
						currentItem[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(currentItem.totalValues);
						currentItem[commonService.constant.maxValueExcludeTarget] = _.max(currentItem.totalValuesExcludeTarget);
						currentItem[commonService.constant.minValueExcludeTarget] = _.min(currentItem.totalValuesExcludeTarget);
						currentItem[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(currentItem.totalValuesExcludeTarget);
					}
				}

				/**
				 * add dynamic compare row (compare fields) for item and set the bidder's quote values for the row.
				 */
				function setColumnValuesForPrcItemCompareFieldRow(parentItem) {
					if (parentItem && parentItem.LineType === compareLineTypes.prcItem) {
						// add the visible rows by custom setting
						_.forEach(itemConfigService.visibleCompareRowsCache, function (visibleRow) {
							if (visibleRow.Field === commonService.constant.Generals || visibleRow.Field === commonService.constant.Characteristics) {
								return;
							}
							let newRow = _.find(parentItem.Children, {Id: parentItem.Id + '_' + visibleRow.Field});
							if (!newRow) {
								newRow = {};
								newRow.Id = parentItem.Id + '_' + visibleRow.Field; // set id unique};
								newRow.LineType = compareLineTypes.compareField;
								newRow[commonService.constant.rowType] = visibleRow.Field;
								newRow.LineName = '';
								newRow.ConditionalFormat = visibleRow.ConditionalFormat; // used to format the cell with this custom style.
								newRow.parentItem = parentItem;
								newRow.Children = [];
								newRow.HasChildren = false;
								newRow.RfqHeaderId = parentItem.RfqHeaderId;
								newRow.ReqHeaderId = parentItem.ReqHeaderId;

								newRow.CompareDescription = visibleRow.DisplayName ? visibleRow.DisplayName : visibleRow.Description;

								parentItem.Children.push(newRow);
								parentItem.HasChildren = true;
							}

							recalculatePrcItemCompareFieldRow(parentItem, visibleRow, newRow);
						});
					} else {
						if (parentItem.Children && parentItem.Children.length > 0) {
							_.forEach(parentItem.Children, function (item) {
								setColumnValuesForPrcItemCompareFieldRow(item);
							});
						}
					}
				}

				function recalculatePrcItemCompareFieldRow(parentItem, visibleRow, newRow) {
					// set max/min/average column's compare row's (compare fields) value.
					let fieldValues = [];
					let fieldValuesExcludeTarget = [];
					// find highlight
					let differentFields = commonService.checkHighlightQtn(itemConfigService.visibleCompareColumnsCache, parentItem.QuoteItems);
					let checkHighlightFields = commonService.highlightFields;
					let fieldKeys = [];
					let compareField = visibleRow.Field;
					let isVerticalCompareRows = compareDirections.isVerticalCompareRows;
					_.map(itemConfigService.visibleCompareColumnsCache, function (column) {
						let visibleColumn = !isVerticalCompareRows ? column : commonHelperService.copyAndExtend(column, {
								Id: commonHelperService.getCombineCompareField(column.Id, compareField),
								QuoteKey: column.Id,
								IsHighlightChanges: column.IsHighlightChanges
							}),
							quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.QuoteKey || visibleColumn.Id}),
							bidderValueProp = visibleColumn.QuoteKey || visibleColumn.Id;
						if (quoteItem) {
							if (compareField === commonService.itemCompareFields.rank) {
								newRow[visibleColumn.Id] = parentItem.ranks[bidderValueProp] || 0;
							} else if (compareField === commonService.itemCompareFields.percentage) {
								newRow[visibleColumn.Id] = parentItem.percentages[bidderValueProp] || 0;
							} else {
								// defect: 79827
								// for a change order RFQ,  if it has a change order quote1 for bidder1, but no change order quote2 for bidder2,
								// so in UI, the two compare fields below in quote1 will allow editable, but set readonly in quote2.
								if (_.includes(commonService.itemEditableCompareFields, compareField)) {
									newRow[visibleColumn.Id + '_$hasBidder'] = true;
								}

								if (compareField === commonService.itemCompareFields.prcItemEvaluationFk) {
									newRow[visibleColumn.Id] = (quoteItem && quoteItem[commonService.itemCompareFields.price]) ? quoteItem[commonService.itemCompareFields.price] : 0;
									newRow[visibleColumn.Id + '_$FirstEvaluationFk'] = (quoteItem && quoteItem[commonService.itemCompareFields.prcItemEvaluationFk]) ? quoteItem[commonService.itemCompareFields.prcItemEvaluationFk] : null;
									newRow[visibleColumn.Id + '_$Evaluation_QuoteCode'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.quoteCode]) ? quoteItem[commonService.itemEvaluationRelatedFields.quoteCode] : null;
									newRow[visibleColumn.Id + '_$Evaluation_QuoteId'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.quoteId]) ? quoteItem[commonService.itemEvaluationRelatedFields.quoteId] : null;
									newRow[visibleColumn.Id + '_$Evaluation_SourcePrcItemId'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.sourcePrcItemId]) ? quoteItem[commonService.itemEvaluationRelatedFields.sourcePrcItemId] : null;
								} else if (_.includes([
									commonService.itemCompareFields.userDefined1,
									commonService.itemCompareFields.userDefined2,
									commonService.itemCompareFields.userDefined3,
									commonService.itemCompareFields.userDefined4,
									commonService.itemCompareFields.userDefined5,
									commonService.itemCompareFields.discountComment,
									commonService.itemCompareFields.externalCode
								], compareField)) {
									newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : '';
								} else if (compareField === commonService.itemCompareFields.isFreeQuantity) {
									newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : false;
								} else if (compareField === commonService.itemCompareFields.exQtnIsEvaluated) {
									newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : false;
								} else if (compareField === commonService.itemCompareFields.absoluteDifference) {
									let basicQuote = commonService.getBasicQuote(parentItem, visibleRow, bidderValueProp, differentFields.markFieldQtn, itemConfigService.leadingFieldCache, commonService.constant.compareType.prcItem);
									newRow[visibleColumn.Id] = basicQuote.absoluteDifference;
									if (!quoteItem.IsIdealBidder && newRow[visibleColumn.Id] !== commonService.constant.tagForNoQuote) {
										commonHelperService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, newRow[visibleColumn.Id], commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
									}
								} else if (compareField === commonService.itemCompareFields.factoredTotalPrice) {
									newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : getFactoredTotalPrice(quoteItem);
									// exclude ideal bidders.
									if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
										commonHelperService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, newRow[visibleColumn.Id], commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
									}
								} else {
									newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : 0;
									// exclude ideal bidders.
									if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
										commonHelperService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, newRow[visibleColumn.Id], commonService.constant.compareType.prcItem, itemConfigService.visibleCompareColumnsCache);
									}
								}
							}
							commonHelperService.setConfigFieldReadonly(visibleRow.Field, visibleColumn.Id, newRow, itemConfigService.itemQtnMatchCache, quoteItem, visibleColumn.IsIdealBidder, compareDirections.isVerticalCompareRows);

							// for highlight function
							// collect the key
							fieldKeys.push(visibleColumn.Id);
							if (visibleColumn.IsHighlightChanges === true && _.includes(checkHighlightFields, compareField)) {
								newRow[visibleColumn.Id + commonService.constant.highlightQtn] = differentFields[compareField] === false;
							}
						} else {
							newRow[visibleColumn.Id] = commonService.constant.tagForNoQuote;
						}

					});

					if (compareField === commonService.itemCompareFields.rank) {
						fieldValues = parentItem.ranks;
						for (let quoteKey1 in parentItem.ranks) {
							if (Object.hasOwn(parentItem.ranks, quoteKey1)) {
								let quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey1});
								if (checkBidderService.item.isNotReference(quoteKey1) && quoteItem && !quoteItem.IsIdealBidder) {
									fieldValuesExcludeTarget.push(parentItem.ranks[quoteKey1]);
								}
							}
						}
					} else if (compareField === commonService.itemCompareFields.percentage) {
						fieldValues = parentItem.percentages;
						for (let quoteKey2 in parentItem.percentages) {
							if (Object.hasOwn(parentItem.percentages, quoteKey2)) {
								var quoteItem2 = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey2});
								if (checkBidderService.item.isNotReference(quoteKey2) && quoteItem2 && !quoteItem2.IsIdealBidder) {
									fieldValuesExcludeTarget.push(parentItem.percentages[quoteKey2]);
								}
							}
						}
					}

					let compareRowPrefix = isVerticalCompareRows ? visibleRow.Field + '_' : '';
					newRow[compareRowPrefix + commonService.constant.maxValueIncludeTarget] = commonHelperService.getRepairNumeric(_.max(fieldValues));
					newRow[compareRowPrefix + commonService.constant.minValueIncludeTarget] = commonHelperService.getRepairNumeric(_.min(fieldValues));
					newRow[compareRowPrefix + commonService.constant.averageValueIncludeTarget] = commonHelperService.getRepairNumeric(commonService.calculateAverageValue(fieldValues));
					newRow[compareRowPrefix + commonService.constant.maxValueExcludeTarget] = commonHelperService.getRepairNumeric(_.max(fieldValuesExcludeTarget));
					newRow[compareRowPrefix + commonService.constant.minValueExcludeTarget] = commonHelperService.getRepairNumeric(_.min(fieldValuesExcludeTarget));
					newRow[compareRowPrefix + commonService.constant.averageValueExcludeTarget] = commonHelperService.getRepairNumeric(commonService.calculateAverageValue(fieldValuesExcludeTarget));

					// highlight deviation rows
					commonService.highlightRows(parentItem, newRow, visibleRow, commonService.itemDeviationFields, fieldKeys, differentFields.markFieldQtn, itemConfigService.leadingFieldCache, 1);

					return newRow;
				}

				function recalculateRfqRow(rfqRow) {
					recalculateRfqRequisitionRows(rfqRow);
					setColumnValuesForRfqRow(rfqRow);
				}

				function recalculateRfqRequisitionRows(rfqRow) {
					_.forEach(rfqRow.Children, function (childRow) {
						if (_.startsWith(childRow.Id, 'requisition_row')) {
							setColumnValuesForRequisitionRow(childRow);
						}
					});
				}

				function getRemoveItems(item, itemTypes, itemTypes2) {
					let items = [],
						isPrcItem = item.LineType === compareLineTypes.prcItem,
						isEmptyTypes = itemTypes.length === 0 && itemTypes2.length === 0,
						isExcluding = (!_.includes(itemTypes, item.ItemTypeFk) || !_.includes(itemTypes2, item['ItemType2Fk']));
					if (isPrcItem && (isEmptyTypes || isExcluding)) {
						items = items.concat([item]).concat(commonHelperService.flatTree(item.Children, 'Children'));
					} else {
						_.each(item.Children, function (m) {
							items = items.concat(getRemoveItems(m, itemTypes, itemTypes2));
						});
					}
					return items;
				}

				function getFactoredTotalPrice(quoteItem){
					let itemCalculateHelperService = $injector.get('prcCommonItemCalculationHelperService');
					let prcCommonGetVatPercent = $injector.get('prcCommonGetVatPercent');
					let vatPercent = prcCommonGetVatPercent.getVatPercent(quoteItem.TaxCodeFk, quoteItem['QtnHeaderVatGroupFk']);
					return itemCalculateHelperService.getFactoredTotalPrice(quoteItem, vatPercent);
				}

				/**
				 * recalculate item comparison data tree by the changed compared field 'PrcItemEvaluation/ Price...'
				 * Note: must recalculate by order (from child to parent)
				 */
				service.recalculateTreeByModifiedPrcItemEvaluation = function recalculateTreeByModifiedPrcItemEvaluation(itemTree) {
					_.each(itemTree || [], function (row) {
						if (_.startsWith(row.Id, 'rfq_row') && !_.isEmpty(row.Children)) {
							recalculateRfqRow(row);
						}
					});

					// recalculate 'grand total row'
					commonHelperService.setColumnValuesForGrandTotalRow(itemConfigService.visibleCompareColumnsCache, itemTree[0], itemTree, commonService.constant.compareType.prcItem);

					// recalculate 'offered total row'
					let offeredTotalRow = _.find(itemTree, {Id: 'offered_total_row'});
					if (offeredTotalRow) {
						commonHelperService.setColumnValuesForOfferedTotalRow(itemConfigService.visibleCompareColumnsCache, offeredTotalRow, itemTree, commonService.constant.compareType.prcItem);
					}

					// recalculate 'evaluated total row'
					let evaluatedTotalRow = _.find(itemTree, {Id: 'evaluated_total_row'});
					if (evaluatedTotalRow) {
						commonHelperService.setColumnValuesForEvaluatedTotalRow(itemConfigService.visibleCompareColumnsCache, evaluatedTotalRow, itemTree, commonService.constant.compareType.prcItem);
					}
				};

				service.setCompareDirections = function (directions) {
					compareDirections = angular.extend(compareDirections, directions);
				};

				service.removeDataRowsByItemTypes = function (dataTree, itemTypes, itemTypes2, isSoftRemove) {

					let removeItems = [];

					_.each(dataTree, function (item) {
						removeItems = removeItems.concat(getRemoveItems(item, itemTypes, itemTypes2));
					});

					let removeIds = _.map(removeItems, function (item) {
						return item.Id;
					});

					return commonHelperService.removeDataRowsRecursively(dataTree, function (n) {
						return _.includes(removeIds, n.Id);
					}, isSoftRemove, commonService.constant.compareType.prcItem);
				};

				service.setColumnValuesForRfqRow = setColumnValuesForRfqRow;

				if (serviceName) {
					serviceCache[serviceName] = service;
				}

				return service;
			}

			return {
				getService: createService
			};

		}
	]);
})(angular);
