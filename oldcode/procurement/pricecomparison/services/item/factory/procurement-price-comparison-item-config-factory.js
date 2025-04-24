/**
 * Created by wed on 9/27/2018.
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemConfigFactory', [
		'globals',
		'_',
		'$',
		'$http',
		'$translate',
		'$rootScope',
		'$injector',
		'$timeout',
		'platformGridDomainService',
		'platformModalService',
		'platformGridAPI',
		'platformCreateUuid',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonCommonService',
		'basicsLookupdataPopupService',
		'PlatformMessenger',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'platformPermissionService',
		function (
			globals,
			_,
			$,
			$http,
			$translate,
			$rootScope,
			$injector,
			$timeout,
			platformGridDomainService,
			platformModalService,
			platformGridAPI,
			platformCreateUuid,
			compareLineTypes,
			commonService,
			popupService,
			PlatformMessenger,
			commonHelperService,
			checkBidderService,
			platformPermissionService) {

			let serviceCache = {};

			let formatValue = function formatValue(field, value, columnDef, dataContext) {
				let rs = value;
				if (value === null || value === undefined) {
					return '';
				}

				if (field === commonService.itemCompareFields.rank) {
					rs = commonService.constant.tagForNoQuote;
					if (!isNaN(value)) {
						rs = platformGridDomainService.formatter('integer')(0, 0, value, {});
					}
				} else if (field === commonService.itemCompareFields.percentage) {
					rs = commonService.constant.tagForNoQuote;
					if (!isNaN(value)) {
						rs = platformGridDomainService.formatter('percent')(0, 0, value, {}) + ' %';
					}
				} else if (_.includes(commonService.co2Fields, field)) {
					rs = platformGridDomainService.formatter('quantity')(0, 0, value, {});
				} else if (field === commonService.itemCompareFields.isFreeQuantity) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === commonService.itemCompareFields.exQtnIsEvaluated) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === commonService.itemCompareFields.notSubmitted) {
					if (commonService.constant.tagForNoQuote === value) {
						return value;
					}
					columnDef.formatterOptions = null;
					rs = platformGridDomainService.formatter('boolean')(0, 0, value, columnDef, dataContext);
				} else if (field === commonService.itemCompareFields.price || field === commonService.itemCompareFields.priceOc){
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
					const columnInfo = {
						formatterOptions: field ? commonHelperService.assignDecimalPlacesOptions({}, field) : null
					};
					if (field === commonService.itemCompareFields.quantity) {
						rs = platformGridDomainService.formatter('quantity')(0, 0, value, columnInfo);
					} else {
						rs = platformGridDomainService.formatter('money')(0, 0, value, columnInfo);
					}
				}

				return rs;
			};

			let formatShowInSummaryRows = function (showInSummaryRows, dataContext, columnDef, quoteKey, isVerticalCompareRows) {
				let quoteItem = _.find(dataContext.QuoteItems, {QuoteKey: quoteKey});
				return showInSummaryRows.map(function (row) {
					if (!quoteItem) {
						return commonService.constant.tagForNoQuote;
					}
					if (_.includes([commonService.itemCompareFields.percentage, commonService.itemCompareFields.rank], row.Field)) {
						if (checkBidderService.item.isReference(quoteKey)) {
							return commonService.constant.tagForNoQuote;
						} else {
							let dataItems = row.Field === commonService.itemCompareFields.percentage ? dataContext.percentages : dataContext.ranks;
							let formattedValue = formatValue(row.Field, dataItems[quoteKey], columnDef, dataContext);
							let statisticValue = commonHelperService.statisticValue(_.values(dataItems));
							return commonHelperService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataItems[quoteKey], formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.prcItem, isVerticalCompareRows);
						}
					} else {
						let formattedValue;

						if (dataContext.LineType === compareLineTypes.requisition) {
							formattedValue = formatValue(row.Field, dataContext.totals[quoteKey], columnDef, dataContext);
							if (checkBidderService.item.isNotReference(columnDef.field) && dataContext.totals[quoteKey] !== commonService.constant.tagForNoQuote) {
								let statisticValue = commonHelperService.statisticValue(dataContext.totalValuesExcludeTarget);
								return commonHelperService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataContext.totals[quoteKey], formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.prcItem, isVerticalCompareRows);
							}
							return formattedValue;
						} else if (dataContext.LineType === compareLineTypes.prcItem) {
							formattedValue = formatValue(row.Field, quoteItem[row.Field], columnDef, dataContext);
							if (checkBidderService.item.isNotReference(columnDef.field)) {
								let fieldValuesExcludeTarget = [];
								_.map(dataContext.QuoteItems, function (item) {
									if (checkBidderService.item.isNotReference(item.QuoteKey)) {
										fieldValuesExcludeTarget.push(item[row.Field]);
									}
								});
								let statisticValue = commonHelperService.statisticValue(fieldValuesExcludeTarget);
								return commonHelperService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, quoteItem[row.Field], formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.prcItem, isVerticalCompareRows);
							}
							return formattedValue;
						}
					}
				}).join(commonService.constant.tagForValueSeparator);
			};

			const readDataFunctions = [
				commonHelperService.createRowReader({
					compareValue: function (dataContext) {
						return dataContext.LineType === compareLineTypes.grandTotal || dataContext.LineType === compareLineTypes.subTotal;
					},
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return dataContext.totals[columnDef.field];
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
								return dataContext[columnDef.field];
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
								return checkBidderService.item.isNotReference(columnDef.field) ? dataContext[columnDef.field] : null;
							},
							valueType: 'Integer'
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
								return dataContext.totals[columnDef.field];
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
							readValue: function (dataContext, columnDef) {
								return dataContext.totals[columnDef.field];
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
								return checkBidderService.item.isNotReference(columnDef.field) ? dataContext[columnDef.field] : null;
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.quoteNewItemTotal,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								const quoteNewItems = _.filter(dataContext.Children, {QuoteKey: columnDef.field});
								return _.sumBy(_.map(quoteNewItems || [], commonService.itemCompareFields.total));
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: compareLineTypes.quoteNewItem,
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef) {
								return commonHelperService.isLineValueColumn(columnDef);
							},
							readValue: function (dataContext, columnDef) {
								return dataContext.QuoteKey === columnDef.field ? (dataContext[commonService.itemCompareFields.total] || 0) : null;
							},
							valueType: 'Decimal'
						})
					]
				}),
				commonHelperService.createRowReader({
					compareValue: function (dataContext, isVerticalCompareRows) {
						return isVerticalCompareRows ? dataContext.LineType === compareLineTypes.prcItem : dataContext.LineType === compareLineTypes.compareField;
					},
					cell: [
						commonHelperService.createCellReader({
							compareValue: function (columnDef, isVerticalCompareRows) {
								// Handling compare row field only.
								return commonHelperService.isBidderColumn(columnDef) && (isVerticalCompareRows ? !commonHelperService.isLineValueColumn(columnDef) : commonHelperService.isLineValueColumn(columnDef));
							},
							readValue: function (dataContext, columnDef) {
								let originalValue;
								let quoteKey = columnDef.isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
								let bidderValueProp = columnDef.isVerticalCompareRows ? columnDef.field : quoteKey;
								let compareField = commonHelperService.getPrcCompareField(dataContext, columnDef);
								let prcItem = commonHelperService.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
								let quoteItem = _.find(prcItem.QuoteItems, {QuoteKey: quoteKey});

								switch (compareField) {
									case commonService.itemCompareFields.percentage:
										originalValue = checkBidderService.boq.isNotReference(quoteKey) ? prcItem.percentages[quoteKey] : null;
										break;
									case commonService.itemCompareFields.rank:
										originalValue = checkBidderService.boq.isNotReference(quoteKey) ? prcItem.ranks[quoteKey] : null;
										break;
									case commonService.itemCompareFields.co2Project:
									case commonService.itemCompareFields.co2ProjectTotal:
									case commonService.itemCompareFields.co2Source:
									case commonService.itemCompareFields.co2SourceTotal: {
										originalValue = _.get(quoteItem, compareField);
										break;
									}
									default:
										originalValue = dataContext[bidderValueProp];
										break;
								}
								return this.isInvalidValue(originalValue) ? null : originalValue;
							},
							readFormattedValue: function (row, cell, dataContext, columnDef) {
								let originalValue = this.readValue(dataContext, columnDef);
								let formattedValue;
								let isVerticalCompareRows = columnDef.isVerticalCompareRows;
								let quoteKey = isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
								let compareField = commonHelperService.getPrcCompareField(dataContext, columnDef);
								let bidderValueProp = isVerticalCompareRows ? columnDef.id : quoteKey;

								if (compareField === commonService.itemCompareFields.percentage) {
									formattedValue = checkBidderService.item.isReference(quoteKey) ? commonService.constant.tagForNoQuote : formatValue(compareField, originalValue, columnDef, dataContext);
								} else if (compareField === commonService.itemCompareFields.rank) {
									formattedValue = checkBidderService.item.isReference(quoteKey) ? commonService.constant.tagForNoQuote : formatValue(compareField, originalValue, columnDef, dataContext);
								} else if (_.includes([commonService.itemCompareFields.userDefined1, commonService.itemCompareFields.userDefined2, commonService.itemCompareFields.userDefined3, commonService.itemCompareFields.userDefined4, commonService.itemCompareFields.userDefined5, commonService.itemCompareFields.discountComment, commonService.itemCompareFields.externalCode], compareField)) {
									formattedValue = _.escape(originalValue) || '';
								} else if (compareField === commonService.itemCompareFields.prcItemEvaluationFk) {
									if (_.isFunction(columnDef.domain)) {
										columnDef.domain(dataContext, columnDef);
									}
									formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
								} else if (compareField === commonService.itemCompareFields.prcPriceConditionFk) {
									if (_.isFunction(columnDef.domain)) {
										columnDef.domain(dataContext, columnDef);
									}
									formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
								} else if (compareField === commonService.itemCompareFields.alternativeBid) {
									if (!originalValue) {
										dataContext[bidderValueProp] = null;
									}
									if (_.isFunction(columnDef.domain)) {
										columnDef.domain(dataContext, columnDef);
									}
									formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
								} else if (compareField === commonService.itemCompareFields.commentClient || compareField === commonService.itemCompareFields.commentContractor) {
									formattedValue = commonHelperService.encodeEntity(originalValue || '');
								} else if (compareField === commonService.itemCompareFields.uomFk) {
									formattedValue = checkBidderService.item.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.uomLookupFormatter(row, cell, originalValue, dataContext, columnDef);
								} else if (_.includes([commonService.itemCompareFields.paymentTermPaFk, commonService.itemCompareFields.paymentTermFiFk], compareField)) {
									if (_.isFunction(columnDef.domain)) {
										columnDef.domain(dataContext, columnDef);
									}
									formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
									// formattedValue = checkBidderService.item.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.paymentTermLookupFormatter(row, cell, originalValue, dataContext, columnDef);
								} else if (compareField === commonService.itemCompareFields.prjChangeFk) {
									formattedValue = checkBidderService.item.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.projectChangeFormatter(row, cell, originalValue, dataContext, columnDef);
								} else if (compareField === commonService.itemCompareFields.prjChangeStatusFk) {
									formattedValue = checkBidderService.item.isReference(quoteKey) ? commonService.constant.tagForNoQuote : commonHelperService.projectChangeStatusFormatter(row, cell, originalValue, dataContext, columnDef);
								} else {
									formattedValue = formatValue(compareField, originalValue, columnDef, dataContext);
								}
								return formattedValue;
							},
							readValueType: function (dataContext, columnDef) {
								let valueType;
								let compareField = commonHelperService.getPrcCompareField(dataContext, columnDef);
								switch (compareField) {
									case commonService.itemCompareFields.percentage:
									case commonService.itemCompareFields.price:
									case commonService.itemCompareFields.priceOc:
									case commonService.itemCompareFields.total:
									case commonService.itemCompareFields.totalOC:
									case commonService.itemCompareFields.totalNoDiscount:
									case commonService.itemCompareFields.totalOcNoDiscount:
									case commonService.itemCompareFields.totalPrice:
									case commonService.itemCompareFields.totalPriceOc:
									case commonService.itemCompareFields.factoredTotalPrice:
									case commonService.itemCompareFields.quantity:
									case commonService.itemCompareFields.priceExtra:
									case commonService.itemCompareFields.priceExtraOc:
									case commonService.itemCompareFields.priceGross:
									case commonService.itemCompareFields.priceOCGross:
									case commonService.itemCompareFields.totalPriceGross:
									case commonService.itemCompareFields.totalPriceOCGross:
									case commonService.itemCompareFields.totalGross:
									case commonService.itemCompareFields.totalOCGross:
									case commonService.itemCompareFields.factorPriceUnit:
									case commonService.itemCompareFields.priceUnit:
									case commonService.itemCompareFields.discount:
									case commonService.itemCompareFields.discountSplit:
									case commonService.itemCompareFields.discountSplitOc:
									case commonService.itemCompareFields.discountAbsolute:
									case commonService.itemCompareFields.discountAbsoluteOc:
									case commonService.itemCompareFields.discountAbsoluteGross:
									case commonService.itemCompareFields.discountAbsoluteGrossOc:
									case commonService.itemCompareFields.absoluteDifference:
									case commonService.itemCompareFields.charge:
									case commonService.itemCompareFields.chargeOc:
										valueType = 'Decimal';
										break;
									case compareField === commonService.itemCompareFields.rank:
										valueType = 'Integer';
										break;
									default:
										valueType = null;
										break;
								}
								return valueType;
							},
							readFormatCode: function (dataContext, columnDef) {
								let formatCode = null;
								let compareField = commonHelperService.getPrcCompareField(dataContext, columnDef);
								if (_.includes([commonService.itemCompareFields.percentage], compareField)) {
									formatCode = '0.00%';
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

				// store the global data required for item comparison shared by all rfqs
				let service = {
					rfqHeadersCache: [],                // Rfq
					originalFieldsCache: [],            // original info of quote: QtnHeaderId + BusinesspartnerId  + QtnVersion + PrcHeaderId

					visibleCompareColumnsCache: [],     // custom compare bidders
					showInSummaryCompareRowsCache: [],  // custom compare fields shown in 'ShonInSummary' cell
					visibleCompareRowsCache: [],        // custom compare fields
					leadingFieldCache: '',              // compare leading field
					visibleQuoteCompareRowsCache: [],   // quote compare field rows
					visibleSchemaCompareRowsCache: [],  // billing schema field rows

					quoteItemAddressCache: [],
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
					generalItems: {},

					quoteItem2BizPartnerCache: [],
					itemQtnMatchCache: {},

					replacementItems: [],
					needUpdate: new PlatformMessenger()
				};
				let compareDirections = {
					isVerticalCompareRows: false,
					isFinalShowInTotal: false
				};

				// common fields (not used as compare, readonly)
				service.getCommonColumns = function getCommonColumns() {
					return [
						{
							id: 'StatusFk',
							field: 'StatusFk',
							name: 'Status',
							name$tr$: 'cloud.common.entityStatus',
							formatter: setFormatterForStatusColumn,
							hidden: false,
							width: 120
						},
						{
							id: 'ItemNo',
							field: 'ItemNo',
							name: 'Item No.',
							name$tr$: 'procurement.common.prcItemItemNo',
							hidden: false,
							searchable: true,
							width: 120
						},
						{
							id: 'Description1',
							field: 'Description1',
							name: 'Description 1',
							name$tr$: 'procurement.common.prcItemDescription1',
							hidden: false,
							searchable: true,
							width: 150,
							domain: 'description',
							editor: 'description'
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
						}
					];
				};

				service.getCommonColumns2 = function getCommonColumns2() {
					let columns = [
						{
							id: 'itemtypeid',
							field: 'ItemTypeFk',
							name: 'Item Type',
							name$tr$: 'procurement.common.prcItemType',
							hidden: false,
							width: 100,
							formatter: commonService.formatter.lookupFormatter,
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
							id: 'itemtype2id',
							field: 'ItemType2Fk',
							name: 'Item Type 2',
							name$tr$: 'procurement.common.prcItemType2',
							hidden: false,
							width: 100,
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								displayMember: 'Description',
								lookupModuleQualifier: 'basics.lookup.boqitemtype2',
								lookupSimpleLookup: true,
								valueMember: 'Id'
							}
						},
						{
							id: 'itemaltid',
							field: 'ItemAlt',
							name: 'Item Alt',
							name$tr$: 'procurement.common.prcItemAlt',
							hidden: false,
							width: 80,
							formatter: commonService.formatter.descriptionFormatter,
						},
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
							id: 'Description2',
							field: 'Description2',
							name: 'Description 2',
							name$tr$: 'procurement.common.prcItemFurtherDescription',
							hidden: false,
							sortable: true,
							searchable: true,
							width: 150
						},
						{
							id: 'Specification',
							field: 'Specification',
							name: 'Specification',
							name$tr$: 'cloud.common.EntitySpec',
							hidden: false,
							sortable: true,
							searchable: true,
							width: 150,
							domain: 'description',
							editor: 'description'
						},
						{
							id: 'DateRequired',
							field: 'DateRequired',
							name: 'Required By',
							name$tr$: 'cloud.common.entityRequiredBy',
							hidden: false,
							width: 100,
							formatter: commonService.formatter.dateFormatter
						},
						{
							id: 'OnHire',
							field: 'OnHire',
							name: 'On Hire Date',
							name$tr$: 'procurement.common.prcItemOnHireDate',
							hidden: false,
							formatter: commonService.formatter.dateFormatter,
							width: 100
						},
						{
							id: 'OffHire',
							field: 'OffHire',
							name: 'Off Hire Date',
							name$tr$: 'procurement.common.prcItemOffHireDate',
							formatter: commonService.formatter.dateFormatter,
							hidden: false,
							width: 100
						},
						{
							id: 'BasAddressFk',
							field: 'AddressFk',
							name: 'Delivery Address',
							name$tr$: 'procurement.common.prcItemDeliveryAddress',
							formatter: setFormatterForDeliveryAddressColumn(),
							hidden: false,
							width: 150
						},
						{
							id: 'PackageCode',
							field: 'PackageFk',
							name: 'Package Code',
							name$tr$: 'procurement.common.prcItemPackageCode',
							hidden: false,
							width: 100,
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PrcPackage',
								displayMember: 'Code'
							}
						},
						{
							id: 'PackageDescription',
							field: 'PackageFk',
							name: 'Package Description',
							name$tr$: 'procurement.common.prcItemPackageDescription',
							hidden: false,
							width: 120,
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PrcPackage',
								displayMember: 'Description'
							}
						},
						{
							id: 'StructureCode',
							field: 'StructureFk',
							name: 'Structure Code',
							name$tr$: 'cloud.common.entityStructureCode',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PrcStructure',
								displayMember: 'Code'
							},
							hidden: false,
							width: 100
						},
						{
							id: 'StructureDescription',
							field: 'StructureFk',
							name: 'Structure Description',
							name$tr$: 'cloud.common.entityStructureDescription',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PrcStructure',
								displayMember: 'Description'
							},
							hidden: false,
							width: 120
						},
						{
							id: 'MaterialCode',
							field: 'MdcMaterialFk',
							name: 'Material No.',
							name$tr$: 'procurement.common.prcItemMaterialNo',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'MaterialRecord',
								displayMember: 'Code'
							},
							hidden: false,
							width: 100
						},
						{
							id: 'UomFk',
							field: 'UomFk',
							name: 'UoM',
							name$tr$: 'cloud.common.entityUoM',
							hidden: false,
							width: 100,
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PCUom',
								displayMember: 'UnitInfo.Translated'
							},
							cssClass: 'cell-center',
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						{
							id: 'ControllingUnitCode',
							field: 'ControllingUnitFk',
							name: 'Controlling Unit Code',
							name$tr$: 'cloud.common.entityControllingUnitCode',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'ControllingUnit',
								displayMember: 'Code'
							},
							hidden: false,
							width: 120
						},
						{
							id: 'ControllingUnitDesc',
							field: 'ControllingUnitFk',
							name: 'Controlling Unit Description',
							name$tr$: 'cloud.common.entityControllingUnitDesc',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'ControllingUnit',
								displayMember: 'DescriptionInfo.Translated'
							},
							hidden: false,
							width: 150
						},
						{
							id: 'TaxCodeCode',
							field: 'TaxCodeFk',
							name: 'Tax Code',
							name$tr$: 'cloud.common.entityTaxCode',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							hidden: false,
							width: 100
						},
						{
							id: 'TaxCodeDescription',
							field: 'TaxCodeFk',
							name: 'Tax Code Description',
							name$tr$: 'cloud.common.entityTaxCodeDescription',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'DescriptionInfo.Translated'
							},
							hidden: false,
							width: 120
						},
						{
							id: 'PaymentTermFiCode',
							field: 'PaymentTermFiFk',
							name: 'Payment Term (FI)',
							name$tr$: 'cloud.common.entityPaymentTermFI',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							},
							hidden: false,
							width: 150
						},
						{
							id: 'PaymentTermFiDescription',
							field: 'PaymentTermFiFk',
							name: 'Payment Term (FI) Description',
							name$tr$: 'cloud.common.entityPaymentTermFiDescription',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Description'
							},
							hidden: false,
							width: 170
						},
						{
							id: 'PaymentTermPaCode',
							field: 'PaymentTermPaFk',
							name: 'Payment Term (PA)',
							name$tr$: 'cloud.common.entityPaymentTermPA',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							},
							hidden: false,
							width: 150
						},
						{
							id: 'PaymentTermPaDescription',
							field: 'PaymentTermPaFk',
							name: 'Payment Term (PA) Description',
							name$tr$: 'cloud.common.entityPaymentTermPaDescription',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Description'
							},
							hidden: false,
							width: 170
						},
						{
							id: 'PrcIncotermDesc',
							field: 'PrcIncotermFk',
							name: 'Incoterms',
							name$tr$: 'cloud.common.entityIncoterms',
							formatter: commonService.formatter.lookupFormatter,
							formatterOptions: {
								lookupType: 'PrcIncoterm',
								displayMember: 'Description'
							},
							hidden: false,
							width: 100
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
							id: 'IsContracted',
							field: 'IsContracted',
							name: 'IsContracted',
							name$tr$: 'procurement.common.entityIsContracted',
							formatter: 'boolean',
							hidden: false,
							width: 100
						}
					];

					// add search-able fields
					columns.map(function (column) {
						if (!_.includes(['OnHire', 'OffHire'], column.field)) {
							column.searchable = true;
						}
					});

					return columns;
				};

				// for grid column of replacement item popup dialog.
				service.getCommonColumns3 = function getCommonColumns3() {
					return [
						{
							id: 'Price',
							field: 'Price',
							name: 'Price',
							name$tr$: 'cloud.common.entityPrice',
							hidden: false,
							formatter: commonService.formatter.moneyFormatter
						},
						{
							id: 'PriceExtra',
							field: 'PriceExtra',
							name: 'Price Extras',
							name$tr$: 'procurement.common.prcItemPriceExtras',
							hidden: false,
							formatter: commonService.formatter.moneyFormatter
						},
						{
							id: 'TotalPrice',
							field: 'TotalPrice',
							name: 'Total Price',
							name$tr$: 'procurement.common.prcItemTotalPrice',
							hidden: false,
							formatter: commonService.formatter.moneyFormatter
						},
						{
							id: 'FactoredTotalPrice',
							field: 'FactoredTotalPrice',
							name: 'Factored Total Price',
							name$tr$: 'procurement.common.item.prcItemFactoredTotalPrice',
							hidden: false,
							formatter: commonService.formatter.moneyFormatter
						},
						{
							id: 'PriceUnit',
							field: 'PriceUnit',
							name: 'Price Unit',
							name$tr$: 'cloud.common.entityPriceUnit',
							hidden: false,
							formatter: commonService.formatter.moneyFormatter
						},
						{
							id: 'Total',
							field: 'Total',
							name: 'Total',
							name$tr$: 'cloud.common.entityTotal',
							hidden: false,
							formatter: commonService.formatter.moneyFormatter
						},
						{
							id: 'UomPriceUnitFk',
							field: 'UomPriceUnitFk',
							name: 'Price Unit UoM',
							name$tr$: 'cloud.common.entityPriceUnitUoM',
							hidden: false,
							width: 100
						}
					];
				};

				service.getReplacementItemColumns = function () {
					let columns = angular.copy(service.getCommonColumns().concat(service.getCommonColumns3()).concat(service.getCommonColumns2()));
					let fields = [
						'ItemNo', 'Description1', 'Price', 'Total', 'PriceExtra',
						'TotalPrice', 'PriceUnit', 'Quantity',
						'PackageFk', 'StructureFk', 'UomPriceUnitFk',
						'TargetPrice', 'TargetTotal', 'DateRequired',
						'FactoredTotalPrice'
					];

					columns = _.filter(columns, function (col) {
						return _.includes(fields, col.field);
					});

					return columns;
				};

				service.getLineNameColumn = function getLineNameColumn() {
					return [
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
							width: 80,
							hidden: false,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'maxValueIncludeTarget',
							name: 'MaxT',
							name$tr$: 'procurement.pricecomparison.compareMaxValueIncludeTarget',
							width: 80,
							hidden: false,
							field: commonService.constant.maxValueIncludeTarget,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'averageValueIncludeTarget',
							name: 'AverageT',
							name$tr$: 'procurement.pricecomparison.compareAverageValueIncludeTarget',
							field: commonService.constant.averageValueIncludeTarget,
							width: 80,
							hidden: false,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'minValueExcludeTarget',
							name: 'Min',
							name$tr$: 'procurement.pricecomparison.compareMinValueExcludeTarget',
							field: commonService.constant.minValueExcludeTarget,
							width: 80,
							hidden: false,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'maxValueExcludeTarget',
							name: 'Max',
							name$tr$: 'procurement.pricecomparison.compareMaxValueExcludeTarget',
							field: commonService.constant.maxValueExcludeTarget,
							width: 80,
							hidden: false,
							formatter: setFormatterForMinMaxAvgColumn()
						},
						{
							id: 'averageValueExcludeTarget',
							name: 'Average',
							name$tr$: 'procurement.pricecomparison.compareAverageValueExcludeTarget',
							field: commonService.constant.averageValueExcludeTarget,
							width: 80,
							hidden: false,
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
					allColumns = allColumns.concat(service.getCommonColumns3());
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

						// requisition row (show 'Total' + <'Rank/ Percentage' if configed to show>).
						if (dataContext.LineType === compareLineTypes.requisition) {
							let desc = $translate.instant('procurement.pricecomparison.compareTotal');
							_.map(service.showInSummaryCompareRowsCache, function (summaryRow) {
								if (summaryRow.Field === commonService.itemCompareFields.rank || summaryRow.Field === commonService.itemCompareFields.percentage) {
									desc = desc + commonService.constant.tagForValueSeparator + summaryRow.DisplayName;
								}
							});
							value = desc;
						}
						// item row (show compare fields that configure in 'Show In Summary')
						else if (dataContext.LineType === compareLineTypes.prcItem) {
							value = _.map(service.showInSummaryCompareRowsCache, function (summaryRow) {
								return summaryRow.DisplayName;
							}).join(commonService.constant.tagForValueSeparator);
						}

						return value;
					};

					return columns;
				};

				// set decimal formatter for quote columns (dynamic compare columns).
				service.setFormatterForQuoteColumn = function (columnDef, rfqCharacteristics, quoteCharacteristics) {

					let hasModulePermission = commonHelperService.hasPermissionForModule('procurement.quote');

					commonService.setTextAlignRight(columnDef);

					let totalShowInSummaryRows = _.filter(angular.copy(service.showInSummaryCompareRowsCache), function(row) {
						return _.includes([commonService.itemCompareFields.total, commonService.itemCompareFields.rank, commonService.itemCompareFields.percentage], row.Field);
					});
					let totalRow = _.find(totalShowInSummaryRows, { Field: commonService.itemCompareFields.total });

					// add a button to create a contract with all items of quote for the bp
					function createContractWithAllQuotePrcItemsButton(column, entity) {
						return commonHelperService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.createContractForItem', () => {
							let qtnHeaderId = commonService.getQuoteId(column.id);
							let modalOptions = {
								backdrop: false,
								width: '1000px',
								controller: 'procurementPriceComparisonOneQuoteContractController',
								templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/one-quote-to-contract.html',
								resizeable: true
							};

							// get the data then show the popup
							$http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/quotecontractitems', {
								Id: qtnHeaderId
							}).then(function(response) {
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
									.then(function(hasContractItemResponse) {
										$injector.get('procurementPriceComparisonOneQuoteContractMainService').responseData(response.data, 'CreateContractFromItem', 'create.contract.onlyItem', reqHeaderId, true,
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

					columnDef.formatter = function(row, cell, value, columnDef, dataContext) {
						let quoteKey = columnDef.isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
						let originalValue = service.readCellValue(dataContext, columnDef);
						let formattedValue = null;

						if (_.includes([compareLineTypes.quoteDate, compareLineTypes.receiveDate, compareLineTypes.priceFixingDate, compareLineTypes.quoteVersion, compareLineTypes.evaluationRank], dataContext.LineType)) {
							commonService.clearFormatterOptions(columnDef);
						}

						switch (dataContext.LineType) {
							case compareLineTypes.grandTotal:
							case compareLineTypes.evaluatedTotal:
							case compareLineTypes.offeredTotal:
							case compareLineTypes.totalType:
								if (columnDef.isVerticalCompareRows) {
									return '';
								}
								formattedValue = formatValue(row.Field, originalValue, columnDef, dataContext);
								if (totalRow && checkBidderService.item.isNotReference(quoteKey)) {
									let staticValue = commonHelperService.statisticValue(dataContext.totalValuesExcludeTarget);
									formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(totalRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, staticValue.minValue, staticValue.maxValue, staticValue.avgValue, commonService.constant.compareType.prcItem, compareDirections.isVerticalCompareRows);
								}
								if (checkBidderService.item.isNotReference(columnDef.field)) {
									let navArrow = '';
									if (platformPermissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
										navArrow = createContractWithAllQuotePrcItemsButton(columnDef, dataContext) + ' ';
									}
									if (!columnDef.isIdealBidder) {
										navArrow += commonService.getNavigationToQuote(columnDef, dataContext, !hasModulePermission);
									}
									return navArrow + ' ' + formattedValue;
								}
								return formattedValue;
							case  compareLineTypes.grandTotalRank:
								return checkBidderService.item.isNotReference(quoteKey) ? originalValue : '';
							case compareLineTypes.rfq:
								formattedValue = formatValue(row.Field, originalValue, columnDef, dataContext);
								if (totalRow && checkBidderService.item.isNotReference(quoteKey)) {
									let staticValue = commonHelperService.statisticValue(dataContext.totalValuesExcludeTarget);
									formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(totalRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, staticValue.minValue, staticValue.maxValue, staticValue.avgValue, commonService.constant.compareType.prcItem, compareDirections.isVerticalCompareRows);
								}
								return formattedValue;
							case compareLineTypes.quoteDate:
							case compareLineTypes.receiveDate:
							case compareLineTypes.priceFixingDate:
								if (columnDef.isVerticalCompareRows && !_.includes([commonService.quoteCompareFields.quoteDate, commonService.quoteCompareFields.receiveDate, commonService.quoteCompareFields.priceFixingDate], columnDef.originalField)) {
									return '';
								}
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									if (_.get(dataContext, quoteKey) && !angular.isString(_.get(dataContext, quoteKey)) && originalValue) {
										return commonService.formatter.dateFormatter.apply(this, [row, cell, originalValue, columnDef, dataContext]);
									}
								}
								return originalValue;
							case  compareLineTypes.quoteVersion:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field) && originalValue) {
									let rawValue = commonService.formatter.integerFormatter.apply(null, [row, cell, originalValue, columnDef, dataContext]);
									return rawValue ? rawValue.toString() : '';
								}
								return originalValue;
							case compareLineTypes.quoteStatus:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
										lookupType: 'QuoteStatus',
										displayMember: 'Description',
										imageSelector: 'platformStatusIconService'
									});
								}
								return originalValue;
							case compareLineTypes.quoteCurrency:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
										lookupType: 'Currency',
										displayMember: 'Currency'
									});
								}
								return originalValue;
							case compareLineTypes.incoterms:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
										lookupType: 'prcincoterm',
										displayMember: 'Description'
									});
								}
								return originalValue;
							case compareLineTypes.quotePaymentTermPA:
							case compareLineTypes.quotePaymentTermFI:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									return commonHelperService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
										lookupType: 'PaymentTerm',
										displayMember: 'Code'
									});
								}
								return originalValue;
							case compareLineTypes.evaluationRank:
							case compareLineTypes.avgEvaluationRank:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field) && originalValue) {
									let rawValue = commonService.formatter.integerFormatter.apply(null, [row, cell, originalValue, columnDef, dataContext]);
									return rawValue ? rawValue.toString() : '';
								}
								return '';
							case compareLineTypes.quoteExchangeRate:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field) && originalValue) {
									let rawValue = platformGridDomainService.formatter('quantity')(0, 0, originalValue, {});
									return rawValue ? rawValue.toString() : '';
								}
								return '';
							case compareLineTypes.overallDiscount:
							case compareLineTypes.overallDiscountOc:
							case compareLineTypes.overallDiscountPercent:
							case compareLineTypes.discountPercent:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									originalValue = originalValue || 0;
									let rawValue = platformGridDomainService.formatter('percent')(0, 0, originalValue, {}) + '%';
									return rawValue ? rawValue.toString() : '';
								}
								return '';
							case compareLineTypes.evaluationResult:
							case compareLineTypes.billingSchemaGroup:
							case compareLineTypes.billingSchemaChildren:
							case compareLineTypes.turnover:
							case compareLineTypes.avgEvaluationA:
							case compareLineTypes.avgEvaluationB:
							case compareLineTypes.avgEvaluationC:
								if (compareLineTypes.billingSchemaGroup !== dataContext.LineType && columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field) && originalValue) {
									if (!columnDef.isIdealBidder && _.includes([compareLineTypes.avgEvaluationA, compareLineTypes.avgEvaluationB, compareLineTypes.avgEvaluationC], dataContext.LineType)) {
										formattedValue = _.isNumber(originalValue) ? Math.round(originalValue) : originalValue;
									} else {
										formattedValue = formatValue(columnDef.field, originalValue, columnDef, dataContext);
									}
									if (totalRow) {
										let statisticValue = commonHelperService.statisticValue(dataContext.totals);
										formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(totalRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, commonService.constant.compareType.prcItem, compareDirections.isVerticalCompareRows);
									}
									return formattedValue;
								}
								return '';
							case compareLineTypes.characteristic:
								return commonService.characterFormatter(dataContext, columnDef, rfqCharacteristics, quoteCharacteristics, service.itemQtnMatchCache, quoteKey, originalValue);
							case compareLineTypes.requisition: {
								if (columnDef.isVerticalCompareRows) {
									return '';
								}
								let button = '';
								if (checkBidderService.item.isNotReference(columnDef.field)) {
									if (platformPermissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
										button = createContractWithAllQuotePrcItemsButton(columnDef, dataContext) + ' ';
									}
									let disabled = isQuoteStatusReadonly(columnDef, dataContext) || columnDef.isIdealBidder;
									button += createQuoteAddItemWizardButton(columnDef, dataContext, disabled) + ' ';
								}
								return button + formatShowInSummaryRows(totalShowInSummaryRows, dataContext, columnDef, quoteKey, compareDirections.isVerticalCompareRows);
							}
							case compareLineTypes.generalTotal:
								return originalValue;
							case compareLineTypes.generalItem:
								dataContext.totals[quoteKey] = originalValue;
								formattedValue = formatValue(null, originalValue, columnDef, dataContext);
								if (totalRow && checkBidderService.item.isNotReference(columnDef.field)) {
									formattedValue = commonHelperService.setStyleForCellValueUsingTagSpan(totalRow.ConditionalFormat, originalValue, formattedValue, columnDef, dataContext, null, null, null, commonService.constant.compareType.prcItem, compareDirections.isVerticalCompareRows);
								}
								return formattedValue;
							case compareLineTypes.quoteNewItemTotal: {
								const quoteNewItems = _.filter(dataContext.Children, { QuoteKey: quoteKey });
								originalValue = _.sumBy(_.map(quoteNewItems || [], commonService.itemCompareFields.total));
								return formatValue(commonService.itemCompareFields.total, originalValue, columnDef, dataContext);
							}
							case compareLineTypes.quoteNewItem:
								if (dataContext.QuoteKey === quoteKey) {
									originalValue = dataContext ? dataContext[commonService.itemCompareFields.total] : 0;
									formattedValue = formatValue(commonService.itemCompareFields.total, originalValue, columnDef, dataContext);
									return addReplacementItemIcon(formattedValue, dataContext, columnDef.id);
								} else {
									return commonService.constant.tagForNoQuote;
								}
							case compareLineTypes.prcItem: {
								if (columnDef.isVerticalCompareRows) {
									return getCompareRowFormatterValue(row, cell, dataContext, columnDef.quoteKey, columnDef, originalValue);
								} else {
									let button = '';
									if (checkBidderService.isNotReference(columnDef.field)) {
										let disabled = isQuoteStatusReadonly(columnDef, dataContext) || columnDef.isIdealBidder || !_.some(dataContext.QuoteItems, s => s.QuoteKey === columnDef.field);
										button = createInsertItemButton(columnDef, dataContext, disabled);
									}
									let rawValue = formatShowInSummaryRows(service.showInSummaryCompareRowsCache, dataContext, columnDef, quoteKey, compareDirections.isVerticalCompareRows);
									return button + addReplacementItemIcon(rawValue, dataContext, columnDef.id);
								}
							}
							case compareLineTypes.compareField:
								return getCompareRowFormatterValue(row, cell, dataContext, columnDef.field, columnDef, originalValue);
							case compareLineTypes.quoteRemark:
								if (_.isFunction(columnDef.domain)) {
									columnDef.domain(dataContext, columnDef);
								}
								return _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
							case compareLineTypes.discountBasis:
							case compareLineTypes.discountBasisOc:
							case compareLineTypes.discountAmount:
							case compareLineTypes.discountAmountOc:
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(columnDef.field)) {
									originalValue = originalValue || 0;
									formattedValue = platformGridDomainService.formatter('money')(0, 0, originalValue, {});
									return formattedValue;
								}
								return '';
							default:
								return originalValue;
						}
					};
				};

				// apply custom css style for quote column (dynamic compare columns)'s  compare field (row)'s cell value after decimal formatter applied.
				service.applyCustomCssStyleForQuoteColumnCell = function (columnDefs) {
					_.forEach(columnDefs, function (columnDef) {
						if (columnDef) {
							let originalFormatter = angular.isDefined(columnDef.formatter) ? columnDef.formatter : function(row, cell, value/* , columnDef, dataContext */) {
								return value;
							};

							// append the new custom css style formatter to the old decimal formatter
							columnDef.formatter = function(row, cell, value, columnDef, dataContext) {
								let formattedValue = originalFormatter.apply(this, [row, cell, value, columnDef, dataContext]),
									isVerticalCompareRows = compareDirections.isVerticalCompareRows,
									quoteKey = isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
								// add custom style only for bidders.
								if (columnDef.isDynamic && checkBidderService.item.isNotReference(quoteKey)) {
									let excludeFields = [
										commonService.itemCompareFields.userDefined1,
										commonService.itemCompareFields.userDefined2,
										commonService.itemCompareFields.userDefined3,
										commonService.itemCompareFields.userDefined4,
										commonService.itemCompareFields.userDefined5,
										commonService.itemCompareFields.discountComment,
										commonService.itemCompareFields.prcItemEvaluationFk,
										commonService.itemCompareFields.prcPriceConditionFk
									];
									let compareField = commonHelperService.getPrcCompareField(dataContext, columnDef),
										isCompareRowCell = isVerticalCompareRows ? isVerticalCompareRows && dataContext.LineType === compareLineTypes.prcItem : dataContext.LineType === compareLineTypes.compareField,
										conditionalFormat = isVerticalCompareRows ? (_.find(service.visibleCompareRowsCache, { Field: compareField }) || {}).ConditionalFormat : dataContext.ConditionalFormat;
									if (isCompareRowCell && conditionalFormat && !_.includes(excludeFields, compareField)) {
										let deviationRow = dataContext[columnDef.id + commonService.constant.deviationRow],
											highlightQtn = dataContext[columnDef.id + commonService.constant.highlightQtn];
										formattedValue = commonHelperService.setStyleForCellValueUsingTagDiv(conditionalFormat, value, formattedValue, columnDef, dataContext, highlightQtn, deviationRow, null, null, null, commonService.constant.compareType.prcItem, isVerticalCompareRows);
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

				function setFormatterForStatusColumn(row, cell, value, columnDef, dataContext) {
					let columnDef2 = angular.copy(columnDef);
					columnDef2.formatterOptions = {
						lookupType: '',
						displayMember: 'Description',
						imageSelector: 'platformStatusIconService'
					};

					if (dataContext.LineType === compareLineTypes.rfq) {
						columnDef2.formatterOptions.lookupType = 'RfqStatus';
					} else if (dataContext.LineType === compareLineTypes.requisition) {
						columnDef2.formatterOptions.lookupType = 'ReqStatus';
					} else if (dataContext.LineType === compareLineTypes.prcItem ||
						dataContext.LineType === compareLineTypes.quoteNewItem) {
						columnDef2.formatterOptions.lookupType = 'PrcItemStatus';
						columnDef2.formatterOptions.displayMember = 'DescriptionInfo.Translated';
					} else {
						columnDef2.formatterOptions = null;
					}

					let result = commonService.formatter.lookupFormatter.apply(null, [row, cell, value, columnDef2, dataContext]);
					return result ? result : '';
				}

				// set decimal formatter for quantity column.
				function setFormatterForQuantityColumn() {
					return function (row, cell, value, columnDef, dataContext) {
						commonService.setTextAlignRight(columnDef); // text align right

						if (dataContext.LineType === compareLineTypes.prcItem ||
							dataContext.LineType === compareLineTypes.quoteNewItem) {
							value = commonService.formatter.quantityFormatter.apply(this, [row, cell, value, columnDef, dataContext]);
						} else {
							value = null;
						}
						return value;
					};
				}

				// set formatter for min/max/average columns.
				function setFormatterForMinMaxAvgColumn() {
					let excludes = [
						commonService.itemCompareFields.rank,
						commonService.itemCompareFields.prcItemEvaluationFk,
						commonService.itemCompareFields.userDefined1,
						commonService.itemCompareFields.userDefined2,
						commonService.itemCompareFields.userDefined3,
						commonService.itemCompareFields.userDefined4,
						commonService.itemCompareFields.userDefined5,
						commonService.itemCompareFields.discountComment,
						commonService.itemCompareFields.alternativeBid,
						commonService.itemCompareFields.commentClient,
						commonService.itemCompareFields.commentContractor,
						commonService.itemCompareFields.isFreeQuantity,
						commonService.itemCompareFields.uomFk,
						commonService.itemCompareFields.externalCode,
						commonService.itemCompareFields.prcPriceConditionFk,
						commonService.itemCompareFields.exQtnIsEvaluated,
						commonService.itemCompareFields.notSubmitted,
						commonService.itemCompareFields.prjChangeFk,
						commonService.itemCompareFields.prjChangeStatusFk
					];
					return function (row, cell, value, columnDef, dataContext) {
						commonService.setTextAlignRight(columnDef);
						let compareField = commonHelperService.getPrcCompareField(dataContext, columnDef);
						if (dataContext.LineType === compareLineTypes.compareField &&
							compareField === commonService.itemCompareFields.percentage) {
							if ((columnDef.field === commonService.constant.maxValueIncludeTarget ||
								columnDef.field === commonService.constant.minValueIncludeTarget ||
								columnDef.field === commonService.constant.averageValueIncludeTarget)) {
								return null;
							}
							return platformGridDomainService.formatter('percent')(0, 0, value, {}) + ' %';
						}
						if (dataContext.LineType === compareLineTypes.compareField && _.includes(excludes, compareField)) {
							value = null;
						} else {
							const finalField = commonHelperService.isPrcItemRow(dataContext.LineType) ? commonService.itemCompareFields.total : compareField;
							if (finalField && _.includes(commonService.co2Fields, finalField)) {
								value = commonService.formatter.quantityFormatter.apply(this, [row, cell, value, columnDef, dataContext]);
							} else {
								const columnInfo = finalField ? _.extend({}, columnDef, {
									formatterOptions: commonHelperService.assignDecimalPlacesOptions(columnDef.formatterOptions, finalField)
								}) : columnDef;
								value = commonService.formatter.moneyFormatter.apply(this, [row, cell, value, columnInfo, dataContext]);
							}
						}
						return value;
					};
				}

				function setFormatterForDeliveryAddressColumn() {
					return function (row, cell, value, columnDef, dataContext) {
						if (dataContext.LineType === compareLineTypes.prcItem ||
							dataContext.LineType === compareLineTypes.quoteNewItem) {
							let address = _.find(service.quoteItemAddressCache, {Id: dataContext.AddressFk});
							value = (address && address.AddressLine) ? address.AddressLine : null;
						} else {
							value = null;
						}
						return value;
					};
				}

				function addReplacementItemIcon(content, dataContext, quoteKey) {
					let replacementItems = service.getReplacementItems(dataContext, quoteKey);
					if (!_.isEmpty(replacementItems)) {
						let popBtn = '<button title="" data-quote="' + quoteKey + '" class="btn btn-default control-icons priceCompareReplaceItemPopupHtmlBtn ico-input-lookup rib-fl" ></button>';
						// use timeout for do ui modify in cell after grid render.
						$timeout(function () {
							$('.priceCompareReplaceItemPopupHtmlBtn').unbind('click').bind('click', function () {
								let quote = $(this).attr('data-quote');
								onCreate(dataContext, quote, $(this));
							});
						});
						return popBtn + content;
					} else {
						return content;
					}
				}

				function onCreate(dataContext, quoteKey, self) {
					service.replacementItems = service.getReplacementItems(dataContext, quoteKey);
					let $scope = $rootScope.$new(true);
					$scope.dataInfo = {
						gridId: platformCreateUuid()
					};
					let popOptions = {
						// id: $scope.settings.lookupType,
						scope: $scope,
						controller: ['$scope', '$popupInstance', function ($scope, $popupInstance) {
							$popupInstance.onResizeStop.register(function () {
								platformGridAPI.grids.resize($scope.dataInfo.gridId);
							});
						}],
						// options: $scope.options,
						focusedElement: self,
						relatedTarget: self,
						width: 400,
						template: '<div data-procurement-price-comparison-item-replacement-directive data-grid-data = gridData class="grid-container" style="width: 96%; height:130px;"></div>'
					};

					if (popOptions.scope && !popOptions.scope.$close) {
						popupService.showPopup(popOptions);
					}
				}

				service.getReplacementItems = function getReplacementItems(dataContext, quoteKey) {
					// for quote item
					if (dataContext.LineType === compareLineTypes.prcItem) {
						let originalQtnItem = _.find(dataContext.QuoteItems, function (item) {
							return item.QuoteKey === quoteKey;
						});

						/** @namespace originalQtnItem.ReplacementItems */
						if (originalQtnItem && !_.isEmpty(originalQtnItem.ReplacementItems)) {
							return originalQtnItem.ReplacementItems;
						}
					}

					// for quote new item
					if (dataContext.LineType === compareLineTypes.quoteNewItem) {
						if (dataContext && !_.isEmpty(dataContext['ReplacementItems4QuoteNewItem'])) {
							return dataContext['ReplacementItems4QuoteNewItem'];
						}
					}

					return [];
				};

				service.setCompareDirections = function (directions) {
					compareDirections = angular.extend(compareDirections, directions);
				};

				service.isShowInSummaryActivated = function () {
					let showInSummaryRows = _.filter(service.showInSummaryCompareRowsCache, {ShowInSummary: true});
					return _.some(showInSummaryRows, (r) => {
						return r.Field === commonService.itemCompareFields.total;
					}) && !_.some(showInSummaryRows, (r) => {
						return _.includes([commonService.itemCompareFields.rank, commonService.itemCompareFields.percentage], r.Field);
					});
				};

				function isQuoteStatusReadonly(columnDef, dataContext) {
					let originalFields = commonHelperService.isPrcItemRow(dataContext.LineType) ? dataContext.parentItem.OriginalFields : dataContext.OriginalFields;
					let quoteId = commonService.getQuoteId(columnDef.id);
					let quote = _.find(originalFields, {QtnHeaderId: _.toInteger(quoteId)});
					let quoteStatus = commonService.getLookupValue('QuoteStatus', quote ? quote.StatusFk : 0);
					return quoteStatus && quoteStatus.IsReadonly;
				}

				function showAddOrInsertDialog(column, entity, controllerOptions) {
					let qtnHeaderId = commonService.getQuoteId(column.id);
					let quote = _.find(service.originalFieldsCache, {QtnHeaderId: _.toInteger(qtnHeaderId)});
					let quoteItem = _.find(entity.QuoteItems, {QuoteKey: column.field});
					if (!quote) {
						return;
					}

					let exchangeRate = commonService.getExchangeRate(quote.RfqHeaderId, quote.QtnHeaderId);
					let currencyFk = commonService.getCurrencyFk(quote.RfqHeaderId, quote.QtnHeaderId);
					let itemData = {
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
							PrcHeaderFk: quoteItem ? quoteItem.PrcHeaderId : quote.PrcHeaderId,
							ReqHeaderFk: quoteItem ? quoteItem.ReqHeaderId : quote.ReqHeaderId,
							QtnHeaderFk: quoteItem ? quoteItem.QtnHeaderId : quote.QtnHeaderId
						}
					};

					let modalOptions = {
						backdrop: false,
						width: '1200px',
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-quote-main-view.html',
						controller: 'procurementPriceComparisonCreateQuoteItemController',
						resizeable: true,
						resolve: {
							controllerOptions: function () {
								return controllerOptions;
							}
						}
					};
					let controllerService = $injector.get('procurementPriceComparisonQuoteMainControllerService');
					controllerService.itemData = itemData;
					controllerService.type = 'item';

					return platformModalService.showDialog(modalOptions).then(function (result) {
						if (result && result.needUpdate) {
							service.needUpdate.fire();
						}
					});
				}

				function createQuoteAddItemWizardButton(column, entity, disabled) {
					if (checkBidderService.isReference(column.field)) {
						return '';
					}
					return commonHelperService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.createQuoteItem', () => {
						showAddOrInsertDialog(column, entity, {
							headerText: $translate.instant('procurement.pricecomparison.wizard.createQuoteItem')
						});
					}, {
						disabled: disabled,
						icon: 'ico-boq-item-new'
					});
				}

				function createInsertItemButton(column, entity, disabled) {
					if (checkBidderService.isReference(column.field)) {
						return '';
					}
					return commonHelperService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.insertItem', () => {
						let selectedItem = _.find(entity.QuoteItems, {QuoteKey: column.field});
						let children = _.filter(entity.parentItem.Children, (c) => c.LineType === compareLineTypes.prcItem);
						let prcItems = _.reduce(children, (result, curr) => {
							let quoteItem = _.find(curr.QuoteItems, {QuoteKey: column.field});
							if (quoteItem) {
								quoteItem.Id = quoteItem.PrcItemId;
								result.push(quoteItem);
							}
							return result;
						}, []);

						let insertOptions = {
							SelectedItem: _.extend(selectedItem, {Id: selectedItem.PrcItemId}),
							PrcItems: _.sortBy(prcItems, 'ItemNo'),
							InsertBefore: false
						};

						showAddOrInsertDialog(column, entity, {
							headerText: $translate.instant('procurement.pricecomparison.wizard.insertItem'),
							insertNote: $translate.instant('procurement.pricecomparison.wizard.insertNote'),
							createParams: {
								InsertOptions: insertOptions
							}
						});
					}, {
						disabled: disabled,
						icon: 'ico-boq-item-new'
					});
				}

				commonHelperService.registerDataReader(service, readDataFunctions, commonService.constant.compareType.prcItem, () => compareDirections.isVerticalCompareRows, service.isShowInSummaryActivated);

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
