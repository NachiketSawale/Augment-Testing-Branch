/**
 * Created by wed on 9/30/2018.
 */
(function (angular) {

	'use strict';

	let moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonBoqConfigFactory', [
		'globals',
		'_',
		'$',
		'$http',
		'$translate',
		'$rootScope',
		'$injector',
		'platformGridDomainService',
		'platformModalService',
		'boqMainLineTypes',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonCommonService',
		'PlatformMessenger',
		'boqMainCommonService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'platformPermissionService',
		'boqMainBoqStructureServiceFactory',
		function (
			globals,
			_,
			$,
			$http,
			$translate,
			$rootScope,
			$injector,
			platformGridDomainService,
			platformModalService,
			boqMainLineTypes,
			compareLineTypes,
			boqCompareRows,
			commonService,
			PlatformMessenger,
			boqMainCommonService,
			commonHelperService,
			checkBidderService,
			platformPermissionService,
			boqMainBoqStructureServiceFactory) {

			let serviceCache = {};

			let decimalCompareFields = [
				boqCompareRows.percentage,
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
				boqCompareRows.itemTotal,
				boqCompareRows.itemTotalOc,
				boqCompareRows.discountPercent,
				boqCompareRows.discountPercentIT,
				boqCompareRows.discount,
				boqCompareRows.price,
				boqCompareRows.priceOc,
				boqCompareRows.priceGross,
				boqCompareRows.priceGrossOc,
				boqCompareRows.finalGross,
				boqCompareRows.finalGrossOc,
				boqCompareRows.discountedPrice,
				boqCompareRows.discountedUnitPrice,
				boqCompareRows.cost,
				boqCompareRows.quantity,
				boqCompareRows.lumpsumPrice,
				boqCompareRows.factor,
				boqCompareRows.extraIncrement,
				boqCompareRows.extraIncrementOc,
				boqCompareRows.absoluteDifference,
				boqCompareRows.quantityAdj
			];

			let booleanCompareFields = [
				boqCompareRows.included,
				boqCompareRows.notSubmitted,
				boqCompareRows.isLumpsum,
				boqCompareRows.exQtnIsEvaluated
			];

			let integerCompareFields = [
				boqCompareRows.rank
			];

			let showInSummaryRowsConfig = {
				boqRoot: [
					boqCompareRows.externalCode,
					boqCompareRows.lumpsumPrice,
					boqCompareRows.itemTotal,
					boqCompareRows.itemTotalOc,
					boqCompareRows.discountPercentIT,
					boqCompareRows.discount,
					boqCompareRows.finalPrice,
					boqCompareRows.finalPriceOc
				],
				boqLevel: [
					boqCompareRows.externalCode,
					boqCompareRows.lumpsumPrice,
					boqCompareRows.itemTotal,
					boqCompareRows.itemTotalOc,
					boqCompareRows.discountPercentIT,
					boqCompareRows.discount,
					boqCompareRows.finalPrice,
					boqCompareRows.finalPriceOc
				],
				boqPosition: [
					boqCompareRows.cost,
					boqCompareRows.unitRateFrom,
					boqCompareRows.unitRateTo,
					boqCompareRows.price,
					boqCompareRows.priceOc,
					boqCompareRows.discountPercent,
					boqCompareRows.discountedPrice,
					boqCompareRows.discountedUnitPrice,
					boqCompareRows.finalPrice,
					boqCompareRows.finalPriceOc,
					boqCompareRows.rank,
					boqCompareRows.percentage,
					boqCompareRows.itemTotal,
					boqCompareRows.itemTotalOc,
					boqCompareRows.priceGross,
					boqCompareRows.priceGrossOc,
					boqCompareRows.finalGross,
					boqCompareRows.finalGrossOc,
					boqCompareRows.urBreakdown1,
					boqCompareRows.urBreakdown2,
					boqCompareRows.urBreakdown3,
					boqCompareRows.urBreakdown4,
					boqCompareRows.urBreakdown5,
					boqCompareRows.urBreakdown6,
					boqCompareRows.externalCode,
					boqCompareRows.userDefined1,
					boqCompareRows.userDefined2,
					boqCompareRows.userDefined3,
					boqCompareRows.userDefined4,
					boqCompareRows.userDefined5
				]
			};

			let filteredShowInSummaryRowsByRowType = function (showInSummaryRows, dataContext) {
				if (commonHelperService.isBoqRow(dataContext.BoqLineTypeFk)) {
					let includeRows = [];
					if (commonHelperService.isBoqRootRow(dataContext.BoqLineTypeFk)) {
						includeRows = showInSummaryRowsConfig.boqRoot;
					} else if (commonHelperService.isBoqLevelRow(dataContext.BoqLineTypeFk)) {
						includeRows = showInSummaryRowsConfig.boqLevel;
					} else {
						includeRows = showInSummaryRowsConfig.boqPosition;
					}
					return _.filter(showInSummaryRows, (row) => {
						return _.includes(includeRows, row.Field);
					});
				}
				return showInSummaryRows;
			};

			let formatValue = function formatValue(field, value, columnDef, dataContext) {
				let rs = value;
				if (value === null || value === undefined) {
					return '';
				}

				if (field === boqCompareRows.rank) {
					rs = commonService.constant.tagForNoQuote;
					if (!isNaN(value)) {
						rs = platformGridDomainService.formatter('integer')(0, 0, value, {});
					}
				} else if (field === boqCompareRows.percentage) {
					rs = commonService.constant.tagForNoQuote;
					if (!isNaN(value)) {
						rs = platformGridDomainService.formatter('percent')(0, 0, value, {}) + ' %';
					}
				} else if (field === boqCompareRows.quantity) {
					rs = platformGridDomainService.formatter('quantity')(0, 0, value, {});
				} else if (field === boqCompareRows.isLumpsum) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === boqCompareRows.notSubmitted) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === boqCompareRows.included) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === boqCompareRows.exQtnIsEvaluated) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === boqCompareRows.price || field === boqCompareRows.priceOc){
					if (!columnDef.isVerticalCompareRows) {
						if (!checkBidderService.isReference(columnDef.field)) {
							let parentItem = dataContext.parentItem;
							let targetItem = _.find(parentItem.QuoteItems, item => item.QuoteKey === columnDef.field);
							if (targetItem && targetItem.NotSubmitted) {
								rs = commonService.constant.tagForNoQuote;
							}
						}
					} else {
						let targetItem = _.find(dataContext.QuoteItems, item => item.QuoteKey === columnDef.quoteKey);
						if (targetItem && targetItem.NotSubmitted) {
							rs = commonService.constant.tagForNoQuote;
						}
					}
				} else if (!isNaN(value)) { // default, if it's a number, 2 decimals
					rs = platformGridDomainService.formatter('money')(0, 0, value, {});
				}

				return rs;
			};

			let formatShowInSummaryRows = function (showInSummaryRows, dataContext, columnDef, quoteKey, isVerticalCompareRows) {
				let quoteItem = _.find(dataContext.QuoteItems, {QuoteKey: quoteKey});
				let filteredShowInSummaryRows = filteredShowInSummaryRowsByRowType(showInSummaryRows, dataContext);
				return filteredShowInSummaryRows.map(function (row) {
					if (!quoteItem) {
						return commonService.constant.tagForNoQuote;
					}
					if (_.includes([boqCompareRows.percentage, boqCompareRows.rank], row.Field)) {
						if (checkBidderService.boq.isReference(quoteKey)) {
							return commonService.constant.tagForNoQuote;
						} else {
							let dataItems = row.Field === boqCompareRows.percentage ? dataContext.percentages : dataContext.ranks;
							let formattedValue = formatValue(row.Field, dataItems[quoteKey], columnDef, dataContext);
							let statisticValue = commonHelperService.statisticValue(_.values(dataItems));
							return commonHelperService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataItems[quoteKey], formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.prcItem, isVerticalCompareRows);
						}
					} else {
						if (dataContext.BoqLineTypeFk === compareLineTypes.requisition) {
							let formattedValue = formatValue(row.Field, dataContext.totals[quoteKey], columnDef, dataContext);
							if (checkBidderService.boq.isNotReference(columnDef.field)) {
								let statisticValue = commonHelperService.statisticValue(dataContext.totalValuesExcludeTarget);
								return commonHelperService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataContext.totals[quoteKey], formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.boqItem, isVerticalCompareRows);
							} else {
								return formattedValue;
							}
						} else if (commonHelperService.isBoqRow(dataContext.BoqLineTypeFk)) {
							let originalValue = quoteItem[row.Field];
							if (commonHelperService.isBoqPositionRow(dataContext.BoqLineTypeFk)) {
								if (quoteItem && (_.includes([3, 5], quoteItem.BasItemType2Fk) || _.includes([2], quoteItem.BasItemTypeFk)) && _.includes([boqCompareRows.itemTotal, boqCompareRows.itemTotalOc, boqCompareRows.finalPrice, boqCompareRows.finalPriceOc], row.Field)) {
									originalValue = quoteItem ? quoteItem[row.Field + '_BaseAlt'] : 0;
								}
							}
							let formattedValue = formatValue(row.Field, originalValue, columnDef, dataContext);
							if (checkBidderService.boq.isNotReference(columnDef.field)) {
								let fieldValuesExcludeTarget = [];
								_.map(dataContext.QuoteItems, function (item) {
									if (checkBidderService.boq.isNotReference(item.QuoteKey)) {
										fieldValuesExcludeTarget.push(item[row.Field]);
									}
								});
								let statisticValue = commonHelperService.statisticValue(fieldValuesExcludeTarget);
								formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.boqItem, isVerticalCompareRows);
							}

							if (commonHelperService.isBoqPositionRow(dataContext.BoqLineTypeFk)) {
								if (quoteItem && (_.includes([3, 5], quoteItem.BasItemType2Fk) || _.includes([2], quoteItem.BasItemTypeFk)) && _.includes([boqCompareRows.itemTotal, boqCompareRows.itemTotalOc, boqCompareRows.finalPrice, boqCompareRows.finalPriceOc], row.Field)) {
									formattedValue = '( ' + formattedValue + ' )';
								}
							}
							return formattedValue;
						}
					}
				}).join(commonService.constant.tagForValueSeparator);
			};

			const readDataFunctions = [
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.grandTotal,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return commonHelperService.isLineValueColumn(columnDef) ? dataContext.totals[columnDef.field]
									: commonHelperService.getAverageMaxMinValue(dataContext, columnDef);
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.evaluatedTotal,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return commonHelperService.isLineValueColumn(columnDef) ? dataContext.totals[columnDef.field]
									: commonHelperService.getAverageMaxMinValue(dataContext, columnDef);
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.grandTotalRank,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return checkBidderService.boq.isNotReference(columnDef.field) ? dataContext[columnDef.field] : null;
							},
							valueType: 'Integer'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: function (dataContext) {
						return _.includes(commonService.boqSummaryFileds, dataContext.BoqLineTypeFk);
					},
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.rfq,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return commonHelperService.isLineValueColumn(columnDef) ? dataContext.totals[columnDef.field]
									: commonHelperService.getAverageMaxMinValue(dataContext, columnDef);
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.requisition,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValueType: function (dataContext, columnDef, isShowInSummaryActivated) {
								return isShowInSummaryActivated ? 'Decimal' : null;
							}
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.quoteExchangeRate,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return checkBidderService.boq.isNotReference(columnDef.field) ? dataContext[columnDef.field] : null;
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: function (dataContext, isVerticalCompareRows) {
						return isVerticalCompareRows ? commonHelperService.isBoqRow(dataContext.BoqLineTypeFk) : dataContext.BoqLineTypeFk === compareLineTypes.compareField;
					},
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef, isVerticalCompareRows) {
								// Handling compare row field only.
								return (commonHelperService.isBidderColumn(columnDef) && (isVerticalCompareRows ? !commonHelperService.isLineValueColumn(columnDef) : commonHelperService.isLineValueColumn(columnDef)));
							},
							readValue: function (dataContext, columnDef) {
								let originalValue;
								let quoteKey = columnDef.isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
								let bidderValueProp = columnDef.isVerticalCompareRows ? columnDef.field : quoteKey;
								let compareField = commonHelperService.getBoqCompareField(dataContext, columnDef);
								let boqItem = commonHelperService.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
								if (commonHelperService.isBoqPositionRow(boqItem.BoqLineTypeFk)) {
									switch (compareField) {
										case boqCompareRows.percentage:
											originalValue = checkBidderService.boq.isNotReference(quoteKey) ? boqItem.percentages[quoteKey] : null;
											break;
										case boqCompareRows.rank:
											originalValue = checkBidderService.boq.isNotReference(quoteKey) ? boqItem.ranks[quoteKey] : null;
											break;
										case boqCompareRows.finalPrice:
										case boqCompareRows.finalPriceOc:
											originalValue = dataContext[bidderValueProp];
											if (boqItem && boqItem.QuoteItems) {
												let currQtnItem = _.find(boqItem.QuoteItems, {QuoteKey: quoteKey});
												if (currQtnItem && (_.includes([3, 5], currQtnItem.BasItemType2Fk) || _.includes([2], currQtnItem.BasItemTypeFk))) {
													originalValue = currQtnItem[compareField + '_BaseAlt'];
												}
											}
											break;
										default:
											originalValue = dataContext[bidderValueProp];
											break;
									}
								} else if (commonHelperService.isBoqRootRow(boqItem.BoqLineTypeFk)) {
									originalValue = dataContext[bidderValueProp];
								} else {
									originalValue = dataContext[bidderValueProp];
								}
								return this.isInvalidValue(originalValue) ? null : originalValue;
							},
							readFormattedValue: function (row, cell, dataContext, columnDef) {
								let originalValue = this.readValue(dataContext, columnDef);
								let formattedValue;
								let isVerticalCompareRows = columnDef.isVerticalCompareRows;
								let quoteKey = isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
								let compareField = commonHelperService.getBoqCompareField(dataContext, columnDef);
								let bidderValueProp = isVerticalCompareRows ? columnDef.id : quoteKey;
								let boqItem = commonHelperService.tryGetParentItem(dataContext, isVerticalCompareRows);
								if (commonHelperService.isBoqPositionRow(boqItem.BoqLineTypeFk)) {
									if (compareField === boqCompareRows.percentage) {
										formattedValue = checkBidderService.boq.isReference(quoteKey) ? commonService.constant.tagForNoQuote : formatValue(compareField, originalValue, columnDef, dataContext);
									} else if (compareField === boqCompareRows.rank) {
										formattedValue = checkBidderService.boq.isReference(quoteKey) ? commonService.constant.tagForNoQuote : formatValue(compareField, originalValue, columnDef, dataContext);
									} else if (_.includes([boqCompareRows.commentContractor, boqCompareRows.commentClient, boqCompareRows.bidderComments, boqCompareRows.boqTotalRank], compareField)) {
										formattedValue = commonHelperService.encodeEntity(originalValue || '');
									} else if (compareField === boqCompareRows.prcItemEvaluationFk) {
										if (_.isFunction(columnDef.domain)) {
											columnDef.domain(dataContext, columnDef);
										}
										formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
									} else if (compareField === commonService.itemCompareFields.prcPriceConditionFk) {
										if (_.isFunction(columnDef.domain)) {
											columnDef.domain(dataContext, columnDef);
										}
										formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
									} else if (compareField === boqCompareRows.alternativeBid) {
										if (!originalValue) {
											dataContext[columnDef.field] = null;
										}
										if (_.isFunction(columnDef.domain)) {
											columnDef.domain(dataContext, columnDef);
										}
										formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
									} else if (_.includes([boqCompareRows.userDefined1, boqCompareRows.userDefined2, boqCompareRows.userDefined3, boqCompareRows.userDefined4, boqCompareRows.userDefined5, boqCompareRows.externalCode], compareField)) {
										formattedValue = _.escape(originalValue) || '';
									} else if (compareField === boqCompareRows.finalPrice || compareField === boqCompareRows.finalPriceOc) {
										formattedValue = formatValue(compareField, dataContext[bidderValueProp], columnDef, dataContext);
										if (dataContext.parentItem && dataContext.parentItem.QuoteItems) {
											let currQtnItem = _.find(dataContext.parentItem.QuoteItems, {QuoteKey: quoteKey});
											if (currQtnItem && (_.includes([3, 5], currQtnItem.BasItemType2Fk) || _.includes([2], currQtnItem.BasItemTypeFk))) {
												formattedValue = '( ' + formatValue(compareField + '_BaseAlt', originalValue, columnDef, dataContext) + ' )';
											}
										}
									} else if (compareField === boqCompareRows.uomFk) {
										return checkBidderService.boq.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.uomLookupFormatter(row, cell, dataContext[bidderValueProp], dataContext, columnDef);
									} else if (compareField === boqCompareRows.prjChangeFk) {
										formattedValue = checkBidderService.boq.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.projectChangeFormatter(row, cell, originalValue, dataContext, columnDef);
									} else if (compareField === boqCompareRows.prjChangeStatusFk) {
										formattedValue = checkBidderService.boq.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.projectChangeStatusFormatter(row, cell, originalValue, dataContext, columnDef);
									} else {
										formattedValue = formatValue(compareField, dataContext[bidderValueProp], columnDef, dataContext);
									}
								} else if (commonHelperService.isBoqRootRow(boqItem.BoqLineTypeFk)) {
									if (commonHelperService.isIncludedCompareRowOnBoqRoot(compareField)) {
										if (_.includes([boqCompareRows.boqTotalRank], compareField)) {
											formattedValue = dataContext[bidderValueProp];
										} else if (compareField === boqCompareRows.prcItemEvaluationFk) {
											if (_.isFunction(columnDef.domain)) {
												columnDef.domain(dataContext, columnDef);
											}
											formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
										} else {
											formattedValue = formatValue(compareField, dataContext[bidderValueProp], columnDef, dataContext);
										}
									} else {
										formattedValue = formatValue(compareField, dataContext[bidderValueProp], columnDef, dataContext);
									}
								} else {
									if (compareField === boqCompareRows.prcItemEvaluationFk) {
										if (_.isFunction(columnDef.domain)) {
											columnDef.domain(dataContext, columnDef);
										}
										formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
									} else {
										formattedValue = formatValue(compareField, dataContext[bidderValueProp], columnDef, dataContext);
									}
								}
								return formattedValue;
							},
							readValueType: function (dataContext, columnDef) {
								let valueType;
								let compareField = commonHelperService.getBoqCompareField(dataContext, columnDef);
								let boqItem = commonHelperService.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
								if (commonHelperService.isBoqRow(boqItem.BoqLineTypeFk)) {
									if (_.includes(decimalCompareFields, compareField)) {
										valueType = 'Decimal';
									} else if (_.includes(booleanCompareFields, compareField)) {
										valueType = 'Boolean';
									} else if (_.includes(integerCompareFields, compareField)) {
										valueType = 'Integer';
									} else {
										valueType = null;
									}
								}
								return valueType;
							},
							readFormatCode: function (dataContext, columnDef) {
								let formatCode = null;
								let compareField = commonHelperService.getBoqCompareField(dataContext, columnDef);
								let boqItem = commonHelperService.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
								if (commonHelperService.isBoqRow(boqItem.BoqLineTypeFk)) {
									if (_.includes([boqCompareRows.percentage], compareField)) {
										formatCode = '0.00%';
									}
								}
								return formatCode;
							}
						})
					]
				}),
				// Default reader must be the last one.
				commonHelperService.createRowReader()
			];

			function createService(serviceName) {

				if (serviceName && serviceCache[serviceName]) {
					return serviceCache[serviceName];
				}

				// store the global data required for boq comparison shared by all rfqs
				let service = {
					rfqHeadersCache: [],
					originalFieldsCache: [],

					visibleCompareColumnsCache: [],
					showInSummaryCompareRowsCache: [],
					visibleCompareRowsCache: [],
					leadingFieldCache: '',
					visibleQuoteCompareRowsCache: [],   // quote compare field rows
					visibleSchemaCompareRowsCache: [],  // billing schema field rows

					boqLineTypeNameCache: {},
					generalTypesCache: {},
					generalValueTypeNameCache: {
						percent: $translate.instant('cloud.common.entityPercent'),
						amount: $translate.instant('cloud.common.entityAmount')
					},
					rfqCharacteristicCache: [],
					quoteCharacteristicCache: [],
					allRfqCharacteristicCache: [],
					allQuoteCharacteristicCache: [],
					childrenCharacterCache: [],

					boqQtnMatchCache: {},
					needUpdate: new PlatformMessenger(),
					decimalCompareFields: decimalCompareFields,
					booleanCompareFields: booleanCompareFields,
					integerCompareFields: integerCompareFields
				};
				let compareDirections = {
					isVerticalCompareRows: false
				};

				// common fields (not used as compare, readonly)
				service.getCommonColumns = function getCommonColumns() {
					return [
						/* {
							id: 'boqLineTypeFk',
							field: 'BoqLineTypeFk',
							name: 'BoQ Line Type',
							name$tr$: 'boq.main.BoqLineTypeFk',
							hidden: false,
							width: 100,
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'BoqLineType',
								displayMember: 'Description'
							}
						}, */
						{
							id: 'reference',
							field: 'Reference',
							name: 'Reference No.',
							name$tr$: 'boq.main.Reference',
							searchable: true,
							hidden: false,
							width: 105
						},
						{
							id: 'brief',
							field: 'Brief',
							name: 'Outline Specification',
							name$tr$: 'cloud.common.entityBriefInfo',
							searchable: true,
							hidden: false,
							width: 130,
							domain: 'description',
							editor: 'description'
						},
						{
							id: 'itemInfo',
							field: 'ItemInfo',
							name: 'ItemInfo',
							name$tr$: 'boq.main.ItemInfo',
							searchable: true,
							hidden: false,
							width: 130,
							formatter: function (row, cell, value, columnDef, entity) {
								if (commonHelperService.isBoqRow(entity.BoqLineTypeFk)) {
									entity.ItemInfo = boqMainCommonService.buildItemInfo(entity);
									return entity.ItemInfo;
								}
								return null;
							}
						},
						{
							id: 'aan',
							field: 'Aan',
							name: 'AAN',
							name$tr$: 'boq.main.AAN',
							searchable: true,
							hidden: false,
							width: 80
						},
						{
							id: 'agn',
							field: 'Agn',
							name: 'AGN',
							name$tr$: 'boq.main.AGN',
							searchable: true,
							hidden: false,
							width: 80
						},
						{
							id: 'budgetperunit',
							field: 'BudgetPerUnit',
							name: 'Budget/Unit',
							name$tr$: 'boq.main.BudgetPerUnit',
							searchable: true,
							hidden: false,
							width: 80,
							formatter: 'money'
						},
						{
							id: 'budgettotal',
							field: 'BudgetTotal',
							name: 'Budget Total',
							name$tr$: 'boq.main.BudgetTotal',
							searchable: true,
							hidden: false,
							width: 80,
							formatter: 'money'
						},
						{
							id: 'budgetdifference',
							field: 'BudgetDifference',
							name: 'Budget Difference',
							name$tr$: 'boq.main.BudgetDifference',
							searchable: true,
							hidden: false,
							width: 80,
							formatter: 'money'
						},
						{
							id: 'BasItemTypeFk',
							field: 'BasItemTypeFk',
							name: 'Item Type Stand/Opt',
							name$tr$: 'boq.main.BasItemTypeFk',
							hidden: false,
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'Description',
								lookupModuleQualifier: 'basics.lookup.boqitemtype',
								lookupSimpleLookup: true,
								valueMember: 'Id'
							},
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-simple',
								lookupOptions: {
									displayMember: 'Description',
									lookupModuleQualifier: 'basics.lookup.boqitemtype',
									lookupType: 'ItemTypes',
									showClearButton: true,
									valueMember: 'Id',
								}
							},
						},
						{
							id: 'BasItemType2Fk',
							field: 'BasItemType2Fk',
							name: 'Item Type Base/Alt',
							name$tr$: 'boq.main.BasItemType2Fk',
							hidden: false,
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ItemTypes2',
								displayMember: 'DisplayName'
							}
						}
					];
				};

				service.getCommonColumns2 = function getCommonColumns2() {
					return [
						{
							id: 'quantity',
							field: 'Quantity',
							name: 'Quantity',
							name$tr$: 'cloud.common.entityQuantity',
							hidden: false,
							width: 80,
							formatter: setFormatterForQuantityColumn(),
							domain: 'decimal',
							editor: 'decimal'
						},
						{
							id: 'quantityAdjustment',
							field: 'QuantityAdj',
							name: 'AQ-Quantity',
							name$tr$: 'boq.main.QuantityAdj',
							hidden: false,
							width: 85,
							formatter: commonService.formatter.quantityFormatter
						},
						{
							id: 'uomFk',
							field: 'UomFk',
							name: 'UoM',
							name$tr$: 'cloud.common.entityUoM',
							hidden: false,
							width: 85,
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PCUom',
								displayMember: 'UnitInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						{
							id: 'isDisabled',
							field: 'IsDisabled',
							name: 'Disabled',
							name$tr$: 'boq.main.IsDisabled',
							hidden: false,
							width: 75,
							formatter: setFormatterForBooleanColumn()
						},
						{
							id: 'isNotApplicable',
							field: 'IsNotApplicable',
							name: 'N/A',
							name$tr$: 'boq.main.IsNotApplicable',
							hidden: false,
							width: 95,
							formatter: setFormatterForBooleanColumn()
						},
						{
							id: 'isFreeQuantity',
							field: 'IsFreeQuantity',
							name: 'Free Quantity',
							name$tr$: 'boq.main.IsFreeQuantity',
							hidden: false,
							width: 95,
							formatter: setFormatterForBooleanColumn()
						},
						{
							id: 'isLeadDescription',
							field: 'IsLeadDescription',
							name: 'Lead Description',
							name$tr$: 'boq.main.IsLeadDescription',
							hidden: false,
							width: 95,
							formatter: setFormatterForBooleanColumn()
						},
						{
							id: 'isNoLeadQuantity',
							field: 'IsNoLeadQuantity',
							name: 'Lead Quantity',
							name$tr$: 'procurement.pricecomparison.leadQuantity',
							hidden: false,
							width: 95,
							formatter: setFormatterForBooleanColumn()
						},
						{
							id: 'externalcode',
							field: 'ExternalCode',
							name: 'External Code',
							name$tr$: 'boq.main.ExternalCode',
							formatter: 'description',
							hidden: false,
							width: 80,
						},
						{
							id: 'UserDefined1',
							field: 'UserDefined1',
							name: 'User-Defined1',
							name$tr$: 'procurement.common.userDefined1',
							hidden: false,
							width: 100
						},
						{
							id: 'UserDefined2',
							field: 'UserDefined2',
							name: 'User-Defined2',
							name$tr$: 'procurement.common.userDefined2',
							hidden: false,
							width: 100
						},
						{
							id: 'UserDefined3',
							field: 'UserDefined3',
							name: 'User-Defined3',
							name$tr$: 'procurement.common.userDefined3',
							hidden: false,
							width: 100
						},
						{
							id: 'UserDefined4',
							field: 'UserDefined4',
							name: 'User-Defined4',
							name$tr$: 'procurement.common.userDefined4',
							hidden: false,
							width: 100
						},
						{
							id: 'UserDefined5',
							field: 'UserDefined5',
							name: 'User-Defined5',
							name$tr$: 'procurement.common.userDefined5',
							hidden: false,
							width: 100
						},
						{
							id: 'isContracted',
							field: 'IsContracted',
							name: 'Contracted in other PKG',
							name$tr$: 'procurement.common.entityIsContractedInOtherPkg',
							hidden: false,
							width: 150,
							formatter: setFormatterForBooleanColumn()
						}
					];
				};

				service.getLineNameColumn = function getLineNameColumn() {
					return [
						{
							id: 'boqLineType',
							field: 'BoqLineType',
							name: 'BoQ Line Type',
							name$tr$: 'boq.main.BoqLineTypeFk',
							hidden: false,
							width: 100
						},
						{
							id: 'lineName',
							field: 'LineName',
							name: 'Line Name',
							name$tr$: 'procurement.pricecomparison.lineName',
							hidden: false,
							width: 135
						}
					];
				};

				// max/ min/ average columns
				service.getMaxMinAverageColumns = function getMaxMinAverageColumns() {
					return [
						{
							id: 'minValueIncludeTarget',
							name: 'MinT',
							name$tr$: 'procurement.pricecomparison.compareMinValueIncludeTarget', // to be translated
							field: commonService.constant.minValueIncludeTarget,
							hidden: false,
							width: 80,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'maxValueIncludeTarget',
							name: 'MaxT',
							name$tr$: 'procurement.pricecomparison.compareMaxValueIncludeTarget',
							hidden: false,
							width: 80,
							field: commonService.constant.maxValueIncludeTarget,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'averageValueIncludeTarget',
							name: 'AverageT',
							name$tr$: 'procurement.pricecomparison.compareAverageValueIncludeTarget',
							field: commonService.constant.averageValueIncludeTarget,
							hidden: false,
							width: 80,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'minValueExcludeTarget',
							name: 'Min',
							name$tr$: 'procurement.pricecomparison.compareMinValueExcludeTarget',
							field: commonService.constant.minValueExcludeTarget,
							hidden: false,
							width: 80,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'maxValueExcludeTarget',
							name: 'Max',
							name$tr$: 'procurement.pricecomparison.compareMaxValueExcludeTarget',
							field: commonService.constant.maxValueExcludeTarget,
							hidden: false,
							width: 80,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'averageValueExcludeTarget',
							name: 'Average',
							name$tr$: 'procurement.pricecomparison.compareAverageValueExcludeTarget',
							field: commonService.constant.averageValueExcludeTarget,
							hidden: false,
							width: 80,
							formatter: setFormatterForMinMaxAvgColumn()
						}
					];
				};

				service.getBidderColumn = function getBidderColumn() {
					return [
						{
							id: '_rt$bidder',
							field: 'Bidder',
							name: 'Bidder',
							name$tr$: 'procurement.pricecomparison.printing.bidder',
							hidden: false
						}
					];
				};

				service.getAllColumns = function getAllColumns() {
					let allColumns = [];
					allColumns = allColumns.concat(service.getCommonColumns());
					allColumns = allColumns.concat(service.getCommonColumns2());
					allColumns = allColumns.concat(service.getLineNameColumn());
					allColumns = allColumns.concat(service.getMaxMinAverageColumns());
					allColumns = allColumns.concat(service.getBidderColumn());
					allColumns = allColumns.concat(getCompareDescriptionColumn());
					return allColumns;
				};

				// dynamically set 'column description' column to the different row cell by custom settings
				service.getCompareDescriptionColumnByCustomSettings = function () {
					let columns = getCompareDescriptionColumn();

					columns[0].formatter = function (row, cell, value, columnDef, dataContext) {
						if (!dataContext) {
							return '';
						}

						// requisition row (show 'Total' + <'Rank/ Percentage' if configure to show>).
						if (dataContext.BoqLineTypeFk === compareLineTypes.requisition) {
							let desc = $translate.instant('procurement.pricecomparison.compareTotal');
							_.map(service.showInSummaryCompareRowsCache, function (summaryRow) {
								if (summaryRow.Field === boqCompareRows.rank || summaryRow.Field === boqCompareRows.percentage) {
									desc = desc + commonService.constant.tagForValueSeparator + summaryRow.DisplayName;
								}
							});
							value = desc;
						}
						// boq item row (show compare fields that configured in 'Show In Summary')
						else if (commonHelperService.isBoqRow(dataContext.BoqLineTypeFk)) {
							let filteredShowInSummaryRows = filteredShowInSummaryRowsByRowType(service.showInSummaryCompareRowsCache, dataContext);
							value = _.map(filteredShowInSummaryRows, function (summaryRow) {
								return summaryRow.DisplayName;
							}).join(commonService.constant.tagForValueSeparator);
						}

						return value;
					};

					return columns;
				};

				// set decimal formatter for quantity column.
				function setFormatterForQuantityColumn() {
					return function (row, cell, value, columnDef, dataContext) {
						commonService.setTextAlignRight(columnDef); // text align right

						if (commonHelperService.isBoqPositionRow(dataContext.BoqLineTypeFk)/* && !dataContext.IsFreeQuantity */) { // only show value of column 'Quantity' when property 'IsFreeQuantity' is false.
							value = commonService.formatter.quantityFormatter.apply(this, [row, cell, value, columnDef, dataContext]);
						} else {
							value = null;
						}

						if ((commonHelperService.isBoqPositionRow(dataContext.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(dataContext.BoqLineTypeFk)) && dataContext['IsQuoteNewItem']) {
							value = null; // for quote new items (Level + Position)
						}
						return value;
					};
				}

				// set decimal formatter for quote columns (dynamic compare columns).
				service.setFormatterForQuoteColumn = function (columnDef, rfqCharacteristics, quoteCharacteristics) {

					let hasModulePermission = commonHelperService.hasPermissionForModule('procurement.quote');

					commonService.setTextAlignRight(columnDef);

					let totalShowInSummaryRows = _.filter(angular.copy(service.showInSummaryCompareRowsCache), function (row) {
						return _.includes([boqCompareRows.finalPrice, boqCompareRows.rank, boqCompareRows.percentage], row.Field);
					});

					let finalPriceRow = _.find(totalShowInSummaryRows, {Field: boqCompareRows.finalPrice});

					// add a button to create contract for the bp
					function getCreateContractButton(column, entity) {
						return commonHelperService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.createContractForBoQ', () => {
							let qtnHeaderId = commonService.getQuoteId(column.id);
							let modalOptions = {
								backdrop: false,
								width: '1000px',
								height: '770px',
								controller: 'procurementPriceComparisonOneQuoteContractController',
								templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/one-quote-to-contract.html',
								resizeable: true
							};

							// get the data then show the popup
							$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/quotecontractboqs', {
								Id: qtnHeaderId
							}).then(function (response) {
								let reqHeaderId = null;
								if (entity && angular.isDefined(entity.ReqHeaderId)) {
									reqHeaderId = entity.ReqHeaderId;
								}
								// set the data
								let request = {
									MainItemIds: [qtnHeaderId],
									ModuleName: 'procurement.quote'
								};
								$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
									.then(function (hasContractItemResponse) {
										$injector.get('procurementPriceComparisonOneQuoteContractMainService').responseData(response.data, 'CreateContractFromBoq', 'create.contract.onlyBoq', reqHeaderId, false,
											hasContractItemResponse ? hasContractItemResponse.data : false);
										platformModalService.showDialog(modalOptions);
									});
							});
						}, {
							icon: 'ico-append'
						});
					}

					function getCompareRowFormatterValue(row, cell, dataContext, quoteKey, columnDef) {
						return service.readCellFormattedValue(row, cell, dataContext, columnDef);
					}

					columnDef.formatter = function (row, cell, value, columnDef, dataContext) {
						let quoteKey = columnDef.field;
						let originalValue = service.readCellValue(dataContext, columnDef);
						let formattedValue = null;

						if (_.includes([compareLineTypes.quoteDate, compareLineTypes.receiveDate, compareLineTypes.priceFixingDate, compareLineTypes.quoteVersion, compareLineTypes.evaluationRank], dataContext.BoqLineTypeFk)) {
							commonService.clearFormatterOptions(columnDef);
						}

						if (dataContext.BoqLineTypeFk === compareLineTypes.grandTotal || dataContext.BoqLineTypeFk === compareLineTypes.evaluatedTotal || dataContext.BoqLineTypeFk === compareLineTypes.offeredTotal || dataContext.BoqLineTypeFk === compareLineTypes.totalType) {
							if (columnDef.isVerticalCompareRows) {
								return '';
							}
							formattedValue = formatValue(null, originalValue, columnDef, dataContext);

							if (finalPriceRow && checkBidderService.boq.isNotReference(quoteKey)) {
								let staticValue = commonHelperService.statisticValue(dataContext.totalValuesExcludeTarget);
								formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(finalPriceRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, staticValue.minValue, staticValue.maxValue, staticValue.avgValue, commonService.constant.compareType.boqItem, compareDirections.isVerticalCompareRows);
							}

							// no navigator for columns 'BoQ Base/Target'
							if (checkBidderService.boq.isNotReference(columnDef.field)) {
								let navArrow = '';
								if (platformPermissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
									navArrow = getCreateContractButton(columnDef, dataContext) + ' ';
								}
								if (!columnDef.isIdealBidder) {
									navArrow += commonService.getNavigationToQuote(columnDef, dataContext, !hasModulePermission);
								}
								return navArrow + ' ' + formattedValue;
							}
							return formattedValue;
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.grandTotalRank) {
							return checkBidderService.boq.isNotReference(quoteKey) ? originalValue : formattedValue;
						} else if (_.includes(commonService.boqSummaryFileds, dataContext.BoqLineTypeFk)) {
							formattedValue = formatValue(null, originalValue, columnDef, dataContext);
							if (_.includes([boqCompareRows.summaryOptionalWITDiscountTotal, boqCompareRows.summaryAlternativeDiscountTotal], dataContext.BoqLineTypeFk)) {
								if (_.isUndefined(originalValue)) {
									formattedValue = commonHelperService.isLineValueColumn(columnDef) ? '( ' + commonService.constant.tagForNoQuote + ' )' : '';
								} else {
									formattedValue = '( ' + formattedValue + ' )';
								}
							}
							if (formattedValue && finalPriceRow && checkBidderService.boq.isNotReference(quoteKey)) {
								formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(finalPriceRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, null, null, null, commonService.constant.compareType.boqItem, compareDirections.isVerticalCompareRows);
							}
							return formattedValue ? formattedValue : (commonHelperService.isLineValueColumn(columnDef) ? commonService.constant.tagForNoQuote : '');
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.rfq) {
							formattedValue = formatValue(null, originalValue, columnDef, dataContext);
							if (finalPriceRow && checkBidderService.boq.isNotReference(quoteKey)) {
								let staticValue = commonHelperService.statisticValue(dataContext.totalValuesExcludeTarget);
								formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(finalPriceRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, staticValue.minValue, staticValue.maxValue, staticValue.avgValue, commonService.constant.compareType.boqItem, compareDirections.isVerticalCompareRows);
							}
							return formattedValue;
						} else if (_.includes([compareLineTypes.quoteDate, compareLineTypes.receiveDate, compareLineTypes.priceFixingDate], dataContext.BoqLineTypeFk)) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								if (_.get(dataContext, quoteKey) && !angular.isString(_.get(dataContext, quoteKey))) {
									return commonService.formatter.dateFormatter.apply(null, [row, cell, originalValue, columnDef, dataContext]);
								}
							}
							return originalValue;
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.quoteVersion) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field) && originalValue) {
								let rowValue = commonService.formatter.integerFormatter.apply(null, [row, cell, originalValue, columnDef, dataContext]);
								return rowValue ? rowValue.toString() : '';
							}
							return originalValue;
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.quoteStatus) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
									lookupType: 'QuoteStatus',
									displayMember: 'Description',
									imageSelector: 'platformStatusIconService'
								});
							}
							return originalValue;
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.quoteCurrency) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
									lookupType: 'Currency',
									displayMember: 'Currency'
								});
							}
							return originalValue;
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.incoterms) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
									lookupType: 'prcincoterm',
									displayMember: 'Description'
								});
							}
							return originalValue;
						} else if (_.includes([compareLineTypes.quotePaymentTermPA, compareLineTypes.quotePaymentTermFI], dataContext.BoqLineTypeFk)) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
									lookupType: 'PaymentTerm',
									displayMember: 'Code'
								});
							}
							return originalValue;
						} else if (_.includes([
							compareLineTypes.evaluationRank,
							compareLineTypes.avgEvaluationRank
						], dataContext.BoqLineTypeFk)) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field) && originalValue) {
								let rowValue = commonService.formatter.integerFormatter.apply(null, [row, cell, originalValue, columnDef, dataContext]);
								return rowValue ? rowValue.toString() : '';
							}
							return '';
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.quoteExchangeRate) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field) && originalValue) {
								let rowValue = platformGridDomainService.formatter('quantity')(0, 0, originalValue, {});
								return rowValue ? rowValue.toString() : '';
							}
							return '';
						} else if (_.includes([compareLineTypes.overallDiscount, compareLineTypes.overallDiscountOc, compareLineTypes.overallDiscountPercent, compareLineTypes.discountPercent], dataContext.BoqLineTypeFk)) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								originalValue = originalValue || 0;
								let rowValue = platformGridDomainService.formatter('percent')(0, 0, originalValue, {}) + '%';
								return rowValue ? rowValue.toString() : '';
							}
							return '';
						} else if (_.includes([
							compareLineTypes.evaluationResult,
							compareLineTypes.billingSchemaGroup,
							compareLineTypes.billingSchemaChildren,
							compareLineTypes.turnover,
							compareLineTypes.avgEvaluationA,
							compareLineTypes.avgEvaluationB,
							compareLineTypes.avgEvaluationC
						], dataContext.BoqLineTypeFk)) {
							if (compareLineTypes.billingSchemaGroup !== dataContext.BoqLineTypeFk && columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field) && originalValue) {
								if (!columnDef.isIdealBidder && _.includes([compareLineTypes.avgEvaluationA, compareLineTypes.avgEvaluationB, compareLineTypes.avgEvaluationC], dataContext.BoqLineTypeFk)) {
									formattedValue = _.isNumber(originalValue) ? Math.round(originalValue) : originalValue;
								} else {
									formattedValue = formatValue(columnDef.field, originalValue, columnDef, dataContext);
								}
								if (finalPriceRow) {
									let staticValue = commonHelperService.statisticValue(dataContext.totals);
									formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(finalPriceRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, staticValue.minValue, staticValue.maxValue, staticValue.avgValue, commonService.constant.compareType.boqItem, compareDirections.isVerticalCompareRows);
								}
								return formattedValue;
							}
							return '';
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.characteristic) {
							return commonService.characterFormatter(dataContext, columnDef, rfqCharacteristics, quoteCharacteristics, service.boqQtnMatchCache, quoteKey, originalValue);
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.requisition) {
							if (columnDef.isVerticalCompareRows) {
								return originalValue;
							}
							let button = '';
							if (checkBidderService.boq.isNotReference(columnDef.field) && platformPermissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
								button = getCreateContractButton(columnDef, dataContext) + ' ';
							}
							return button + formatShowInSummaryRows(totalShowInSummaryRows, dataContext, columnDef, quoteKey, compareDirections.isVerticalCompareRows);
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.generalTotal) {
							return originalValue;
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.generalItem) {
							dataContext.totals[quoteKey] = originalValue;
							formattedValue = formatValue(null, originalValue, columnDef, dataContext);
							if (finalPriceRow && checkBidderService.boq.isNotReference(columnDef.field)) {
								formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(finalPriceRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, null, null, null, commonService.constant.compareType.boqItem, compareDirections.isVerticalCompareRows);
							}
							return formattedValue;
						} else if (commonHelperService.isBoqRow(dataContext.BoqLineTypeFk)) {
							if (columnDef.isVerticalCompareRows) {
								if (commonHelperService.isBoqRow(dataContext.BoqLineTypeFk)) {
									return getCompareRowFormatterValue(row, cell, dataContext, columnDef.quoteKey, columnDef, originalValue);
								}
								return originalValue;
							} else {
								let button = '';
								if (checkBidderService.boq.isNotReference(columnDef.field)) {
									let quoteId = commonService.getQuoteId(columnDef.id);
									let quote = _.find(service.originalFieldsCache, {QtnHeaderId: _.toInteger(quoteId)});
									if (quote) {
										let quoteItem = _.find(dataContext.QuoteItems, {
											QuoteKey: columnDef.field,
											// BoqItemPrjBoqFk: dataContext.BoqItemPrjBoqFk,
											// BoqItemPrjItemFk: dataContext.BoqItemPrjItemFk
											LinkBoqFk: dataContext.LinkBoqFk,
											LinkItemFk: dataContext.LinkItemFk
										});
										let quoteStatus = commonService.getLookupValue('QuoteStatus', quote.StatusFk);
										let canCreate = commonHelperService.isBoqPositionRow(dataContext.BoqLineTypeFk) ? dataContext.parentItem['CanCreateQuoteBoqItem'] : dataContext['CanCreateQuoteBoqItem'];
										if (canCreate) {
											let disabled = !(quoteItem && quoteStatus && !quoteStatus.IsReadonly) || columnDef.isIdealBidder || dataContext['isONORM'];
											if (commonHelperService.isBoqPositionRow(dataContext.BoqLineTypeFk)) {
												button = createInsertItemButton(columnDef, dataContext, disabled) + ' ';
											} else {
												button = getCreateQuoteBoqItemButton(columnDef, dataContext, disabled) + ' ';
											}
										}
									}
								}
								return button + formatShowInSummaryRows(service.showInSummaryCompareRowsCache, dataContext, columnDef, quoteKey, compareDirections.isVerticalCompareRows);
							}
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.compareField) {
							return getCompareRowFormatterValue(row, cell, dataContext, quoteKey, columnDef, originalValue);
						} else if (dataContext.BoqLineTypeFk === compareLineTypes.quoteRemark) {
							if (_.isFunction(columnDef.domain)) {
								columnDef.domain(dataContext, columnDef);
							}
							return _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
						} else if (_.includes([
							compareLineTypes.discountBasis,
							compareLineTypes.discountBasisOc,
							compareLineTypes.discountAmount,
							compareLineTypes.discountAmountOc
						], dataContext.BoqLineTypeFk)) {
							if (columnDef.isDynamic && checkBidderService.boq.isNotReference(columnDef.field)) {
								originalValue = originalValue || 0;
								formattedValue = platformGridDomainService.formatter('money')(0, 0, originalValue, {});
								return formattedValue;
							}
							return '';
						} else {
							return originalValue;
						}
					};
				};

				// apply custom css style for quote column (dynamic compare columns)'s  compare field (row)'s cell value after decimal formatter applied.
				service.applyCustomCssStyleForQuoteColumnCell = function (columnDefs) {
					_.forEach(columnDefs, function (columnDef) {
						if (columnDef) {
							let originalFormatter = angular.isFunction(columnDef.formatter) ? columnDef.formatter : function(row, cell, value/* , columnDef, dataContext */) {
								return value;
							};
							// append the new custom css style formatter to the old decimal formatter
							columnDef.formatter = function(row, cell, value, columnDef, dataContext) {
								let formattedValue = originalFormatter.apply(this, [row, cell, value, columnDef, dataContext]);
								let isVerticalCompareRows = columnDef.isVerticalCompareRows;
								let quoteKey = isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
								if (checkBidderService.boq.isNotReference(quoteKey)) {
									let excludeFields = [
										boqCompareRows.commentContractor,
										boqCompareRows.commentClient,
										boqCompareRows.bidderComments,
										boqCompareRows.prcItemEvaluationFk,
										boqCompareRows.userDefined1,
										boqCompareRows.userDefined2,
										boqCompareRows.userDefined3,
										boqCompareRows.userDefined4,
										boqCompareRows.userDefined5
									];
									let compareField = commonHelperService.getBoqCompareField(dataContext, columnDef),
										isCompareRowCell = isVerticalCompareRows ? columnDef.isVerticalCompareRows && commonHelperService.isBoqRow(dataContext.BoqLineTypeFk) : dataContext.BoqLineTypeFk === compareLineTypes.compareField,
										conditionalFormat = isVerticalCompareRows ? (_.find(service.visibleCompareRowsCache, { Field: compareField }) || {}).ConditionalFormat : dataContext.ConditionalFormat;
									if (isCompareRowCell && conditionalFormat && !_.includes(excludeFields, compareField)) {
										let deviationRow = dataContext[columnDef.id + commonService.constant.deviationRow],
											highlightQtn = dataContext[columnDef.id + commonService.constant.highlightQtn];

										formattedValue = commonHelperService.setStyleForCellValueUsingTagDiv(conditionalFormat, value, formattedValue, columnDef, dataContext, highlightQtn, deviationRow, null, null, null, commonService.constant.compareType.boqItem, compareDirections.isVerticalCompareRows);
									}
								}

								return formattedValue;
							};
						}
					});
				};

				function getCompareDescriptionColumn() {
					return [
						{
							id: 'compareDescription',
							field: commonService.constant.compareDescription,
							name: 'Compare Description',
							name$tr$: 'procurement.pricecomparison.compareDescription',
							hidden: false,
							width: 250
						}
					];
				}

				function setFormatterForMinMaxAvgColumn() {
					return function (row, cell, value, columnDef, dataContext) {
						commonService.setTextAlignRight(columnDef);
						let includeFields = [
							boqCompareRows.rank,
							boqCompareRows.commentContractor,
							boqCompareRows.commentClient,
							boqCompareRows.prcItemEvaluationFk,
							boqCompareRows.bidderComments,
							boqCompareRows.userDefined1,
							boqCompareRows.userDefined2,
							boqCompareRows.userDefined3,
							boqCompareRows.userDefined4,
							boqCompareRows.userDefined5,
							boqCompareRows.alternativeBid,
							boqCompareRows.uomFk,
							boqCompareRows.included,
							boqCompareRows.notSubmitted,
							boqCompareRows.externalCode,
							boqCompareRows.isLumpsum,
							boqCompareRows.exQtnIsEvaluated,
							boqCompareRows.prjChangeFk,
							boqCompareRows.prjChangeStatusFk,
							boqCompareRows.prcPriceConditionFk
						];
						let compareField = commonHelperService.getBoqCompareField(dataContext);

						if (dataContext.BoqLineTypeFk === compareLineTypes.compareField && compareField === boqCompareRows.percentage) {
							if ((columnDef.field === commonService.constant.maxValueIncludeTarget ||
								columnDef.field === commonService.constant.minValueIncludeTarget ||
								columnDef.field === commonService.constant.averageValueIncludeTarget)) {
								return null;
							}
							return platformGridDomainService.formatter('percent')(0, 0, value, {}) + ' %';
						}

						if (dataContext.BoqLineTypeFk === compareLineTypes.compareField && _.includes(includeFields, compareField)) {
							value = null;
						} else {
							value = commonService.formatter.moneyFormatter.apply(this, [row, cell, value, columnDef, dataContext]);
						}
						return value;
					};
				}

				function setFormatterForBooleanColumn() {
					return function (row, cell, value, columnDef, dataContext) {
						// only boq item has bool column
						if (commonHelperService.isBoqRow(dataContext.BoqLineTypeFk)) {
							value = commonService.formatter.booleanFormatter.apply(this, [row, cell, value, columnDef, dataContext]);
						} else {
							value = null;
						}
						return value;
					};
				}

				service.setCompareDirections = function (directions) {
					compareDirections = angular.extend(compareDirections, directions);
				};

				function showAddOrInsertDialog(column, entity, controllerOptions) {
					let qtnHeaderId = commonService.getQuoteId(column.id);
					let quote = _.find(service.originalFieldsCache, {QtnHeaderId: _.toInteger(qtnHeaderId)});
					let quoteItem = _.find(entity.QuoteItems, {
						QuoteKey: column.field,
						LinkBoqFk: entity.LinkBoqFk,
						LinkItemFk: entity.LinkItemFk
					});

					if (!quote || !quoteItem) {
						return;
					}

					let parentQuoteItem = commonHelperService.isBoqPositionRow(entity.BoqLineTypeFk) ? _.find(entity.parentItem.QuoteItems, {
						QuoteKey: column.field
					}) : quoteItem;

					let exchangeRate = commonService.getExchangeRate(quote.RfqHeaderId, quote.QtnHeaderId);
					let currencyFk = commonService.getCurrencyFk(quote.RfqHeaderId, quote.QtnHeaderId);
					let boqData = {
						quote: {
							Id: quote.QtnHeaderId,
							BusinessPartnerFk: quote.BusinessPartnerId,
							StatusFk: quote.StatusFk,
							QtnVersion: quote.QtnVersion,
							ExchangeRate: exchangeRate,
							DateQuoted: quote.DateQuoted,
							CurrencyFk: currencyFk
						},
						quoteRequisition: {
							PrcHeaderFk: quoteItem.PrcHeaderId,
							ReqHeaderFk: quoteItem.ReqHeaderId,
							QtnHeaderFk: quoteItem.QtnHeaderId
						},
						prcBoq: {
							Id: quoteItem.PrcHeaderId,
							PrcHeaderFk: quoteItem.PrcHeaderId,
							BoqHeaderFk: quoteItem.BoqHeaderId
						}
					};
					let creationData = {
						parent: {
							Id: quoteItem.Id,
							BoqItems: null,
							BoqHeaderFk: quoteItem.BoqHeaderId,
							BoqItemPrjBoqFk: quoteItem.BoqItemPrjBoqFk,
							BoqItemPrjItemFk: quoteItem.BoqItemPrjItemFk
						},
						parentItemId: parentQuoteItem.BoqItemId,
						selectedItemId: quoteItem.BoqItemId,
						boqHeaderFk: quoteItem.BoqHeaderId,
						boqItemPrjBoqFk: quoteItem.BoqItemPrjBoqFk,
						lineType: boqMainLineTypes.position,
						quote: quote,
						doSave: false,
						SyncBaseBoq: false
					};

					let modalOptions = {
						backdrop: false,
						width: '1200px',
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-quote-main-view.html',
						controller: 'procurementPriceComparisonCreateQuoteBoqItemController',
						resizeable: true,
						resolve: {
							controllerOptions: function () {
								return controllerOptions;
							}
						}
					};
					let controllerService = $injector.get('procurementPriceComparisonQuoteMainControllerService');
					controllerService.boqData = boqData;
					controllerService.creationData = creationData;
					controllerService.type = 'boq';

					let boqStructureService = boqMainBoqStructureServiceFactory.createBoqStructureService({});
					return boqStructureService.loadStructure(quoteItem.BoqHeaderId).then(function (boqStructure) {
						controllerService.boqData.boqStructure = boqStructure;
						return platformModalService.showDialog(modalOptions).then(function (result) {
							if (result && result.needUpdate) {
								service.needUpdate.fire();
							}
						});
					});
				}

				function getCreateQuoteBoqItemButton(column, entity, disabled) {
					return commonHelperService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.createQuoteItem', () => {
						showAddOrInsertDialog(column, entity, {
							headerText: $translate.instant('procurement.pricecomparison.wizard.createQuoteItem')
						});
					}, {
						icon: 'ico-boq-item-new',
						disabled: disabled
					});
				}

				function createInsertItemButton(column, entity, disabled) {
					if (checkBidderService.isReference(column.field)) {
						return '';
					}
					return commonHelperService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.insertItem', () => {
						let selectedItem = _.find(entity.QuoteItems, {QuoteKey: column.field});
						let parentItem = _.find(entity.parentItem.QuoteItems, {QuoteKey: column.field});
						let insertOptions = {
							SelectedBoq: {
								Id: selectedItem.BoqItemId,
								BoqItemFk: parentItem.BoqItemId
							},
							InsertBefore: false
						};

						showAddOrInsertDialog(column, entity, {
							headerText: $translate.instant('procurement.pricecomparison.wizard.insertItem'),
							insertNote: $translate.instant('procurement.pricecomparison.wizard.insertBoQNote'),
							createParams: {
								InsertOptions: insertOptions
							}
						});
					}, {
						disabled: disabled,
						icon: 'ico-boq-item-new'
					});
				}

				service.isShowInSummaryActivated = function () {
					let showInSummaryRows = _.filter(service.showInSummaryCompareRowsCache, {ShowInSummary: true});
					return _.some(showInSummaryRows, (r) => {
						return r.Field === boqCompareRows.finalPrice;
					}) && !_.some(showInSummaryRows, (r) => {
						return _.includes([boqCompareRows.rank, boqCompareRows.percentage], r.Field);
					});
				};

				commonHelperService.registerDataReader(service, readDataFunctions, commonService.constant.compareType.boqItem, () => compareDirections.isVerticalCompareRows, service.isShowInSummaryActivated);

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
