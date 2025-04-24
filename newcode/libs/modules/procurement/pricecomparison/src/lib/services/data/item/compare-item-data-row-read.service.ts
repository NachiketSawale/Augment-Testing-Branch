/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import _ from 'lodash';
import { FieldType } from '@libs/ui/common';
import { CompareDataRowReaderBase } from '../../../model/classes/compare-data-row-reader-base.class';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { ICompareDataRowReader } from '../../../model/entities/compare-data-reader.interface';
import { ProcurementPricecomparisonUtilService } from '../../util.service';
import { DataValueTypes } from '../../../model/constants/data-value-types';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { CompareRowTypes } from '../../../model/constants/compare-row-types';
import { ProcurementPricecomparisonBidderIdentityService } from '../../bidder-identity.service';
import { CompareFields } from '../../../model/constants/compare-fields';
import { Constants } from '../../../model/constants/constants';
import { Co2Fields } from '../../../model/constants/co2-fields';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareItemDataRowReadService extends CompareDataRowReaderBase<ICompositeItemEntity> {
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly bidderSvc = inject(ProcurementPricecomparisonBidderIdentityService);

	private readCompareFieldRowValue(dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) {
		let originalValue: unknown;
		const quoteKey = columnDef.isVerticalCompareRows ? columnDef.quoteKey as string : columnDef.field as string;
		const bidderValueProp = columnDef.isVerticalCompareRows ? columnDef.field as string : quoteKey as string;
		const compareField = this.utilSvc.getPrcCompareField(dataContext, columnDef);
		const prcItem = this.utilSvc.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
		const quoteItem = prcItem && prcItem.QuoteItems ? _.find(prcItem.QuoteItems, {QuoteKey: quoteKey}) : null;

		switch (compareField) {
			case CompareFields.percentage:
				originalValue = this.bidderSvc.isNotReference(quoteKey) && prcItem && prcItem.percentages ? prcItem.percentages[quoteKey] : null;
				break;
			case CompareFields.rank:
				originalValue = this.bidderSvc.isNotReference(quoteKey) && prcItem && prcItem.ranks ? prcItem.ranks[quoteKey] : null;
				break;
			case CompareFields.co2Project:
			case CompareFields.co2ProjectTotal:
			case CompareFields.co2Source:
			case CompareFields.co2SourceTotal: {
				originalValue = _.get(quoteItem, compareField);
				break;
			}
			default:
				originalValue = dataContext[bidderValueProp];
				break;
		}
		return this.isInvalidValue(originalValue) ? null : originalValue;
	}

	public override formatValue(dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, field?: string, value?: unknown) {
		let rs = value;
		if (value === null || value === undefined) {
			return '';
		}

		if (field === CompareFields.rank) {
			rs = Constants.tagForNoQuote;
			if (_.isNumber(value) && !isNaN(value)) {
				rs = this.utilSvc.formatValue(FieldType.Integer, 0, 0, value, columnDef, dataContext);
			}
		} else if (field === CompareFields.percentage) {
			rs = Constants.tagForNoQuote;
			if (_.isNumber(value) && !isNaN(value)) {
				rs = this.utilSvc.formatValue(FieldType.Percent, 0, 0, value, columnDef, dataContext) + ' %';
			}
		} else if (_.includes(Co2Fields, field)) {
			rs = this.utilSvc.formatValue(FieldType.Quantity, 0, 0, value, columnDef, dataContext);
		} else if (field === CompareFields.isFreeQuantity) {
			if (Constants.tagForNoQuote === value) {
				return value;
			}
			columnDef.formatterOptions = undefined;
			rs = this.utilSvc.formatValue(FieldType.Boolean, 0, 0, value, columnDef, dataContext);
		} else if (field === CompareFields.exQtnIsEvaluated) {
			if (Constants.tagForNoQuote === value) {
				return value;
			}
			columnDef.formatterOptions = undefined;
			rs = this.utilSvc.formatValue(FieldType.Boolean, 0, 0, value, columnDef, dataContext);
		} else if (field === CompareFields.notSubmitted) {
			if (Constants.tagForNoQuote === value) {
				return value;
			}
			columnDef.formatterOptions = undefined;
			rs = this.utilSvc.formatValue(FieldType.Boolean, 0, 0, value, columnDef, dataContext);
		} else if (field === CompareFields.price || field === CompareFields.priceOc) {
			if (!columnDef.isVerticalCompareRows) {
				if (!this.bidderSvc.isReference(columnDef.field)) {
					const parentItem = dataContext.parentItem;
					const targetItem = parentItem && parentItem.QuoteItems ? _.find(parentItem.QuoteItems, item => item.QuoteKey === columnDef.field) : null;
					if (targetItem && targetItem.NotSubmitted) {
						rs = Constants.tagForNoQuote;
					}
				}
			} else {
				const targetItem = _.find(dataContext.QuoteItems, item => item.QuoteKey === columnDef.quoteKey);
				if (targetItem && targetItem.NotSubmitted) {
					rs = Constants.tagForNoQuote;
				}
			}
		} else if (_.isNumber(value) && !isNaN(value)) { // default, if it's a number, 2 decimals
			const columnInfo: CompareGridColumn<ICompositeItemEntity> = {
				...columnDef,
				formatterOptions: field ? this.utilSvc.assignDecimalPlacesOptions({}, field) : undefined
			};
			if (field === CompareFields.quantity) {
				rs = this.utilSvc.formatValue(FieldType.Quantity, 0, 0, value, columnInfo, dataContext);
			} else {
				rs = this.utilSvc.formatValue(FieldType.Money, 0, 0, value, columnInfo, dataContext);
			}
		}

		return _.toString(rs);
	}

	public override createDataRowReaders(): ICompareDataRowReader<ICompositeItemEntity>[] {
		return [
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => {
					return dataContext.LineTypeFk === CompareRowTypes.grandTotal || dataContext.LineTypeFk === CompareRowTypes.subTotal;
				},
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return dataContext.totals ? dataContext.totals[columnDef.field as string] : 0;
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.evaluatedTotal,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return dataContext[columnDef.field as string];
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.grandTotalRank,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.bidderSvc.isNotReference(columnDef.field) ? dataContext[columnDef.field as string] : null;
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.integer;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.rfq,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return dataContext.totals ? dataContext.totals[columnDef.field as string] : 0;
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.requisition,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return dataContext.totals ? dataContext.totals[columnDef.field as string] : 0;
						},
						readValueType: function (dataContext, columnDef, isShowInSummaryActivated) {
							return isShowInSummaryActivated ? DataValueTypes.decimal : null;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.quoteExchangeRate,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.bidderSvc.isNotReference(columnDef.field) ? dataContext[columnDef.field as string] : null;
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.quoteNewItemTotal,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							const quoteNewItems = _.filter(dataContext.Children, {QuoteKey: columnDef.field});
							return _.sumBy(_.map(quoteNewItems || [], CompareFields.total));
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.quoteNewItem,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return dataContext['QuoteKey'] === columnDef.field ? (dataContext[CompareFields.total] || 0) : null;
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeItemEntity, isVerticalCompareRows: boolean) => {
					return isVerticalCompareRows ? dataContext.LineTypeFk === CompareRowTypes.prcItem : dataContext.LineTypeFk === CompareRowTypes.compareField;
				},
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
							// Handling compare row field only.
							return this.utilSvc.isBidderColumn(columnDef) && (isVerticalCompareRows ? !this.utilSvc.isLineValueColumn(columnDef) : this.utilSvc.isLineValueColumn(columnDef));
						},
						readValue: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							return this.readCompareFieldRowValue(dataContext, columnDef);
						},
						readFormattedValue: (row: number, cell: number, dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							const originalValue = this.readCompareFieldRowValue(dataContext, columnDef);
							let formattedValue: unknown;
							const isVerticalCompareRows = columnDef.isVerticalCompareRows;
							const quoteKey = isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
							const compareField = this.utilSvc.getPrcCompareField(dataContext, columnDef);
							const bidderValueProp = isVerticalCompareRows ? columnDef.id as string : quoteKey as string;

							if (compareField === CompareFields.percentage) {
								formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.formatValue(dataContext, columnDef, compareField, originalValue);
							} else if (compareField === CompareFields.rank) {
								formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.formatValue(dataContext, columnDef, compareField, originalValue);
							} else if (_.includes([CompareFields.userDefined1, CompareFields.userDefined2, CompareFields.userDefined3, CompareFields.userDefined4, CompareFields.userDefined5, CompareFields.discountComment, CompareFields.externalCode], compareField)) {
								formattedValue = _.escape(originalValue as string) || '';
							} else if (compareField === CompareFields.prcItemEvaluationFk) {
								if (_.isFunction(columnDef.domain)) {
									columnDef.domain(dataContext, columnDef);
								}
								formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
							} else if (compareField === CompareFields.prcPriceConditionFk) {
								if (_.isFunction(columnDef.domain)) {
									columnDef.domain(dataContext, columnDef);
								}
								formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
							} else if (compareField === CompareFields.alternativeBid) {
								if (!originalValue) {
									dataContext[bidderValueProp] = null;
								}
								if (_.isFunction(columnDef.domain)) {
									columnDef.domain(dataContext, columnDef);
								}
								formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
							} else if (compareField === CompareFields.commentClient || compareField === CompareFields.commentContractor) {
								formattedValue = this.utilSvc.encodeEntity(originalValue as string);
							} else if (compareField === CompareFields.uomFk) {
								formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.utilSvc.uomLookupFormatter(row, cell, originalValue, dataContext, columnDef);
							} else if (_.includes([CompareFields.paymentTermPaFk, CompareFields.paymentTermFiFk], compareField)) {
								if (_.isFunction(columnDef.domain)) {
									columnDef.domain(dataContext, columnDef);
								}
								formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
							} else if (compareField === CompareFields.prjChangeFk) {
								formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.utilSvc.projectChangeFormatter(row, cell, originalValue);
							} else if (compareField === CompareFields.prjChangeStatusFk) {
								formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.utilSvc.projectChangeStatusFormatter(row, cell, originalValue);
							} else {
								formattedValue = this.formatValue(dataContext, columnDef, compareField, originalValue);
							}
							return _.toString(formattedValue);
						},
						readValueType: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							let valueType: string | undefined;
							const compareField = this.utilSvc.getPrcCompareField(dataContext, columnDef);
							switch (compareField) {
								case CompareFields.percentage:
								case CompareFields.price:
								case CompareFields.priceOc:
								case CompareFields.total:
								case CompareFields.totalOC:
								case CompareFields.totalNoDiscount:
								case CompareFields.totalOcNoDiscount:
								case CompareFields.totalPrice:
								case CompareFields.totalPriceOc:
								case CompareFields.factoredTotalPrice:
								case CompareFields.quantity:
								case CompareFields.priceExtra:
								case CompareFields.priceExtraOc:
								case CompareFields.priceGross:
								case CompareFields.priceOCGross:
								case CompareFields.totalPriceGross:
								case CompareFields.totalPriceOCGross:
								case CompareFields.totalGross:
								case CompareFields.totalOCGross:
								case CompareFields.factorPriceUnit:
								case CompareFields.priceUnit:
								case CompareFields.discount:
								case CompareFields.discountSplit:
								case CompareFields.discountSplitOc:
								case CompareFields.discountAbsolute:
								case CompareFields.discountAbsoluteOc:
								case CompareFields.discountAbsoluteGross:
								case CompareFields.discountAbsoluteGrossOc:
								case CompareFields.absoluteDifference:
								case CompareFields.charge:
								case CompareFields.chargeOc:
									valueType = DataValueTypes.decimal;
									break;
								case CompareFields.rank:
									valueType = DataValueTypes.integer;
									break;
								default:
									valueType = undefined;
									break;
							}
							return valueType;
						},
						readFormatCode: (dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>) => {
							let formatCode = null;
							const compareField = this.utilSvc.getPrcCompareField(dataContext, columnDef);
							if (_.includes([CompareFields.percentage], compareField)) {
								formatCode = '0.00%';
							}
							return formatCode;
						}
					})
				]
			}),
			// Default reader must be the last one.
			this.createRowReader()
		];
	}
}