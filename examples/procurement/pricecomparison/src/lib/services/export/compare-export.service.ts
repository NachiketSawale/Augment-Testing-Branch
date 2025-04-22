/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import _ from 'lodash';
import { PlatformHttpService } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';
import { BasicsShareFileDownloadService, ITaxCodeEntity } from '@libs/basics/shared';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { ProcurementPricecomparisonCompareCommonDialogService } from '../compare-common-dialog.service';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../rfq-header-data.service';
import { ProcurementPricecomparisonUtilService } from '../util.service';
import { CompareFields } from '../../model/constants/compare-fields';
import { boqSummaryFields } from '../../model/constants/boq/boq-summary-fields';
import { ICompositeBoqEntity } from '../../model/entities/boq/composite-boq-entity.interface';
import { ProcurementPricecomparisonCompareExportBoqDataService } from './boq/compare-export-boq-data.service';
import { ICompositeBaseEntity } from '../../model/entities/composite-base-entity.interface';
import { CompareGridColumn } from '../../model/entities/compare-grid-column.interface';
import { decimalCompareFields } from '../../model/constants/export/boq-decimal-compare-fields';
import { booleanCompareFields } from '../../model/constants/export/boq-bool-compare-fields';
import { integerCompareFields } from '../../model/constants/export/boq-int-compare-fields';
import { ProcurementPricecomparisonBidderIdentityService } from '../bidder-identity.service';
import { ICompareExportCellFormulaRule, ICompareExportRowFormulaRule } from '../../model/entities/export/compare-export-formula-rule.interface';
import { ICompareExportCellInfo, ICompareExportColumnInfo, ICompareExportOptions, ICompareExportRowInfo, ICompareExportStyleInfo } from '../../model/entities/export/compare-export-options.interface';
import { ICompareExportLookupMap, ICompareExportVatPercent } from '../../model/entities/export/compare-export-lookup-map.interface';
import { ICompareExportBoqUserData, ICompareExportItemUserData, ICompareExportUserDataBase } from '../../model/entities/export/compare-export-user-data.interface';
import { Constants } from '../../model/constants/constants';
import { ICompareExportRowChunk } from '../../model/entities/export/compare-export-row-chunk.interface';
import { CompareDataReadManager } from '../../model/classes/compare-data-read-manager.class';
import { ICompareExportDataRowDic } from '../../model/entities/export/compare-export-data-row-dic.interface';
import { CompareTypes } from '../../model/enums/compare.types.enum';
import { ProcurementPricecomparisonCompareExportItemDataService } from './item/compare-export-item-data.service';
import { ICompositeItemEntity } from '../../model/entities/item/composite-item-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareExportService {
	private readonly httpSvc = inject(PlatformHttpService);
	private readonly downloadSvc = inject(BasicsShareFileDownloadService);
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly rfqSvc = inject(ProcurementPricecomparisonRfqHeaderDataService);
	private readonly bidderIdentitySvc = inject(ProcurementPricecomparisonBidderIdentityService);
	private readonly commonDlgSvc = inject(ProcurementPricecomparisonCompareCommonDialogService);
	private readonly exportBoqSvc = inject(ProcurementPricecomparisonCompareExportBoqDataService);
	private readonly exportItemSvc = inject(ProcurementPricecomparisonCompareExportItemDataService);

	// Additional export table for calculate such as billing schema and price condition.
	private lookupMap: ICompareExportLookupMap = {
		Quote: [],
		VatPercent: []
	};

	private clearTagReg = /<[^<>]+>/g;

	private resetExportConfig() {
		this.exportBoqSvc.config.hide.columns = [];
		this.exportBoqSvc.config.hide.quoteFields = [];
		this.exportBoqSvc.config.hide.compareFields = [];

		this.exportItemSvc.config.hide.columns = [];
		this.exportItemSvc.config.hide.quoteFields = [];
		this.exportItemSvc.config.hide.compareFields = [];
	}

	private filterBoqRows(items: ICompositeBoqEntity[]) {
		const summaryTypes = this.exportBoqSvc.getTypeSummary();
		return summaryTypes.checkedLineTypes.length ? items : items.filter(item => !_.includes(boqSummaryFields, item.LineTypeFk));
	}

	private findRowRule<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(rows: T[], currRow: T, rules: ICompareExportRowFormulaRule<T, UT>[], isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>) {
		return rules.find(r => (_.isFunction(r.disabled) ? !r.disabled(rows, currRow, isVerticalCompareRows, lookupMap, userData, dataRowDic) : !r.disabled) && r.row(currRow, isVerticalCompareRows));
	}

	private findCellRule<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(rows: T[], currRow: T, rowIndex: number, columns: CompareGridColumn<T>[], currCol: CompareGridColumn<T>, colIndex: number, rowRule: ICompareExportRowFormulaRule<T, UT>, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>) {
		if (!rowRule) {
			return null;
		}
		return rowRule ? rowRule.cells.find(r => (_.isFunction(r.disabled) ? !r.disabled(rows, currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) : !r.disabled) && r.cell(currRow, currCol, isVerticalCompareRows)) : null;
	}

	private buildFormula<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(rows: T[], currRow: T, rowIndex: number, columns: CompareGridColumn<T>[], currCol: CompareGridColumn<T>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>, rowRule?: ICompareExportRowFormulaRule<T, UT>, cellRule?: ICompareExportCellFormulaRule<T, UT>) {
		let formula: string | undefined = undefined;
		if (!rowRule || !cellRule) {
			return formula;
		}
		if (cellRule) {
			let result: RegExpExecArray | null;
			const ruleExpReg = new RegExp('{\\s*(.+?)\\s*}', 'g');
			const ruleFormula = _.isFunction(cellRule.formula) ? cellRule.formula(currRow, isVerticalCompareRows, userData) : cellRule.formula;
			formula = ruleFormula;
			while ((result = ruleExpReg.exec(ruleFormula))) {
				const matchValues = result[1].split('.');
				const lookupName = matchValues.length > 1 ? matchValues[0] : null;
				const dataRows = lookupName ? lookupMap[lookupName] as T[] : rows;
				const prop = matchValues.length > 1 ? matchValues[1] : matchValues[0];
				const propFn = cellRule.expression[prop];
				if (!_.isFunction(propFn)) {
					formula = undefined;
					// TODO-DRIZZLE: To be checked.
					/*if (globals.debugMode) {
						console.group(`error:formula: ${rowRule.label}`);
						console.error(`The function "${prop}" is not defined in rule "${rowRule.label}".`);
						console.groupEnd();
					}*/
					break;
				}
				const evaluatedValue = propFn(dataRows, currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic);
				if (_.includes([null, undefined, ''], evaluatedValue)) {
					formula = undefined;
					/*if (globals.debugMode) {
						console.groupCollapsed(`warn:formula: ${rowRule.label}`);
						console.warn(`The expression "${prop}" in rule "${rowRule.label}" does not hit the target.`);
						console.log(`row.index = ${rowIndex}, row.Id = "${currRow.Id}", col.index = ${colIndex}, col.field = "${currCol.field}", vertical = ${isVerticalCompareRows}`);
						console.groupEnd();
					}*/
					break;
				}
				formula = formula.replace(new RegExp('{\\s*' + (lookupName ? lookupName + '\\.' : '') + prop + '\\s*}', 'g'), (lookupName ? '\'' + lookupName + '\'!' : '') + evaluatedValue);
			}
		}

		return formula;
	}

	private getTreeImage(formattedValue?: string | null) {
		const reg = /<i\s+class="([\s\S]+)">.*?<\/i>/;
		let imageValue = 'ico-folder-empty';
		if (formattedValue && _.isString(formattedValue) && reg.test(formattedValue)) {
			const match = reg.exec(formattedValue);
			imageValue = match && match.length > 1 ? _.last(match[1].split(' ')) as string : '';
		}
		return imageValue;
	}

	private buildHeader<T extends ICompositeBaseEntity<T>>(columns: CompareGridColumn<T>[], hideColumns: string[]) {
		const headers: ICompareExportColumnInfo[] = [];
		_.each(columns, (col) => {
			let width = 100;
			if (col.width) {
				width = col.width;
			}
			headers.push({
				Field: col?.field ?? '',
				Name: col?.name ?? '',
				Width: width,
				IsHidden: _.includes(hideColumns, col.field),
				Span: 1
			});
		});
		return headers;
	}

	private buildHeaderGroup<T extends ICompositeBaseEntity<T>>(columns: CompareGridColumn<T>[]) {
		const groups: ICompareExportColumnInfo[] = [];
		const bidderHeaders: ICompareExportColumnInfo[] = [];

		let bidders = columns.filter(e => e.quoteKey).map((column) => {
			return {quoteKey: column.quoteKey, name: column.groupName};
		});
		bidders = _.uniqBy(bidders, 'quoteKey');

		_.forEach(bidders, bidder => {
			let width = 100;
			let span = 1;
			const innerColumns = _.filter(columns, col => {
				return bidder && bidder.quoteKey && col.field ? col.field.indexOf(bidder.quoteKey) > -1 : false;
			});
			if (innerColumns && innerColumns.length > 0) {
				span = innerColumns.length;
				width = _.sumBy(innerColumns, item => {
					return item.width ? item.width : width;
				});
			}
			bidderHeaders.push({
				Field: bidder?.quoteKey || '',
				Name: bidder?.name || '',
				Span: span,
				Width: width,
				IsHidden: false
			});
		});

		_.forEach(columns, col => {
			if (col.isDynamic) {
				const bidderHeader = _.find(bidderHeaders, bidder => {
					return (col.field || '').indexOf(bidder.Field) > -1;
				});
				const group = bidderHeader ? _.find(groups, group => {
					return group.Field === bidderHeader.Field;
				}) : null;
				if (bidderHeader && !group) {
					groups.push(bidderHeader);
				}
			} else {
				let width = 100;
				if (col.width) {
					width = col.width;
				}
				groups.push({
					Field: col?.field ?? '',
					Name: col?.name ?? '',
					Span: 1,
					Width: width,
					IsHidden: false
				});
			}
		});
		return groups;
	}

	private buildSimpleCell(cell: ICompareExportCellInfo, value: unknown, valueType?: string | null, formattedValue?: string, styles?: ICompareExportStyleInfo[], formula?: string, formatCode?: string | null) {
		if (value !== null && value !== undefined && value !== '') {
			cell.v = value;
		}

		if (valueType) {
			cell.vt = this.buildSimpleValueType(valueType);
		}

		if (formattedValue !== '') {
			cell.fv = formattedValue;
		}

		if (styles && styles.length) {
			cell.st = styles;
		}

		if (formula) {
			cell.fm = formula;
		}

		if (formatCode) {
			cell.fc = formatCode;
		}

		return cell;
	}

	private buildSimpleRow(row: ICompareExportRowInfo, level: number, hidden?: boolean, styles?: ICompareExportStyleInfo[]) {
		if (level > 0) {
			row.lv = level;
		}

		if (hidden) {
			row.h = hidden;
		}

		if (styles && styles.length) {
			row.st = styles;
		}

		return row;
	}

	private buildSimpleValueType(valueType: string) {
		switch (valueType) {
			case 'Decimal':
				return 0;
			case 'Integer':
				return 1;
			case 'Boolean':
				return 2;
			case 'Date':
				return 3;
			case 'Image':
				return 4;
			default :
				return undefined;
		}
	}

	private isPrcRowFormulaSupported<T extends ICompositeBaseEntity<T>>(row: T, isVerticalCompareRows: boolean) {
		if (!isVerticalCompareRows) {
			return row.rowType ? !this.exportItemSvc.config.formula.excludeRows.includes(row.rowType as string) : true;
		}
		return true;
	}

	private isBoqRowFormulaSupported<T extends ICompositeBaseEntity<T>>(row: T, isVerticalCompareRows: boolean) {
		if (!isVerticalCompareRows) {
			return row.rowType ? !this.exportBoqSvc.config.formula.excludeRows.includes(row.rowType) : true;
		}
		return true;
	}

	private isPrcColumnFormulaSupported<T extends ICompositeBaseEntity<T>>(column: CompareGridColumn<T>, isVerticalCompareRows: boolean) {
		if (!isVerticalCompareRows) {
			return column.field ? !this.exportItemSvc.config.formula.excludeColumns.includes(column.field) : false;
		}
		return true;
	}

	private isBoqColumnFormulaSupported<T extends ICompositeBaseEntity<T>>(column: CompareGridColumn<T>, isVerticalCompareRows: boolean) {
		if (!isVerticalCompareRows) {
			return column.field ? !this.exportBoqSvc.config.formula.excludeColumns.includes(column.field) : false;
		}
		return true;
	}

	private buildChunkRow<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(
		chunk: ICompareExportRowChunk<T>,
		dataRows: T[],
		columns: CompareGridColumn<T>[],
		formulaRules: ICompareExportRowFormulaRule<T, UT>[],
		readMgr: CompareDataReadManager<T>,
		isVerticalCompareRows: boolean,
		isExportedFormula: boolean,
		lookupMap: ICompareExportLookupMap,
		userData: UT,
		dataRowDic: ICompareExportDataRowDic<T>,
		hideCompareFields: string[],
		hideQuoteFields: string[],
		isTargetRowFn: (row: T) => boolean,
		isRowFormulaSupported: (row: T, isVerticalCompareRows: boolean) => boolean,
		isColumnFormulaSupported: (column: CompareGridColumn<T>, isVerticalCompareRows: boolean) => boolean
	): ICompareExportRowInfo[] {
		const rows: ICompareExportRowInfo[] = [];
		chunk.rows.forEach((row, rowIndex) => {
			const isTargetRow = isTargetRowFn(row);
			const rowReader = readMgr.getRowReader(row);
			const rowRule = isExportedFormula && isRowFormulaSupported(row, isVerticalCompareRows) ? this.findRowRule(dataRows, row, formulaRules, isVerticalCompareRows, lookupMap, userData, dataRowDic) : undefined;
			const cells = _.map(columns, (col, columnIndex) => {
				const cellReader = readMgr.getCellReader(row, col, rowReader);
				let originalValue = readMgr.readCellValue(row, col, cellReader);
				let valueType = readMgr.readCellValueType(row, col, cellReader);
				let formatCode = readMgr.readCellFormatCode(row, col, cellReader);

				let formatter = col['formatter'] as (string | ((rIndex: number, cIndex: number, value: unknown, col: CompareGridColumn<T>, row: T) => string));
				if (_.isString(formatter)) {
					formatter = (rIndex: number, cIndex: number, value: unknown, col: CompareGridColumn<T>, row: T) => {
						return this.utilSvc.formatValue(formatter as FieldType, rIndex, cIndex, value, col, row);
					};
				}
				let formattedValue = formatter(rowIndex, columnIndex, originalValue, col, row);

				const styles = [];
				const colorValue = this.getColorValue(formattedValue);
				if (colorValue) {
					styles.push({Name: 'FONT.COLOR', Value: colorValue});
				}

				if (col.id === 'tree') {
					valueType = 'Image';
					originalValue = row['image'] || this.getTreeImage(formattedValue);
				}

				if (isTargetRow && _.includes([CompareFields.budgetPerUnit, CompareFields.budgetTotal], col.field)) {
					valueType = 'Decimal'; // TODO: Resolve ALM 137240 temporary, it should be determine in cell reader function.
				}

				if (this.utilSvc.isAverageMaxMinCol(col)) {
					valueType = 'Decimal'; // average,max,min are always decimal.
					if (_.includes([CompareFields.uomFk, CompareFields.prcItemEvaluationFk, CompareFields.notSubmitted], row.rowType as string)) {
						originalValue = null;
					}

					if (row.rowType === CompareFields.percentage) {
						formatCode = '0.00%';
					}
				}

				if (_.isString(formattedValue)) {
					formattedValue = this.utilSvc.clearButtonTag(formattedValue);
					formattedValue = formattedValue.replace(this.clearTagReg, '');
				}

				const cellRule = rowRule && _.includes(['Decimal', 'Integer'], valueType) && isColumnFormulaSupported(col, isVerticalCompareRows) ? this.findCellRule(dataRows, row, rowIndex, columns, col, columnIndex, rowRule, isVerticalCompareRows, this.lookupMap, userData, dataRowDic) : null;
				const cellFormula = cellRule ? this.buildFormula(dataRows, row, rowIndex, columns, col, columnIndex, isVerticalCompareRows, this.lookupMap, userData, dataRowDic, rowRule, cellRule) : '';
				const cellValue = _.includes([Constants.tagForNoQuote], originalValue) ? null : originalValue;
				const cellFormattedValue = !_.includes([null, 'null', undefined, 'undefined'], formattedValue) ? formattedValue.toString().trim() : '';

				/*if (cellFormula) {
					styles.push({Name: 'FILL.BG.COLOR', Value: 'RGBA:239,59,239,1'});
				}*/

				return this.buildSimpleCell({
					f: col.field as string
				}, cellValue, valueType, cellFormattedValue, styles, cellFormula, formatCode);
			});

			const cssClasses = _.isString(row.cssClass) ? row.cssClass.split(' ') : [];
			const styles: ICompareExportStyleInfo[] = [];
			if (cssClasses.length) {
				if (cssClasses.includes('font-bold')) {
					styles.push({Name: 'FONT.BOLD', Value: true});
				}
			}

			const hasChildren = row.nodeInfo && row.nodeInfo.children;
			if (hasChildren) {
				styles.push({Name: 'FILL.BG.COLOR', Value: 'RGBA:245,245,245,1'});
			}

			let isHidden = row._rt$Deleted;
			if (!row._rt$Deleted) {
				if (this.utilSvc.isCompareFieldRow(row.LineTypeFk)) {
					isHidden = _.includes(hideCompareFields, row.rowType as string);
				} else if (this.utilSvc.isQuoteFieldRow(row)) {
					isHidden = _.includes(hideQuoteFields, row.QuoteField as string);
				}
			}

			const level = row.nodeInfo ? row.nodeInfo.level : 0;
			const hidden = row._rt$Deleted || isHidden;

			rows.push(this.buildSimpleRow({
				cl: cells,
				lv: 0
			}, level, hidden, styles));
		});
		chunk.status = true;
		return rows;
	}

	private buildDataRow<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(
		buildType: CompareTypes,
		dataRows: T[],
		columns: CompareGridColumn<T>[],
		isExportedFormula: boolean,
		isVerticalCompareRows: boolean,
		readMgr: CompareDataReadManager<T>,
		lookupMap: ICompareExportLookupMap,
		userData: UT,
		formulaRules: ICompareExportRowFormulaRule<T, UT>[],
		hideCompareFields: string[],
		hideQuoteFields: string[],
		isTargetRowFn: (row: T) => boolean,
		isRowFormulaSupported: (row: T, isVerticalCompareRows: boolean) => boolean,
		isColumnFormulaSupported: (column: CompareGridColumn<T>, isVerticalCompareRows: boolean) => boolean,
		showProgressMessage: (text: string) => void
	): Promise<ICompareExportRowInfo[]> {
		const bidderColumns = _.filter(columns, column => this.utilSvc.isLineValueColumn(column) && this.bidderIdentitySvc.isNotReference(column.field) && !column.isIdealBidder);
		const countInTargetColumnIds = _.filter(userData.visibleCompareColumns, item => item.IsCountInTarget).map(item => item.Id);
		const dataRowDic: ICompareExportDataRowDic<T> = {
			rows: this.utilSvc.toDictionary<T, string>(dataRows, 'Id'),
			columns: this.utilSvc.toDictionary<CompareGridColumn<T>, string>(columns, 'field'),
			bidderColumns: bidderColumns,
			countInTargetColumns: _.filter(bidderColumns, bidderColumn => {
				return _.includes(countInTargetColumnIds, bidderColumn.id);
			})
		};
		const chunks = _.chunk(dataRows, 1000).map(chunk => {
			return {status: false, rows: chunk};
		});

		const showBuildProgressMessage = (buildType: CompareTypes, chunks: Array<{ status: boolean, rows: T[] }>) => {
			const complete = chunks.filter(c => c.status);
			const container = buildType === CompareTypes.BoQ ? 'procurement.pricecomparison.priceComparisonBoqTitle' : 'procurement.pricecomparison.priceCompareTitle';
			const percent = (complete.length / chunks.length * 100).toFixed(2) + '%';
			showProgressMessage(this.utilSvc.getTranslationText('procurement.pricecomparison.wizard.buildExportDataFor', {p1: this.utilSvc.getTranslationText(container), p2: percent}));
		};

		const buildQueues = chunks.map(chunk => {
			return () => {
				return new Promise<ICompareExportRowInfo[]>((resolve) => {
					setTimeout(() => {
						const rows = this.buildChunkRow(
							chunk,
							dataRows,
							columns,
							formulaRules,
							readMgr,
							isVerticalCompareRows,
							isExportedFormula,
							lookupMap,
							userData,
							dataRowDic,
							hideCompareFields,
							hideQuoteFields,
							isTargetRowFn,
							isRowFormulaSupported,
							isColumnFormulaSupported
						);
						showBuildProgressMessage(buildType, chunks);
						resolve(rows);
					}, 10);
				});
			};
		});
		return _.reduce(buildQueues, async (chain: Promise<ICompareExportRowInfo[]>, fn: () => Promise<ICompareExportRowInfo[]>) => {
			const results = await chain;
			const items = await fn();
			return _.concat(results, items);
		}, Promise.resolve([]));
	}

	private getColorValue(value?: string | null) {
		if (!value) {
			return null;
		}

		let colorValue = null;
		let regResult = null;
		const regExp = new RegExp('color\\s*:\\s*([\\s\\S]+?);', 'g');
		while ((regResult = regExp.exec(value))) {
			colorValue = regResult[1];
		}
		if (colorValue) {
			const clearValue = colorValue.trim().toLowerCase();
			if (clearValue.startsWith('rgb')) {
				colorValue = 'RGB:' + clearValue.replace('rgb', '').replace('(', '').replace(')', '');
			} else if (clearValue.startsWith('rgba')) {
				colorValue = 'RGBA:' + clearValue.replace('rgba', '').replace('(', '').replace(')', '');
			} else if (clearValue.startsWith('#')) {
				colorValue = '#:' + clearValue.replace('#', '');
			} else {
				colorValue = 'N:' + clearValue;
			}
		}

		return colorValue;
	}

	private buildVatPercentLookupDataRows(lookupItems: ICompareExportVatPercent[]): ICompareExportRowInfo[] {
		let list: ICompareExportRowInfo[] = _.map<ICompareExportVatPercent, ICompareExportRowInfo>(lookupItems, item => {
			return {
				lv: 0,
				cl: [{
					f: 'Code',
					fv: item.Code
				}, {
					f: 'Description',
					fv: item.DescriptionInfo ? item.DescriptionInfo.Translated : undefined
				}, {
					f: 'VatPercent',
					v: item.VatPercent,
					vt: this.buildSimpleValueType('Decimal'),
					fv: item.VatPercent.toString(),
				}]
			};
		});

		list = _.concat(list, [{
			lv: 0,
			cl: [{
				f: 'Code',
				fv: '-'
			}, {
				f: 'Description',
				fv: '-'
			}, {
				f: 'VatPercent',
				v: 0,
				vt: this.buildSimpleValueType('Decimal'),
				fv: '0.00',
			}]
		}]);
		return list;
	}

	private async buildBoq(dataRows: ICompositeBoqEntity[], isExportedFormula: boolean, showProgressMessage: (text: string) => void) {
		const boqDataRows = this.utilSvc.flatTree(dataRows);
		const boqVerticalCompareRows = this.exportBoqSvc.isVerticalCompareRows();
		const boqExportColumns = this.exportBoqSvc.columnBuilder.getBuildColumns();
		const boqHeaders = this.buildHeader(boqExportColumns, this.exportBoqSvc.config.hide.columns);
		const filteredBoqRows = this.filterBoqRows(boqDataRows);
		const boqHeaderGroups = boqVerticalCompareRows ? this.buildHeaderGroup(boqExportColumns) : [];
		const boqUserData: ICompareExportBoqUserData = {
			showInSummaryRows: this.exportBoqSvc.compareCache.summaryRows,
			isFinalPriceRowActivated: this.utilSvc.isShowInSummaryActivated(this.exportBoqSvc.compareCache.summaryRows, CompareFields.finalPrice),
			decimalCompareFields: decimalCompareFields,
			booleanCompareFields: booleanCompareFields,
			integerCompareFields: integerCompareFields,
			boqRows: filteredBoqRows,
			leadingField: this.exportBoqSvc.compareCache.leadingRow.Field,
			visibleCompareRows: this.exportBoqSvc.compareCache.visibleCompareRows,
			visibleCompareColumns: this.exportBoqSvc.compareCache.visibleColumns,
			isCalculateAsPerAdjustedQuantity: this.exportBoqSvc.isCalculateAsPerAdjustedQuantity()
		};

		const boqRows = await this.buildDataRow(
			CompareTypes.BoQ,
			filteredBoqRows,
			boqExportColumns,
			isExportedFormula,
			boqVerticalCompareRows,
			this.exportBoqSvc.readMgr,
			this.lookupMap,
			boqUserData,
			this.exportBoqSvc.formulaRules,
			this.exportBoqSvc.config.hide.compareFields,
			this.exportBoqSvc.config.hide.quoteFields,
			row => this.utilSvc.isBoqRow(row.LineTypeFk),
			(row, isVerticalCompareRows) => this.isBoqRowFormulaSupported(row, isVerticalCompareRows),
			(column, isVerticalCompareRows) => this.isBoqColumnFormulaSupported(column, isVerticalCompareRows),
			showProgressMessage
		);

		return {
			headers: boqHeaders,
			headerGroups: boqHeaderGroups,
			rows: boqRows
		};
	}

	private async buildItem(dataRows: ICompositeItemEntity[], isExportedFormula: boolean, showProgressMessage: (text: string) => void) {
		const itemDataRows = this.utilSvc.flatTree(dataRows);
		const itemVerticalCompareRows = this.exportItemSvc.isVerticalCompareRows();
		const itemExportColumns = this.exportItemSvc.columnBuilder.getBuildColumns();
		const itemHeaders = this.buildHeader(itemExportColumns, this.exportItemSvc.config.hide.columns);
		const itemHeaderGroups = itemVerticalCompareRows ? this.buildHeaderGroup(itemExportColumns) : [];
		const itemUserData: ICompareExportItemUserData = {
			showInSummaryRows: this.exportItemSvc.compareCache.summaryRows,
			isTotalRowActivated: this.utilSvc.isShowInSummaryActivated(this.exportItemSvc.compareCache.summaryRows, CompareFields.total),
			leadingField: this.exportItemSvc.compareCache.leadingRow.Field,
			visibleCompareRows: this.exportItemSvc.compareCache.visibleCompareRows,
			visibleCompareColumns: this.exportItemSvc.compareCache.visibleColumns
		};

		const itemRows = await this.buildDataRow(
			CompareTypes.Item,
			itemDataRows,
			itemExportColumns,
			isExportedFormula,
			itemVerticalCompareRows,
			this.exportItemSvc.readMgr,
			this.lookupMap,
			itemUserData,
			this.exportItemSvc.formulaRules,
			this.exportItemSvc.config.hide.compareFields,
			this.exportItemSvc.config.hide.quoteFields,
			row => this.utilSvc.isPrcItemRow(row.LineTypeFk),
			(row, isVerticalCompareRows) => this.isPrcRowFormulaSupported(row, isVerticalCompareRows),
			(column, isVerticalCompareRows) => this.isPrcColumnFormulaSupported(column, isVerticalCompareRows),
			showProgressMessage
		);

		return {
			headers: itemHeaders,
			headerGroups: itemHeaderGroups,
			rows: itemRows
		};

	}

	private toExportVatPercent(items: ITaxCodeEntity[] | IMdcTaxCodeMatrixEntity[]): ICompareExportVatPercent[] {
		return items.map((m: ITaxCodeEntity | IMdcTaxCodeMatrixEntity) => {
			return {
				Id: m.Id,
				Code: m.Code,
				VatPercent: m.VatPercent,
				DescriptionInfo: m.DescriptionInfo
			};
		});
	}

	private async doExportCompareDataToExcel(isExportedFormula: boolean, showProgressMessage: (text: string) => void) {
		showProgressMessage(this.utilSvc.getTranslationText('procurement.pricecomparison.wizard.loadingRfqData'));
		const response = await Promise.all([this.exportItemSvc.reload(), this.exportBoqSvc.reload()]);

		this.lookupMap.Quote = _.uniqBy([...this.exportItemSvc.compareCache.quotes, ...this.exportBoqSvc.compareCache.quotes], e => e.Id);
		this.lookupMap.VatPercent = _.uniqBy([
			...this.toExportVatPercent(this.exportItemSvc.compareCache.taxCodes),
			...this.toExportVatPercent(this.exportItemSvc.compareCache.taxCodeMatrixes),
			...this.toExportVatPercent(this.exportBoqSvc.compareCache.taxCodes),
			...this.toExportVatPercent(this.exportBoqSvc.compareCache.taxCodeMatrixes)
		], e => e.Id);

		const boqResult = await this.buildBoq(response[1], isExportedFormula, showProgressMessage);
		const itemResult = await this.buildItem(response[0], isExportedFormula, showProgressMessage);

		const params: ICompareExportOptions = {
			RfqHeaderId: this.rfqSvc.getSelectedRfqId(),
			Sheets: [{
				SheetName: 'BoQ',
				Columns: boqResult.headers,
				Rows: boqResult.rows,
				ColumnGroups: boqResult.headerGroups
			}, {
				SheetName: 'Item',
				Columns: itemResult.headers,
				Rows: itemResult.rows,
				ColumnGroups: itemResult.headerGroups
			}, {
				SheetName: 'VatPercent',
				Columns: [{
					Field: 'Code',
					Name: 'Code',
					Width: 100,
					IsHidden: false,
					Span: 1
				}, {
					Field: 'Description',
					Name: 'Description',
					Width: 100,
					IsHidden: false,
					Span: 1
				}, {
					Field: 'VatPercent',
					Name: 'Value',
					Width: 100,
					IsHidden: false,
					Span: 1
				}],
				Rows: this.buildVatPercentLookupDataRows(this.lookupMap.VatPercent),
				ColumnGroups: []
			}]
		};

		showProgressMessage(this.utilSvc.getTranslationText('procurement.pricecomparison.wizard.uploadingRfqData'));
		const uploadResult = await this.utilSvc.uploadLargeObjectAsFile(params);

		showProgressMessage(this.utilSvc.getTranslationText('procurement.pricecomparison.wizard.exportingToExcel'));
		const exportResult = await this.httpSvc.post<{
			FileName: string;
			Path: string;
		}>('procurement/pricecomparison/export/excel/' + uploadResult.Uuid, null);

		this.downloadSvc.download(undefined, undefined, exportResult.FileName, exportResult.Path);

		this.resetExportConfig();
	}

	/**
	 *
	 */
	public async exportExcel() {
		if (!this.rfqSvc.hasSelection()) {
			return Promise.resolve();
		}

		return await this.commonDlgSvc.showExportExcelDialog(async info => {
			await this.doExportCompareDataToExcel(info.dialog.value === true, (text) => {
				info.dialog.message = text;
			});
		});
	}
}