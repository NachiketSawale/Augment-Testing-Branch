(function (angular) {
	'use strict';

	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('pricecomparisonItemFormulaService', [
		'_',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonLineTypes',
		function (
			_,
			checkBidderService,
			commonHelperService,
			commonService,
			compareLineTypes) {

			let service = {};

			let utility = {
				price: createFieldFinder(commonService.itemCompareFields.price),
				quantity: createFieldFinder(commonService.itemCompareFields.quantity),
				priceUnit: createFieldFinder(commonService.itemCompareFields.priceUnit),
				factorPriceUnit: createFieldFinder(commonService.itemCompareFields.factorPriceUnit),
				discountSplit: createFieldFinder(commonService.itemCompareFields.discountSplit),
				discountSplitOc: createFieldFinder(commonService.itemCompareFields.discountSplitOc),
				discount: createFieldFinder(commonService.itemCompareFields.discount),
				priceOc: createFieldFinder(commonService.itemCompareFields.priceOc),
				priceExtra: createFieldFinder(commonService.itemCompareFields.priceExtra),
				priceExtraOc: createFieldFinder(commonService.itemCompareFields.priceExtraOc),
				charge: createFieldFinder(commonService.itemCompareFields.charge),
				chargeOc: createFieldFinder(commonService.itemCompareFields.chargeOc),
				vatPercent: getVatPercent,
				leadingField: getLeadingField,
				deviationReference: getDeviationReference,
				bidderReference: getBidderReference
			};

			const compareFieldCells = {
				createPrice: function (isVerticalMode) {
					return {
						formula: '{priceOc}/{exchangeRate}',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.price),
						expression: {
							priceOc: utility.priceOc,
							exchangeRate: commonHelperService.createQuoteRowFinder(compareLineTypes.quoteExchangeRate)
						}
					};
				},
				createTotalPrice: function (isVerticalMode) {
					return {
						formula: '({price}+{priceExtra}+{charge})*((100-{discount})/100)',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalPrice),
						expression: {
							price: utility.price,
							priceExtra: utility.priceExtra,
							discount: utility.discount,
							charge: utility.charge
						}
					};
				},
				createFactoredTotalPrice: function (isVerticalMode) {
					return {
						formula: '({price}+{priceExtra}+{charge})*((100-{discount})/100)/{priceUnit}',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalPrice),
						expression: {
							price: utility.price,
							priceExtra: utility.priceExtra,
							discount: utility.discount,
							priceUnit: utility.priceUnit,
							charge: utility.charge
						}
					};
				},
				createTotal: function (isVerticalMode) {
					return {
						formula: '{totalPrice}*{quantity}/{priceUnit}*{factorPriceUnit}-{discountSplit}',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.total),
						expression: {
							totalPrice: createFieldFinder(commonService.itemCompareFields.totalPrice),
							quantity: utility.quantity,
							priceUnit: utility.priceUnit,
							factorPriceUnit: utility.factorPriceUnit,
							discountSplit: utility.discountSplit
						}
					};
				},
				createTotalOC: function (isVerticalMode) {
					return {
						formula: '({priceOc}+{priceExtraOc}+{chargeOc})*((100-{discount})/100)*{quantity}/{priceUnit}*{factorPriceUnit}-{discountSplitOc}',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalOC),
						expression: {
							priceOc: utility.priceOc,
							priceExtraOc: utility.priceExtraOc,
							discount: utility.discount,
							quantity: utility.quantity,
							priceUnit: utility.priceUnit,
							factorPriceUnit: utility.factorPriceUnit,
							discountSplit: utility.discountSplit,
							discountSplitOc: utility.discountSplitOc,
							chargeOc: utility.chargeOc
						}
					};
				},
				createTotalNoDiscount: function (isVerticalMode) {
					return {
						formula: '({price}+{priceExtra})*{quantity}/{priceUnit}*{factorPriceUnit}',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalNoDiscount),
						expression: {
							price: utility.price,
							priceExtra: utility.priceExtra,
							quantity: utility.quantity,
							priceUnit: utility.priceUnit,
							factorPriceUnit: utility.factorPriceUnit
						}
					};
				},
				createTotalOcNoDiscount: function (isVerticalMode) {
					return {
						formula: '({priceOc}+{priceExtraOc})*{quantity}/{priceUnit}*{factorPriceUnit}',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalOcNoDiscount),
						expression: {
							priceOc: utility.priceOc,
							priceExtraOc: utility.priceExtraOc,
							quantity: utility.quantity,
							priceUnit: utility.priceUnit,
							factorPriceUnit: utility.factorPriceUnit
						}
					};
				},
				createPriceOCGross: function (isVerticalMode){
					return {
						formula: '{priceOc}*(100+{VatPercent.vatPercent})/100',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.priceOCGross),
						expression: {
							priceOc: utility.priceOc,
							vatPercent: utility.vatPercent
						}
					};
				},
				createPriceGross: function (isVerticalMode) {
					return {
						formula: '{price}*(100+{VatPercent.vatPercent})/100',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.priceGross),
						expression: {
							price: utility.price,
							vatPercent: utility.vatPercent
						}
					};
				},
				createTotalPriceOCGross: function (isVerticalMode) {
					return {
						formula: '({priceOc}+{priceExtraOc}+{chargeOc})*((100-{discount})/100)*(100+{VatPercent.vatPercent})/100',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalPriceOCGross),
						expression: {
							priceOc: utility.priceOc,
							priceExtraOc: utility.priceExtraOc,
							discount: utility.discount,
							vatPercent: utility.vatPercent,
							chargeOc: utility.chargeOc
						}
					};
				},
				createTotalPriceGross: function (isVerticalMode) {
					return {
						formula: '{totalPrice}*(100+{VatPercent.vatPercent})/100',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalPriceGross),
						expression: {
							totalPrice: createFieldFinder(commonService.itemCompareFields.totalPrice),
							vatPercent: utility.vatPercent
						}
					};
				},
				createTotalOCGross: function (isVerticalMode) {
					return {
						formula: '(({priceOc}+{priceExtraOc}+{chargeOc})*((100-{discount})/100)*{quantity}/{priceUnit}*{factorPriceUnit}-{discountSplitOc})*(100+{VatPercent.vatPercent})/100',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalOCGross),
						expression: {
							priceOc: utility.priceOc,
							priceExtraOc: utility.priceExtraOc,
							discount: utility.discount,
							quantity: utility.quantity,
							priceUnit: utility.priceUnit,
							factorPriceUnit: utility.factorPriceUnit,
							discountSplit: utility.discountSplit,
							discountSplitOc: utility.discountSplitOc,
							vatPercent: utility.vatPercent,
							chargeOc: utility.chargeOc
						}
					};
				},
				createTotalGross: function (isVerticalMode) {
					return {
						formula: '{total}*(100+{VatPercent.vatPercent})/100',
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.totalGross),
						expression: {
							total: createFieldFinder(commonService.itemCompareFields.total),
							vatPercent: utility.vatPercent
						}
					};
				},
				createAbsoluteDifference: function (isVerticalMode) {
					return {
						formula: commonHelperService.deviationDifferenceFormula,
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.absoluteDifference),
						expression: {
							leadingField: utility.leadingField,
							deviationReference: utility.deviationReference,
							bidderReference: utility.bidderReference
						}
					};
				},
				createPercentage: function (isVerticalMode) {
					return {
						formula: commonHelperService.percentageFormula,
						cell: createCellMatcher(isVerticalMode, commonService.itemCompareFields.percentage),
						expression: {
							leadingField: utility.leadingField,
							deviationReference: utility.deviationReference,
							bidderReference: utility.bidderReference
						}
					};
				}
			};

			service.itemExportExcelFormulaRules = [
				{
					label: 'Grand Total',
					row: function (row) {
						return row.LineType === compareLineTypes.grandTotal;
					},
					cells: [{
						formula: 'SUM({total})',
						cell: function (row, column, isVerticalCompareRows) {
							if (isVerticalCompareRows) {
								return commonHelperService.isLineValueColumn(column);
							} else {
								return checkBidderService.isNotReference(column.field) && commonHelperService.isBidderColumn(column);
							}
						},
						expression:
							{
								total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
									let results;
									let targetRows;
									if (isVerticalCompareRows) {
										targetRows = _.filter(rows, item => item.LineType === compareLineTypes.rfq);
										results = targetRows.map(r => {
											let rowIndex = _.findIndex(rows, row => {
												return row.Id === r.Id;
											});
											return [rowIndex, colIndex];
										});
									} else {
										targetRows = _.filter(rows, item => item.LineType === compareLineTypes.rfq);
										results = targetRows.map(r => {
											let rowIndex = _.findIndex(rows, row => {
												return row.Id === r.Id;
											});
											return [rowIndex, colIndex];
										});
									}
									return results.map(m => commonHelperService.formatExpressionValue(m[0], m[1])).join(',');
								}
							}
					}
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Evaluated Total',
					row: function (row) {
						return row.LineType === compareLineTypes.evaluatedTotal;
					},
					cells: [{
						formula: 'SUM({total})',
						cell: function (row, column, isVerticalCompareRows) {
							if (isVerticalCompareRows) {
								return commonHelperService.isLineValueColumn(column);
							} else {
								return checkBidderService.isNotReference(column.field) && commonHelperService.isBidderColumn(column);
							}
						},
						expression: {
							total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
								return commonHelperService.buildEvaluatedTotalExpress(rows, currRow, columns, col, colIndex, isVerticalCompareRows, commonService.constant.compareType.prcItem);
							}
						}
					}].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Rfq row Total',
					row: function (row) {
						return row.LineType === compareLineTypes.rfq;
					},
					cells: [{
						formula: 'SUM({total})',
						cell: function (row, column, isVerticalCompareRows) {
							if (isVerticalCompareRows) {
								return commonHelperService.isLineValueColumn(column);
							} else {
								return checkBidderService.isNotReference(column.field) && commonHelperService.isBidderColumn(column);
							}
						},
						expression: {
							total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
								let reqRow = _.find(currRow.Children, item => {
									return _.startsWith(item.Id, 'requisition_row');
								});
								return findRfqReqTotalCellIndex(rows, reqRow, columns, col, colIndex, isVerticalCompareRows);
							}
						}
					}].concat(createRfqReqTotalStatisticCells())
				},
				{
					label: 'Requisition row Total',
					row: function (row) {
						return row.LineType === compareLineTypes.requisition;
					},
					cells: [{
						formula: 'SUM({total})',
						cell: function (row, column, isVerticalCompareRows) {
							if (isVerticalCompareRows) {
								return commonHelperService.isLineValueColumn(column);
							} else {
								return checkBidderService.isNotReference(column.field) && row.QuoteItems.some(item => item.QuoteKey === column.field);
							}
						},
						expression: {
							total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
								return findRfqReqTotalCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows);
							}
						},
						disabled: function (rows, currRow, columns, cole, colIndex, isVerticalCompareRows, lookupMap, userData) {
							return !userData.isFinalPriceRowActivated;
						}
					}].concat(createRfqReqTotalStatisticCells())
				},
				{
					label: 'PrcItem Total',
					row: function (row) {
						return row.LineType === compareLineTypes.prcItem;
					},
					cells: [
						{
							formula: '{total}',
							cell: function (row, column, isVerticalCompareRows) {
								if (isVerticalCompareRows) {
									return commonHelperService.isLineValueColumn(column);
								} else {
									return checkBidderService.isNotReference(column.field) && row.QuoteItems.some(item => item.QuoteKey === column.field);
								}
							},
							expression: {
								total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
									let results;
									let targetRows;
									if (isVerticalCompareRows) {
										targetRows = _.filter(rows, item => item.Id === currRow.Id);
										results = targetRows.map(r => {
											let rowIndex = _.findIndex(rows, row => {
												return row.Id === r.Id;
											});
											colIndex = _.findIndex(columns, column => column.id === col.id + '_' + commonService.itemCompareFields.total);
											return [rowIndex, colIndex];
										});
									} else {
										targetRows = _.filter(rows, item => item.rowType === commonService.itemCompareFields.total && item.LineType === compareLineTypes.compareField && item.ParentId === currRow.Id);
										results = targetRows.map(r => {
											let rowIndex = _.findIndex(rows, row => {
												return row.Id === r.Id;
											});
											return [rowIndex, colIndex];
										});
									}
									return results.map(m => commonHelperService.formatExpressionValue(m[0], m[1])).join(',');
								}
							}
						},
						compareFieldCells.createPrice(true),
						compareFieldCells.createTotalPrice(true),
						compareFieldCells.createFactoredTotalPrice(true),
						compareFieldCells.createTotal(true),
						compareFieldCells.createTotalOC(true),
						compareFieldCells.createTotalNoDiscount(true),
						compareFieldCells.createTotalOcNoDiscount(true),
						compareFieldCells.createPriceOCGross(true),
						compareFieldCells.createPriceGross(true),
						compareFieldCells.createTotalPriceOCGross(true),
						compareFieldCells.createTotalPriceGross(true),
						compareFieldCells.createTotalOCGross(true),
						compareFieldCells.createTotalGross(true),
						compareFieldCells.createAbsoluteDifference(true),
						compareFieldCells.createPercentage(true)
					].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Price',
					row: createRowMatcher(commonService.itemCompareFields.price),
					cells: [compareFieldCells.createPrice(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total Price',
					row: createRowMatcher(commonService.itemCompareFields.totalPrice),
					cells: [compareFieldCells.createTotalPrice(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Factored Total Price',
					row: createRowMatcher(commonService.itemCompareFields.totalPrice),
					cells: [compareFieldCells.createFactoredTotalPrice(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total',
					row: createRowMatcher(commonService.itemCompareFields.total),
					cells: [compareFieldCells.createTotal(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total Oc',
					row: createRowMatcher(commonService.itemCompareFields.totalOC),
					cells: [compareFieldCells.createTotalOC(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total No Discount',
					row: createRowMatcher(commonService.itemCompareFields.totalNoDiscount),
					cells: [compareFieldCells.createTotalNoDiscount(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total Oc No Discount',
					row: createRowMatcher(commonService.itemCompareFields.totalOcNoDiscount),
					cells: [compareFieldCells.createTotalOcNoDiscount(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Price Oc Gross',
					row: createRowMatcher(commonService.itemCompareFields.priceOCGross),
					cells: [compareFieldCells.createPriceOCGross(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Price Gross',
					row: createRowMatcher(commonService.itemCompareFields.priceGross),
					cells: [compareFieldCells.createPriceGross(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total Price OC Gross',
					row: createRowMatcher(commonService.itemCompareFields.totalPriceOCGross),
					cells: [compareFieldCells.createTotalPriceOCGross(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total Price Gross',
					row: createRowMatcher(commonService.itemCompareFields.totalPriceGross),
					cells: [compareFieldCells.createTotalPriceGross(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total OC Gross',
					row: createRowMatcher(commonService.itemCompareFields.totalOCGross),
					cells: [compareFieldCells.createTotalOCGross(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Total Gross',
					row: createRowMatcher(commonService.itemCompareFields.totalGross),
					cells: [compareFieldCells.createTotalGross(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Absolute Difference',
					row: createRowMatcher(commonService.itemCompareFields.absoluteDifference),
					cells: [compareFieldCells.createAbsoluteDifference(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Percentage',
					row: createRowMatcher(commonService.itemCompareFields.percentage),
					cells: [compareFieldCells.createPercentage(false)].concat(commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem))
				},
				{
					label: 'Price Oc',
					row: createRowMatcher(commonService.itemCompareFields.priceOc),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Price Extras',
					row: createRowMatcher(commonService.itemCompareFields.priceExtra),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Price Extras Oc',
					row: createRowMatcher(commonService.itemCompareFields.priceExtraOc),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Price Unit',
					row: createRowMatcher(commonService.itemCompareFields.priceUnit),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Quantity',
					row: createRowMatcher(commonService.itemCompareFields.quantity),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Discount',
					row: createRowMatcher(commonService.itemCompareFields.discount),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Discount Absolute',
					row: createRowMatcher(commonService.itemCompareFields.discountAbsolute),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Discount Split',
					row: createRowMatcher(commonService.itemCompareFields.discountSplit),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Discount Split Oc',
					row: createRowMatcher(commonService.itemCompareFields.discountSplitOc),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Factor Price Unit',
					row: createRowMatcher(commonService.itemCompareFields.factorPriceUnit),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Charge',
					row: createRowMatcher(commonService.itemCompareFields.charge),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				},
				{
					label: 'Charge Oc',
					row: createRowMatcher(commonService.itemCompareFields.chargeOc),
					cells: commonHelperService.createStatisticCells(commonService.constant.compareType.prcItem)
				}
			];

			function createFieldFinder(fieldType) {
				return function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
					return commonHelperService.getFieldCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, fieldType);
				};
			}

			function createRowMatcher(fieldType) {
				return function (row, isVerticalCompareRows) {
					if (isVerticalCompareRows) {
						return row.LineType === compareLineTypes.prcItem;
					} else {
						return row.LineType === compareLineTypes.compareField && row.rowType === fieldType;
					}
				};
			}

			function createCellMatcher(isVerticalMode, fieldType) {
				return function (row, column, isVerticalCompareRows) {
					if (isVerticalMode) {
						return isVerticalCompareRows && checkBidderService.isNotReference(column.quoteKey) && column.originalField === fieldType && row.QuoteItems.some(item => item.QuoteKey === column.quoteKey);
					}
					else {
						return checkBidderService.isNotReference(column.field) && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);

					}
				};
			}

			function getVatPercent(rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
				let targetItem;
				if (isVerticalCompareRows) {
					targetItem = _.find(currRow.QuoteItems, item => item.QuoteKey === col.quoteKey);
				} else {
					targetItem = _.find(currRow.parentItem.QuoteItems, item => item.QuoteKey === col.field);
				}
				return targetItem ? commonHelperService.getVatPercentExpressionValue(targetItem.TaxCodeFk, targetItem['QtnHeaderVatGroupFk']) : null;
			}

			function getLeadingField(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData){
				let leadingField = userData.leadingFieldCache;
				let visibleRow = _.find(userData.visibleCompareRowsCache, {Field: commonService.itemCompareFields.absoluteDifference});
				if (!_.includes(commonService.valuableLeadingFields, leadingField)){
					return null;
				}
				if (visibleRow.Field === commonService.itemCompareFields.absoluteDifference || visibleRow.Field === commonService.itemCompareFields.percentage){
					switch (visibleRow.DeviationReference) {
						case 10:
							leadingField = commonService.itemCompareFields.price;
							break;
						case 11: {
							leadingField = commonService.itemCompareFields.total;
							break;
						}
						default:
							break;
					}
				}
				return commonHelperService.getFieldCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, leadingField);
			}

			function getDeviationReference(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
				return commonHelperService.getDeviationReferenceFieldIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, commonService.constant.compareType.prcItem);
			}

			function getBidderReference(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData) {
				return commonHelperService.getBidderReferenceFieldIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, commonService.constant.compareType.prcItem);
			}

			function findRfqReqTotalCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows){
				let results;
				if (isVerticalCompareRows) {
					results = currRow.Children.map(r => {
						let rowIndex = _.findIndex(rows, row => {
							return row.Id === r.Id;
						});
						colIndex = _.findIndex(columns, column => column.id === col.id + '_' + commonService.itemCompareFields.total);
						return [rowIndex, colIndex];
					});
				} else {
					let targetRows = [];
					_.forEach(currRow.Children, item => {
						let itemTotalRow = _.find(item.Children, childRow => {
							return childRow.rowType === commonService.itemCompareFields.total;
						});
						if (itemTotalRow) {
							targetRows.push(itemTotalRow);
						}
					});
					results = targetRows.map(r => {
						let rowIndex = _.findIndex(rows, row => {
							return row.Id === r.Id;
						});
						return [rowIndex, colIndex];
					});
				}
				return results.map(m => commonHelperService.formatExpressionValue(m[0], m[1])).join(',');
			}

			function createRfqReqTotalStatisticCells(){
				return [
					createRfqReqTotalStatisticCell(commonService.constant.maxValueIncludeTarget),
					createRfqReqTotalStatisticCell(commonService.constant.maxValueExcludeTarget),
					createRfqReqTotalStatisticCell(commonService.constant.minValueIncludeTarget),
					createRfqReqTotalStatisticCell(commonService.constant.minValueExcludeTarget),
					commonHelperService.createStatisticCell(commonService.constant.averageValueIncludeTarget, commonService.constant.compareType.prcItem),
					commonHelperService.createStatisticCell(commonService.constant.averageValueExcludeTarget, commonService.constant.compareType.prcItem)
				];
			}

			function createRfqReqTotalStatisticCell(field) {
				return {
					formula: 'SUM({total})',
					cell: function (row, column) {
						return column.field === field;
					},
					expression: {
						total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
							if (currRow.LineType === compareLineTypes.rfq) {
								let reqRow = _.find(currRow.Children, item => {
									return item.LineType === compareLineTypes.requisition;
								});
								return findRfqReqTotalCellIndex(rows, reqRow, columns, col, colIndex, isVerticalCompareRows);
							}
							return findRfqReqTotalCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows);
						}
					}
				};
			}

			return service;
		}]);

})(angular);