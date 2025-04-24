(function (angular) {
	'use strict';

	angular.module('procurement.pricecomparison').factory('pricecomparisonBoqFormulaService', [
		'_',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqCompareRows',
		'boqMainLineTypes',
		'boqMainCommonService',
		'procurementPriceComparisonLineTypes',
		'basicsLookupdataLookupDescriptorService',
		function (
			_,
			checkBidderService,
			commonHelperService,
			commonService,
			boqCompareRows,
			boqMainLineTypes,
			boqMainCommonService,
			compareLineTypes,
			lookupDescriptorService) {

			const EXCEL_MAX_FUNCTION_ARG_LENGTH = 255;

			let buildBoqCompareRowExpression = function (boqRow, rows, columns, col, colIndex, isVerticalCompareRows, rowType, dataRowDic) {
				let excludeInVerticalModel = isVerticalCompareRows && commonHelperService.isExcludedCompareRowInVerticalMode(rowType);
				let targetRowIndex = isVerticalCompareRows && !excludeInVerticalModel ? _.findIndex(rows, row => {
					return row.Id === boqRow.Id;
				}) : commonHelperService.findIndexFromDicCache((row) => commonHelperService.isCompareFieldRow(row.BoqLineTypeFk) && row.rowType === rowType, boqRow.BoqItemChildren, dataRowDic.rows, 'Id');

				let targetColIndex = isVerticalCompareRows && !excludeInVerticalModel ? _.findIndex(columns, c => {
					return c.quoteKey === (col.quoteKey || col.field) && commonHelperService.isBidderColumn(c) && c.originalField === rowType;
				}) : (!isVerticalCompareRows ? colIndex : _.findIndex(rows, row => {
					return row.ParentId === boqRow.Id && commonHelperService.isCompareFieldRow(row.BoqLineTypeFk) && row.rowType === rowType;
				}));
				return targetRowIndex !== -1 && targetColIndex !== -1 ? commonHelperService.formatExpressionValue(targetRowIndex, targetColIndex) : null;
			};

			let createSummaryRowFinder = function (summaryRowType) {
				return function (rows, currRow, columns, col, colIndex) {
					let rowTypePrefix = currRow.rowType.split('_')[0];
					const rowIndex = _.findIndex(rows, (row) => {
						return row.ParentId === currRow.ParentId && row.SummaryRowType === summaryRowType && row.rowType.startsWith(rowTypePrefix);
					});
					return rowIndex !== -1 && colIndex !== -1 ? commonHelperService.formatExpressionValue(rowIndex, colIndex) : null;
				};
			};

			let createCompareRowIdentifier = function (compareField) {
				return function (row) {
					return commonHelperService.isCompareFieldRow(row.BoqLineTypeFk) && row.rowType === compareField;
				};
			};

			let createCompareColumnIdentifier = function (isVerticalMode, compareField) {
				return isVerticalMode ? function (row, column, isVerticalCompareRows) {
					return isVerticalCompareRows && commonHelperService.isBidderColumn(column) && checkBidderService.isNotReference(column.quoteKey) && column.originalField === compareField && row.QuoteItems.some(item => item.QuoteKey === column.quoteKey);
				} : function (row, column) {
					return commonHelperService.isBidderColumn(column) && checkBidderService.isNotReference(column.field) && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
				};
			};

			let createCompareRowFinder = function (compareField) {
				return function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
					let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
					return buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, compareField, dataRowDic);
				};
			};

			let createVatPercentRowFinder = function () {
				let taxCode = _.values(lookupDescriptorService.getData('MdcTaxCode'));
				let taxCodeMatrixes = _.values(lookupDescriptorService.getData('TaxCodeMatrixs'));
				return function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
					let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
					let quoteKey = isVerticalCompareRows ? col.quoteKey : col.field;
					let target = _.find(boqRow.QuoteItems, item => item.QuoteKey === quoteKey);
					let quote = _.find(lookupMap.Quote, {Id: target.QtnHeaderId});
					let taxCodeFk = commonHelperService.tryGetTaxCodeFK(currRow, userData.boqRows, quoteKey, 'BoqItemChildren', quote.TaxCodeFk, true);
					return commonHelperService.getVatPercentExpressionValue(taxCodeFk, quote.BpdVatGroupFk, {
						MdcTaxCode: taxCode,
						TaxCodeMatrixs: taxCodeMatrixes
					});
				};
			};

			let buildRootFinalPriceExpression = function (boqRoots, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue, dataRowDic, notJoin) {
				let results = boqRoots.map(root => {
					let beforeDiscountExpression = buildBoqCompareRowExpression(root, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue ? boqCompareRows.itemTotalOc : boqCompareRows.itemTotal, dataRowDic);
					let discountPercentExpression = buildBoqCompareRowExpression(root, rows, columns, col, colIndex, isVerticalCompareRows, boqCompareRows.discountPercentIT, dataRowDic);
					let discountAbsoluteExpression = buildBoqCompareRowExpression(root, rows, columns, col, colIndex, isVerticalCompareRows, boqCompareRows.discount, dataRowDic);
					return '(' + beforeDiscountExpression + '-' + 'MAX(' + beforeDiscountExpression + '*' + discountPercentExpression + '/100' + ',' + discountAbsoluteExpression + '))';
				});
				return notJoin ? results : results.join(',');
			};

			let buildPositionFinalPriceExpression = function (positions, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue, dataRowDic) {
				return positions.map(p => {
					return buildBoqCompareRowExpression(p, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue ? boqCompareRows.finalPriceOc : boqCompareRows.finalPrice, dataRowDic);
				});
			};

			let findSummaryTotalRows = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, dataRowDic) {
				let results = [];
				let children = currRow.parentItem.BoqItemChildren;
				let levelFilter;
				let positionFilter;
				switch (currRow.BoqLineTypeFk) {
					case boqCompareRows.summaryStandardTotal:
						levelFilter = boqCompareRows.summaryStandardDiscountTotal;
						positionFilter = (item) => commonHelperService.isStandardBoq(item.BasItemTypeFk, item.BasItemType2Fk);
						break;
					case boqCompareRows.summaryOptionalITTotal:
						levelFilter = boqCompareRows.summaryOptionalITDiscountTotal;
						positionFilter = (item) => commonHelperService.isOptionalWithItBoq(item.BasItemTypeFk, item.BasItemType2Fk);
						break;
					case boqCompareRows.summaryOptionalWITTotal:
						levelFilter = boqCompareRows.summaryOptionalWITDiscountTotal;
						positionFilter = (item) => commonHelperService.isOptionalWithoutItBoq(item.BasItemTypeFk);
						break;
					case boqCompareRows.summaryAlternativeTotal:
						levelFilter = boqCompareRows.summaryAlternativeDiscountTotal;
						positionFilter = (item) => commonHelperService.isAlternativeBoq(item.BasItemType2Fk);
						break;
					case boqCompareRows.summaryGrandTotal:
						levelFilter = boqCompareRows.summaryGrandDiscountTotal;
						positionFilter = () => true;
						break;
				}

				let levelChildren = children.filter(child => commonHelperService.isBoqLevelRow(child.BoqLineTypeFk));
				let positionChildren = children.filter(child => {
					return commonHelperService.isBoqPositionRow(child.BoqLineTypeFk) && child.QuoteItems.some(item => item.QuoteKey === col.field && positionFilter(item));
				});

				if (levelChildren.length) {
					let targetRows = levelChildren.reduce((rows, row) => {
						let childTotalRows = _.filter(row.BoqItemChildren, (c) => c.BoqLineTypeFk === levelFilter && !_.includes([undefined], c[col.field]));
						return rows.concat(childTotalRows);
					}, []);
					let targetResults = targetRows.map(r => {
						return [commonHelperService.findIndexByKeyFromDicCache(r.Id, dataRowDic.rows), colIndex];
					});
					results = results.concat(targetResults);
				}

				if (positionChildren.length) {
					let targetResults;
					if (isVerticalCompareRows) {
						targetResults = positionChildren.map(r => {
							const rowIndex = commonHelperService.findIndexByKeyFromDicCache(r.Id, dataRowDic.rows);
							const targetColIndex = _.findIndex(columns, c => {
								return c.quoteKey === col.field && commonHelperService.isBidderColumn(c) && c.originalField === boqCompareRows.finalPrice;
							});
							return [rowIndex, targetColIndex];
						});
					} else {
						let targetRows = positionChildren.reduce((rows, row) => {
							let childTotalRows = _.filter(row.BoqItemChildren, (c) => c.BoqLineTypeFk === compareLineTypes.compareField && c.rowType === boqCompareRows.finalPrice);
							return rows.concat(childTotalRows);
						}, []);
						targetResults = targetRows.map(r => {
							return [commonHelperService.findIndexByKeyFromDicCache(r.Id, dataRowDic.rows), colIndex];
						});
					}
					results = results.concat(targetResults);
				}

				return results;
			};

			let findLeadingField = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
				let leadingField = userData.leadingFieldCache;
				let visibleRow = _.find(userData.visibleCompareRowsCache, {Field: commonService.itemCompareFields.absoluteDifference});
				if (!_.includes(commonService.valuableLeadingFields, leadingField)) {
					return null;
				}
				if (visibleRow.Field === commonService.itemCompareFields.absoluteDifference || visibleRow.Field === commonService.itemCompareFields.percentage) {
					switch (visibleRow.DeviationReference) {
						case 10:
							leadingField = commonService.itemCompareFields.price;
							break;
						case 11: {
							leadingField = commonService.boqCompareFields.itemTotal;
							break;
						}
						default:
							break;
					}
				}
				let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
				if (commonHelperService.isBoqRootRow(boqRow.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(boqRow.BoqLineTypeFk)) {
					leadingField = boqCompareRows.itemTotal;
				}
				return commonHelperService.getFieldCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, leadingField);
			};

			let findDeviationReference = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
				return commonHelperService.getDeviationReferenceFieldIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, commonService.constant.compareType.boqItem);
			};

			let findBidderReference = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
				return commonHelperService.getBidderReferenceFieldIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, commonService.constant.compareType.boqItem);
			};

			let createAbsoluteDifference = function (isVerticalMode) {
				return {
					formula: commonHelperService.deviationDifferenceFormula,
					cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.absoluteDifference : null),
					expression: {
						leadingField: findLeadingField,
						deviationReference: findDeviationReference,
						bidderReference: findBidderReference
					}
				};
			};

			let createPercentage = function (isVerticalMode) {
				return {
					formula: commonHelperService.percentageFormula,
					cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.percentage : null),
					expression: {
						leadingField: findLeadingField,
						deviationReference: findDeviationReference,
						bidderReference: findBidderReference
					}
				};
			};

			let createItemTotalFinder = function (isOcValue) {
				return function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
					let totalExpressions = [];
					let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
					let quoteKey = isVerticalCompareRows ? col.quoteKey : col.field;

					let levels = _.filter(boqRow.BoqItemChildren, item => commonHelperService.isBoqLevelRow(item.BoqLineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === quoteKey));
					let positions = _.filter(boqRow.BoqItemChildren, item => {
						return commonHelperService.isBoqPositionRow(item.BoqLineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === quoteKey && commonHelperService.isItemWithITBoq(x.BasItemTypeFk, x.BasItemType2Fk)) && !commonHelperService.isBoqDisabledOrNA(item);
					});

					if (levels.length) {
						totalExpressions.push(buildRootFinalPriceExpression(levels, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue, dataRowDic, true));
					}

					if (positions.length) {
						totalExpressions.push(buildPositionFinalPriceExpression(positions, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue, dataRowDic));
					}

					const mergeExpression = _.concat(...totalExpressions);
					return mergeExpression.length > EXCEL_MAX_FUNCTION_ARG_LENGTH ? _.chunk(mergeExpression, EXCEL_MAX_FUNCTION_ARG_LENGTH).map(group => {
						return 'SUM(' + group.join(',') + ')';
					}).join(',') : mergeExpression.join(',');
				};
			};

			let hasSummaryRowValid = function (rows, currRow, col, summaryRowType) {
				let rowTypePrefix = currRow.rowType.split('_')[0];
				return commonHelperService.isLineValueColumn(col) && checkBidderService.isNotReference(col.field) && _.some(rows, row => {
					return row.ParentId === currRow.ParentId && row.SummaryRowType === summaryRowType && row.rowType.startsWith(rowTypePrefix) && !_.includes([undefined], row[col.field]);
				});
			};

			let createQuantityCompareRowFinder = function () {
				return function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
					const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
					const compareField = userData.isCalculateAsPerAdjustedQuantity ? boqCompareRows.quantityAdj : boqCompareRows.quantity;
					return buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, compareField, dataRowDic);
				};
			};

			const rootLevelCells = {
				createItemTotal: function (isVerticalMode) {
					return {
						formula: function (currRow) {
							let boqRow = isVerticalMode ? currRow : currRow.parentItem;
							if (commonHelperService.isBoqRootRow(boqRow.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(boqRow.BoqLineTypeFk)) {
								return 'SUM({levelAndPositionTotal})';
							} else {
								return '{price}*{quantity}*{factor}';
							}
						},
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.itemTotal : null),
						expression: {
							price: createCompareRowFinder(boqCompareRows.price),
							quantity: createQuantityCompareRowFinder(),
							factor: createCompareRowFinder(boqCompareRows.factor),
							levelAndPositionTotal: createItemTotalFinder(false)
						}
					};
				},
				createItemTotalOc: function (isVerticalMode) {
					return {
						formula: function (currRow) {
							let boqRow = isVerticalMode ? currRow : currRow.parentItem;
							if (commonHelperService.isBoqRootRow(boqRow.BoqLineTypeFk) || commonHelperService.isBoqLevelRow(boqRow.BoqLineTypeFk)) {
								return 'SUM({levelAndPositionTotal})';
							} else {
								return '{priceOc}*{quantity}*{factor}';
							}
						},
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.itemTotalOc : null),
						expression: {
							priceOc: createCompareRowFinder(boqCompareRows.priceOc),
							quantity: createQuantityCompareRowFinder(),
							factor: createCompareRowFinder(boqCompareRows.factor),
							levelAndPositionTotal: createItemTotalFinder(true)
						}
					};
				},
				createDiscount: function (isVerticalMode) {
					return {
						formula: '{total}*{discount}/100',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.discount : null),
						expression: {
							total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
								let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
								return buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, boqCompareRows.itemTotal, dataRowDic);
							},
							discount: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
								let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
								return buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, boqCompareRows.discountPercentIT, dataRowDic);
							}
						}
					};
				},
				createSummaryInRow: function () {
					return {
						formula: 'TEXTJOIN("/",FALSE,{fields})',
						cell: function (row, column) {
							return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field);
						},
						expression: {
							fields: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
								let rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
								let cellValue = _.isFunction(col.formatter) ? (col.formatter(rowIndex, colIndex, currRow[col.field], col, currRow) || '') : '';
								let rowValues = cellValue.replace(/<\/?.+?[^>]*>/g, '').split('/');
								let cellValues = _.map(userData.showInSummaryRows, (row, index) => {
									let expressionValue = buildBoqCompareRowExpression(currRow, rows, columns, col, colIndex, isVerticalCompareRows, row.Field, dataRowDic);
									return expressionValue !== null ? (_.includes(userData.decimalCompareFields, row.Field) ? _.wrap((v) => v, (fn, v) => 'FIXED(' + fn(v) + ',2)')(expressionValue) : expressionValue) : '"' + rowValues[index] + '"';
								});
								return cellValues.join(',');
							}
						},
						disabled: true
					};
				},
				createAbsoluteDifference: createAbsoluteDifference,
				createPercentage: createPercentage
			};

			const positionCells = {
				createPrice: function (isVerticalMode) {
					return {
						formula: '{priceOc}/{exchangeRate}',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.price : null),
						expression: {
							priceOc: createCompareRowFinder(boqCompareRows.priceOc),
							exchangeRate: commonHelperService.createQuoteRowFinder(compareLineTypes.quoteExchangeRate)
						}
					};
				},
				createDiscountedPrice: function (isVerticalMode) {
					return {
						formula: '{discountedUnitPrice}*{quantity}*{factor}',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.discountedPrice : null),
						expression: {
							discountedUnitPrice: createCompareRowFinder(boqCompareRows.discountedUnitPrice),
							quantity: createQuantityCompareRowFinder(),
							factor: createCompareRowFinder(boqCompareRows.factor)
						}
					};
				},
				createDiscountedUnitPrice: function (isVerticalMode) {
					return {
						formula: '{price}-({price}*{discountedPercent}/100)',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.discountedUnitPrice : null),
						expression: {
							price: createCompareRowFinder(boqCompareRows.price),
							discountedPercent: createCompareRowFinder(boqCompareRows.discountPercent),
						}
					};
				},
				createFinalPrice: function (isVerticalMode) {
					return {
						formula: '{discountedPrice}+{extraIncrement}',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.finalPrice : null),
						expression: {
							discountedPrice: createCompareRowFinder(boqCompareRows.discountedPrice),
							extraIncrement: createCompareRowFinder(boqCompareRows.extraIncrement)
						}
					};
				},
				createFinalPriceOc: function (isVerticalMode) {
					return {
						formula: '(({priceOc}-({priceOc}*{discountedPercent}/100))*{quantity}*{factor})+{extraIncrementOc}',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.finalPriceOc : null),
						expression: {
							priceOc: createCompareRowFinder(boqCompareRows.priceOc),
							discountedPercent: createCompareRowFinder(boqCompareRows.discountPercent),
							quantity: createQuantityCompareRowFinder(),
							factor: createCompareRowFinder(boqCompareRows.factor),
							extraIncrementOc: createCompareRowFinder(boqCompareRows.extraIncrementOc)
						}
					};
				},
				createPriceGross: function (isVerticalMode) {
					return {
						formula: '({price}-({price}*{discountedPercent}/100))*(100+{VatPercent.vatPercent})/100',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.priceGross : null),
						expression: {
							price: createCompareRowFinder(boqCompareRows.price),
							discountedPercent: createCompareRowFinder(boqCompareRows.discountPercent),
							vatPercent: createVatPercentRowFinder()
						}
					};
				},
				createPriceGrossOc: function (isVerticalMode) {
					return {
						formula: '({priceOc}-({priceOc}*{discountedPercent}/100))*(100+{VatPercent.vatPercent})/100',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.priceGrossOc : null),
						expression: {
							priceOc: createCompareRowFinder(boqCompareRows.priceOc),
							discountedPercent: createCompareRowFinder(boqCompareRows.discountPercent),
							vatPercent: createVatPercentRowFinder()
						}
					};
				},
				createFinalGross: function (isVerticalMode) {
					return {
						formula: '{finalPrice}*(100+{VatPercent.vatPercent})/100',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.finalGross : null),
						expression: {
							finalPrice: createCompareRowFinder(boqCompareRows.finalPrice),
							vatPercent: createVatPercentRowFinder()
						}
					};
				},
				createFinalGrossOc: function (isVerticalMode) {
					return {
						formula: '{finalPriceOc}*(100+{VatPercent.vatPercent})/100',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.finalGrossOc : null),
						expression: {
							finalPriceOc: createCompareRowFinder(boqCompareRows.finalPriceOc),
							vatPercent: createVatPercentRowFinder()
						}
					};
				},
				createExtraIncrement: function (isVerticalMode) {
					return {
						formula: '{extraIncrementOc}/{exchangeRate}',
						cell: createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? boqCompareRows.extraIncrement : null),
						expression: {
							extraIncrementOc: createCompareRowFinder(boqCompareRows.extraIncrementOc),
							exchangeRate: commonHelperService.createQuoteRowFinder(compareLineTypes.quoteExchangeRate)
						}
					};
				},
				createAbsoluteDifference: createAbsoluteDifference,
				createPercentage: createPercentage
			};

			const boqExportExcelFormulaRules = [
				{
					label: 'Grand Total',
					row: function (row) {
						return row.BoqLineTypeFk === compareLineTypes.grandTotal;
					},
					cells: [{
						formula: 'SUM({total})',
						cell: function (row, column) {
							return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field);
						},
						expression: {
							total: function (rows, currRow, columns, col, colIndex) {
								let targetRows = _.filter(rows, item => item.BoqLineTypeFk === compareLineTypes.rfq);
								let results = targetRows.map(r => {
									let rowIndex = _.findIndex(rows, row => {
										return row.Id === r.Id;
									});
									return [rowIndex, colIndex];
								});

								return results.map(m => commonHelperService.formatExpressionValue(m[0], m[1])).join(',');
							}
						}
					}].concat(createRfqTotalStatisticCells())
				},
				{
					label: 'Evaluated Total',
					row: function (row) {
						return row.BoqLineTypeFk === compareLineTypes.evaluatedTotal;
					},
					cells: [
						{
							formula: 'SUM({total})',
							cell: function (row, column) {
								return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field);
							},
							expression: {
								total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
									return commonHelperService.buildEvaluatedTotalExpress(rows, currRow, columns, col, colIndex, isVerticalCompareRows, commonService.constant.compareType.boqItem);
								}
							}
						}].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'RFQ Total',
					row: function (row) {
						return row.BoqLineTypeFk === compareLineTypes.rfq;
					},
					cells: [
						{
							formula: 'SUM({total})',
							cell: function (row, column) {
								return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field);
							},
							expression: {
								total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
									let boqRoots = [];
									currRow.BoqItemChildren.forEach(item => {
										if (item.BoqLineTypeFk === compareLineTypes.requisition) {
											let roots = _.filter(item.BoqItemChildren, item => commonHelperService.isBoqRootRow(item.BoqLineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === col.field));
											boqRoots = boqRoots.concat(roots);
										}
									});

									return buildRootFinalPriceExpression(boqRoots, rows, columns, col, colIndex, isVerticalCompareRows, false, dataRowDic);
								}
							}
						}].concat(createRfqTotalStatisticCells())
				},
				{
					label: 'REQ Total',
					row: function (row) {
						return row.BoqLineTypeFk === compareLineTypes.requisition;
					},
					cells: [{
						formula: 'SUM({total})',
						cell: function (row, column) {
							return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field) && row.QuoteItems.some(item => item.QuoteKey === column.field);
						},
						expression: {
							total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
								let boqRoots = _.filter(currRow.BoqItemChildren, item => commonHelperService.isBoqRootRow(item.BoqLineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === col.field));
								return buildRootFinalPriceExpression(boqRoots, rows, columns, col, colIndex, isVerticalCompareRows, false, dataRowDic);
							}
						},
						disabled: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
							return !userData.isFinalPriceRowActivated;
						}
					}].concat(createRequisitionTotalStatisticCells())
				},
				{
					label: 'Summary Total',
					row: function (row) {
						return _.includes(commonService.boqSummaryFileds, row.BoqLineTypeFk) && row.SummaryRowType === commonService.boqSummaryRowTypes.total;
					},
					cells: [
						{
							formula: 'SUM({totalRows})',
							cell: function (row, column) {
								return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field) && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
							},
							expression: {
								totalRows: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
									const results = findSummaryTotalRows(rows, currRow, columns, col, colIndex, isVerticalCompareRows, dataRowDic);
									const resultExpressions = results.map(m => commonHelperService.formatExpressionValue(m[0], m[1]));

									return resultExpressions.length > EXCEL_MAX_FUNCTION_ARG_LENGTH ? _.chunk(resultExpressions, EXCEL_MAX_FUNCTION_ARG_LENGTH).map(group => {
										return 'SUM(' + group.join(',') + ')';
									}).join(',') : resultExpressions.join(',');
								}
							},
							disabled: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
								const results = findSummaryTotalRows(rows, currRow, columns, col, colIndex, isVerticalCompareRows, dataRowDic);
								return _.isEmpty(results);
							}
						}
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Summary Discount Abs',
					row: function (row) {
						return _.includes(commonService.boqSummaryFileds, row.BoqLineTypeFk) && row.SummaryRowType === commonService.boqSummaryRowTypes.abs;
					},
					cells: [{
						formula: '{total}*{percent}/100',
						cell: function (row, column) {
							return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field) && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
						},
						expression: {
							total: createSummaryRowFinder(commonService.boqSummaryRowTypes.total),
							percent: createSummaryRowFinder(commonService.boqSummaryRowTypes.percent)
						},
						disabled: function (rows, currRow, columns, col) {
							return !hasSummaryRowValid(rows, currRow, col, commonService.boqSummaryRowTypes.total) && !hasSummaryRowValid(rows, currRow, col, commonService.boqSummaryRowTypes.percent);
						}
					}].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Summary Discount Total',
					row: function (row) {
						return _.includes(commonService.boqSummaryFileds, row.BoqLineTypeFk) && row.SummaryRowType === commonService.boqSummaryRowTypes.discountTotal;
					},
					cells: [{
						formula: '{total}-{abs}',
						cell: function (row, column) {
							return commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field) && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
						},
						expression: {
							total: createSummaryRowFinder(commonService.boqSummaryRowTypes.total),
							abs: createSummaryRowFinder(commonService.boqSummaryRowTypes.abs)
						},
						disabled: function (rows, currRow, columns, col) {
							return !hasSummaryRowValid(rows, currRow, col, commonService.boqSummaryRowTypes.total) && !hasSummaryRowValid(rows, currRow, col, commonService.boqSummaryRowTypes.abs);
						}
					}].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Summary Discount Percent',
					row: function (row) {
						return _.includes(commonService.boqSummaryFileds, row.BoqLineTypeFk) && row.SummaryRowType === commonService.boqSummaryRowTypes.percent;
					},
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Summary Discount Percent IT',
					row: function (row) {
						return row.rowType === boqCompareRows.discountPercentIT;
					},
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Lumpsum Price',
					row: function (row) {
						return row.rowType === boqCompareRows.lumpsumPrice;
					},
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'BoQ Root',
					row: function (row) {
						return commonHelperService.isBoqRootRow(row.BoqLineTypeFk);
					},
					cells: [
						rootLevelCells.createItemTotal(true),
						rootLevelCells.createItemTotalOc(true),
						// rootLevelCells.createDiscount(true),
						rootLevelCells.createSummaryInRow(),
						rootLevelCells.createAbsoluteDifference(true),
						rootLevelCells.createPercentage(true)
					].concat(createRootLevelTotalStatisticCells())
				},
				{
					label: 'BoQ Level',
					row: function (row) {
						return commonHelperService.isBoqLevelRow(row.BoqLineTypeFk);
					},
					cells: [
						rootLevelCells.createItemTotal(true),
						rootLevelCells.createItemTotalOc(true),
						// rootLevelCells.createDiscount(true),
						rootLevelCells.createSummaryInRow(),
						rootLevelCells.createAbsoluteDifference(true),
						rootLevelCells.createPercentage(true)
					].concat(createRootLevelTotalStatisticCells())
				},
				{
					label: 'BoQ Position',
					row: function (row) {
						return commonHelperService.isBoqPositionRow(row.BoqLineTypeFk);
					},
					cells: [
						positionCells.createPrice(true),
						positionCells.createDiscountedPrice(true),
						positionCells.createDiscountedUnitPrice(true),
						positionCells.createFinalPrice(true),
						positionCells.createFinalPriceOc(true),
						positionCells.createPriceGross(true),
						positionCells.createPriceGrossOc(true),
						positionCells.createFinalGross(true),
						positionCells.createFinalGrossOc(true),
						rootLevelCells.createItemTotal(true),
						rootLevelCells.createItemTotalOc(true),
						positionCells.createExtraIncrement(true),
						rootLevelCells.createSummaryInRow(),
						positionCells.createAbsoluteDifference(true),
						positionCells.createPercentage(true)
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Price',
					row: createCompareRowIdentifier(boqCompareRows.price),
					cells: [
						positionCells.createPrice()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Discounted Price',
					row: createCompareRowIdentifier(boqCompareRows.discountedPrice),
					cells: [
						positionCells.createDiscountedPrice()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Discounted Unit Price',
					row: createCompareRowIdentifier(boqCompareRows.discountedUnitPrice),
					cells: [
						positionCells.createDiscountedUnitPrice()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Final Price',
					row: createCompareRowIdentifier(boqCompareRows.finalPrice),
					cells: [
						positionCells.createFinalPrice()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Final Price(OC)',
					row: createCompareRowIdentifier(boqCompareRows.finalPriceOc),
					cells: [
						positionCells.createFinalPriceOc()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Final Price Before Discount',
					row: createCompareRowIdentifier(boqCompareRows.itemTotal),
					cells: [
						rootLevelCells.createItemTotal()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Final Price Before Discount (OC)',
					row: createCompareRowIdentifier(boqCompareRows.itemTotalOc),
					cells: [
						rootLevelCells.createItemTotalOc()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Discount ABS IT',
					row: createCompareRowIdentifier(boqCompareRows.discount),
					cells: [
						// rootLevelCells.createDiscount()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Corrected UR (Gross)',
					row: createCompareRowIdentifier(boqCompareRows.priceGross),
					cells: [
						positionCells.createPriceGross()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Corrected UR (Gross OC)',
					row: createCompareRowIdentifier(boqCompareRows.priceGrossOc),
					cells: [
						positionCells.createPriceGrossOc()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Final Price (Gross)',
					row: createCompareRowIdentifier(boqCompareRows.finalGross),
					cells: [
						positionCells.createFinalGross()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Final Price (Gross OC)',
					row: createCompareRowIdentifier(boqCompareRows.finalGrossOc),
					cells: [
						positionCells.createFinalGrossOc()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Extra Increment',
					row: createCompareRowIdentifier(boqCompareRows.extraIncrement),
					cells: [
						positionCells.createExtraIncrement()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Absolute Difference',
					row: createCompareRowIdentifier(boqCompareRows.absoluteDifference),
					cells: [
						positionCells.createAbsoluteDifference()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Percentage',
					row: createCompareRowIdentifier(boqCompareRows.percentage),
					cells: [
						positionCells.createPercentage()
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem))
				},
				{
					label: 'Compare Field - Cost',
					row: createCompareRowIdentifier(boqCompareRows.cost),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Compare Field - Discount Percent Unit Rate',
					row: createCompareRowIdentifier(boqCompareRows.discountPercent),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Compare Field - Quantity',
					row: createCompareRowIdentifier(boqCompareRows.quantity),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Compare Field - AQ-Quantity',
					row: createCompareRowIdentifier(boqCompareRows.quantityAdj),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Compare Field - Unit Rate Oc',
					row: createCompareRowIdentifier(boqCompareRows.priceOc),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Compare Field - Factor',
					row: createCompareRowIdentifier(boqCompareRows.factor),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				},
				{
					label: 'Compare Field - Extra Increment OC',
					row: createCompareRowIdentifier(boqCompareRows.extraIncrementOc),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.boqItem)
				}
			];

			function createRootLevelTotalStatisticCells() {
				return [
					createRootLevelStaticsCell(commonService.constant.maxValueIncludeTarget, 'MAX'),
					createRootLevelStaticsCell(commonService.constant.maxValueExcludeTarget, 'MAX'),
					createRootLevelStaticsCell(commonService.constant.minValueIncludeTarget, 'MIN'),
					createRootLevelStaticsCell(commonService.constant.minValueExcludeTarget, 'MIN'),
					createRootLevelStaticsCell(commonService.constant.averageValueIncludeTarget, 'AVERAGE'),
					createRootLevelStaticsCell(commonService.constant.averageValueExcludeTarget, 'AVERAGE')
				];
			}

			function createRootLevelStaticsCell(compareField, fnName) {
				return {
					formula: fnName + '({total})',
					cell: function (row, column) {
						return column.field === compareField;
					},
					expression: {
						total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
							let bidderColumns = isVerticalCompareRows
								? _.filter(columns, c => commonHelperService.isBidderColumn(c) && checkBidderService.isNotReference(c.quoteKey) && !c.isIdealBidder && c.originalField === boqCompareRows.itemTotal)
								: _.filter(columns, c => commonHelperService.isBidderColumn(c) && checkBidderService.isNotReference(c.field) && !c.isIdealBidder);

							if (!commonHelperService.isExcludeTargetColumn(col)) {
								let countInTargetColumnIds = _.filter(userData.visibleCompareColumnsCache, item => item.IsCountInTarget).map(item => item.Id);
								bidderColumns = _.filter(bidderColumns, bidderColumn => {
									return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
								});
							}

							let quoteKeys = _.map(currRow.QuoteItems, item => item.QuoteKey);
							bidderColumns = _.filter(bidderColumns, bidderColumn => {
								return _.indexOf(quoteKeys, bidderColumn.id) > -1;
							});

							let levels = _.filter(currRow.BoqItemChildren, item => commonHelperService.isBoqLevelRow(item.BoqLineTypeFk));
							let positions = _.filter(currRow.BoqItemChildren, item => {
								return commonHelperService.isBoqPositionRow(item.BoqLineTypeFk) && !commonHelperService.isBoqDisabledOrNA(item);
							});

							let totalExpressions = [];
							if (levels.length || positions.length) {
								_.forEach(bidderColumns, c => {
									const currColIndex = _.findIndex(columns, item => item.id === c.id);
									const levelExpressions = buildRootFinalPriceExpression(levels, rows, columns, c, currColIndex, isVerticalCompareRows, false, dataRowDic, true);
									const positionExpressions = buildPositionFinalPriceExpression(positions, rows, columns, c, currColIndex, isVerticalCompareRows, false, dataRowDic);

									const mergeExpression = levelExpressions.concat(positionExpressions);
									const resultExpression = mergeExpression.length > EXCEL_MAX_FUNCTION_ARG_LENGTH ? _.chunk(mergeExpression, EXCEL_MAX_FUNCTION_ARG_LENGTH).map(group => {
										return 'SUM(' + group.join(',') + ')';
									}).join(',') : mergeExpression.join(',');

									totalExpressions.push('SUM(' + resultExpression + ')');
								});
							}
							return totalExpressions.join(',');
						}
					}
				};
			}

			function createRfqTotalStatisticCells() {
				return [
					createRfqReqTotalStatisticCell(commonService.constant.maxValueIncludeTarget, 'MAX'),
					createRfqReqTotalStatisticCell(commonService.constant.maxValueExcludeTarget, 'MAX'),
					createRfqReqTotalStatisticCell(commonService.constant.minValueIncludeTarget, 'MIN'),
					createRfqReqTotalStatisticCell(commonService.constant.minValueExcludeTarget, 'MIN'),
					commonHelperService.createStatisticCell(commonService.constant.averageValueIncludeTarget, commonService.constant.compareType.boqItem),
					commonHelperService.createStatisticCell(commonService.constant.averageValueExcludeTarget, commonService.constant.compareType.boqItem)
				];
			}

			function createRequisitionTotalStatisticCells() {
				return [
					createRfqReqTotalStatisticCell(commonService.constant.maxValueIncludeTarget, 'MAX'),
					createRfqReqTotalStatisticCell(commonService.constant.maxValueExcludeTarget, 'MAX'),
					createRfqReqTotalStatisticCell(commonService.constant.minValueIncludeTarget, 'MIN'),
					createRfqReqTotalStatisticCell(commonService.constant.minValueExcludeTarget, 'MIN'),
					createRequisitionAverageCell(commonService.constant.averageValueIncludeTarget),
					createRequisitionAverageCell(commonService.constant.averageValueExcludeTarget)
				];
			}

			function createRfqReqTotalStatisticCell(compareField, fnName) {
				return {
					formula: fnName + '({total})',
					cell: function (row, column) {
						return column.field === compareField;
					},
					expression: {
						total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
							const totalExpressions = [];
							let bidderColumns = isVerticalCompareRows
								? _.filter(columns, c => commonHelperService.isLineValueColumn(c) && checkBidderService.isNotReference(c.quoteKey) && !c.isIdealBidder)
								: _.filter(columns, c => commonHelperService.isLineValueColumn(c) && checkBidderService.isNotReference(c.field) && !c.isIdealBidder);
							if (!commonHelperService.isExcludeTargetColumn(col)) {
								let countInTargetColumnIds = _.filter(userData.visibleCompareColumnsCache, item => item.IsCountInTarget).map(item => item.Id);
								bidderColumns = _.filter(bidderColumns, bidderColumn => {
									return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
								});
							}
							_.forEach(bidderColumns, c => {
								const currColIndex = _.findIndex(columns, item => item.id === c.id);
								const currRowIndex = commonHelperService.findIndexByKeyFromDicCache(currRow.Id, dataRowDic.rows);
								totalExpressions.push(commonHelperService.formatExpressionValue(currRowIndex, currColIndex));
							});
							return totalExpressions.join(',');
						}
					}
				};
			}

			function createRequisitionAverageCell(compareField) {
				return {
					formula: 'AVERAGE({total})',
					cell: function (row, column) {
						return column.field === compareField;
					},
					expression: {
						total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
							let boqRoots = _.filter(currRow.BoqItemChildren, item => commonHelperService.isBoqRootRow(item.BoqLineTypeFk));

							let totalExpressions = [];
							let bidderColumns = isVerticalCompareRows
								? _.filter(columns, c => commonHelperService.isBidderColumn(c) && checkBidderService.isNotReference(c.quoteKey) && !c.isIdealBidder && c.originalField === boqCompareRows.itemTotal)
								: _.filter(columns, c => commonHelperService.isBidderColumn(c) && checkBidderService.isNotReference(c.field) && !c.isIdealBidder);
							if (!commonHelperService.isExcludeTargetColumn(col)) {
								let countInTargetColumnIds = _.filter(userData.visibleCompareColumnsCache, item => item.IsCountInTarget).map(item => item.Id);
								bidderColumns = _.filter(bidderColumns, bidderColumn => {
									return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
								});
							}

							let quoteKeys = _.map(currRow.QuoteItems, item => item.QuoteKey);
							bidderColumns = _.filter(bidderColumns, bidderColumn => {
								return _.indexOf(quoteKeys, bidderColumn.id) > -1;
							});

							if (boqRoots.length) {
								_.forEach(bidderColumns, c => {
									const currColIndex = _.findIndex(columns, item => item.id === c.id);
									totalExpressions.push(buildRootFinalPriceExpression(boqRoots, rows, columns, c, currColIndex, isVerticalCompareRows, false, dataRowDic));
								});
							}
							return totalExpressions.join(',');
						}
					}
				};
			}

			return {
				boqExportExcelFormulaRules: boqExportExcelFormulaRules
			};
		}
	]);

})(angular);