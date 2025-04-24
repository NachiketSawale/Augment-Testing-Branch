/**
 * Created by wed on 9/30/2018.
 */
(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqDataStructureFactory', [
		'_',
		'$translate',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonLineTypes',
		'boqMainLineTypes',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonConfigurationService',
		function (
			_,
			$translate,
			boqCompareRows,
			commonService,
			compareLineTypes,
			boqMainLineTypes,
			lookupDescriptorService,
			commonHelperService,
			checkBidderService,
			procurementPriceComparisonConfigurationService) {

			let serviceCache = {};

			function createService(boqConfigService, serviceName) {

				if (serviceName && serviceCache[serviceName]) {
					return serviceCache[serviceName];
				}

				let service = {}, compareDirections = {
					isVerticalCompareRows: false,
					isFinalShowInTotal: true
				};

				// store the local data required for boq comparison used only by one Rfq
				let rfqCharacteristicGroupTreeCache = [];
				let rfqCharacteristicGroupListCache = [];
				let boqHeaderStructuresCache = [];
				let structureDetailCache = [];
				let boqCompareFields = [];

				/**
				 * restructure rfq's original comparison data according to user's custom settings.
				 * @param { object } rfqData The rfq's original comaprison data.
				 * * @param { bool } isChangeOrder: if true, we need reset the rows (Status/QuoteDate/Version) value from change order quote.
				 * @returns { object } The finalcomparsion data of Rfq.
				 */
				service.restructureCompareData = function restructureCompareData(rfqData, isChangeOrder) {
					// clear data.
					// rfqCharacteristicGroupTreeCache = [];
					rfqCharacteristicGroupListCache = [];
					boqConfigService.rfqCharacteristicCache = [];
					boqConfigService.quoteCharacteristicCache = [];
					commonService.generalItems = {};
					boqHeaderStructuresCache = [];
					structureDetailCache = [];

					// characteristic data for compare
					rfqCharacteristicGroupTreeCache = rfqData[commonService.constant.rfqCharacteristicGroup] || [];
					commonService.flatCharacteristicGroupTree(rfqCharacteristicGroupTreeCache, rfqCharacteristicGroupListCache);

					boqConfigService.rfqCharacteristicCache = rfqData[commonService.constant.rfqCharacteristic] || [];
					boqConfigService.quoteCharacteristicCache = rfqData[commonService.constant.quoteCharacteristic] || [];
					boqConfigService.allRfqCharacteristicCache = boqConfigService.allRfqCharacteristicCache.concat(rfqData[commonService.constant.rfqCharacteristic] || []);
					boqConfigService.allQuoteCharacteristicCache = boqConfigService.allQuoteCharacteristicCache.concat(rfqData[commonService.constant.quoteCharacteristic] || []);

					cacheOriginalFieldsAndBoqHeaderStructures(rfqData.Main);

					let qtnKeyMatch = [];
					// set compare column (bidder's quote) values for boq item tree.
					_.forEach(rfqData.Main, function (requisitionRow) {
						requisitionRow.cssClass = 'font-bold'; // set font format for Requisition Row
						setChangeOrderQuoteKey2BaseOrderQuoteKey(requisitionRow);
						qtnKeyMatch = qtnKeyMatch.concat(retrieveComboQuotes(requisitionRow.QuoteItems, rfqData['BoqCustomColumn']));
						commonService.generalItems[requisitionRow.RfqHeaderId] = requisitionRow.QuoteGeneralItems;

						commonHelperService.addGeneralTotalRow2RequisitionRow(requisitionRow, boqConfigService.visibleCompareRowsCache, boqConfigService, 'BoqLineTypeFk', 'BoqItemChildren');
						setColumnValuesForRequisitionRow(requisitionRow);

					});
					boqConfigService.boqQtnMatchCache[rfqData.Main[0].RfqHeaderId] = qtnKeyMatch;

					let rfqRow = addRfqRow(rfqData.Main);
					setColumnValuesForRfqRow(rfqRow);

					let structure = service.getDefaultBoqStructure();
					let isONORM = !!structure && structure['StandardId'] === 5;

					commonService.addCharacteristicTotalRow2RfqRow(boqConfigService, boqConfigService.boqQtnMatchCache, rfqRow.BoqItemChildren, rfqCharacteristicGroupTreeCache, 'BoqItemChildren', 'BoqLineTypeFk', boqConfigService.visibleQuoteCompareRowsCache);

					// add billing schema compare field
					commonService.addSchemaCompareFieldRows(rfqRow.BoqItemChildren, rfqRow.RfqHeaderId, rfqRow.ReqHeaderId, boqConfigService, 'BoqItemChildren', 'BoqLineTypeFk');

					// add quote compare field
					commonHelperService.addQuoteCompareFieldRows(boqConfigService, boqConfigService.visibleQuoteCompareRowsCache, commonService.constant.compareType.boqItem, rfqRow.BoqItemChildren, isChangeOrder, rfqRow.RfqHeaderId, rfqRow.ReqHeaderId, compareDirections.isVerticalCompareRows);

					commonHelperService.attachValueFromParent(rfqRow, 'BoqItemChildren', [{
						sourceProp: 'Id',
						targetProp: 'ParentId'
					}, {
						sourceProp: 'isONORM',
						targetProp: 'isONORM',
						attachFn: function (c, n, sourceProp, targetProp) {
							c[targetProp] = isONORM;
						}
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
							type: 'boq'
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
					_.each(boqConfigService.visibleCompareColumnsCache, function (baseOrderCol) {
						_.each(baseOrderCol.Children || [], function (changeOrderCol) {
							_.each(row.QuoteItems || [], function (item) {
								// only reset change order quote item's quoteKey into base order quote item's quoteKey.
								if (item.QuoteKey === changeOrderCol.Id) {
									let newItem = angular.copy(item);     // deal with the case when the base QTN have two version
									newItem.OwnQuoteKey = item.QuoteKey;  // keep original quoteKey
									newItem.QuoteKey = baseOrderCol.Id;   // set base order quoteKey
									row.QuoteItems.push(newItem);
								}
							});

						});
					});
					_.each(row.BoqItemChildren, function (boqItem) {
						setChangeOrderQuoteKey2BaseOrderQuoteKey(boqItem);
					});
				}

				/**
				 * add 'Grand Total' row and set values for it's columns.
				 */
				service.addGrandTotalRowAndSetColumnValues = function addGrandTotalRowAndSetColumnValues(rfqRows) {
					let grandTotalRow = addGrandTotalRow(rfqRows);
					commonHelperService.setColumnValuesForGrandTotalRow(boqConfigService.visibleCompareColumnsCache, grandTotalRow, rfqRows, commonService.constant.compareType.boqItem);

					// put 'grand total row' in the first
					rfqRows.unshift(grandTotalRow);
				};

				/**
				 * add 'Evaluated Total' row and set values for it's columns.
				 */
				service.addEvaluatedTotalRowAndSetColumnValues = function addEvaluatedTotalRowAndSetColumnValues(rfqRows) {
					let evaluatedTotalRow = addEvaluatedTotalRow(rfqRows);
					commonHelperService.setColumnValuesForEvaluatedTotalRow(boqConfigService.visibleCompareColumnsCache, evaluatedTotalRow, rfqRows, commonService.constant.compareType.boqItem);
					rfqRows.unshift(evaluatedTotalRow);
				};

				/**
				 * add 'Offered Total' row and set values for it's columns.
				 */
				service.addOfferedTotalRowAndSetColumnValues = function addOfferedTotalRowAndSetColumnValues(rfqRows) {
					let offeredTotalRow = addOfferedTotalRow(rfqRows);
					commonHelperService.setColumnValuesForOfferedTotalRow(boqConfigService.visibleCompareColumnsCache, offeredTotalRow, rfqRows, commonService.constant.compareType.boqItem);
					rfqRows.unshift(offeredTotalRow);
				};

				/**
				 * set row values for the column 'LineName'.
				 */
				service.setRowValuesForLineNameColumn = function setRowValuesForLineNameColumn(itemList) {
					angular.forEach(itemList, function (item) {
						switch (item.BoqLineTypeFk) {
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
								item.LineName = _.result(_.find(boqConfigService.visibleCompareRowsCache, {Field: commonService.constant.Characteristics}), 'DisplayName');
								break;
							case compareLineTypes.characteristicGroup:
								item.LineName = _.result(_.find(rfqCharacteristicGroupListCache, {Id: item.GroupId}), 'Description');
								break;
							case compareLineTypes.characteristic:
								item.LineName = _.result(_.find(boqConfigService.rfqCharacteristicCache, {Id: item.CharacteristicDataId}), 'Description');
								break;
							case compareLineTypes.requisition:
								item.LineName = $translate.instant('procurement.pricecomparison.compareRequisitionTotal');
								break;
							case compareLineTypes.generalTotal:
								item.LineName = _.result(_.find(boqConfigService.visibleCompareRowsCache, {Field: commonService.constant.Generals}), 'DisplayName');
								break;
							case compareLineTypes.generalItem:
								item.LineName = '';
								break;
							case boqMainLineTypes.root:
								item.LineName = $translate.instant('procurement.pricecomparison.compareBoqName');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level1:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level1}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level2:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level2}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level3:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level3}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level4:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level4}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level5:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level5}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level6:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level6}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level7:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level7}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level8:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level8}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.level9:
								item.LineName = _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqMainLineTypes.level9}), 'Description');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								break;
							case boqMainLineTypes.position:
								item.LineName = $translate.instant('procurement.pricecomparison.compareItem');
								item.BoqLineType = getStructureDetail(item.BoqLineTypeFk);
								if (item['IsQuoteNewItem']) {
									item.LineName = $translate.instant('procurement.pricecomparison.compareNewItem');
								}
								break;
							default:
								break;
						}

						if (item.BoqItemChildren && item.BoqItemChildren.length > 0 && item.BoqLineTypeFk !== compareLineTypes.compareField) {
							service.setRowValuesForLineNameColumn(item.BoqItemChildren);
						}
					});

					function getStructureDetail(boqLineTypeId) {
						let structureDetail = _.find(structureDetailCache, {LineTypeId: boqLineTypeId});

						if (!structureDetail || _.isEmpty(structureDetail.Description)) {
							return _.result(_.find(boqConfigService.boqLineTypeNameCache, {Id: boqLineTypeId}), 'Description');
						}
						return structureDetail.Description;
					}
				};

				/**
				 * add 'rfq row'.
				 */
				function addRfqRow(requisitionRows) {
					let rfqRow = {};
					let rfqId = requisitionRows[0].RfqHeaderId;

					rfqRow.Id = 'rfq_row_' + rfqId;
					rfqRow.BoqLineTypeFk = compareLineTypes.rfq;
					rfqRow.RfqHeaderId = rfqId;
					// give row a default ReqHeaderId value
					rfqRow.ReqHeaderId = requisitionRows[0].ReqHeaderId;
					rfqRow.Reference = _.result(_.find(boqConfigService.rfqHeadersCache, {Id: rfqId}), 'Code') || '';
					rfqRow.Brief = _.result(_.find(boqConfigService.rfqHeadersCache, {Id: rfqId}), 'Description') || '';
					rfqRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareRfqTotal');
					rfqRow.BoqItemChildren = requisitionRows;
					rfqRow.HasChildren = true;
					rfqRow.parentItem = null;

					return rfqRow;
				}

				/**
				 * add 'Grand Total' row.
				 */
				function addGrandTotalRow(rfqRows) {
					let newRow = {};
					newRow.Id = 'grand_total_row';
					newRow.BoqLineTypeFk = compareLineTypes.grandTotal;
					newRow.HasChildren = false;
					newRow.BoqItemChildren = [];
					newRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareGrandTotal');
					newRow.cssClass = 'font-bold'; // the Grand Total row to be BOLD format

					// when there is only base rfq, then click one cell on GrandTotal row under one bidder, it should show billingSchema of the quote.
					// assign value RfqHeaderId to GrandTotal Row.
					if (rfqRows && rfqRows.length === 1) {
						newRow.RfqHeaderId = rfqRows[0].RfqHeaderId;
					}
					commonHelperService.addGrantTotalCompareRows(boqConfigService.visibleQuoteCompareRowsCache, newRow, commonService.constant.compareType.boqItem);
					return newRow;
				}

				/**
				 * add 'Evaluated Total' row.
				 */
				function addEvaluatedTotalRow(rfqRows) {
					let newRow = {};
					newRow.Id = 'evaluated_total_row';
					newRow.BoqLineTypeFk = compareLineTypes.evaluatedTotal;
					newRow.HasChildren = false;
					newRow.BoqItemChildren = [];
					newRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareEvaluatedTotal');

					if (rfqRows && rfqRows.length === 1) {
						newRow.RfqHeaderId = rfqRows[0].RfqHeaderId;
					}

					return newRow;
				}

				/**
				 * add 'Offered Total' row.
				 */
				function addOfferedTotalRow(rfqRows) {
					let newRow = {};
					newRow.Id = 'offered_total_row';
					newRow.BoqLineTypeFk = compareLineTypes.offeredTotal;
					newRow.HasChildren = false;
					newRow.BoqItemChildren = [];
					newRow[commonService.constant.compareDescription] = $translate.instant('procurement.pricecomparison.compareOfferedTotal');

					if (rfqRows && rfqRows.length === 1) {
						newRow.RfqHeaderId = rfqRows[0].RfqHeaderId;
					}

					return newRow;
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

					_.each(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						let requisitionRows = _.filter(rfqRow.BoqItemChildren, function (item) {
							return item.BoqLineTypeFk === compareLineTypes.requisition;
						});
						let sum = _.sumBy(requisitionRows, function (item) {
							return item.totals[visibleColumn.Id] === commonService.constant.tagForNoQuote ? 0 : item.totals[visibleColumn.Id];
						});
						let quoteItemList = [];
						_.forEach(requisitionRows, function (item) {
							let quoteItem = _.find(item.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem) {
								quoteItemList.push(quoteItem);
							}
						});

						if (quoteItemList && quoteItemList.length > 0) {
							rfqRow.totals[visibleColumn.Id] = sum;
							let ownQuoteKey = commonService.getOwnQuoteKey(boqConfigService.boqQtnMatchCache, visibleColumn.Id, rfqRow.RfqHeaderId);
							let currentQuoteId = _.parseInt(commonService.getQuoteId(ownQuoteKey));
							let finalBillingSchema = commonService.getFinalBillingSchema(currentQuoteId);
							if (compareDirections.isFinalShowInTotal && finalBillingSchema) {
								sum = finalBillingSchema.Result;
								rfqRow.totals[visibleColumn.Id] = finalBillingSchema.Result;
								rfqRow.finalBillingSchemas[visibleColumn.Id] = finalBillingSchema;
							}
							// exclude ideal bidders.
							if (!visibleColumn.IsIdealBidder) {
								commonHelperService.concludeTargetValue(visibleColumn.Id, rfqRow.totalValues, rfqRow.totalValuesExcludeTarget, sum, commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
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
					angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						if (checkBidderService.boq.isNotReference(visibleColumn.Id)) {
							if (minValueField === 0) {
								rfqRow.percentages[visibleColumn.Id] = 0;
							} else {
								rfqRow.percentages[visibleColumn.Id] = rfqRow.totals[visibleColumn.Id] / minValueField * 100;
							}
						}
					});

					// set Rank value
					angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						if (checkBidderService.boq.isNotReference(visibleColumn.Id)) {
							let rank = _.indexOf(rfqRow.totalValuesExcludeTarget, rfqRow.totals[visibleColumn.Id]);
							rfqRow.ranks[visibleColumn.Id] = rank + 1;
						}
					});

					// set Max/ Min/ Average value
					if (rfqRow && rfqRow.BoqItemChildren && rfqRow.BoqItemChildren.length > 0) {
						let children = _.filter(rfqRow.BoqItemChildren, {BoqLineTypeFk: compareLineTypes.requisition});
						commonService.combinedMaxMin(rfqRow, children);
					}
				}

				/***
				 * cache the original fields and boq header's structures.
				 */
				function cacheOriginalFieldsAndBoqHeaderStructures(itemList) {
					_.forEach(itemList, function (item) {
						/** @namespace item.OriginalFields */
						if (item.OriginalFields) {
							_.forEach(item.OriginalFields, function (originalObj) {
								boqConfigService.originalFieldsCache.push(originalObj);
							});
						}

						if (item.QuoteItems) {
							let targetQuoteItems = _.filter(item.QuoteItems, function (quoteItem) {
								return quoteItem.QuoteKey === checkBidderService.constant.targetKey;
							});
							_.forEach(targetQuoteItems, function (targetItem) {
								/** @namespace targetItem.BoqStructure */
								if (targetItem.BoqStructure) {
									boqHeaderStructuresCache.push(targetItem.BoqStructure);
								}

								if (targetItem['BoqStructureDetail']) {
									structureDetailCache = structureDetailCache.concat(targetItem['BoqStructureDetail']);
								}
							});
						}
					});
				}

				/**
				 * set bidder's quote value for requisition row.
				 */
				function setColumnValuesForRequisitionRow(currentItem) {
					if (currentItem.BoqLineTypeFk === compareLineTypes.requisition) {
						currentItem.totals = {};                      // store quote keys/values for bidders (includeing BaseBoq/Target)
						currentItem.totalValues = [];                 // store quote values for bidders (includeing BaseBoq/Target)
						currentItem.totalValuesExcludeTarget = [];    // store quote values for bidders (Exclude BaseBoq/Target)
						currentItem.ranks = {};
						currentItem.percentages = {};
						currentItem.leadingFields = {};                     // store quote keys/values for bidders (include Target)

						let targetSum = _.sumBy(_.filter(currentItem.QuoteItems, {QuoteKey: checkBidderService.constant.targetKey}), boqCompareRows.finalPrice) || 0;

						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							currentItem[visibleColumn.Id] = null;

							let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem) {
								let quoteSum = _.sumBy(_.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id}), boqCompareRows.finalPrice) || 0;

								/**
								 * special case: package has boq (base boq), but requisition/quotations only has items (no boq);
								 * when calculate grand total (base boq total > 0, target total = 0, quote total = 0), this is not correct.
								 * we should set base boq total = 0 when target total = 0
								 */
								if (checkBidderService.boq.isBase(visibleColumn.Id) && targetSum === 0) {
									quoteSum = 0;
								}

								currentItem.totals[visibleColumn.Id] = quoteSum;
								// exclude ideal bidders.
								if (!quoteItem.IsIdealBidder) {
									commonHelperService.concludeTargetValue(visibleColumn.Id, currentItem.totalValues, currentItem.totalValuesExcludeTarget, quoteSum, commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
								}
							} else {
								currentItem.totals[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}

							// set leading value
							let quoteItems = _.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItems.length > 0) {
								currentItem.leadingFields[visibleColumn.Id] = _.sumBy(quoteItems, boqConfigService.leadingFieldCache);
							} else {
								currentItem.leadingFields[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}

						});

						// sort by ascending for calculate rank.
						currentItem.totalValues = _.sortBy(currentItem.totalValues);
						currentItem.totalValuesExcludeTarget = _.sortBy(currentItem.totalValuesExcludeTarget);

						// add max/min/average value
						currentItem[commonService.constant.maxValueIncludeTarget] = 0;
						currentItem[commonService.constant.minValueIncludeTarget] = 0;
						currentItem[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(currentItem.totalValues) || 0;
						currentItem[commonService.constant.maxValueExcludeTarget] = 0;
						currentItem[commonService.constant.minValueExcludeTarget] = 0;
						currentItem[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(currentItem.totalValuesExcludeTarget) || 0;

						// get the min leading Field Values Exclude Target
						let minLeadingField = _.min(currentItem.totalValuesExcludeTarget) || 0;
						let differentFields = commonService.checkHighlightQtn(boqConfigService.visibleCompareColumnsCache, currentItem.QuoteItems);
						let absoluteDiffColumn = _.find(boqConfigService.visibleCompareRowsCache, row => row.Field === boqCompareRows.absoluteDifference || row.Field === boqCompareRows.percentage);
						// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							if (checkBidderService.boq.isNotReference(visibleColumn.Id)) {
								let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
								if (quoteItem) {
									if (absoluteDiffColumn && absoluteDiffColumn.DeviationReference > 0) {
										let leadingField = boqConfigService.leadingFieldCache;
										let isBoqLevelRow = false;
										let percentageBasicQuote = commonService.getBasicQuote(currentItem, absoluteDiffColumn, visibleColumn.Id, differentFields.markFieldQtn, leadingField, commonService.constant.compareType.boqItem, isBoqLevelRow);
										currentItem.percentages[visibleColumn.Id] = percentageBasicQuote.basicPercentage;
									} else {
										if (minLeadingField === 0) {
											currentItem.percentages[visibleColumn.Id] = 0;
										} else {
											currentItem.percentages[visibleColumn.Id] = currentItem.leadingFields && currentItem.leadingFields[visibleColumn.Id] ? currentItem.leadingFields[visibleColumn.Id] / minLeadingField * 100 : 0;
										}
									}
								} else {
									currentItem.percentages[visibleColumn.Id] = commonService.constant.tagForNoQuote;
								}
							}
						});

						// set rank value
						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							if (checkBidderService.boq.isNotReference(visibleColumn.Id)) {
								let rank = _.indexOf(currentItem.totalValuesExcludeTarget, currentItem.totals[visibleColumn.Id]);
								currentItem.ranks[visibleColumn.Id] = rank + 1;
							}
						});

						// set value for children (general total/ boq root item).
						if (currentItem.BoqItemChildren && currentItem.BoqItemChildren.length > 0) {
							angular.forEach(currentItem.BoqItemChildren, function (item) {
								setColumnValuesForGeneralTotalRow(item);
								setColumnValuesForBoqItemRow(item, currentItem);
								item.parentItem = currentItem;
							});
							let children = _.filter(currentItem.BoqItemChildren, {BoqLineTypeFk: boqMainLineTypes.root});
							// set Max/ Min/ Average value
							commonService.combinedMaxMin(currentItem, children);
						}

						// set budget total
						let budgetTotalSum = 0;
						if (currentItem.QuoteItems && currentItem.QuoteItems.length > 0) {
							budgetTotalSum = _.sumBy(_.filter(currentItem.QuoteItems, quoteItem => {
								return quoteItem.QuoteKey === 'QuoteCol_-1_-1_-1';
							}), boqCompareRows.budgetTotal) || 0;
						}
						currentItem.BudgetTotal = budgetTotalSum;
					}
				}

				/**
				 * set bidder's quote value for boq item row.
				 */
				function setColumnValuesForBoqItemRow(currentItem) {
					// boq item row.
					if (commonHelperService.isBoqRow(currentItem.BoqLineTypeFk)) {
						currentItem.leadingFields = {};                      // store quote keys/values for bidders (include BaseBoq/Target)
						currentItem.leadingFieldValues = [];                 // store quote values for bidders (include BaseBoq/Target)
						currentItem.leadingFieldValuesExcludeTarget = [];    // store quote values for bidders (Exclude BaseBoq/Target)
						currentItem.finalPriceFields = {};
						currentItem.ranks = {};
						currentItem.percentages = {};
						let finalPriceValues = [];
						let finalPriceValuesExcludeTarget = [];

						currentItem.originPriceExcludeTarget = [];  // store quote values for bidders (Exclude Target)

						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							currentItem[visibleColumn.Id] = null;

							let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem) {
								let leadingField = boqConfigService.leadingFieldCache;
								// root and level node should always take the total field.
								if (commonHelperService.isBoqLevelRow(currentItem.BoqLineTypeFk) || commonHelperService.isBoqRootRow(currentItem.BoqLineTypeFk)) {
									leadingField = commonService.boqCompareFields.itemTotal;
								}
								let leadingFieldValue = (quoteItem && quoteItem[leadingField]) ? quoteItem[leadingField] : 0;
								currentItem.leadingFields[visibleColumn.Id] = leadingFieldValue;
								// exclude ideal bidders.
								if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
									commonHelperService.concludeTargetValue(visibleColumn.Id, currentItem.leadingFieldValues, currentItem.leadingFieldValuesExcludeTarget, leadingFieldValue, commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);

									// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
									let finalPriceValue = (quoteItem && quoteItem[boqCompareRows.finalPrice]) ? quoteItem[boqCompareRows.finalPrice] : 0;
									commonHelperService.concludeTargetValue(visibleColumn.Id, finalPriceValues, finalPriceValuesExcludeTarget, finalPriceValue, commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
									currentItem.finalPriceFields[visibleColumn.Id] = finalPriceValue;
								}
							} else {
								currentItem.leadingFields[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}
						});

						// sort by ascending for calculate rank.
						currentItem.leadingFieldValues = _.sortBy(currentItem.leadingFieldValues);
						currentItem.leadingFieldValuesExcludeTarget = _.sortBy(currentItem.leadingFieldValuesExcludeTarget);

						// set Average column's boq item tree's value.
						currentItem[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(finalPriceValues) || 0;
						currentItem[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(finalPriceValuesExcludeTarget) || 0;

						// get the min leading Field Values Exclude Target
						let minLeadingField = _.min(currentItem.leadingFieldValuesExcludeTarget) || 0;
						let differentFields = commonService.checkHighlightQtn(boqConfigService.visibleCompareColumnsCache, currentItem.QuoteItems);
						let absoluteDiffColumn = _.find(boqConfigService.visibleCompareRowsCache, row => row.Field === boqCompareRows.absoluteDifference || row.Field === boqCompareRows.percentage);
						// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							if (checkBidderService.boq.isNotReference(visibleColumn.Id)) {
								let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
								if (quoteItem) {
									if (commonHelperService.isBoqRow(currentItem.BoqLineTypeFk) && absoluteDiffColumn && absoluteDiffColumn.DeviationReference > 0) {
										let leadingField = boqConfigService.leadingFieldCache;
										let isBoqLevelRow = false;
										if (commonHelperService.isBoqLevelRow(currentItem.BoqLineTypeFk) || commonHelperService.isBoqRootRow(currentItem.BoqLineTypeFk)) {
											leadingField = commonService.boqCompareFields.itemTotal;
											isBoqLevelRow = true;
										}
										let percentageBasicQuote = commonService.getBasicQuote(currentItem, absoluteDiffColumn, visibleColumn.Id, differentFields.markFieldQtn, leadingField, commonService.constant.compareType.boqItem, isBoqLevelRow);
										currentItem.percentages[visibleColumn.Id] = percentageBasicQuote.basicPercentage;
									} else {
										if (minLeadingField === 0) {
											currentItem.percentages[visibleColumn.Id] = 0;
										} else {
											currentItem.percentages[visibleColumn.Id] = currentItem.leadingFields[visibleColumn.Id] / minLeadingField * 100;
										}
									}
								} else {
									currentItem.percentages[visibleColumn.Id] = commonService.constant.tagForNoQuote;
								}
							}
						});

						// set Rank value
						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {

							let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (quoteItem) {
								if (checkBidderService.boq.isNotReference(visibleColumn.Id)) {
									let rank = _.indexOf(currentItem.leadingFieldValuesExcludeTarget, currentItem.leadingFields[visibleColumn.Id]);
									currentItem.ranks[visibleColumn.Id] = rank + 1;
								}
							} else {
								currentItem.ranks[visibleColumn.Id] = commonService.constant.tagForNoQuote;
							}
						});

						// set value for children.
						if (currentItem.BoqItemChildren && currentItem.BoqItemChildren.length > 0) {
							angular.forEach(currentItem.BoqItemChildren, function (item) {
								setColumnValuesForBoqItemRow(item);
								item.parentItem = currentItem;
							});
						}

						// store price origin Value
						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							let quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
							if (checkBidderService.item.isNotReference(visibleColumn.Id) && quoteItem && !quoteItem.IsIdealBidder) {
								currentItem.originPriceExcludeTarget.push({
									QuoteKey: quoteItem.QuoteKey,
									BoqItemId: quoteItem.BoqItemId,
									Price: quoteItem.Price,
									NotSubmitted: quoteItem.NotSubmitted
								});
							}
						});

						// (1) add dynamic compare row (compare fields) for boq item (Position) and set the row values for of bidder columns (quote bizpartners).
						//    Note: if it's a QuoteNewItem, don't add compare field rows for it.
						//    ** @namespace item.IsQuoteNewItem */
						if (currentItem && commonHelperService.isBoqPositionRow(currentItem.BoqLineTypeFk)) {
							let visibleRowsForPosition = _.filter(boqConfigService.visibleCompareRowsCache, function (item) {
								return !commonHelperService.isExcludedCompareRowOnBoqPosition(item.Field);
							});
							if (!_.isEmpty(visibleRowsForPosition)) {
								setColumnValuesForCompareFieldRow(currentItem, visibleRowsForPosition);
							}
							// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
							// set Max/ Min/ Average value
							currentItem[commonService.constant.maxValueIncludeTarget] = _.max(finalPriceValues) || 0;
							currentItem[commonService.constant.minValueIncludeTarget] = _.min(finalPriceValues) || 0;
							currentItem[commonService.constant.maxValueExcludeTarget] = _.max(finalPriceValuesExcludeTarget) || 0;
							currentItem[commonService.constant.minValueExcludeTarget] = _.min(finalPriceValuesExcludeTarget) || 0;
						}

						// (2)add dynamic compare field row 'Discount' (Discount ABS.IT) only for boq item (Root and Leve1-9)
						if (currentItem && !commonHelperService.isBoqPositionRow(currentItem.BoqLineTypeFk)) {
							if (commonHelperService.isBoqRootRow(currentItem.BoqLineTypeFk)) {
								let visibleRowsForRoot = _.filter(boqConfigService.visibleCompareRowsCache, function (item) {// jshint ignore: line
									return commonHelperService.isIncludedCompareRowOnBoqRoot(item.Field);
								});
								if (!_.isEmpty(visibleRowsForRoot)) {// jshint ignore: line
									_.remove(visibleRowsForRoot, function (item) {
										return item.Field === boqCompareRows.boqTotalRank;
									});
									// according to compare setting of 'percentageLevels' whether display percentage and absoluteDifference or not.
									let percentageLevels = procurementPriceComparisonConfigurationService.getTypeSummaryCompareFields().percentageLevels;
									if (!percentageLevels) {
										_.remove(visibleRowsForRoot, function (item) {
											return _.includes([boqCompareRows.percentage, boqCompareRows.absoluteDifference], item.Field);
										});
									}
									setColumnValuesForCompareFieldRow(currentItem, visibleRowsForRoot);// jshint ignore: line
								}

								// add Boq Total rank for Root
								commonHelperService.addBoqTotalRank(currentItem, boqConfigService, compareDirections.isVerticalCompareRows);
							}

							if (commonHelperService.isBoqLevelRow(currentItem.BoqLineTypeFk)) {
								let visibleRowsForLevel = _.filter(boqConfigService.visibleCompareRowsCache, function (item) {// jshint ignore: line
									return commonHelperService.isIncludedCompareRowOnBoqLevel(item.Field);
								});
								if (!_.isEmpty(visibleRowsForLevel)) {// jshint ignore: line
									// according to compare setting of 'percentageLevels' whether display percentage and absoluteDifference or not.
									let percentageLevels = procurementPriceComparisonConfigurationService.getTypeSummaryCompareFields().percentageLevels;
									if (!percentageLevels) {
										_.remove(visibleRowsForLevel, function (item) {
											return _.includes([boqCompareRows.percentage, boqCompareRows.absoluteDifference], item.Field);
										});
									}
									setColumnValuesForCompareFieldRow(currentItem, visibleRowsForLevel);// jshint ignore: line
								}
							}

							if (currentItem.BoqItemChildren && currentItem.BoqItemChildren.length > 0) {
								let children = _.filter(currentItem.BoqItemChildren, function (child) {
									return commonHelperService.isBoqPositionRow(child.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(child.BoqLineTypeFk);
								});
								// set Max/ Min/ Average value
								commonService.combinedMaxMin(currentItem, children);
							}
						}
					}
				}

				/**
				 * set bidder's quote value for general total row.
				 */
				function setColumnValuesForGeneralTotalRow(currentItem) {
					if (currentItem.BoqLineTypeFk === compareLineTypes.generalTotal) {
						// set value for children.
						angular.forEach(currentItem.BoqItemChildren || [], function (item) {
							setColumnValuesForGeneralItemRow(item);
						});
					}
				}

				/**
				 * set bidder's quote value for general item row.
				 */
				function setColumnValuesForGeneralItemRow(currentItem) {
					if (currentItem.BoqLineTypeFk === compareLineTypes.generalItem) {
						currentItem.totals = {};
						currentItem.totalValues = [];
						currentItem.totalValuesExcludeTarget = [];

						angular.forEach(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
							// currentItem[visibleColumn.Id] = null;

							let generalItem = _.find(currentItem.parentItem.parentItem.QuoteGeneralItems, {
								QuoteKey: visibleColumn.Id,
								ReqHeaderId: currentItem.parentItem.parentItem.ReqHeaderId,
								GeneralTypeId: currentItem.GeneralTypeId
							});

							let value = (generalItem && generalItem.Value) ? generalItem.Value : 0;  // 'Value' is an entity's property

							currentItem.totals[visibleColumn.Id] = value;
							currentItem[visibleColumn.Id] = value;
							commonHelperService.concludeTargetValue(visibleColumn.Id, currentItem.totalValues, currentItem.totalValuesExcludeTarget, value, commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
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
				 * add dynamic compare row (compare fields) for boq item (only BoqLineTypeFk = 0 --> Position) and set the bidder's quote values for the row.
				 */
				function setColumnValuesForCompareFieldRow(parentItem, visibleCompareRows) {
					// add the visible rows by custom setting
					_.forEach(visibleCompareRows, function (visibleRow) {
						if (compareDirections.isVerticalCompareRows && !commonHelperService.isExcludedCompareRowInVerticalMode(visibleRow.Field)) {
							service.setOrRecalculateColumnValuesForCompareFieldRow(parentItem, visibleRow, parentItem);
						} else {
							if (visibleRow.Field !== boqCompareRows.bidderComments) {

								// the Unit Rate Break Down is equal to 0 (or the Unit Rate Break Down Flag is not checked)
								if (_.includes(commonService.unitRateBreakDownFields, visibleRow.Field) && !commonService.showUrbData(parentItem, visibleRow.Field)) {
									return;
								}

								let newRow = _.find(parentItem.BoqItemChildren, {Id: parentItem.Id + '_' + visibleRow.Field});
								if (!newRow) {
									newRow = {};
									newRow.Id = parentItem.Id + '_' + visibleRow.Field; // set id unique};
									newRow.BoqLineTypeFk = compareLineTypes.compareField;
									newRow[commonService.constant.rowType] = visibleRow.Field;
									newRow.LineType = compareLineTypes.compareField;
									if (_.includes(commonService.unitRateBreakDownFields, visibleRow.Field)) {
										let currRow = _.find(boqCompareFields, {Field: visibleRow.Field});
										newRow.LineName = currRow ? currRow.FieldName : visibleRow.Field;
									} else {
										newRow.LineName = '';
									}
									newRow.ConditionalFormat = visibleRow.ConditionalFormat; // used to format the cell with this custom style.
									newRow.parentItem = parentItem;
									newRow.BoqItemChildren = [];
									newRow.HasChildren = false;
									newRow.CompareDescription = visibleRow.DisplayName;
									newRow.RfqHeaderId = parentItem.RfqHeaderId;
									newRow.ReqHeaderId = parentItem.ReqHeaderId;

									// using custom name for compare field 'Urb1/Urb2/Urb3/Urb4/Urb5/Urb6' which stored in target (requisition) BoqHeader's structures.
									if (_.includes(commonService.unitRateBreakDownFields, visibleRow.Field)) {
										newRow.CompareDescription = visibleRow.UserLabelName || service.getUrbDisplayName(visibleRow.Field, visibleRow.DisplayName);
									}
									if (parentItem && commonHelperService.isBoqPositionRow(parentItem.BoqLineTypeFk)) {
										parentItem.BoqItemChildren.push(newRow);
									} else {
										parentItem.BoqItemChildren.unshift(newRow); // put Discount row at first in Level 1-9
									}
									parentItem.HasChildren = true;
								}
								service.setOrRecalculateColumnValuesForCompareFieldRow(parentItem, visibleRow, newRow);
							}

							// add the bidders
							if (boqCompareRows.bidderComments === visibleRow.Field && parentItem.QuoteItems && parentItem.QuoteItems.length > 0) {
								// get all allTextComplement
								let allTextComplement = getAllTextComplement(parentItem.QuoteItems);
								_.forEach(allTextComplement, function (text) {
									let complCaption = parentItem.Id + '_' + text.ComplCaption;
									let newRowText = _.find(parentItem.BoqItemChildren, {Id: complCaption});
									if (!newRowText) {
										newRowText = {};
										newRowText.Id = complCaption; // set id unique};
										newRowText.BoqLineTypeFk = compareLineTypes.compareField;
										newRowText[commonService.constant.rowType] = visibleRow.Field;
										newRowText.LineType = compareLineTypes.compareField;
										newRowText.LineName = 'BC: ' + text.ComplCaption;  // add the string 'BC:' to mark the bidder message
										newRowText.ComplCaption = text.ComplCaption;
										newRowText.ConditionalFormat = visibleRow.ConditionalFormat; // used to format the cell with this custom style.
										newRowText.parentItem = parentItem;
										newRowText.BoqItemChildren = [];
										newRowText.HasChildren = false;
										newRowText.CompareDescription = visibleRow.DisplayName;
										parentItem.BoqItemChildren.push(newRowText);
										parentItem.HasChildren = true;

										service.setOrRecalculateColumnValuesForCompareFieldRow(parentItem, {Field: boqCompareRows.bidderComments}, newRowText);
									}
								});
							}
						}
					});
				}

				// get all allTextComplement
				function getAllTextComplement(quoteItems) {
					let textComplement = [];
					if (!quoteItems) {
						return textComplement;
					}
					_.forEach(quoteItems, function (item) {
						// noinspection JSUnresolvedVariable
						_.forEach(item.TextComplement, function (text) {
							let findText = _.find(textComplement, {ComplCaption: text.ComplCaption});
							if (!findText) {
								textComplement.push(text);
							}
						});
					});
					return textComplement;
				}

				function setBidderCompareRowValue(entity, visibleColumn, visibleRow, currRow, fieldKeys, fieldValues, checkHighlightFields, differentFields, fieldValuesExcludeTarget) {
					let bidderValueProp = visibleColumn.QuoteKey || visibleColumn.Id,
						quoteItem = _.find(entity.QuoteItems, {QuoteKey: visibleColumn.QuoteKey || visibleColumn.Id}),
						compareField = visibleRow.Field;

					if (quoteItem) {
						if (compareField === boqCompareRows.rank) {
							currRow[visibleColumn.Id] = entity.ranks[bidderValueProp] || 0;
						} else if (compareField === boqCompareRows.bidderComments) {
							let textComplement = [];
							if (quoteItem) {
								// noinspection JSUnresolvedVariable
								textComplement = _.find(quoteItem.TextComplement, {ComplCaption: currRow.ComplCaption}); // find currency filed and bidder value
							}
							currRow[visibleColumn.Id + '_$hasBidder'] = true;
							currRow[visibleColumn.Id + '_Id'] = textComplement ? textComplement.Id : null;
							currRow[visibleColumn.Id] = textComplement ? textComplement.ComplBody : '';
						} else {
							// defect: 79827
							// for a change order RFQ,  if it has a change order quote1 for bidder1, but no change order quote2 for bidder2,
							// so in UI, the two compare fields below in quote1 will allow editable, but set readonly in quote2.
							if (_.includes(commonService.boqEditableCompareFields, compareField)) {
								currRow[visibleColumn.Id + '_$hasBidder'] = true;
							}

							if (compareField === boqCompareRows.prcItemEvaluationFk) {
								currRow[visibleColumn.Id] = (quoteItem && quoteItem[boqCompareRows.discountedUnitPrice]) ? quoteItem[boqCompareRows.discountedUnitPrice] : 0;
								currRow[visibleColumn.Id + '_$FirstEvaluationFk'] = (quoteItem && quoteItem[boqCompareRows.prcItemEvaluationFk]) ? quoteItem[boqCompareRows.prcItemEvaluationFk] : null;
								currRow[visibleColumn.Id + '_$Evaluation_QuoteCode'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.quoteCode]) ? quoteItem[commonService.itemEvaluationRelatedFields.quoteCode] : null;
								currRow[visibleColumn.Id + '_$Evaluation_QuoteId'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.quoteId]) ? quoteItem[commonService.itemEvaluationRelatedFields.quoteId] : null;
								currRow[visibleColumn.Id + '_$Evaluation_SourceBoqHeaderId'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.sourceBoqHeaderId]) ? quoteItem[commonService.itemEvaluationRelatedFields.sourceBoqHeaderId] : null;
								currRow[visibleColumn.Id + '_$Evaluation_SourceBoqItemId'] = (quoteItem && quoteItem[commonService.itemEvaluationRelatedFields.sourceBoqItemId]) ? quoteItem[commonService.itemEvaluationRelatedFields.sourceBoqItemId] : null;
							} else if (compareField === boqCompareRows.userDefined1 ||
								compareField === boqCompareRows.userDefined2 ||
								compareField === boqCompareRows.userDefined3 ||
								compareField === boqCompareRows.userDefined4 ||
								compareField === boqCompareRows.userDefined5 ||
								compareField === boqCompareRows.externalCode) {

								currRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : '';
							} else if (compareField === boqCompareRows.commentContractor || compareField === boqCompareRows.commentClient) {
								currRow[visibleColumn.Id] = quoteItem ? quoteItem[compareField] : null;
							} else if (compareField === boqCompareRows.isLumpsum || compareField === boqCompareRows.included || compareField === boqCompareRows.notSubmitted) {
								currRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : false;
							} else if (compareField === boqCompareRows.absoluteDifference || compareField === boqCompareRows.percentage) {
								let leadingField = boqConfigService.leadingFieldCache;
								let isBoqLevelRow = false;
								// root and level node should always take the total field.
								if (commonHelperService.isBoqLevelRow(entity.BoqLineTypeFk) || commonHelperService.isBoqRootRow(entity.BoqLineTypeFk)) {
									leadingField = commonService.boqCompareFields.itemTotal;
									isBoqLevelRow = true;
								}
								let basicQuote = commonService.getBasicQuote(entity, visibleRow, bidderValueProp, differentFields.markFieldQtn, leadingField, commonService.constant.compareType.boqItem, isBoqLevelRow);
								currRow[visibleColumn.Id] = compareField === boqCompareRows.absoluteDifference ? basicQuote.absoluteDifference : basicQuote.basicPercentage;
								if (!quoteItem.IsIdealBidder && currRow[visibleColumn.Id] !== commonService.constant.tagForNoQuote) {
									commonHelperService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, currRow[visibleColumn.Id], commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
								}
							} else {
								currRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : 0;
								// exclude ideal bidders.
								if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
									commonHelperService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, currRow[visibleColumn.Id], commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
								}
							}
						}
						commonHelperService.setConfigFieldReadonly(visibleRow.Field, visibleColumn.Id, currRow, boqConfigService.boqQtnMatchCache, quoteItem, visibleColumn.IsIdealBidder, compareDirections.isVerticalCompareRows);

						// for highlight function
						if (visibleColumn.IsHighlightChanges === true && _.includes(checkHighlightFields, compareField)) {
							currRow[visibleColumn.Id + commonService.constant.highlightQtn] = differentFields[compareField] === false;
						}
						fieldKeys.push(visibleColumn.Id);
					} else {
						currRow[visibleColumn.Id] = commonService.constant.tagForNoQuote;
					}
				}

				function recalculateRfqRequisitionRows(rfqRow) {
					_.forEach(rfqRow.BoqItemChildren, function (childRow) {
						if (_.startsWith(childRow.Id, 'requisition_row')) {
							setColumnValuesForRequisitionRow(childRow);
						}
					});
				}

				function recalculateRfqRow(rfqRow) {
					recalculateRfqRequisitionRows(rfqRow);

					setColumnValuesForRfqRow(rfqRow);
				}

				function retrieveTotalDescription(itemTypeValue, itemTypeLookupName, summaryInfo) {
					let itemTypes = lookupDescriptorService.getData(itemTypeLookupName);
					let itemType = itemTypes[itemTypeValue];
					if (itemType) {
						let itemTypeInfoProp = itemTypeLookupName === 'itemTypes' ? 'boqItemTypesInfos' : 'boqItemTypes2Infos',
							itemTypeInfos = summaryInfo[itemTypeInfoProp] || {},
							targetInfo = _.find(itemTypeInfos, {Id: itemType.Id});
						return (targetInfo && targetInfo.UserLabelName) ? targetInfo.UserLabelName : itemType.DisplayName;
					}
					return '';
				}

				function createRowOptions(parent, summaryInfo) {
					let rowOptions = [
						{
							rows: [
								{
									Id: parent.Id + '_standard_total',
									ParentId: parent.Id,
									CompareDescription: retrieveTotalDescription(1, 'itemTypes', summaryInfo),
									SummaryRowType: commonService.boqSummaryRowTypes.total,
									rowType: 'standard_total',
									BoqLineTypeFk: boqCompareRows.summaryStandardTotal
								},
								{
									Id: parent.Id + '_standard_abs',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountAbs'),
									SummaryRowType: commonService.boqSummaryRowTypes.abs,
									rowType: 'standard_abs',
									BoqLineTypeFk: boqCompareRows.summaryStandardABS
								},
								{
									Id: parent.Id + '_standard_percent',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountPercent'),
									SummaryRowType: commonService.boqSummaryRowTypes.percent,
									rowType: 'standard_percent',
									BoqLineTypeFk: boqCompareRows.summaryStandardPercent
								},
								{
									Id: parent.Id + '_standard_discountTotal',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.summaryTotal', {
										p_0: retrieveTotalDescription(1, 'itemTypes', summaryInfo)
									}),
									SummaryRowType: commonService.boqSummaryRowTypes.discountTotal,
									rowType: 'standard_discountTotal',
									BoqLineTypeFk: boqCompareRows.summaryStandardDiscountTotal,
									cssClass: 'font-bold'
								}
							],
							summaryType: commonService.boqSummaryTypes.standard
						},
						{
							rows: [
								{
									Id: parent.Id + '_optIT_total',
									ParentId: parent.Id,
									CompareDescription: retrieveTotalDescription(5, 'itemTypes', summaryInfo),
									SummaryRowType: commonService.boqSummaryRowTypes.total,
									rowType: 'optIT_total',
									BoqLineTypeFk: boqCompareRows.summaryOptionalITTotal
								},
								{
									Id: parent.Id + '_optIT_abs',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountAbs'),
									SummaryRowType: commonService.boqSummaryRowTypes.abs,
									rowType: 'optIT_abs',
									BoqLineTypeFk: boqCompareRows.summaryOptionalITABS
								},
								{
									Id: parent.Id + '_optIT_percent',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountPercent'),
									SummaryRowType: commonService.boqSummaryRowTypes.percent,
									rowType: 'optIT_percent',
									BoqLineTypeFk: boqCompareRows.summaryOptionalITPercent
								},
								{
									Id: parent.Id + '_optIT_discountTotal',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.summaryTotal', {
										p_0: retrieveTotalDescription(5, 'itemTypes', summaryInfo)
									}),
									SummaryRowType: commonService.boqSummaryRowTypes.discountTotal,
									rowType: 'optIT_discountTotal',
									BoqLineTypeFk: boqCompareRows.summaryOptionalITDiscountTotal,
									cssClass: 'font-bold'
								}
							],
							summaryType: commonService.boqSummaryTypes.optionWithIT
						},
						{
							rows: [
								{
									Id: parent.Id + '_optWIT_total',
									ParentId: parent.Id,
									CompareDescription: retrieveTotalDescription(2, 'itemTypes', summaryInfo),
									SummaryRowType: commonService.boqSummaryRowTypes.total,
									rowType: 'optWIT_total',
									BoqLineTypeFk: boqCompareRows.summaryOptionalWITTotal
								},
								{
									Id: parent.Id + '_optWIT_abs',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountAbs'),
									SummaryRowType: commonService.boqSummaryRowTypes.abs,
									rowType: 'optWIT_abs',
									BoqLineTypeFk: boqCompareRows.summaryOptionalWITABS
								},
								{
									Id: parent.Id + '_optWIT_percent',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountPercent'),
									SummaryRowType: commonService.boqSummaryRowTypes.percent,
									rowType: 'optWIT_percent',
									BoqLineTypeFk: boqCompareRows.summaryOptionalWITPercent
								},
								{
									Id: parent.Id + '_optWIT_discountTotal',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.summaryTotal', {
										p_0: retrieveTotalDescription(2, 'itemTypes', summaryInfo)
									}),
									SummaryRowType: commonService.boqSummaryRowTypes.discountTotal,
									rowType: 'optWIT_discountTotal',
									BoqLineTypeFk: boqCompareRows.summaryOptionalWITDiscountTotal,
									cssClass: 'font-bold'
								}
							],
							summaryType: commonService.boqSummaryTypes.optionWithoutIT
						},
						{
							rows: [
								{
									Id: parent.Id + '_alternative_total',
									ParentId: parent.Id,
									CompareDescription: retrieveTotalDescription(5, 'itemTypes2', summaryInfo),
									SummaryRowType: commonService.boqSummaryRowTypes.total,
									rowType: 'alternative_total',
									BoqLineTypeFk: boqCompareRows.summaryAlternativeTotal,
									_rt$Deleted: true
								},
								{
									Id: parent.Id + '_alternative_abs',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountAbs'),
									SummaryRowType: commonService.boqSummaryRowTypes.abs,
									rowType: 'alternative_abs',
									BoqLineTypeFk: boqCompareRows.summaryAlternativeABS,
									_rt$Deleted: true
								},
								{
									Id: parent.Id + '_alternative_percent',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountPercent'),
									SummaryRowType: commonService.boqSummaryRowTypes.percent,
									rowType: 'alternative_percent',
									BoqLineTypeFk: boqCompareRows.summaryAlternativePercent,
									_rt$Deleted: true
								},
								{
									Id: parent.Id + '_alternative_discountTotal',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.summaryTotal', {
										p_0: retrieveTotalDescription(5, 'itemTypes2', summaryInfo)
									}),
									SummaryRowType: commonService.boqSummaryRowTypes.discountTotal,
									rowType: 'alternative_discountTotal',
									BoqLineTypeFk: boqCompareRows.summaryAlternativeDiscountTotal,
									cssClass: 'font-bold'
								}
							],
							summaryType: commonService.boqSummaryTypes.alternative
						},
						{
							rows: [
								{
									Id: parent.Id + '_grand_total',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.grantItems'),
									SummaryRowType: commonService.boqSummaryRowTypes.total,
									rowType: 'grand_total',
									BoqLineTypeFk: boqCompareRows.summaryGrandTotal
								},
								{
									Id: parent.Id + '_grand_abs',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountAbs'),
									SummaryRowType: commonService.boqSummaryRowTypes.abs,
									rowType: 'grand_abs',
									BoqLineTypeFk: boqCompareRows.summaryGrandABS
								},
								{
									Id: parent.Id + '_grand_percent',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.discountPercent'),
									SummaryRowType: commonService.boqSummaryRowTypes.percent,
									rowType: 'grand_percent',
									BoqLineTypeFk: boqCompareRows.summaryGrandPercent
								},
								{
									Id: parent.Id + '_grand_discountTotal',
									ParentId: parent.Id,
									CompareDescription: $translate.instant('procurement.pricecomparison.printing.grandDiscountItems'),
									SummaryRowType: commonService.boqSummaryRowTypes.discountTotal,
									rowType: 'grand_discountTotal',
									BoqLineTypeFk: boqCompareRows.summaryGrandDiscountTotal,
									cssClass: 'font-bold'
								}
							],
							summaryType: commonService.boqSummaryTypes.grand
						}
					];

					_.each(rowOptions, function (opt) {
						_.each(opt.rows, function (row) {
							row.nodeInfo = {
								level: parent.nodeInfo ? parent.nodeInfo.level + 1 : 1,
								collapsed: true,
								lastElement: true
							};
						});
					});

					return rowOptions;
				}

				function mergeRowOptions(bidderColumns, levelOptions, positionOptions, defaultOptionsFn) {
					if (levelOptions && positionOptions) {
						_.each(levelOptions, rowOpt => {
							let summaryTypeTarget = _.find(positionOptions, {summaryType: rowOpt.summaryType});
							_.each(rowOpt.rows, row => {
								let rowTarget = _.find(summaryTypeTarget.rows, {Id: row.Id});
								_.each(bidderColumns, bidder => {
									if (_.includes([
										commonService.boqSummaryRowTypes.total,
										commonService.boqSummaryRowTypes.abs,
										commonService.boqSummaryRowTypes.discountTotal
									], row.SummaryRowType) && _.isNumber(row[bidder.Id]) && rowTarget[bidder.Id]) {
										row[bidder.Id] += rowTarget[bidder.Id];
									}
								});
							});
						});
					}
					return levelOptions || positionOptions || defaultOptionsFn();
				}

				function processSummaryDataRowChildren(parent, bidderColumns, summaryInfo) {
					if (commonHelperService.isBoqRootRow(parent.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(parent.BoqLineTypeFk)) {
						let children = parent.BoqItemChildren;
						let levels = _.filter(children, (child) => {
							return commonHelperService.isBoqLevelRow(child.BoqLineTypeFk);
						});
						let positions = _.filter(children, (child) => {
							return commonHelperService.isBoqPositionRow(child.BoqLineTypeFk);
						});
						let levelRowOptions = null;
						let positionRowOptions = null;

						if (levels.length) {
							levelRowOptions = createRowOptions(parent, summaryInfo);
							// Current row contains levels.
							_.each(children, function (child) {
								processSummaryDataRowChildren(child, bidderColumns, summaryInfo);
							});

							let discountItems = [];
							_.each(children, function (child) {
								let summaryItems = _.filter(child.BoqItemChildren, function (item) {
									return _.includes([commonService.boqSummaryRowTypes.discountTotal], item.SummaryRowType);
								});
								discountItems = discountItems.concat(summaryItems);
							});

							_.each(bidderColumns, function (bidder) {
								let parentQuote = _.find(parent.QuoteItems, {QuoteKey: bidder.Id});
								if (parentQuote) {
									let totalSum = _.sumBy(_.filter(discountItems, {BoqLineTypeFk: boqCompareRows.summaryGrandDiscountTotal}), bidder.Id);
									let currDiscountPercent = getProcessSummaryCurrentBidderDiscount(parentQuote, totalSum);
									_.each(levelRowOptions, function (rowOpt) {
										let items = [];
										switch (rowOpt.summaryType) {
											case commonService.boqSummaryTypes.standard:
												items = _.filter(discountItems, {BoqLineTypeFk: boqCompareRows.summaryStandardDiscountTotal});
												break;
											case commonService.boqSummaryTypes.optionWithIT:
												items = _.filter(discountItems, {BoqLineTypeFk: boqCompareRows.summaryOptionalITDiscountTotal});
												break;
											case commonService.boqSummaryTypes.optionWithoutIT:
												items = _.filter(discountItems, {BoqLineTypeFk: boqCompareRows.summaryOptionalWITDiscountTotal});
												break;
											case commonService.boqSummaryTypes.grand:
												items = _.filter(discountItems, {BoqLineTypeFk: boqCompareRows.summaryGrandDiscountTotal});
												break;
											case commonService.boqSummaryTypes.alternative:
												items = _.filter(discountItems, {BoqLineTypeFk: boqCompareRows.summaryAlternativeDiscountTotal});
												break;
										}
										_.each(rowOpt.rows, function (row) {
											processSummaryDataRowLevelBidderColumns(rowOpt.rows, items, row, bidder, currDiscountPercent, bidder.Id);
										});
									});
								} else {
									_.each(levelRowOptions, function (rowOpt) {
										_.each(rowOpt.rows, function (row) {
											processSummaryEmptyDataRowLevelBidderColumns(row, bidder);
										});
									});
								}
							});
						}

						if (positions.length) {
							positionRowOptions = createRowOptions(parent, summaryInfo);
							// Current row contains positions.
							let quoteItems = [];
							_.each(children, function (child) {
								if (child.BoqLineTypeFk === boqMainLineTypes.position) {
									quoteItems = quoteItems.concat(child.QuoteItems);
								}
							});
							_.each(bidderColumns, function bidderColumnsIterator(bidder) {
								let parentQuote = _.find(parent.QuoteItems, {QuoteKey: bidder.Id});
								if (parentQuote) {
									let bidderItems = _.filter(quoteItems, {QuoteKey: bidder.Id});
									_.each(positionRowOptions, function rowOptsIterator(rowOpt) {
										let items = [], sumProp = 'Finalprice';
										switch (rowOpt.summaryType) {
											case commonService.boqSummaryTypes.standard:
												items = _.filter(bidderItems, function standardIterator(item) {
													return commonHelperService.isStandardBoq(item.BasItemTypeFk, item.BasItemType2Fk);
												});
												break;
											case commonService.boqSummaryTypes.optionWithIT:
												items = _.filter(bidderItems, function optionITIterator(item) {
													return commonHelperService.isOptionalWithItBoq(item.BasItemTypeFk, item.BasItemType2Fk);
												});
												break;
											case commonService.boqSummaryTypes.optionWithoutIT:
												items = _.filter(bidderItems, function (item) {
													return commonHelperService.isOptionalWithoutItBoq(item.BasItemTypeFk);
												});
												sumProp = 'Finalprice_BaseAlt';
												break;
											case commonService.boqSummaryTypes.grand:
												items = _.filter(bidderItems, {QuoteKey: bidder.Id});
												sumProp = function (item) {
													if (item.BasItemTypeFk === 2 || item.BasItemType2Fk === 5) {
														return item['Finalprice_BaseAlt'];
													}
													return item.Finalprice;
												};
												break;
											case  commonService.boqSummaryTypes.alternative:
												items = _.filter(bidderItems, function (item) {
													return commonHelperService.isAlternativeBoq(item.BasItemType2Fk);
												});
												sumProp = 'Finalprice_BaseAlt';
												break;
										}
										let totalSum = _.sumBy(bidderItems, sumProp);
										let currDiscountPercent = getProcessSummaryCurrentBidderDiscount(parentQuote, totalSum);
										_.each(rowOpt.rows, function rowsIterator(row) {
											processSummaryDataRowLevelBidderColumns(rowOpt.rows, items, row, bidder, currDiscountPercent, sumProp);
										});
									});
								} else {
									_.each(positionRowOptions, function copyRowOptsIterator(rowOpt) {
										_.each(rowOpt.rows, function rowsEmptyIterator(row) {
											processSummaryEmptyDataRowLevelBidderColumns(row, bidder);
										});
									});
								}
							});
						}

						let rowOptions = mergeRowOptions(bidderColumns, levelRowOptions, positionRowOptions, () => createRowOptions(parent, summaryInfo));

						// Insert new rows into children node.
						let tempChildren = parent.BoqItemChildren ? parent.BoqItemChildren : [],
							currRowOptions = processSummaryDataRowValueComparison(rowOptions.reverse(), bidderColumns);
						_.each(currRowOptions, function (rowOpt) {
							_.each(rowOpt.rows, row => {
								row.parentItem = parent;
							});
							tempChildren = _.concat(rowOpt.rows, tempChildren);
						});
						parent.BoqItemChildren = tempChildren;
					}
				}

				function processSummaryDataRowValueComparison(rowOptions, bidderColumns) {
					_.each(rowOptions, function (rowOpt) {
						_.each(rowOpt.rows, function (row) {
							let excludeTargetValues = [], includeTargetValues = [];
							_.each(bidderColumns, function (bidder) {
								if (_.isNumber(row[bidder.Id])) {
									commonHelperService.concludeTargetValue(bidder.Id, includeTargetValues, excludeTargetValues, row[bidder.Id], commonService.constant.compareType.prcItem, bidderColumns);
								}
							});

							// Calculate max/min/average value by exclude target.
							row[commonService.constant.minValueExcludeTarget] = _.min(excludeTargetValues);
							row[commonService.constant.maxValueExcludeTarget] = _.max(excludeTargetValues);
							row[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(excludeTargetValues);

							// Calculate max/min/average values by include target.
							row[commonService.constant.minValueIncludeTarget] = _.min(includeTargetValues);
							row[commonService.constant.maxValueIncludeTarget] = _.max(includeTargetValues);
							row[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(includeTargetValues);
						});
					});
					return rowOptions;
				}

				function processSummaryDataRowLevelBidderColumns(rows, sumItems, row, bidder, currDiscountPercent, totalSumProp) {
					// This function' logic constrains that the row sorting should be like total->abs->percent->discountTotal
					let absTotal = null;
					switch (row.SummaryRowType) {
						case commonService.boqSummaryRowTypes.total: {
							let actualSumItems = _.filter(sumItems, function (item) {
								let sumValue = _.isString(totalSumProp) ? item[totalSumProp] : totalSumProp(item);
								return _.isNumber(sumValue);
							});
							row[bidder.Id] = _.sumBy(actualSumItems, totalSumProp);
							break;
						}
						case commonService.boqSummaryRowTypes.abs:
							absTotal = _.find(rows, {SummaryRowType: commonService.boqSummaryRowTypes.total})[bidder.Id];
							row[bidder.Id] = absTotal * currDiscountPercent / 100;
							break;
						case commonService.boqSummaryRowTypes.percent:
							absTotal = _.find(rows, {SummaryRowType: commonService.boqSummaryRowTypes.total})[bidder.Id];
							row[bidder.Id] = absTotal === 0 ? 0 : currDiscountPercent;
							break;
						case commonService.boqSummaryRowTypes.discountTotal: {
							let total = _.find(rows, {SummaryRowType: commonService.boqSummaryRowTypes.total})[bidder.Id],
								abs = _.find(rows, {SummaryRowType: commonService.boqSummaryRowTypes.abs})[bidder.Id];
							row[bidder.Id] = total - abs;
							break;
						}
					}
				}

				function processSummaryEmptyDataRowLevelBidderColumns(row, bidder) {
					row[bidder.Id] = undefined;
				}

				function getProcessSummaryCurrentBidderDiscount(parentQuote, totalSum) {
					let currDiscountPercent = 0,
						discount = parentQuote.Discount,
						discountPercentIt = parentQuote.DiscountPercentIt;
					if (discountPercentIt > 0) {
						currDiscountPercent = discountPercentIt;
					}
					if (discount > 0) {
						currDiscountPercent = (discount && totalSum > 0 ? discount / totalSum : 0) * 100;
					}
					return currDiscountPercent;
				}

				function getRemoveBoQsByRanges(dataTree, boqRanges) {
					let dataRows = commonHelperService.flatTree(dataTree, 'BoqItemChildren');
					let removeItems = [];
					let rfqNodes = _.filter(dataRows, function (item) {
						return item.BoqLineTypeFk === compareLineTypes.rfq;
					});
					_.each(rfqNodes, function (rfq) {
						let dataSource = commonHelperService.flatTree([rfq], 'BoqItemChildren');
						_.each(boqRanges, function (range) {
							let root = _.find(dataSource, function (row) {
								return row.BoqLineTypeFk === boqMainLineTypes.root && row.Reference === range.ReferenceNo;
							});
							let index = 0;
							root.sorting = index;
							let flatList = commonHelperService.flatTree([root], 'BoqItemChildren');
							_.each(flatList, function (item) {
								item.sorting = ++index;
							});

							let fromBoq = _.find(flatList, {BoqItemId: range['FromId']}),
								toBoq = _.find(flatList, {BoqItemId: range['ToId']});
							if (toBoq && commonHelperService.isBoqPositionRow(toBoq.BoqLineTypeFk) && toBoq.BoqItemChildren.length > 0) {
								toBoq = _.last(commonHelperService.flatTree([toBoq], 'BoqItemChildren'));
							}
							removeItems = removeItems.concat(_.filter(flatList, function (item) {
								return (fromBoq ? item.sorting < fromBoq.sorting : false) || (toBoq ? item.sorting > toBoq.sorting : false);
							}));
						});
					});

					return removeItems;
				}

				function getRemoveBoQsByItemTypes(item, itemTypes, itemTypes2, boqStructure) {
					let items = [],
						isPosition = commonHelperService.isBoqPositionRow(item.BoqLineTypeFk),
						isCRB = boqStructure && boqStructure['StandardId'] === 4,
						isEmptyTypes = itemTypes.length === 0 && itemTypes2.length === 0,
						isExcluding = item.BasItemTypeFk === 0 ? false : (!_.includes(itemTypes, item.BasItemTypeFk) || !_.includes(itemTypes2, item.BasItemType2Fk));

					if ((isPosition) && (!isCRB) && (isEmptyTypes || isExcluding)) {
						items = items.concat([item]).concat(commonHelperService.flatTree(item.BoqItemChildren, 'BoqItemChildren'));
					} else {
						_.each(item.BoqItemChildren, function (m) {
							items = items.concat(getRemoveBoQsByItemTypes(m, itemTypes, itemTypes2, boqStructure));
						});
					}
					return items;
				}

				function getRemoveBoQsByZeroValue(item, bidderColumns) {
					let items = [],
						isPositionRow = commonHelperService.isBoqPositionRow(item.BoqLineTypeFk),
						isSummaryRow = _.includes(commonService.boqSummaryFileds, item.BoqLineTypeFk),
						isRowMatched = isPositionRow || isSummaryRow,
						isMatched = isRowMatched && _.sumBy(bidderColumns, function sumPropFn(column) {
							if (isSummaryRow) {
								return Math.abs(_.isNumber(item[column.Id]) ? item[column.Id] : 0);
							} else {
								let boqItem = _.find(item.QuoteItems, {QuoteKey: column.Id});
								let prop = _.includes([3, 5], item.BasItemType2Fk) || _.includes([2], item.BasItemTypeFk) ? 'ItemTotal_BaseAlt' : 'ItemTotal';
								return Math.abs(boqItem ? boqItem[prop] : 0);
							}
						}) === 0;

					if (isMatched) {
						items = items.concat([item]).concat(commonHelperService.flatTree(item.BoqItemChildren, 'BoqItemChildren'));
					} else {
						_.each(item.BoqItemChildren, function childrenIterator(m) {
							items = items.concat(getRemoveBoQsByZeroValue(m, bidderColumns));
						});
					}
					return items;
				}

				function getRemoveBoQsBySummaryChildren(parent, checkedLineTypes, bidderColumns) {
					let children = parent.BoqItemChildren,
						removeItems = [];

					if (parent.BoqLineTypeFk === boqMainLineTypes.root || (parent.BoqLineTypeFk >= boqMainLineTypes.level1 && parent.BoqLineTypeFk <= boqMainLineTypes.level9)) {
						if (!_.includes(checkedLineTypes, parent.BoqLineTypeFk)) {
							let summaryRows = _.filter(children, function (item) {
								return _.includes(commonService.boqSummaryFileds, item.BoqLineTypeFk);
							});
							removeItems = _.concat(removeItems, summaryRows);
						}
					}

					_.each(parent.BoqItemChildren, function (child) {
						removeItems = removeItems.concat(getRemoveBoQsBySummaryChildren(child, checkedLineTypes, bidderColumns));
					});

					removeItems = _.concat(removeItems);
					return removeItems;
				}

				/**
				 * set or recalculate column values for 'compare field row'.
				 */
				service.setOrRecalculateColumnValuesForCompareFieldRow = function setOrRecalculateColumnValuesForCompareFieldRow(parentItem, visibleRow, newRow) {
					// set max/min/average column's compare row's (compare fields) value.
					let fieldValues = [];
					let fieldValuesExcludeTarget = [];
					// find highlight
					let differentFields = commonService.checkHighlightQtn(boqConfigService.visibleCompareColumnsCache, parentItem.QuoteItems);
					let checkHighlightFields = commonService.highlightFields;
					let fieldKeys = [];
					let isVerticalCompareRows = compareDirections.isVerticalCompareRows;
					_.each(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
						let currColumn = isVerticalCompareRows && !commonHelperService.isExcludedCompareRowInVerticalMode(visibleRow.Field) ? commonHelperService.copyAndExtend(visibleColumn, {
							Id: commonHelperService.getCombineCompareField(visibleColumn.Id, visibleRow.Field),
							QuoteKey: visibleColumn.Id,
							IsHighlightChanges: visibleColumn.IsHighlightChanges,
							IsIdealBidder: visibleColumn.IsIdealBidder
						}) : visibleColumn;

						setBidderCompareRowValue(parentItem, currColumn, visibleRow, newRow, fieldKeys, fieldValues, checkHighlightFields, differentFields, fieldValuesExcludeTarget);
					});

					if (visibleRow.Field === boqCompareRows.rank) {
						fieldValues = parentItem.ranks;
						for (var quoteKey1 in parentItem.ranks) {
							var quoteItem1 = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey1});
							if (checkBidderService.boq.isNotReference(quoteKey1) && quoteItem1 && !quoteItem1.IsIdealBidder) {
								// noinspection JSUnfilteredForInLoop
								fieldValuesExcludeTarget.push(parentItem.ranks[quoteKey1]);
							}
						}
					} else if (visibleRow.Field === boqCompareRows.percentage) {
						fieldValues = parentItem.percentages;
						for (var quoteKey2 in parentItem.percentages) {
							var quoteItem2 = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey2});
							if (checkBidderService.boq.isNotReference(quoteKey2) && quoteItem2 && !quoteItem2.IsIdealBidder) {
								// no inspection JSUnfilteredForInLoop
								fieldValuesExcludeTarget.push(parentItem.percentages[quoteKey2]);
							}
						}
					} else if (!visibleRow.Field) {
						fieldValues = [];
						fieldValuesExcludeTarget = [];
					}
					let compareRowPrefix = isVerticalCompareRows ? visibleRow.Field + '_' : '';
					newRow[compareRowPrefix + commonService.constant.maxValueIncludeTarget] = commonHelperService.getRepairNumeric(_.max(fieldValues));
					newRow[compareRowPrefix + commonService.constant.minValueIncludeTarget] = commonHelperService.getRepairNumeric(_.min(fieldValues));
					newRow[compareRowPrefix + commonService.constant.averageValueIncludeTarget] = commonHelperService.getRepairNumeric(commonService.calculateAverageValue(fieldValues));
					newRow[compareRowPrefix + commonService.constant.maxValueExcludeTarget] = commonHelperService.getRepairNumeric(_.max(fieldValuesExcludeTarget));
					newRow[compareRowPrefix + commonService.constant.minValueExcludeTarget] = commonHelperService.getRepairNumeric(_.min(fieldValuesExcludeTarget));
					newRow[compareRowPrefix + commonService.constant.averageValueExcludeTarget] = commonHelperService.getRepairNumeric(commonService.calculateAverageValue(fieldValuesExcludeTarget));

					let isBoqLevelRow = false;
					let leadingField = boqConfigService.leadingFieldCache;
					if (commonHelperService.isBoqLevelRow(newRow.BoqLineTypeFk) || commonHelperService.isBoqRootRow(newRow.BoqLineTypeFk)) {
						leadingField = commonService.boqCompareFields.itemTotal;
						isBoqLevelRow = true;
					}
					// highlight deviation rows
					commonService.highlightRows(parentItem, newRow, visibleRow, commonService.boqDeviationFields, fieldKeys, differentFields.markFieldQtn, leadingField, 2, isBoqLevelRow);

					return newRow; // return object only used in recalculation by the changed 'PrcItemEvaluationFk' value.
				};

				/**
				 * get recalculate column values for 'compare field row'.
				 */
				service.getColumnValuesForCompareFieldRow = function recalculateColumnValuesForCompareFieldRow(parentItem, visibleRow, newRow) {
					if (!parentItem) {
						return;
					}
					// set max/min/average column's compare row's (compare fields) value.
					let fieldValues = [];
					_.each(boqConfigService.visibleCompareColumnsCache, function (visibleColumn) {
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
							commonHelperService.concludeTargetValue(item.id, currentFieldValues, currentFieldValuesExcludeTarget, item.value, commonService.constant.compareType.boqItem, boqConfigService.visibleCompareColumnsCache);
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

				/**
				 * recalculate boq comparison data tree by the changed compared field 'PrcItemEvaluation' value (use a custom price for evaluation)
				 * Note: must recalculate by order (from child to parent)
				 */
				service.recalculateTreeByModifiedPrcItemEvaluation = function recalculateTreeByModifiedPrcItemEvaluation(itemTree) {
					_.each(itemTree || [], function (row) {
						if (_.startsWith(row.Id, 'rfq_row') && !_.isEmpty(row.BoqItemChildren)) {
							recalculateRfqRow(row);
						}
					});

					// recalculate 'grand total row'
					commonHelperService.setColumnValuesForGrandTotalRow(boqConfigService.visibleCompareColumnsCache, itemTree[0], itemTree, commonService.constant.compareType.boqItem);

					// recalculate 'offered total row'
					let offeredTotalRow = _.find(itemTree, {Id: 'offered_total_row'});
					if (offeredTotalRow) {
						commonHelperService.setColumnValuesForOfferedTotalRow(boqConfigService.visibleCompareColumnsCache, offeredTotalRow, itemTree, commonService.constant.compareType.boqItem);
					}

					// recalculate 'evaluated total row'
					let evaluatedTotalRow = _.find(itemTree, {Id: 'evaluated_total_row'});
					if (evaluatedTotalRow) {
						commonHelperService.setColumnValuesForEvaluatedTotalRow(boqConfigService.visibleCompareColumnsCache, evaluatedTotalRow, itemTree, commonService.constant.compareType.boqItem);
					}
				};

				service.getDefaultBoqStructure = function () {
					return boqHeaderStructuresCache && boqHeaderStructuresCache.length ? boqHeaderStructuresCache[0] : null;
				};

				service.getBoqHeaderStructureWithNameUrb = function () {
					if (boqHeaderStructuresCache && boqHeaderStructuresCache.length) {
						return _.find(boqHeaderStructuresCache, function (item) {
							return item.NameUrb1 || item.NameUrb2 || item.NameUrb3 || item.NameUrb4 || item.NameUrb5 || item.NameUrb6;
						});
					}
					return null;
				};

				service.setBoqCompareFields = function (fields) {
					boqCompareFields = fields;
				};

				service.setCompareDirections = function (directions) {
					compareDirections = angular.extend(compareDirections, directions);
				};

				service.getUrbDisplayName = function (field, altName) {
					let structure = service.getBoqHeaderStructureWithNameUrb(),
						displayName = altName;
					switch (field) {
						case boqCompareRows.urBreakdown1:
							displayName = (structure && structure.NameUrb1) ? structure.NameUrb1 : altName;
							break;
						case boqCompareRows.urBreakdown2:
							displayName = (structure && structure.NameUrb2) ? structure.NameUrb2 : altName;
							break;
						case boqCompareRows.urBreakdown3:
							displayName = (structure && structure.NameUrb3) ? structure.NameUrb3 : altName;
							break;
						case boqCompareRows.urBreakdown4:
							displayName = (structure && structure.NameUrb4) ? structure.NameUrb4 : altName;
							break;
						case boqCompareRows.urBreakdown5:
							displayName = (structure && structure.NameUrb5) ? structure.NameUrb5 : altName;
							break;
						case boqCompareRows.urBreakdown6:
							displayName = (structure && structure.NameUrb6) ? structure.NameUrb6 : altName;
							break;
					}
					return displayName;
				};

				service.removeBoQDataRowsByRanges = function (dataTree, boqRanges, isSoftRemove) {

					let removeItems = getRemoveBoQsByRanges(dataTree, boqRanges);

					let removeIds = _.map(removeItems, function (item) {
						return item.Id;
					});

					return commonHelperService.removeDataRowsRecursively(dataTree, function (n) {
						return _.includes(removeIds, n.Id);
					}, isSoftRemove);
				};

				service.removeBoQDataRowsByItemTypes = function (dataTree, itemTypes, itemTypes2, isSoftRemove) {

					let removeItems = [];
					let boqStructure = _.first(boqHeaderStructuresCache);

					_.each(dataTree, function (item) {
						removeItems = removeItems.concat(getRemoveBoQsByItemTypes(item, itemTypes, itemTypes2, boqStructure));
					});

					let removeIds = _.map(removeItems, function (item) {
						return item.Id;
					});

					return commonHelperService.removeDataRowsRecursively(dataTree, function (n) {
						return _.includes(removeIds, n.Id);
					}, isSoftRemove);
				};

				service.removeSummaryDataRows = function (dataTree, checkedLineTypes, bidderColumns, isSoftRemove) {
					let flatDataRows = commonHelperService.flatTree(_.isArray(dataTree) ? dataTree : [dataTree], 'BoqItemChildren'),
						boqRoots = _.filter(flatDataRows, {BoqLineTypeFk: boqMainLineTypes.root}),
						removeItems = [];
					_.each(boqRoots, function (root) {
						removeItems = removeItems.concat(getRemoveBoQsBySummaryChildren(root, checkedLineTypes, bidderColumns));
					});
					let removeIds = _.map(removeItems, function (row) {
						return row.Id;
					});
					return commonHelperService.removeDataRowsRecursively(dataTree, function (n) {
						return _.includes(removeIds, n.Id);
					}, isSoftRemove);
				};

				service.removeZeroValueRows = function removeZeroValueRows(dataTree, bidderColumns, isSoftRemove) {
					let removeItems = [];

					_.each(dataTree, function treeIterator(item) {
						removeItems = removeItems.concat(getRemoveBoQsByZeroValue(item, bidderColumns));
					});

					let removeIds = _.map(removeItems, function removeMapFn(item) {
						return item.Id;
					});

					return commonHelperService.removeDataRowsRecursively(dataTree, function removeDataRowsRecursivelyFn(n) {
						return _.includes(removeIds, n.Id);
					}, isSoftRemove);
				};

				service.clearSummaryDataRows = function (dataTree) {
					return commonHelperService.removeDataRowsRecursively(dataTree, function (n) {
						return _.includes(commonService.boqSummaryFileds, n.BoqLineTypeFk);
					}, false);
				};

				service.addSummaryDataRows = function (dataTree, bidderColumns, summaryInfo) {
					let flatDataRows = commonHelperService.flatTree(angular.isArray(dataTree) ? dataTree : [dataTree], 'BoqItemChildren');
					let boqRoots = _.filter(flatDataRows, {BoqLineTypeFk: boqMainLineTypes.root});
					_.each(boqRoots, function (root) {
						processSummaryDataRowChildren(root, bidderColumns, summaryInfo);
					});
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
