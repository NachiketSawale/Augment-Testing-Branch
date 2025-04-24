/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import _ from 'lodash';
import { ITaxCodeEntity } from '@libs/basics/shared';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { ICompareExportCellFormulaRule, ICompareExportRowFormulaRule } from '../../../model/entities/export/compare-export-formula-rule.interface';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { ICompareExportDataRowDic } from '../../../model/entities/export/compare-export-data-row-dic.interface';
import { ICompareExportLookupMap } from '../../../model/entities/export/compare-export-lookup-map.interface';
import { ProcurementPricecomparisonUtilService } from '../../util.service';
import { ProcurementPricecomparisonBidderIdentityService } from '../../bidder-identity.service';
import { ICompareExportBoqUserData } from '../../../model/entities/export/compare-export-user-data.interface';
import { CompareFields } from '../../../model/constants/compare-fields';
import { CompareRowTypes } from '../../../model/constants/compare-row-types';
import { ValuableLeadingFields } from '../../../model/constants/valuable-leading-fields';
import { Constants } from '../../../model/constants/constants';
import { boqSummaryFields } from '../../../model/constants/boq/boq-summary-fields';
import { BoqSummaryRowTypes } from '../../../model/constants/boq/boq-summary-row-types';
import { BoqLineType } from '../../../model/constants/boq/boq-line-type';
import { ICustomBoqItem } from '../../../model/entities/boq/custom-boq-item.interface';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareExportBoqFormulaService {
	private readonly EXCEL_MAX_FUNCTION_ARG_LENGTH = 255;
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly bidderSvc = inject(ProcurementPricecomparisonBidderIdentityService);
	private taxCodes: ITaxCodeEntity[] = [];
	private taxCodeMatrixes: IMdcTaxCodeMatrixEntity[] = [];
	private rootLevelCells = {
		createItemTotal: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: (currRow: ICompositeBoqEntity) => {
					const boqRow = isVerticalMode ? currRow : currRow.parentItem as ICompositeBoqEntity;
					if (this.utilSvc.isBoqRootRow(boqRow.LineTypeFk) || this.utilSvc.isBoqLevelRow(boqRow.LineTypeFk)) {
						return 'SUM({levelAndPositionTotal})';
					} else {
						return '{price}*{quantity}*{factor}';
					}
				},
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.itemTotal : undefined),
				expression: {
					price: this.createCompareRowFinder(CompareFields.price),
					quantity: this.createQuantityCompareRowFinder(),
					factor: this.createCompareRowFinder(CompareFields.factor),
					levelAndPositionTotal: this.createItemTotalFinder(false)
				}
			};
		},
		createItemTotalOc: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: (currRow: ICompositeBoqEntity) => {
					const boqRow = isVerticalMode ? currRow : currRow.parentItem as ICompositeBoqEntity;
					if (this.utilSvc.isBoqRootRow(boqRow.LineTypeFk) || this.utilSvc.isBoqLevelRow(boqRow.LineTypeFk)) {
						return 'SUM({levelAndPositionTotal})';
					} else {
						return '{priceOc}*{quantity}*{factor}';
					}
				},
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.itemTotalOc : undefined),
				expression: {
					priceOc: this.createCompareRowFinder(CompareFields.priceOc),
					quantity: this.createQuantityCompareRowFinder(),
					factor: this.createCompareRowFinder(CompareFields.factor),
					levelAndPositionTotal: this.createItemTotalFinder(true)
				}
			};
		},
		createDiscount: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{total}*{discount}/100',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.discount : undefined),
				expression: {
					total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
						return this.buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, CompareFields.itemTotal, dataRowDic);
					},
					discount: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
						return this.buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, CompareFields.discountPercentIT, dataRowDic);
					}
				}
			};
		},
		createSummaryInRow: (): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: 'TEXTJOIN("/",FALSE,{fields})',
				cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
					return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
				},
				expression: {
					fields: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						const rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
						const cellValue = _.isFunction(col['formatter']) ? (col['formatter'](rowIndex, colIndex, currRow[col.field as string], col, currRow) || '') : '';
						const rowValues = cellValue.replace(/<\/?.+?[^>]*>/g, '').split('/');
						const cellValues = _.map(userData.showInSummaryRows, (row, index) => {
							const expressionValue = this.buildBoqCompareRowExpression(currRow, rows, columns, col, colIndex, isVerticalCompareRows, row.Field, dataRowDic);
							return expressionValue !== null ? (_.includes(userData.decimalCompareFields, row.Field) ? _.wrap((v: string) => v, (fn, v: string) => 'FIXED(' + fn(v) + ',2)')(expressionValue) : expressionValue) : '"' + rowValues[index] + '"';
						});
						return cellValues.join(',');
					}
				},
				disabled: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => true
			};
		},
		createAbsoluteDifference: this.createAbsoluteDifference.bind(this),
		createPercentage: this.createPercentage.bind(this)
	};
	private positionCells = {
		createPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{priceOc}/{exchangeRate}',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.price : undefined),
				expression: {
					priceOc: this.createCompareRowFinder(CompareFields.priceOc),
					exchangeRate: this.utilSvc.createQuoteRowFinder(CompareRowTypes.quoteExchangeRate)
				}
			};
		},
		createDiscountedPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{discountedUnitPrice}*{quantity}*{factor}',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.discountedPrice : undefined),
				expression: {
					discountedUnitPrice: this.createCompareRowFinder(CompareFields.discountedUnitPrice),
					quantity: this.createQuantityCompareRowFinder(),
					factor: this.createCompareRowFinder(CompareFields.factor)
				}
			};
		},
		createDiscountedUnitPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{price}-({price}*{discountedPercent}/100)',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.discountedUnitPrice : undefined),
				expression: {
					price: this.createCompareRowFinder(CompareFields.price),
					discountedPercent: this.createCompareRowFinder(CompareFields.discountPercent),
				}
			};
		},
		createFinalPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{discountedPrice}+{extraIncrement}',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.finalPrice : undefined),
				expression: {
					discountedPrice: this.createCompareRowFinder(CompareFields.discountedPrice),
					extraIncrement: this.createCompareRowFinder(CompareFields.extraIncrement)
				}
			};
		},
		createFinalPriceOc: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '(({priceOc}-({priceOc}*{discountedPercent}/100))*{quantity}*{factor})+{extraIncrementOc}',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.finalPriceOc : undefined),
				expression: {
					priceOc: this.createCompareRowFinder(CompareFields.priceOc),
					discountedPercent: this.createCompareRowFinder(CompareFields.discountPercent),
					quantity: this.createQuantityCompareRowFinder(),
					factor: this.createCompareRowFinder(CompareFields.factor),
					extraIncrementOc: this.createCompareRowFinder(CompareFields.extraIncrementOc)
				}
			};
		},
		createPriceGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '({price}-({price}*{discountedPercent}/100))*(100+{VatPercent.vatPercent})/100',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.priceGross : undefined),
				expression: {
					price: this.createCompareRowFinder(CompareFields.price),
					discountedPercent: this.createCompareRowFinder(CompareFields.discountPercent),
					vatPercent: this.createVatPercentRowFinder(this.taxCodes, this.taxCodeMatrixes)
				}
			};
		},
		createPriceGrossOc: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '({priceOc}-({priceOc}*{discountedPercent}/100))*(100+{VatPercent.vatPercent})/100',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.priceGrossOc : undefined),
				expression: {
					priceOc: this.createCompareRowFinder(CompareFields.priceOc),
					discountedPercent: this.createCompareRowFinder(CompareFields.discountPercent),
					vatPercent: this.createVatPercentRowFinder(this.taxCodes, this.taxCodeMatrixes)
				}
			};
		},
		createFinalGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{finalPrice}*(100+{VatPercent.vatPercent})/100',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.finalGross : undefined),
				expression: {
					finalPrice: this.createCompareRowFinder(CompareFields.finalPrice),
					vatPercent: this.createVatPercentRowFinder(this.taxCodes, this.taxCodeMatrixes)
				}
			};
		},
		createFinalGrossOc: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{finalPriceOc}*(100+{VatPercent.vatPercent})/100',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.finalGrossOc : undefined),
				expression: {
					finalPriceOc: this.createCompareRowFinder(CompareFields.finalPriceOc),
					vatPercent: this.createVatPercentRowFinder(this.taxCodes, this.taxCodeMatrixes)
				}
			};
		},
		createExtraIncrement: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> => {
			return {
				formula: '{extraIncrementOc}/{exchangeRate}',
				cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.extraIncrement : undefined),
				expression: {
					extraIncrementOc: this.createCompareRowFinder(CompareFields.extraIncrementOc),
					exchangeRate: this.utilSvc.createQuoteRowFinder(CompareRowTypes.quoteExchangeRate)
				}
			};
		},
		createAbsoluteDifference: this.createAbsoluteDifference.bind(this),
		createPercentage: this.createPercentage.bind(this)
	};

	private buildBoqCompareRowExpression(boqRow: ICompositeBoqEntity, rows: ICompositeBoqEntity[], columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, rowType: string, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) {
		const excludeInVerticalModel = isVerticalCompareRows && this.utilSvc.isExcludedCompareRowInVerticalMode(rowType);
		const targetRowIndex = isVerticalCompareRows && !excludeInVerticalModel ? _.findIndex(rows, row => {
			return row.Id === boqRow.Id;
		}) : this.utilSvc.findIndexFromDicCache((row) => this.utilSvc.isCompareFieldRow(row.LineTypeFk) && row.rowType === rowType, boqRow.Children, dataRowDic.rows, 'Id');

		const targetColIndex = isVerticalCompareRows && !excludeInVerticalModel ? _.findIndex(columns, c => {
			return c.quoteKey === (col.quoteKey || col.field) && this.utilSvc.isBidderColumn(c) && c.originalField === rowType;
		}) : (!isVerticalCompareRows ? colIndex : _.findIndex(rows, row => {
			return row.ParentId === boqRow.Id && this.utilSvc.isCompareFieldRow(row.LineTypeFk) && row.rowType === rowType;
		}));
		return targetRowIndex !== -1 && targetColIndex !== -1 ? this.utilSvc.formatExpressionValue(targetRowIndex, targetColIndex) : '';
	}

	private createSummaryRowFinder(summaryRowType: string) {
		return (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
			const rowTypePrefix = currRow.rowType ? currRow.rowType.split('_')[0] : '';
			const rowIndex = rows.findIndex((row) => {
				return row.rowType && row.ParentId === currRow.ParentId && row.SummaryRowType === summaryRowType && row.rowType.startsWith(rowTypePrefix);
			});
			return rowIndex !== -1 && colIndex !== -1 ? this.utilSvc.formatExpressionValue(rowIndex, colIndex) : undefined;
		};
	}

	private createCompareRowIdentifier(compareField: string) {
		return (row: ICompositeBoqEntity) => {
			return this.utilSvc.isCompareFieldRow(row.LineTypeFk) && row.rowType === compareField;
		};
	}

	private createCompareColumnIdentifier(isVerticalMode?: boolean, compareField?: string) {
		return isVerticalMode ? (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>) => {
			return isVerticalMode && this.utilSvc.isBidderColumn(column) && this.bidderSvc.isNotReference(column.quoteKey) && column.originalField === compareField && row.QuoteItems.some(item => item.QuoteKey === column.quoteKey);
		} : (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>) => {
			return this.utilSvc.isBidderColumn(column) && this.bidderSvc.isNotReference(column.field) && row.parentItem?.QuoteItems.some(item => item.QuoteKey === column.field);
		};
	}

	private createCompareRowFinder(compareField: string) {
		return (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
			const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
			return this.buildBoqCompareRowExpression(boqRow, rows, columns, col, colIndex, isVerticalCompareRows, compareField, dataRowDic);
		};
	}

	private createVatPercentRowFinder(taxCode: ITaxCodeEntity[], taxCodeMatrixes: IMdcTaxCodeMatrixEntity[]) {
		return (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
			const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
			const quoteKey = (isVerticalCompareRows ? col.quoteKey : col.field) as string;
			const target = _.find(boqRow.QuoteItems, item => item.QuoteKey === quoteKey) as ICustomBoqItem;
			const quote = _.find(lookupMap.Quote, {Id: target.QtnHeaderId});
			const taxCodeFk = this.utilSvc.tryGetTaxCodeFK(currRow, userData.boqRows, quoteKey, quote?.TaxCodeFk, true);
			return this.utilSvc.getVatPercentExpressionValue(taxCode, taxCodeMatrixes, taxCodeFk, quote?.BpdVatGroupFk);
		};
	}

	private buildRootFinalPriceExpression(boqRoots: ICompositeBoqEntity[], rows: ICompositeBoqEntity[], columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, isOcValue: boolean, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>, notJoin?: boolean) {
		const results = boqRoots.map(root => {
			const beforeDiscountExpression = this.buildBoqCompareRowExpression(root, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue ? CompareFields.itemTotalOc : CompareFields.itemTotal, dataRowDic);
			const discountPercentExpression = this.buildBoqCompareRowExpression(root, rows, columns, col, colIndex, isVerticalCompareRows, CompareFields.discountPercentIT, dataRowDic);
			const discountAbsoluteExpression = this.buildBoqCompareRowExpression(root, rows, columns, col, colIndex, isVerticalCompareRows, CompareFields.discount, dataRowDic);
			return '(' + beforeDiscountExpression + '-' + 'MAX(' + beforeDiscountExpression + '*' + discountPercentExpression + '/100' + ',' + discountAbsoluteExpression + '))';
		});
		return notJoin ? results : results.join(',');
	}

	private buildPositionFinalPriceExpression(positions: ICompositeBoqEntity[], rows: ICompositeBoqEntity[], columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, isOcValue: boolean, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) {
		return positions.map(p => {
			return this.buildBoqCompareRowExpression(p, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue ? CompareFields.finalPriceOc : CompareFields.finalPrice, dataRowDic);
		});
	}

	private findSummaryTotalRows(rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) {
		let results: number[][] = [];
		const children = currRow.parentItem?.Children as ICompositeBoqEntity[];
		let levelFilter: number;
		let positionFilter: (item: ICustomBoqItem) => boolean;
		switch (currRow.LineTypeFk) {
			case CompareRowTypes.summaryStandardTotal:
				levelFilter = CompareRowTypes.summaryStandardDiscountTotal;
				positionFilter = (item: ICustomBoqItem) => this.utilSvc.isStandardBoq(item.BasItemTypeFk, item.BasItemType2Fk);
				break;
			case CompareRowTypes.summaryOptionalITTotal:
				levelFilter = CompareRowTypes.summaryOptionalITDiscountTotal;
				positionFilter = (item: ICustomBoqItem) => this.utilSvc.isOptionalWithItBoq(item.BasItemTypeFk, item.BasItemType2Fk);
				break;
			case CompareRowTypes.summaryOptionalWITTotal:
				levelFilter = CompareRowTypes.summaryOptionalWITDiscountTotal;
				positionFilter = (item: ICustomBoqItem) => this.utilSvc.isOptionalWithoutItBoq(item.BasItemTypeFk);
				break;
			case CompareRowTypes.summaryAlternativeTotal:
				levelFilter = CompareRowTypes.summaryAlternativeDiscountTotal;
				positionFilter = (item: ICustomBoqItem) => this.utilSvc.isAlternativeBoq(item.BasItemType2Fk);
				break;
			case CompareRowTypes.summaryGrandTotal:
				levelFilter = CompareRowTypes.summaryGrandDiscountTotal;
				positionFilter = (item: ICustomBoqItem) => true;
				break;
		}

		const levelChildren = children.filter(child => this.utilSvc.isBoqLevelRow(child.LineTypeFk));
		const positionChildren = children.filter(child => {
			return this.utilSvc.isBoqPositionRow(child.LineTypeFk) && child.QuoteItems.some(item => item.QuoteKey === col.field && positionFilter(item));
		});

		if (levelChildren.length) {
			const targetRows = _.reduce<ICompositeBoqEntity, ICompositeBoqEntity[]>(levelChildren, (rows, row) => {
				const childTotalRows = row.Children.filter((c) => col.field && c.LineTypeFk === levelFilter && !_.includes([undefined], c[col.field]));
				return _.concat(rows, childTotalRows);
			}, []);
			const targetResults = targetRows.map(r => {
				return [this.utilSvc.findIndexByKeyFromDicCache(r.Id, dataRowDic.rows), colIndex];
			});
			results = results.concat(targetResults);
		}

		if (positionChildren.length) {
			let targetResults: Array<[number, number]>;
			if (isVerticalCompareRows) {
				targetResults = positionChildren.map(r => {
					const rowIndex = this.utilSvc.findIndexByKeyFromDicCache<ICompositeBoqEntity, string>(r.Id, dataRowDic.rows);
					const targetColIndex = _.findIndex(columns, c => {
						return c.quoteKey === col.field && this.utilSvc.isBidderColumn(c) && c.originalField === CompareFields.finalPrice;
					});
					return [rowIndex, targetColIndex];
				});
			} else {
				const targetRows = positionChildren.reduce<ICompositeBoqEntity[]>((rows, row) => {
					const childTotalRows = _.filter(row.Children, (c) => c.LineTypeFk === CompareRowTypes.compareField && c.rowType === CompareFields.finalPrice);
					return rows.concat(childTotalRows);
				}, []);
				targetResults = targetRows.map(r => {
					return [this.utilSvc.findIndexByKeyFromDicCache(r.Id, dataRowDic.rows), colIndex];
				});
			}
			results = results.concat(targetResults);
		}

		return results;
	}

	private findLeadingField(rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData) {
		let leadingField = userData.leadingField;
		const visibleRow = userData.visibleCompareRows.find(e => e.Field === CompareFields.absoluteDifference) as ICompareRowEntity;
		if (!_.includes(ValuableLeadingFields, leadingField)) {
			return null;
		}
		if (visibleRow.Field === CompareFields.absoluteDifference || visibleRow.Field === CompareFields.percentage) {
			switch (visibleRow.DeviationReference) {
				case 10:
					leadingField = CompareFields.price;
					break;
				case 11: {
					leadingField = CompareFields.itemTotal;
					break;
				}
				default:
					break;
			}
		}
		const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
		if (boqRow && (this.utilSvc.isBoqRootRow(boqRow.LineTypeFk) || this.utilSvc.isBoqLevelRow(boqRow.LineTypeFk))) {
			leadingField = CompareFields.itemTotal;
		}
		return this.utilSvc.getFieldCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, leadingField);
	}

	private findDeviationReference(rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData) {
		const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
		let leadingField = userData.leadingField;
		if (this.utilSvc.isBoqRootRow(boqRow.LineTypeFk) || this.utilSvc.isBoqLevelRow(boqRow.LineTypeFk)) {
			leadingField = CompareFields.itemTotal;
		}
		return this.utilSvc.getDeviationReferenceFieldIndex(rows, currRow, columns, colIndex, isVerticalCompareRows, leadingField, userData.visibleCompareRows, userData.visibleCompareColumns);
	}

	private findBidderReference(rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData) {
		const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
		let leadingField = userData.leadingField;
		if (this.utilSvc.isBoqRootRow(boqRow.LineTypeFk) || this.utilSvc.isBoqLevelRow(boqRow.LineTypeFk)) {
			leadingField = CompareFields.itemTotal;
		}
		return this.utilSvc.getBidderReferenceFieldIndex(rows, currRow, columns, isVerticalCompareRows, leadingField);
	}

	private createAbsoluteDifference(isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> {
		return {
			formula: this.utilSvc.deviationDifferenceFormula.bind(this.utilSvc),
			cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.absoluteDifference : undefined),
			expression: {
				leadingField: this.findLeadingField.bind(this),
				deviationReference: this.findDeviationReference.bind(this),
				bidderReference: this.findBidderReference.bind(this)
			}
		};
	}

	private createPercentage(isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> {
		return {
			formula: this.utilSvc.percentageFormula.bind(this.utilSvc),
			cell: this.createCompareColumnIdentifier(isVerticalMode, isVerticalMode ? CompareFields.percentage : undefined),
			expression: {
				leadingField: this.findLeadingField.bind(this),
				deviationReference: this.findDeviationReference.bind(this),
				bidderReference: this.findBidderReference.bind(this)
			}
		};
	}

	private createItemTotalFinder(isOcValue: boolean) {
		return (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
			const totalExpressions = [];
			const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
			const quoteKey = isVerticalCompareRows ? col.quoteKey : col.field;

			const levels = _.filter(boqRow.Children, item => this.utilSvc.isBoqLevelRow(item.LineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === quoteKey));
			const positions = _.filter(boqRow.Children, item => {
				return this.utilSvc.isBoqPositionRow(item.LineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === quoteKey && this.utilSvc.isItemWithITBoq(x.BasItemTypeFk, x.BasItemType2Fk)) && !this.utilSvc.isBoqDisabledOrNA(item);
			});

			if (levels.length) {
				totalExpressions.push(this.buildRootFinalPriceExpression(levels, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue, dataRowDic, true));
			}

			if (positions.length) {
				totalExpressions.push(this.buildPositionFinalPriceExpression(positions, rows, columns, col, colIndex, isVerticalCompareRows, isOcValue, dataRowDic));
			}

			const mergeExpression = _.concat(...totalExpressions);
			return mergeExpression.length > this.EXCEL_MAX_FUNCTION_ARG_LENGTH ? _.chunk(mergeExpression, this.EXCEL_MAX_FUNCTION_ARG_LENGTH).map(group => {
				return 'SUM(' + group.join(',') + ')';
			}).join(',') : mergeExpression.join(',');
		};
	}

	private hasSummaryRowValid(rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, col: CompareGridColumn<ICompositeBoqEntity>, summaryRowType: string) {
		const rowTypePrefix = currRow.rowType ? currRow.rowType.split('_')[0] : '';
		return this.utilSvc.isLineValueColumn(col) && this.bidderSvc.isNotReference(col.field) && _.some(rows, row => {
			return row.rowType && col.field && row.ParentId === currRow.ParentId && row.SummaryRowType === summaryRowType && row.rowType.startsWith(rowTypePrefix) && !_.includes([undefined], row[col.field] as string);
		});
	}

	private createQuantityCompareRowFinder() {
		return (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
			const boqRow = isVerticalCompareRows ? currRow : currRow.parentItem as ICompositeBoqEntity;
			const compareField = userData.isCalculateAsPerAdjustedQuantity ? CompareFields.quantityAdj : CompareFields.quantity;
			return this.buildBoqCompareRowExpression(boqRow as ICompositeBoqEntity, rows, columns, col, colIndex, isVerticalCompareRows, compareField, dataRowDic);
		};
	}

	private createRootLevelTotalStatisticCells(): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData>[] {
		return [
			this.createRootLevelStaticsCell(Constants.maxValueIncludeTarget, 'MAX'),
			this.createRootLevelStaticsCell(Constants.maxValueExcludeTarget, 'MAX'),
			this.createRootLevelStaticsCell(Constants.minValueIncludeTarget, 'MIN'),
			this.createRootLevelStaticsCell(Constants.minValueExcludeTarget, 'MIN'),
			this.createRootLevelStaticsCell(Constants.averageValueIncludeTarget, 'AVERAGE'),
			this.createRootLevelStaticsCell(Constants.averageValueExcludeTarget, 'AVERAGE')
		];
	}

	private createRootLevelStaticsCell(compareField: string, fnName: string): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> {
		return {
			formula: fnName + '({total})',
			cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
				return column.field === compareField;
			},
			expression: {
				total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
					let bidderColumns = isVerticalCompareRows
						? _.filter(columns, c => this.utilSvc.isBidderColumn(c) && this.bidderSvc.isNotReference(c.quoteKey) && !c.isIdealBidder && c.originalField === CompareFields.itemTotal)
						: _.filter(columns, c => this.utilSvc.isBidderColumn(c) && this.bidderSvc.isNotReference(c.field) && !c.isIdealBidder);

					if (!this.utilSvc.isExcludeTargetColumn(col)) {
						const countInTargetColumnIds = _.filter(userData.visibleCompareColumns, item => item.IsCountInTarget).map(item => item.Id);
						bidderColumns = _.filter(bidderColumns, bidderColumn => {
							return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
						});
					}

					const quoteKeys = _.map(currRow.QuoteItems, item => item.QuoteKey);
					bidderColumns = _.filter(bidderColumns, bidderColumn => {
						return _.indexOf(quoteKeys, bidderColumn.id) > -1;
					});

					const levels = _.filter(currRow.Children, item => this.utilSvc.isBoqLevelRow(item.LineTypeFk));
					const positions = _.filter(currRow.Children, item => {
						return this.utilSvc.isBoqPositionRow(item.LineTypeFk) && !this.utilSvc.isBoqDisabledOrNA(item);
					});

					const totalExpressions: string[] = [];
					if (levels.length || positions.length) {
						_.forEach(bidderColumns, c => {
							const currColIndex = _.findIndex(columns, item => item.id === c.id);
							const levelExpressions = this.buildRootFinalPriceExpression(levels, rows, columns, c, currColIndex, isVerticalCompareRows, false, dataRowDic, true);
							const positionExpressions = this.buildPositionFinalPriceExpression(positions, rows, columns, c, currColIndex, isVerticalCompareRows, false, dataRowDic);

							const mergeExpression = (levelExpressions as string[]).concat(positionExpressions);
							const resultExpression = mergeExpression.length > this.EXCEL_MAX_FUNCTION_ARG_LENGTH ? _.chunk(mergeExpression, this.EXCEL_MAX_FUNCTION_ARG_LENGTH).map(group => {
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

	private createRfqTotalStatisticCells(): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData>[] {
		return [
			this.createRfqReqTotalStatisticCell(Constants.maxValueIncludeTarget, 'MAX'),
			this.createRfqReqTotalStatisticCell(Constants.maxValueExcludeTarget, 'MAX'),
			this.createRfqReqTotalStatisticCell(Constants.minValueIncludeTarget, 'MIN'),
			this.createRfqReqTotalStatisticCell(Constants.minValueExcludeTarget, 'MIN'),
			this.utilSvc.createStatisticCell(Constants.averageValueIncludeTarget, CompareFields.itemTotal),
			this.utilSvc.createStatisticCell(Constants.averageValueExcludeTarget, CompareFields.itemTotal)
		];
	}

	private createRequisitionTotalStatisticCells(): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData>[] {
		return [
			this.createRfqReqTotalStatisticCell(Constants.maxValueIncludeTarget, 'MAX'),
			this.createRfqReqTotalStatisticCell(Constants.maxValueExcludeTarget, 'MAX'),
			this.createRfqReqTotalStatisticCell(Constants.minValueIncludeTarget, 'MIN'),
			this.createRfqReqTotalStatisticCell(Constants.minValueExcludeTarget, 'MIN'),
			this.createRequisitionAverageCell(Constants.averageValueIncludeTarget),
			this.createRequisitionAverageCell(Constants.averageValueExcludeTarget)
		];
	}

	private createRfqReqTotalStatisticCell(compareField: string, fnName: string): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> {
		return {
			formula: fnName + '({total})',
			cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
				return column.field === compareField;
			},
			expression: {
				total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
					const totalExpressions: string[] = [];
					let bidderColumns = isVerticalCompareRows
						? _.filter(columns, c => this.utilSvc.isLineValueColumn(c) && this.bidderSvc.isNotReference(c.quoteKey) && !c.isIdealBidder)
						: _.filter(columns, c => this.utilSvc.isLineValueColumn(c) && this.bidderSvc.isNotReference(c.field) && !c.isIdealBidder);
					if (!this.utilSvc.isExcludeTargetColumn(col)) {
						const countInTargetColumnIds = _.filter(userData.visibleCompareColumns, item => item.IsCountInTarget).map(item => item.Id);
						bidderColumns = _.filter(bidderColumns, bidderColumn => {
							return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
						});
					}
					_.forEach(bidderColumns, c => {
						const currColIndex = _.findIndex(columns, item => item.id === c.id);
						const currRowIndex = this.utilSvc.findIndexByKeyFromDicCache(currRow.Id, dataRowDic.rows);
						totalExpressions.push(this.utilSvc.formatExpressionValue(currRowIndex, currColIndex));
					});
					return totalExpressions.join(',');
				}
			}
		};
	}

	private createRequisitionAverageCell(compareField: string): ICompareExportCellFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData> {
		return {
			formula: 'AVERAGE({total})',
			cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
				return column.field === compareField;
			},
			expression: {
				total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
					const boqRoots = _.filter(currRow.Children, item => this.utilSvc.isBoqRootRow(item.LineTypeFk));

					const totalExpressions: string[] = [];
					let bidderColumns = isVerticalCompareRows
						? _.filter(columns, c => this.utilSvc.isBidderColumn(c) && this.bidderSvc.isNotReference(c.quoteKey) && !c.isIdealBidder && c.originalField === CompareFields.itemTotal)
						: _.filter(columns, c => this.utilSvc.isBidderColumn(c) && this.bidderSvc.isNotReference(c.field) && !c.isIdealBidder);
					if (!this.utilSvc.isExcludeTargetColumn(col)) {
						const countInTargetColumnIds = _.filter(userData.visibleCompareColumns, item => item.IsCountInTarget).map(item => item.Id);
						bidderColumns = _.filter(bidderColumns, bidderColumn => {
							return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
						});
					}

					const quoteKeys = _.map(currRow.QuoteItems, item => item.QuoteKey);
					bidderColumns = _.filter(bidderColumns, bidderColumn => {
						return _.indexOf(quoteKeys, bidderColumn.id) > -1;
					});

					if (boqRoots.length) {
						_.forEach(bidderColumns, c => {
							const currColIndex = _.findIndex(columns, item => item.id === c.id);
							totalExpressions.push(this.buildRootFinalPriceExpression(boqRoots, rows, columns, c, currColIndex, isVerticalCompareRows, false, dataRowDic) as string);
						});
					}
					return totalExpressions.join(',');
				}
			}
		};
	}

	public createFormulaRules(
		taxCodes: ITaxCodeEntity[],
		taxCodeMatrixes: IMdcTaxCodeMatrixEntity[]
	): ICompareExportRowFormulaRule<ICompositeBoqEntity, ICompareExportBoqUserData>[] {
		this.taxCodes = taxCodes;
		this.taxCodeMatrixes = taxCodeMatrixes;
		return [
			{
				label: 'Grand Total',
				row: (row: ICompositeBoqEntity) => {
					return row.LineTypeFk === CompareRowTypes.grandTotal;
				},
				cells: this.createRfqTotalStatisticCells().concat([{
					formula: 'SUM({total})',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
					},
					expression: {
						total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
							const targetRows = _.filter(rows, item => item.LineTypeFk === CompareRowTypes.rfq);
							const results = targetRows.map(r => {
								const rowIndex = _.findIndex(rows, row => {
									return row.Id === r.Id;
								});
								return [rowIndex, colIndex];
							});

							return results.map(m => this.utilSvc.formatExpressionValue(m[0], m[1])).join(',');
						}
					}
				}])
			},
			{
				label: 'Evaluated Total',
				row: (row: ICompositeBoqEntity) => {
					return row.LineTypeFk === CompareRowTypes.evaluatedTotal;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal).concat([{
					formula: 'SUM({total})',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
					},
					expression: {
						total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
							return this.utilSvc.buildEvaluatedTotalExpress(rows, columns, col, colIndex, isVerticalCompareRows, CompareFields.itemTotal, BoqLineType.position);
						}
					}
				}])
			},
			{
				label: 'RFQ Total',
				row: (row: ICompositeBoqEntity) => {
					return row.LineTypeFk === CompareRowTypes.rfq;
				},
				cells: this.createRfqTotalStatisticCells().concat([{
					formula: 'SUM({total})',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
					},
					expression: {
						total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
							let boqRoots: ICompositeBoqEntity[] = [];
							currRow.Children.forEach(item => {
								if (item.LineTypeFk === CompareRowTypes.requisition) {
									const roots = _.filter(item.Children, item => this.utilSvc.isBoqRootRow(item.LineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === col.field));
									boqRoots = boqRoots.concat(roots);
								}
							});

							return this.buildRootFinalPriceExpression(boqRoots, rows, columns, col, colIndex, isVerticalCompareRows, false, dataRowDic) as string;
						}
					}
				}])
			},
			{
				label: 'REQ Total',
				row: (row: ICompositeBoqEntity) => {
					return row.LineTypeFk === CompareRowTypes.requisition;
				},
				cells: this.createRequisitionTotalStatisticCells().concat([{
					formula: 'SUM({total})',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field) && row.QuoteItems.some(item => item.QuoteKey === column.field);
					},
					expression: {
						total: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
							const boqRoots = _.filter(currRow.Children, item => this.utilSvc.isBoqRootRow(item.LineTypeFk) && item.QuoteItems.some(x => x.QuoteKey === col.field));
							return this.buildRootFinalPriceExpression(boqRoots, rows, columns, col, colIndex, isVerticalCompareRows, false, dataRowDic) as string;
						}
					},
					disabled: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						return !userData.isFinalPriceRowActivated;
					}
				}])
			},
			{
				label: 'Summary Total',
				row: (row: ICompositeBoqEntity) => {
					return _.includes(boqSummaryFields, row.LineTypeFk) && row.SummaryRowType === BoqSummaryRowTypes.total;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal).concat([{
					formula: 'SUM({totalRows})',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field) && row.parentItem && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
					},
					expression: {
						totalRows: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
							const results = this.findSummaryTotalRows(rows, currRow, columns, col, colIndex, isVerticalCompareRows, dataRowDic);
							const resultExpressions = results.map(m => this.utilSvc.formatExpressionValue(m[0], m[1]));

							return resultExpressions.length > this.EXCEL_MAX_FUNCTION_ARG_LENGTH ? _.chunk(resultExpressions, this.EXCEL_MAX_FUNCTION_ARG_LENGTH).map(group => {
								return 'SUM(' + group.join(',') + ')';
							}).join(',') : resultExpressions.join(',');
						}
					},
					disabled: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						const results = this.findSummaryTotalRows(rows, currRow, columns, col, colIndex, isVerticalCompareRows, dataRowDic);
						return _.isEmpty(results);
					}
				}])
			},
			{
				label: 'Summary Discount Abs',
				row: (row: ICompositeBoqEntity) => {
					return _.includes(boqSummaryFields, row.LineTypeFk) && row.SummaryRowType === BoqSummaryRowTypes.abs;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal).concat([{
					formula: '{total}*{percent}/100',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field) && row.parentItem && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
					},
					expression: {
						total: this.createSummaryRowFinder(BoqSummaryRowTypes.total),
						percent: this.createSummaryRowFinder(BoqSummaryRowTypes.percent)
					},
					disabled: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						return !this.hasSummaryRowValid(rows, currRow, col, BoqSummaryRowTypes.total) && !this.hasSummaryRowValid(rows, currRow, col, BoqSummaryRowTypes.percent);
					}
				}])
			},
			{
				label: 'Summary Discount Total',
				row: (row: ICompositeBoqEntity) => {
					return _.includes(boqSummaryFields, row.LineTypeFk) && row.SummaryRowType === BoqSummaryRowTypes.discountTotal;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal).concat([{
					formula: '{total}-{abs}',
					cell: (row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field) && row.parentItem && row.parentItem.QuoteItems.some(item => item.QuoteKey === column.field);
					},
					expression: {
						total: this.createSummaryRowFinder(BoqSummaryRowTypes.total),
						abs: this.createSummaryRowFinder(BoqSummaryRowTypes.abs)
					},
					disabled: (rows: ICompositeBoqEntity[], currRow: ICompositeBoqEntity, columns: CompareGridColumn<ICompositeBoqEntity>[], col: CompareGridColumn<ICompositeBoqEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportBoqUserData, dataRowDic: ICompareExportDataRowDic<ICompositeBoqEntity>) => {
						return !this.hasSummaryRowValid(rows, currRow, col, BoqSummaryRowTypes.total) && !this.hasSummaryRowValid(rows, currRow, col, BoqSummaryRowTypes.abs);
					}
				}])
			},
			{
				label: 'Summary Discount Percent',
				row: (row: ICompositeBoqEntity) => {
					return _.includes(boqSummaryFields, row.LineTypeFk) && row.SummaryRowType === BoqSummaryRowTypes.percent;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Summary Discount Percent IT',
				row: (row: ICompositeBoqEntity) => {
					return row.rowType === CompareFields.discountPercentIT;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Lumpsum Price',
				row: (row: ICompositeBoqEntity) => {
					return row.rowType === CompareFields.lumpsumPrice;
				},
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'BoQ Root',
				row: (row: ICompositeBoqEntity) => {
					return this.utilSvc.isBoqRootRow(row.LineTypeFk);
				},
				cells: [
					this.rootLevelCells.createItemTotal(true),
					this.rootLevelCells.createItemTotalOc(true),
					this.rootLevelCells.createSummaryInRow(),
					this.rootLevelCells.createAbsoluteDifference(true),
					this.rootLevelCells.createPercentage(true)
				].concat(this.createRootLevelTotalStatisticCells())
			},
			{
				label: 'BoQ Level',
				row: (row: ICompositeBoqEntity) => {
					return this.utilSvc.isBoqLevelRow(row.LineTypeFk);
				},
				cells: [
					this.rootLevelCells.createItemTotal(true),
					this.rootLevelCells.createItemTotalOc(true),
					this.rootLevelCells.createSummaryInRow(),
					this.rootLevelCells.createAbsoluteDifference(true),
					this.rootLevelCells.createPercentage(true)
				].concat(this.createRootLevelTotalStatisticCells())
			},
			{
				label: 'BoQ Position',
				row: (row: ICompositeBoqEntity) => {
					return this.utilSvc.isBoqPositionRow(row.LineTypeFk);
				},
				cells: [
					this.positionCells.createPrice(true),
					this.positionCells.createDiscountedPrice(true),
					this.positionCells.createDiscountedUnitPrice(true),
					this.positionCells.createFinalPrice(true),
					this.positionCells.createFinalPriceOc(true),
					this.positionCells.createPriceGross(true),
					this.positionCells.createPriceGrossOc(true),
					this.positionCells.createFinalGross(true),
					this.positionCells.createFinalGrossOc(true),
					this.rootLevelCells.createItemTotal(true),
					this.rootLevelCells.createItemTotalOc(true),
					this.positionCells.createExtraIncrement(true),
					this.rootLevelCells.createSummaryInRow(),
					this.positionCells.createAbsoluteDifference(true),
					this.positionCells.createPercentage(true)
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Price',
				row: this.createCompareRowIdentifier(CompareFields.price),
				cells: [
					this.positionCells.createPrice()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Discounted Price',
				row: this.createCompareRowIdentifier(CompareFields.discountedPrice),
				cells: [
					this.positionCells.createDiscountedPrice()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Discounted Unit Price',
				row: this.createCompareRowIdentifier(CompareFields.discountedUnitPrice),
				cells: [
					this.positionCells.createDiscountedUnitPrice()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Final Price',
				row: this.createCompareRowIdentifier(CompareFields.finalPrice),
				cells: [
					this.positionCells.createFinalPrice()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Final Price(OC)',
				row: this.createCompareRowIdentifier(CompareFields.finalPriceOc),
				cells: [
					this.positionCells.createFinalPriceOc()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Final Price Before Discount',
				row: this.createCompareRowIdentifier(CompareFields.itemTotal),
				cells: [
					this.rootLevelCells.createItemTotal()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Final Price Before Discount (OC)',
				row: this.createCompareRowIdentifier(CompareFields.itemTotalOc),
				cells: [
					this.rootLevelCells.createItemTotalOc()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Discount ABS IT',
				row: this.createCompareRowIdentifier(CompareFields.discount),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - Corrected UR (Gross)',
				row: this.createCompareRowIdentifier(CompareFields.priceGross),
				cells: [
					this.positionCells.createPriceGross()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Corrected UR (Gross OC)',
				row: this.createCompareRowIdentifier(CompareFields.priceGrossOc),
				cells: [
					this.positionCells.createPriceGrossOc()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Final Price (Gross)',
				row: this.createCompareRowIdentifier(CompareFields.finalGross),
				cells: [
					this.positionCells.createFinalGross()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Final Price (Gross OC)',
				row: this.createCompareRowIdentifier(CompareFields.finalGrossOc),
				cells: [
					this.positionCells.createFinalGrossOc()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Extra Increment',
				row: this.createCompareRowIdentifier(CompareFields.extraIncrement),
				cells: [
					this.positionCells.createExtraIncrement()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Absolute Difference',
				row: this.createCompareRowIdentifier(CompareFields.absoluteDifference),
				cells: [
					this.positionCells.createAbsoluteDifference()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Percentage',
				row: this.createCompareRowIdentifier(CompareFields.percentage),
				cells: [
					this.positionCells.createPercentage()
				].concat(this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal))
			},
			{
				label: 'Compare Field - Cost',
				row: this.createCompareRowIdentifier(CompareFields.cost),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - Discount Percent Unit Rate',
				row: this.createCompareRowIdentifier(CompareFields.discountPercent),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - Quantity',
				row: this.createCompareRowIdentifier(CompareFields.quantity),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - AQ-Quantity',
				row: this.createCompareRowIdentifier(CompareFields.quantityAdj),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - Unit Rate Oc',
				row: this.createCompareRowIdentifier(CompareFields.priceOc),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - Factor',
				row: this.createCompareRowIdentifier(CompareFields.factor),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			},
			{
				label: 'Compare Field - Extra Increment OC',
				row: this.createCompareRowIdentifier(CompareFields.extraIncrementOc),
				cells: this.utilSvc.createStatisticCells<ICompositeBoqEntity, ICompareExportBoqUserData>(CompareFields.itemTotal)
			}
		];
	}
}