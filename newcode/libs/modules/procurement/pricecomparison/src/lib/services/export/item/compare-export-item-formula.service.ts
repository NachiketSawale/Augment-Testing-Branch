/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ITaxCodeEntity } from '@libs/basics/shared';
import _ from 'lodash';
import { ICompareExportCellFormulaRule, ICompareExportRowFormulaRule } from '../../../model/entities/export/compare-export-formula-rule.interface';
import { ICompareExportItemUserData } from '../../../model/entities/export/compare-export-user-data.interface';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { CompareFields } from '../../../model/constants/compare-fields';
import { CompareRowTypes } from '../../../model/constants/compare-row-types';
import { ProcurementPricecomparisonUtilService } from '../../util.service';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { ICompareExportLookupMap } from '../../../model/entities/export/compare-export-lookup-map.interface';
import { ICompareExportDataRowDic } from '../../../model/entities/export/compare-export-data-row-dic.interface';
import { ProcurementPricecomparisonBidderIdentityService } from '../../bidder-identity.service';
import { ValuableLeadingFields } from '../../../model/constants/valuable-leading-fields';
import { Constants } from '../../../model/constants/constants';
import { ICustomPrcItem } from '../../../model/entities/item/custom-prc-item.interface';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareExportItemFormulaService {
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly bidderSvc = inject(ProcurementPricecomparisonBidderIdentityService);
	private taxCodes: ITaxCodeEntity[] = [];
	private taxCodeMatrixes: IMdcTaxCodeMatrixEntity[] = [];

	private utility = {
		price: this.createFieldFinder(CompareFields.price),
		quantity: this.createFieldFinder(CompareFields.quantity),
		priceUnit: this.createFieldFinder(CompareFields.priceUnit),
		factorPriceUnit: this.createFieldFinder(CompareFields.factorPriceUnit),
		discountSplit: this.createFieldFinder(CompareFields.discountSplit),
		discountSplitOc: this.createFieldFinder(CompareFields.discountSplitOc),
		discount: this.createFieldFinder(CompareFields.discount),
		priceOc: this.createFieldFinder(CompareFields.priceOc),
		priceExtra: this.createFieldFinder(CompareFields.priceExtra),
		priceExtraOc: this.createFieldFinder(CompareFields.priceExtraOc),
		charge: this.createFieldFinder(CompareFields.charge),
		chargeOc: this.createFieldFinder(CompareFields.chargeOc),
		vatPercent: this.getVatPercent.bind(this),
		leadingField: this.getLeadingField.bind(this),
		deviationReference: this.getDeviationReference.bind(this),
		bidderReference: this.getBidderReference.bind(this)
	};
	private compareFieldCells = {
		createPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '{priceOc}/{exchangeRate}',
				cell: this.createCellMatcher(CompareFields.price, isVerticalMode),
				expression: {
					priceOc: this.utility.priceOc.bind(this),
					exchangeRate: this.utilSvc.createQuoteRowFinder(CompareRowTypes.quoteExchangeRate)
				}
			};
		},
		createTotalPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '({price}+{priceExtra}+{charge})*((100-{discount})/100)',
				cell: this.createCellMatcher(CompareFields.totalPrice, isVerticalMode),
				expression: {
					price: this.utility.price.bind(this),
					priceExtra: this.utility.priceExtra.bind(this),
					discount: this.utility.discount.bind(this),
					charge: this.utility.charge.bind(this)
				}
			};
		},
		createFactoredTotalPrice: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '({price}+{priceExtra}+{charge})*((100-{discount})/100)/{priceUnit}',
				cell: this.createCellMatcher(CompareFields.totalPrice, isVerticalMode),
				expression: {
					price: this.utility.price.bind(this),
					priceExtra: this.utility.priceExtra.bind(this),
					discount: this.utility.discount.bind(this),
					priceUnit: this.utility.priceUnit.bind(this),
					charge: this.utility.charge.bind(this)
				}
			};
		},
		createTotal: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '{totalPrice}*{quantity}/{priceUnit}*{factorPriceUnit}-{discountSplit}',
				cell: this.createCellMatcher(CompareFields.total, isVerticalMode),
				expression: {
					totalPrice: this.createFieldFinder(CompareFields.totalPrice),
					quantity: this.utility.quantity.bind(this),
					priceUnit: this.utility.priceUnit.bind(this),
					factorPriceUnit: this.utility.factorPriceUnit.bind(this),
					discountSplit: this.utility.discountSplit.bind(this)
				}
			};
		},
		createTotalOC: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '({priceOc}+{priceExtraOc}+{chargeOc})*((100-{discount})/100)*{quantity}/{priceUnit}*{factorPriceUnit}-{discountSplitOc}',
				cell: this.createCellMatcher(CompareFields.totalOC, isVerticalMode),
				expression: {
					priceOc: this.utility.priceOc.bind(this),
					priceExtraOc: this.utility.priceExtraOc.bind(this),
					discount: this.utility.discount.bind(this),
					quantity: this.utility.quantity.bind(this),
					priceUnit: this.utility.priceUnit.bind(this),
					factorPriceUnit: this.utility.factorPriceUnit.bind(this),
					discountSplit: this.utility.discountSplit.bind(this),
					discountSplitOc: this.utility.discountSplitOc.bind(this),
					chargeOc: this.utility.chargeOc.bind(this)
				}
			};
		},
		createTotalNoDiscount: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '({price}+{priceExtra})*{quantity}/{priceUnit}*{factorPriceUnit}',
				cell: this.createCellMatcher(CompareFields.totalNoDiscount, isVerticalMode),
				expression: {
					price: this.utility.price.bind(this),
					priceExtra: this.utility.priceExtra.bind(this),
					quantity: this.utility.quantity.bind(this),
					priceUnit: this.utility.priceUnit.bind(this),
					factorPriceUnit: this.utility.factorPriceUnit.bind(this)
				}
			};
		},
		createTotalOcNoDiscount: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '({priceOc}+{priceExtraOc})*{quantity}/{priceUnit}*{factorPriceUnit}',
				cell: this.createCellMatcher(CompareFields.totalOcNoDiscount, isVerticalMode),
				expression: {
					priceOc: this.utility.priceOc.bind(this),
					priceExtraOc: this.utility.priceExtraOc.bind(this),
					quantity: this.utility.quantity.bind(this),
					priceUnit: this.utility.priceUnit.bind(this),
					factorPriceUnit: this.utility.factorPriceUnit.bind(this)
				}
			};
		},
		createPriceOCGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '{priceOc}*(100+{VatPercent.vatPercent})/100',
				cell: this.createCellMatcher(CompareFields.priceOCGross, isVerticalMode),
				expression: {
					priceOc: this.utility.priceOc.bind(this),
					vatPercent: this.utility.vatPercent.bind(this)
				}
			};
		},
		createPriceGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '{price}*(100+{VatPercent.vatPercent})/100',
				cell: this.createCellMatcher(CompareFields.priceGross, isVerticalMode),
				expression: {
					price: this.utility.price.bind(this),
					vatPercent: this.utility.vatPercent.bind(this)
				}
			};
		},
		createTotalPriceOCGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '({priceOc}+{priceExtraOc}+{chargeOc})*((100-{discount})/100)*(100+{VatPercent.vatPercent})/100',
				cell: this.createCellMatcher(CompareFields.totalPriceOCGross, isVerticalMode),
				expression: {
					priceOc: this.utility.priceOc.bind(this),
					priceExtraOc: this.utility.priceExtraOc.bind(this),
					discount: this.utility.discount.bind(this),
					vatPercent: this.utility.vatPercent.bind(this),
					chargeOc: this.utility.chargeOc.bind(this)
				}
			};
		},
		createTotalPriceGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '{totalPrice}*(100+{VatPercent.vatPercent})/100',
				cell: this.createCellMatcher(CompareFields.totalPriceGross, isVerticalMode),
				expression: {
					totalPrice: this.createFieldFinder(CompareFields.totalPrice),
					vatPercent: this.utility.vatPercent.bind(this)
				}
			};
		},
		createTotalOCGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '(({priceOc}+{priceExtraOc}+{chargeOc})*((100-{discount})/100)*{quantity}/{priceUnit}*{factorPriceUnit}-{discountSplitOc})*(100+{VatPercent.vatPercent})/100',
				cell: this.createCellMatcher(CompareFields.totalOCGross, isVerticalMode),
				expression: {
					priceOc: this.utility.priceOc.bind(this),
					priceExtraOc: this.utility.priceExtraOc.bind(this),
					discount: this.utility.discount.bind(this),
					quantity: this.utility.quantity.bind(this),
					priceUnit: this.utility.priceUnit.bind(this),
					factorPriceUnit: this.utility.factorPriceUnit.bind(this),
					discountSplit: this.utility.discountSplit.bind(this),
					discountSplitOc: this.utility.discountSplitOc.bind(this),
					vatPercent: this.utility.vatPercent.bind(this),
					chargeOc: this.utility.chargeOc.bind(this)
				}
			};
		},
		createTotalGross: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: '{total}*(100+{VatPercent.vatPercent})/100',
				cell: this.createCellMatcher(CompareFields.totalGross, isVerticalMode),
				expression: {
					total: this.createFieldFinder(CompareFields.total),
					vatPercent: this.utility.vatPercent.bind(this)
				}
			};
		},
		createAbsoluteDifference: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: this.utilSvc.deviationDifferenceFormula,
				cell: this.createCellMatcher(CompareFields.absoluteDifference, isVerticalMode),
				expression: {
					leadingField: this.utility.leadingField.bind(this),
					deviationReference: this.utility.deviationReference.bind(this),
					bidderReference: this.utility.bidderReference.bind(this)
				}
			};
		},
		createPercentage: (isVerticalMode?: boolean): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> => {
			return {
				formula: this.utilSvc.percentageFormula,
				cell: this.createCellMatcher(CompareFields.percentage, isVerticalMode),
				expression: {
					leadingField: this.utility.leadingField.bind(this),
					deviationReference: this.utility.deviationReference.bind(this),
					bidderReference: this.utility.bidderReference.bind(this)
				}
			};
		}
	};

	private createFieldFinder(fieldType: string) {
		return (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
			return this.utilSvc.getFieldCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, fieldType);
		};
	}

	private createRowMatcher(fieldType: string) {
		return (row: ICompositeItemEntity, isVerticalCompareRows: boolean) => {
			if (isVerticalCompareRows) {
				return row.LineTypeFk === CompareRowTypes.prcItem;
			} else {
				return row.LineTypeFk === CompareRowTypes.compareField && row.rowType === fieldType;
			}
		};
	}

	private createCellMatcher(fieldType: string, isVerticalMode?: boolean) {
		const isNotReference = this.bidderSvc.isNotReference;
		return (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
			if (isVerticalMode) {
				return isVerticalCompareRows && isNotReference(column.quoteKey) && column.originalField === fieldType && row.QuoteItems.some(item => item.QuoteKey === column.quoteKey);
			} else {
				return isNotReference(column.field) && row.parentItem?.QuoteItems.some(item => item.QuoteKey === column.field);
			}
		};
	}

	private getVatPercent(rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean) {
		let targetItem: ICustomPrcItem | undefined;
		if (isVerticalCompareRows) {
			targetItem = _.find(currRow.QuoteItems, item => item.QuoteKey === col.quoteKey);
		} else {
			targetItem = _.find(currRow.parentItem?.QuoteItems, item => item.QuoteKey === col.field);
		}
		return targetItem ? this.utilSvc.getVatPercentExpressionValue(this.taxCodes, this.taxCodeMatrixes, targetItem.TaxCodeFk, targetItem.QtnHeaderVatGroupFk) : null;
	}

	private getLeadingField(rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData) {
		let leadingField = userData.leadingField;
		const visibleRow = _.find(userData.visibleCompareRows, {Field: CompareFields.absoluteDifference}) as ICompareRowEntity;
		if (!_.includes(ValuableLeadingFields, leadingField)) {
			return null;
		}
		if (visibleRow.Field === CompareFields.absoluteDifference || visibleRow.Field === CompareFields.percentage) {
			switch (visibleRow.DeviationReference) {
				case 10:
					leadingField = CompareFields.price;
					break;
				case 11: {
					leadingField = CompareFields.total;
					break;
				}
				default:
					break;
			}
		}
		return this.utilSvc.getFieldCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows, leadingField);
	}

	private getDeviationReference(rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) {
		return this.utilSvc.getDeviationReferenceFieldIndex(rows, currRow, columns, colIndex, isVerticalCompareRows, userData.leadingField, userData.visibleCompareRows, userData.visibleCompareColumns);
	}

	private getBidderReference(rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) {
		return this.utilSvc.getBidderReferenceFieldIndex(rows, currRow, columns, isVerticalCompareRows, userData.leadingField);
	}

	private findRfqReqTotalCellIndex(rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean) {
		let results: Array<[number, number]>;
		if (isVerticalCompareRows) {
			results = currRow.Children.map(r => {
				const rowIndex = _.findIndex(rows, row => {
					return row.Id === r.Id;
				});
				colIndex = _.findIndex(columns, column => column.id === col.id + '_' + CompareFields.total);
				return [rowIndex, colIndex];
			});
		} else {
			const targetRows: ICompositeItemEntity[] = [];
			_.forEach(currRow.Children, item => {
				const itemTotalRow = _.find(item.Children, childRow => {
					return childRow.rowType === CompareFields.total;
				});
				if (itemTotalRow) {
					targetRows.push(itemTotalRow);
				}
			});
			results = targetRows.map(r => {
				const rowIndex = _.findIndex(rows, row => {
					return row.Id === r.Id;
				});
				return [rowIndex, colIndex];
			});
		}
		return results.map(m => this.utilSvc.formatExpressionValue(m[0], m[1])).join(',');
	}

	private createRfqReqTotalStatisticCells(): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData>[] {
		return [
			this.createRfqReqTotalStatisticCell(Constants.maxValueIncludeTarget),
			this.createRfqReqTotalStatisticCell(Constants.maxValueExcludeTarget),
			this.createRfqReqTotalStatisticCell(Constants.minValueIncludeTarget),
			this.createRfqReqTotalStatisticCell(Constants.minValueExcludeTarget),
			this.utilSvc.createStatisticCell(Constants.averageValueIncludeTarget, CompareFields.total),
			this.utilSvc.createStatisticCell(Constants.averageValueExcludeTarget, CompareFields.total)
		];
	}

	private createRfqReqTotalStatisticCell(field: string): ICompareExportCellFormulaRule<ICompositeItemEntity, ICompareExportItemUserData> {
		return {
			formula: 'SUM({total})',
			cell: (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
				return column.field === field;
			},
			expression: {
				total: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
					if (currRow.LineTypeFk === CompareRowTypes.rfq) {
						const reqRow = _.find(currRow.Children, item => {
							return item.LineTypeFk === CompareRowTypes.requisition;
						}) as ICompositeItemEntity;
						return this.findRfqReqTotalCellIndex(rows, reqRow, columns, col, colIndex, isVerticalCompareRows);
					}
					return this.findRfqReqTotalCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows);
				}
			}
		};
	}

	public createFormulaRules(
		taxCodes: ITaxCodeEntity[],
		taxCodeMatrixes: IMdcTaxCodeMatrixEntity[]
	): ICompareExportRowFormulaRule<ICompositeItemEntity, ICompareExportItemUserData>[] {
		this.taxCodes = taxCodes;
		this.taxCodeMatrixes = taxCodeMatrixes;
		return [{
			label: 'Grand Total',
			row: (row: ICompositeItemEntity) => {
				return row.LineTypeFk === CompareRowTypes.grandTotal;
			},
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([{
				formula: 'SUM({total})',
				cell: (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
					return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
				},
				expression: {
					total: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
						const targetRows: ICompositeItemEntity[] = _.filter(rows, item => item.LineTypeFk === CompareRowTypes.rfq);
						const results: Array<[number, number]> = targetRows.map(r => {
							const rowIndex = _.findIndex(rows, row => {
								return row.Id === r.Id;
							});
							return [rowIndex, colIndex];
						});
						return results.map(m => this.utilSvc.formatExpressionValue(m[0], m[1])).join(',');
					}
				}
			}])
		}, {
			label: 'Evaluated Total',
			row: (row: ICompositeItemEntity) => {
				return row.LineTypeFk === CompareRowTypes.evaluatedTotal;
			},
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([{
				formula: 'SUM({total})',
				cell: (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
					return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
				},
				expression: {
					total: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
						return this.utilSvc.buildEvaluatedTotalExpress(rows, columns, col, colIndex, isVerticalCompareRows, CompareFields.total, CompareRowTypes.prcItem);
					}
				}
			}])
		}, {
			label: 'RFQ Total',
			row: (row: ICompositeItemEntity) => {
				return row.LineTypeFk === CompareRowTypes.rfq;
			},
			cells: this.createRfqReqTotalStatisticCells().concat([{
				formula: 'SUM({total})',
				cell: (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
					return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field);
				},
				expression: {
					total: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
						const reqRow = _.find(currRow.Children, item => {
							return _.startsWith(item.Id, 'requisition_row');
						}) as ICompositeItemEntity;
						return this.findRfqReqTotalCellIndex(rows, reqRow, columns, col, colIndex, isVerticalCompareRows);
					}
				}
			}])
		}, {
			label: 'REQ Total',
			row: (row: ICompositeItemEntity) => {
				return row.LineTypeFk === CompareRowTypes.requisition;
			},
			cells: this.createRfqReqTotalStatisticCells().concat([{
				formula: 'SUM({total})',
				cell: (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
					return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field) && row.QuoteItems.some(item => item.QuoteKey === column.field);
				},
				expression: {
					total: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
						return this.findRfqReqTotalCellIndex(rows, currRow, columns, col, colIndex, isVerticalCompareRows);
					}
				},
				disabled: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
					return !userData.isTotalRowActivated;
				}
			}])
		}, {
			label: 'PrcItem Total',
			row: (row: ICompositeItemEntity) => {
				return row.LineTypeFk === CompareRowTypes.prcItem;
			},
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([
				{
					formula: '{total}',
					cell: (row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>, isVerticalCompareRows: boolean) => {
						return this.utilSvc.isLineValueColumn(column) && this.bidderSvc.isNotReference(column.field) && row.QuoteItems.some(item => item.QuoteKey === column.field);
					},
					expression: {
						total: (rows: ICompositeItemEntity[], currRow: ICompositeItemEntity, columns: CompareGridColumn<ICompositeItemEntity>[], col: CompareGridColumn<ICompositeItemEntity>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: ICompareExportItemUserData, dataRowDic: ICompareExportDataRowDic<ICompositeItemEntity>) => {
							let results: Array<[number, number]>;
							let targetRows: ICompositeItemEntity[];
							if (isVerticalCompareRows) {
								targetRows = _.filter(rows, item => item.Id === currRow.Id);
								results = targetRows.map(r => {
									const rowIndex = _.findIndex(rows, row => {
										return row.Id === r.Id;
									});
									colIndex = _.findIndex(columns, column => column.id === col.id + '_' + CompareFields.total);
									return [rowIndex, colIndex];
								});
							} else {
								targetRows = _.filter(rows, item => item.rowType === CompareFields.total && item.LineTypeFk === CompareRowTypes.compareField && item.ParentId === currRow.Id);
								results = targetRows.map(r => {
									const rowIndex = _.findIndex(rows, row => {
										return row.Id === r.Id;
									});
									return [rowIndex, colIndex];
								});
							}
							return results.map(m => this.utilSvc.formatExpressionValue(m[0], m[1])).join(',');
						}
					}
				},
				this.compareFieldCells.createPrice(true),
				this.compareFieldCells.createTotalPrice(true),
				this.compareFieldCells.createFactoredTotalPrice(true),
				this.compareFieldCells.createTotal(true),
				this.compareFieldCells.createTotalOC(true),
				this.compareFieldCells.createTotalNoDiscount(true),
				this.compareFieldCells.createTotalOcNoDiscount(true),
				this.compareFieldCells.createPriceOCGross(true),
				this.compareFieldCells.createPriceGross(true),
				this.compareFieldCells.createTotalPriceOCGross(true),
				this.compareFieldCells.createTotalPriceGross(true),
				this.compareFieldCells.createTotalOCGross(true),
				this.compareFieldCells.createTotalGross(true),
				this.compareFieldCells.createAbsoluteDifference(true),
				this.compareFieldCells.createPercentage(true)])
		}, {
			label: 'Price',
			row: this.createRowMatcher(CompareFields.price),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createPrice(false)])
		}, {
			label: 'Total Price',
			row: this.createRowMatcher(CompareFields.totalPrice),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalPrice(false)])
		}, {
			label: 'Factored Total Price',
			row: this.createRowMatcher(CompareFields.totalPrice),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createFactoredTotalPrice(false)])
		}, {
			label: 'Total',
			row: this.createRowMatcher(CompareFields.total),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotal(false)])
		}, {
			label: 'Total Oc',
			row: this.createRowMatcher(CompareFields.totalOC),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalOC(false)])
		}, {
			label: 'Total No Discount',
			row: this.createRowMatcher(CompareFields.totalNoDiscount),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalNoDiscount(false)])
		}, {
			label: 'Total Oc No Discount',
			row: this.createRowMatcher(CompareFields.totalOcNoDiscount),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalOcNoDiscount(false)])
		}, {
			label: 'Price Oc Gross',
			row: this.createRowMatcher(CompareFields.priceOCGross),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createPriceOCGross(false)])
		}, {
			label: 'Price Gross',
			row: this.createRowMatcher(CompareFields.priceGross),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createPriceGross(false)])
		}, {
			label: 'Total Price OC Gross',
			row: this.createRowMatcher(CompareFields.totalPriceOCGross),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalPriceOCGross(false)])
		}, {
			label: 'Total Price Gross',
			row: this.createRowMatcher(CompareFields.totalPriceGross),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalPriceGross(false)])
		}, {
			label: 'Total OC Gross',
			row: this.createRowMatcher(CompareFields.totalOCGross),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalOCGross(false)])
		}, {
			label: 'Total Gross',
			row: this.createRowMatcher(CompareFields.totalGross),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createTotalGross(false)])
		}, {
			label: 'Absolute Difference',
			row: this.createRowMatcher(CompareFields.absoluteDifference),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createAbsoluteDifference(false)])
		}, {
			label: 'Percentage',
			row: this.createRowMatcher(CompareFields.percentage),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total).concat([this.compareFieldCells.createPercentage(false)])
		}, {
			label: 'Price Oc',
			row: this.createRowMatcher(CompareFields.priceOc),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Price Extras',
			row: this.createRowMatcher(CompareFields.priceExtra),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Price Extras Oc',
			row: this.createRowMatcher(CompareFields.priceExtraOc),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Price Unit',
			row: this.createRowMatcher(CompareFields.priceUnit),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Quantity',
			row: this.createRowMatcher(CompareFields.quantity),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Discount',
			row: this.createRowMatcher(CompareFields.discount),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Discount Absolute',
			row: this.createRowMatcher(CompareFields.discountAbsolute),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Discount Split',
			row: this.createRowMatcher(CompareFields.discountSplit),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Discount Split Oc',
			row: this.createRowMatcher(CompareFields.discountSplitOc),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Factor Price Unit',
			row: this.createRowMatcher(CompareFields.factorPriceUnit),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Charge',
			row: this.createRowMatcher(CompareFields.charge),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}, {
			label: 'Charge Oc',
			row: this.createRowMatcher(CompareFields.chargeOc),
			cells: this.utilSvc.createStatisticCells<ICompositeItemEntity, ICompareExportItemUserData>(CompareFields.total)
		}];
	}
}