/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { Injectable, inject } from '@angular/core';
import { FieldType } from '@libs/ui/common';
import { CompareDataRowReaderBase } from '../../../model/classes/compare-data-row-reader-base.class';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareDataRowReader } from '../../../model/entities/compare-data-reader.interface';
import { CompareRowTypes } from '../../../model/constants/compare-row-types';
import { ProcurementPricecomparisonUtilService } from '../../util.service';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { DataValueTypes } from '../../../model/constants/data-value-types';
import { ProcurementPricecomparisonBidderIdentityService } from '../../bidder-identity.service';
import { CompareFields } from '../../../model/constants/compare-fields';
import { boqSummaryFields } from '../../../model/constants/boq/boq-summary-fields';
import { decimalCompareFields } from '../../../model/constants/export/boq-decimal-compare-fields';
import { booleanCompareFields } from '../../../model/constants/export/boq-bool-compare-fields';
import { integerCompareFields } from '../../../model/constants/export/boq-int-compare-fields';
import { Constants } from '../../../model/constants/constants';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareBoqDataRowReadService extends CompareDataRowReaderBase<ICompositeBoqEntity> {
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly bidderSvc = inject(ProcurementPricecomparisonBidderIdentityService);

	private formatEvaluationValue(dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) {
		if (_.isFunction(columnDef.domain)) {
			columnDef.domain(dataContext, columnDef);
		}
		return _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
	}

	private createTotalCellReader() {
		return this.createCellReader({
			compareValue: (columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
				return this.utilSvc.isLineValueColumn(columnDef);
			},
			readValue: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
				return this.utilSvc.isLineValueColumn(columnDef) && dataContext.totals
					? dataContext.totals[columnDef.field as string]
					: this.utilSvc.getAverageMaxMinValue(dataContext, columnDef);
			},
			readValueType: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, isShowInSummaryActivated: boolean) => {
				return DataValueTypes.decimal;
			}
		});
	}

	private readCompareFieldRowValue(dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) {
		let originalValue: unknown;
		const quoteKey = columnDef.isVerticalCompareRows ? columnDef.quoteKey as string : columnDef.field as string;
		const bidderValueProp = columnDef.isVerticalCompareRows ? columnDef.field as string : quoteKey as string;
		const compareField = this.utilSvc.getBoqCompareField(dataContext, columnDef);
		const boqItem = this.utilSvc.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
		if (boqItem && this.utilSvc.isBoqPositionRow(boqItem.LineTypeFk)) {
			switch (compareField) {
				case CompareFields.percentage:
					originalValue = this.bidderSvc.isNotReference(quoteKey) && boqItem.percentages ? boqItem.percentages[quoteKey] : null;
					break;
				case CompareFields.rank:
					originalValue = this.bidderSvc.isNotReference(quoteKey) && boqItem.ranks ? boqItem.ranks[quoteKey] : null;
					break;
				case CompareFields.finalPrice:
				case CompareFields.finalPriceOc:
					originalValue = dataContext[bidderValueProp];
					if (boqItem && boqItem.QuoteItems) {
						const currQtnItem = _.find(boqItem.QuoteItems, {QuoteKey: quoteKey});
						if (currQtnItem && (_.includes([3, 5], currQtnItem.BasItemType2Fk) || _.includes([2], currQtnItem.BasItemTypeFk))) {
							originalValue = currQtnItem[compareField + '_BaseAlt'];
						}
					}
					break;
				default:
					originalValue = dataContext[bidderValueProp];
					break;
			}
		} else if (boqItem && this.utilSvc.isBoqRootRow(boqItem.LineTypeFk)) {
			originalValue = dataContext[bidderValueProp];
		} else {
			originalValue = dataContext[bidderValueProp];
		}
		return this.isInvalidValue(originalValue) ? null : originalValue;
	}

	public override formatValue(dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, field?: string, value?: unknown,) {
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
		} else if (field === CompareFields.quantity) {
			rs = this.utilSvc.formatValue(FieldType.Quantity, 0, 0, value, columnDef, dataContext);
		} else if (field === CompareFields.isLumpsum) {
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
		} else if (field === CompareFields.included) {
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
		} else if (field === CompareFields.price || field === CompareFields.priceOc) {
			if (!columnDef.isVerticalCompareRows) {
				if (!this.bidderSvc.isReference(columnDef.field)) {
					const parentItem = dataContext.parentItem;
					const targetItem = parentItem ? _.find(parentItem.QuoteItems, item => item.QuoteKey === columnDef.field) : null;
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
			rs = this.utilSvc.formatValue(FieldType.Money, 0, 0, value, columnDef, dataContext);
		}

		return _.toString(rs);
	}

	public override createDataRowReaders(): ICompareDataRowReader<ICompositeBoqEntity>[] {
		return [
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => {
					return dataContext.LineTypeFk === CompareRowTypes.grandTotal;
				},
				cell: [
					this.createTotalCellReader()
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => {
					return dataContext.LineTypeFk === CompareRowTypes.evaluatedTotal;
				},
				cell: [
					this.createTotalCellReader()
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => {
					return dataContext.LineTypeFk === CompareRowTypes.grandTotalRank;
				},
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.bidderSvc.isNotReference(columnDef.field) ? dataContext[columnDef.field as string] : null;
						},
						readValueType: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.integer;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity) => {
					return boqSummaryFields.includes(dataContext.LineTypeFk);
				},
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValueType: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => {
					return dataContext.LineTypeFk === CompareRowTypes.rfq;
				},
				cell: [
					this.createTotalCellReader()
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => {
					return dataContext.LineTypeFk === CompareRowTypes.requisition;
				},
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValueType: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, isShowInSummaryActivated: boolean) => {
							return isShowInSummaryActivated ? DataValueTypes.decimal : null;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => dataContext.LineTypeFk === CompareRowTypes.quoteExchangeRate,
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.utilSvc.isLineValueColumn(columnDef);
						},
						readValue: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.bidderSvc.isNotReference(columnDef.field) ? dataContext[columnDef.field as string] : null;
						},
						readValueType: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, isShowInSummaryActivated: boolean) => {
							return DataValueTypes.decimal;
						}
					})
				]
			}),
			this.createRowReader({
				compareValue: (dataContext: ICompositeBoqEntity, isVerticalCompareRows: boolean) => {
					return isVerticalCompareRows ? this.utilSvc.isBoqRow(dataContext.LineTypeFk) : dataContext.LineTypeFk === CompareRowTypes.compareField;
				},
				cell: [
					this.createCellReader({
						compareValue: (columnDef: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
							// Handling compare row field only.
							return (this.utilSvc.isBidderColumn(columnDef) && (isVerticalCompareRows ? !this.utilSvc.isLineValueColumn(columnDef) : this.utilSvc.isLineValueColumn(columnDef)));
						},
						readValue: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							return this.readCompareFieldRowValue(dataContext, columnDef);
						},
						readFormattedValue: (row: number, cell: number, dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							const originalValue = this.readCompareFieldRowValue(dataContext, columnDef);
							let formattedValue: unknown;
							const isVerticalCompareRows = columnDef.isVerticalCompareRows;
							const quoteKey = isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
							const compareField = this.utilSvc.getBoqCompareField(dataContext, columnDef);
							const bidderValueProp = isVerticalCompareRows ? columnDef.id as string : quoteKey as string;
							const boqItem = this.utilSvc.tryGetParentItem(dataContext, isVerticalCompareRows);
							if (boqItem && this.utilSvc.isBoqPositionRow(boqItem.LineTypeFk)) {
								if (compareField === CompareFields.percentage) {
									formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.formatValue(dataContext, columnDef, compareField, originalValue);
								} else if (compareField === CompareFields.rank) {
									formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.formatValue(dataContext, columnDef, compareField, originalValue);
								} else if (_.includes([CompareFields.commentContractor, CompareFields.commentClient, CompareFields.bidderComments, CompareFields.boqTotalRank], compareField)) {
									formattedValue = this.utilSvc.encodeEntity(originalValue as string);
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
										dataContext[columnDef.field as string] = null;
									}
									if (_.isFunction(columnDef.domain)) {
										columnDef.domain(dataContext, columnDef);
									}
									formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
								} else if (_.includes([CompareFields.userDefined1, CompareFields.userDefined2, CompareFields.userDefined3, CompareFields.userDefined4, CompareFields.userDefined5, CompareFields.externalCode], compareField)) {
									formattedValue = _.escape(originalValue as string) || '';
								} else if (compareField === CompareFields.finalPrice || compareField === CompareFields.finalPriceOc) {
									formattedValue = this.formatValue(dataContext, columnDef, compareField, dataContext[bidderValueProp]);
									if (dataContext.parentItem && dataContext.parentItem.QuoteItems) {
										const currQtnItem = _.find(dataContext.parentItem.QuoteItems, {QuoteKey: quoteKey});
										if (currQtnItem && (_.includes([3, 5], currQtnItem.BasItemType2Fk) || _.includes([2], currQtnItem.BasItemTypeFk))) {
											formattedValue = '( ' + this.formatValue(dataContext, columnDef, compareField + '_BaseAlt', originalValue) + ' )';
										}
									}
								} else if (compareField === CompareFields.uomFk) {
									formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.utilSvc.uomLookupFormatter(row, cell, dataContext[bidderValueProp], dataContext, columnDef);
								} else if (compareField === CompareFields.prjChangeFk) {
									formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.utilSvc.projectChangeFormatter(row, cell, originalValue);
								} else if (compareField === CompareFields.prjChangeStatusFk) {
									formattedValue = this.bidderSvc.isReference(quoteKey) ? Constants.tagForNoQuote : this.utilSvc.projectChangeStatusFormatter(row, cell, originalValue);
								} else {
									formattedValue = this.formatValue(dataContext, columnDef, compareField, dataContext[bidderValueProp]);
								}
							} else if (boqItem && this.utilSvc.isBoqRootRow(boqItem.LineTypeFk)) {
								if (this.utilSvc.isIncludedCompareRowOnBoqRoot(compareField)) {
									if (_.includes([CompareFields.boqTotalRank], compareField)) {
										formattedValue = dataContext[bidderValueProp];
									} else if (compareField === CompareFields.prcItemEvaluationFk) {
										formattedValue = this.formatEvaluationValue(dataContext, columnDef);
									} else {
										formattedValue = this.formatValue(dataContext, columnDef, compareField, dataContext[bidderValueProp]);
									}
								} else {
									formattedValue = this.formatValue(dataContext, columnDef, compareField, dataContext[bidderValueProp]);
								}
							} else {
								if (compareField === CompareFields.prcItemEvaluationFk) {
									formattedValue = this.formatEvaluationValue(dataContext, columnDef);
								} else {
									formattedValue = this.formatValue(dataContext, columnDef, compareField, dataContext[bidderValueProp]);
								}
							}
							return _.toString(formattedValue);
						},
						readValueType: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							let valueType: string | undefined = undefined;
							const compareField = this.utilSvc.getBoqCompareField(dataContext, columnDef);
							const boqItem = this.utilSvc.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
							if (boqItem && this.utilSvc.isBoqRow(boqItem.LineTypeFk)) {
								if (_.includes(decimalCompareFields, compareField)) {
									valueType = DataValueTypes.decimal;
								} else if (_.includes(booleanCompareFields, compareField)) {
									valueType = DataValueTypes.boolean;
								} else if (_.includes(integerCompareFields, compareField)) {
									valueType = DataValueTypes.integer;
								} else {
									valueType = undefined;
								}
							}
							return valueType;
						},
						readFormatCode: (dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>) => {
							let formatCode = null;
							const compareField = this.utilSvc.getBoqCompareField(dataContext, columnDef);
							const boqItem = this.utilSvc.tryGetParentItem(dataContext, columnDef.isVerticalCompareRows);
							if (boqItem && this.utilSvc.isBoqRow(boqItem.LineTypeFk)) {
								if (_.includes([CompareFields.percentage], compareField)) {
									formatCode = '0.00%';
								}
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