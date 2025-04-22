/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { firstValueFrom, Observable } from 'rxjs';
import { CellChangeEvent, ConcreteFieldOverload, createLookup, FieldType, ILookupOptions } from '@libs/ui/common';
import { IQuoteStatusEntity } from '@libs/basics/interfaces';
import { BasicsSharedBasCurrencyLookupService, BasicsSharedPaymentTermLookupService, BasicsSharedQuoteStatusLookupService, BasicsSharedReqStatusLookupService, BasicsSharedStatusIconService } from '@libs/basics/shared';
import { CompareGridColumn, GridFormatter } from '../entities/compare-grid-column.interface';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';
import { IEntityContext, PlatformHttpService, PlatformPermissionService, ServiceLocator, Translatable } from '@libs/platform/common';
import { ProcurementPricecomparisonUtilService } from '../../services/util.service';
import { ProcurementPricecomparisonConfigurationService } from '../../services/configuration.service';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../services/compare-data-base.service';
import { ICompareTreeResponseBase } from '../entities/compare-tree-response-base.interface';
import { ICustomCompareColumnEntity } from '../entities/custom-compare-column-entity.interface';
import { CustomCompareColumnComposite, EvaluatedItemHandleMode, ReqHeaderComposite } from '../entities/wizard/custom-compare-column-composite.interface';
import { SingleQuoteContractWizardService } from '../../services/wizard/single-quote-contract-wizard.service';
import { CompareFields } from '../constants/compare-fields';
import { ICompareRowEntity } from '../entities/compare-row-entity.interface';
import { CompareRowTypes } from '../constants/compare-row-types';
import { ProcurementPricecomparisonBidderIdentityService } from '../../services/bidder-identity.service';
import { IExtendableObject } from '../entities/extendable-object.interface';
import { Constants } from '../constants/constants';
import { CompareCssStyleLessFields } from '../constants/compare-css-style-less-fields';
import { CompareRowLineTypes } from '../constants/compare-row-line-types';

export abstract class CompareColumnBaseBuilder<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>
> {
	protected readonly httpSvc = ServiceLocator.injector.get(PlatformHttpService);
	protected readonly permissionService = ServiceLocator.injector.get(PlatformPermissionService);
	protected readonly utilService = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly configService = ServiceLocator.injector.get(ProcurementPricecomparisonConfigurationService);
	protected readonly bidderSvc = ServiceLocator.injector.get(ProcurementPricecomparisonBidderIdentityService);
	protected readonly reqLookupSvc = ServiceLocator.injector.get(BasicsSharedReqStatusLookupService);

	protected constructor(
		protected dataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>,
		protected contractWizard: SingleQuoteContractWizardService
	) {

	}

	private _buildColumns: CompareGridColumn<T>[] = [];

	public abstract getAllColumns(): CompareGridColumn<T>[];

	public abstract getDefaultColumns(): CompareGridColumn<T>[];

	public abstract getCreateContractOptions(): { quoteGroupName: Translatable, buttonName: Translatable };

	public abstract get summaryTotalField(): string;

	public abstract customFormatQuoteColumnValue(row: number, cell: number, originalValue: unknown, formattedValue: unknown, columnDef: CompareGridColumn<T>, dataContext: T, quoteKey?: string, summaryTotalRow?: ICompareRowEntity, hasQuoteModulePermission?: boolean): string | null | undefined;

	public abstract customQuoteColumnRowCellEditor(dataContext: T, quoteColumn: ICustomCompareColumnEntity, columnDef: CompareGridColumn<T>, columnDomainFn: unknown): Observable<ConcreteFieldOverload<T>>;

	private getImageColumns(): CompareGridColumn<T>[] {
		return [];
		// TODO-DRIZZLE: To be checked.
		/*return [{
			id: 'indicator',
			name: '',
			field: 'indicator',
			width: 20,
			minWidth: 20,
			resizable: false,
			sortable: false,
			behavior: 'selectAndMove',
			formatter: 'indicator',
			// formatter: treeHandleFormat('indicator'),
			cssClass: 'indicator dnd',
			pinned: true,
			hidden: false,
			focusable: true
		}, {
			id: 'tree',
			name: 'Structure',
			name$tr$: 'platform.gridTreeHeader',
			toolTip: 'Structure',
			toolTip$tr$: 'platform.gridTreeHeader',
			field: 'tree',
			width: 100,
			minWidth: 40,
			resizable: true,
			sortable: false,
			formatter: 'tree',
			// formatter: treeHandleFormat('tree'),
			pinned: true,
			hidden: false,
			focusable: true
		}];*/
	}

	private getIndexForBidder(configColumns: CompareGridColumn<T>[]) {
		const userColumns = _.filter(configColumns, (col) => {
			return !_.includes(['indicator', 'tree'], col.id);
		});
		const bidderCol = _.find(userColumns, (item) => {
			return item.id === '_rt$bidder' && item.hidden;
		}) as CompareGridColumn<T>;

		let dynamicCol = _.find(userColumns, (item) => {
			return _.startsWith(item.id, 'QuoteCol_') && item.hidden;
		}) as CompareGridColumn<T>;

		const firstDynamicCol = _.find(userColumns, (item) => {
			return _.startsWith(item.id, 'QuoteCol_');
		});

		if (dynamicCol && firstDynamicCol) {
			dynamicCol = firstDynamicCol;
		}

		const holderPos = bidderCol ? _.findIndex(userColumns, (item) => {
			return item.id === bidderCol.id;
		}) : (!dynamicCol ? -1 : _.findIndex(userColumns, (item) => {
			return dynamicCol.id === item.id;
		}));

		return {
			bidderCol: bidderCol,
			holderPos: holderPos
		};
	}

	private setFormatterForQuoteColumn(columnDef: CompareGridColumn<T>, allRfqCharacteristic: unknown, allQuoteCharacteristic: unknown) {
		// TODO-DRIZZLE: Add custom formatter to append action buttons to the cell.
		/*const quoteId = this.utilService.getQuoteId(columnDef.id);
		const options = this.getCreateContractOptions();
		this.showCreateContractDialog(quoteId, null, options.quoteGroupName).then(() => {

		});*/
	}

	protected addCellCssClass(column: CompareGridColumn<T>, cssClass: string = 'cell-right') {
		column.cssClass = (column.cssClass ?? '').split(' ').filter(e => e.trim() !== cssClass.trim()).concat(cssClass).join(' ');
	}

	protected toString(value: unknown) {
		return _.toString(value);
	}

	protected generateCreateContractButtonTemplate(dataContext: T, columnDef: CompareGridColumn<T>) {
		return this.utilService.createGridCellButtonTemplateAsNavigator(columnDef, dataContext, 'procurement.pricecomparison.wizard.createContractForItem', async () => {
			const qtnHeaderId = this.utilService.getQuoteId(columnDef.id);
			const options = this.getCreateContractOptions();
			await this.showCreateContractDialog(qtnHeaderId, dataContext.ReqHeaderId, options.quoteGroupName);
		}, {
			icon: 'ico-append'
		});
	}

	protected formatPercentageAndRank(row: ICompareRowEntity, dataContext: T, columnDef: CompareGridColumn<T>, quoteKey?: string, isVerticalCompareRows?: boolean) {
		if (this.bidderSvc.isReference(quoteKey)) {
			return Constants.tagForNoQuote;
		} else {
			const dataItems = (row.Field === CompareFields.percentage ? dataContext.percentages : dataContext.ranks) as IExtendableObject<number>;
			const formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, row.Field, dataItems[quoteKey as string]);
			const statisticValue = this.utilService.statisticValue(dataItems);
			return this.utilService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataItems[quoteKey as string] as number, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, isVerticalCompareRows);
		}
	}

	protected showAddOrInsertDialog(column: CompareGridColumn<T>, entity: T, options: object) {
		// TODO-DRIZZLE: To be checked.
	}

	protected createInsertItemButton(column: CompareGridColumn<T>, entity: T, disabled: boolean, insertOptions: () => object, insertNote: string) {
		if (this.bidderSvc.isReference(column.field)) {
			return '';
		}
		return this.utilService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.insertItem', () => {
			this.showAddOrInsertDialog(column, entity, {
				headerText: this.utilService.getTranslationText('procurement.pricecomparison.wizard.insertItem'),
				insertNote: this.utilService.getTranslationText(insertNote),
				createParams: {
					InsertOptions: insertOptions()
				}
			});
		}, {
			disabled: disabled,
			icon: 'ico-boq-item-new'
		});
	}

	private formatTotalValuesExcludeTarget(dataContext: T, columnDef: CompareGridColumn<T>, originalValue: unknown, formattedValue: unknown, summaryTotalRow?: ICompareRowEntity, quoteKey?: string) {
		if (summaryTotalRow && this.bidderSvc.isNotReference(quoteKey)) {
			const staticValue = this.utilService.statisticValue(dataContext.totalValuesExcludeTarget as number[]);
			formattedValue = this.utilService.setStyleForCellValueUsingTagSpan(summaryTotalRow.ConditionalFormat, originalValue as number, formattedValue as string, columnDef, dataContext, staticValue.minValue, staticValue.maxValue, staticValue.avgValue, columnDef.isVerticalCompareRows);
		}

		return formattedValue;
	}

	private formatQuoteColumnValue(
		row: number,
		cell: number,
		originalValue: unknown,
		columnDef: CompareGridColumn<T>,
		dataContext: T,
		quoteKey?: string,
		summaryTotalRow?: ICompareRowEntity,
		hasQuoteModulePermission?: boolean
	): string | undefined | null {
		let formattedValue: unknown = originalValue;

		// Clear formatter options.
		if (columnDef.formatterOptions) {
			columnDef.formatterOptions = undefined;
			columnDef.dynamicFormatterFn = undefined;
		}

		switch (dataContext.LineTypeFk) {
			case CompareRowTypes.grandTotal:
			case CompareRowTypes.evaluatedTotal:
			case CompareRowTypes.offeredTotal:
			case CompareRowTypes.totalType:
				if (columnDef.isVerticalCompareRows) {
					formattedValue = '';
				} else {
					formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, '', originalValue);
					formattedValue = this.formatTotalValuesExcludeTarget(dataContext, columnDef, originalValue, formattedValue, summaryTotalRow, quoteKey);

					if (this.bidderSvc.isNotReference(columnDef.field)) {
						let navArrow = '';
						if (this.permissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
							navArrow = this.generateCreateContractButtonTemplate(dataContext, columnDef) + ' ';
						}
						if (!columnDef.isIdealBidder) {
							navArrow += this.utilService.getNavigationToQuote(columnDef, dataContext, !hasQuoteModulePermission);
						}
						return navArrow + ' ' + formattedValue;
					}
				}
				break;
			case  CompareRowTypes.grandTotalRank:
				formattedValue = this.bidderSvc.isNotReference(quoteKey) ? originalValue : '';
				break;
			case CompareRowTypes.rfq:
				formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, '', originalValue);
				formattedValue = this.formatTotalValuesExcludeTarget(dataContext, columnDef, originalValue, formattedValue, summaryTotalRow, quoteKey);
				break;
			case CompareRowTypes.quoteDate:
			case CompareRowTypes.receiveDate:
			case CompareRowTypes.priceFixingDate:
				if (columnDef.isVerticalCompareRows && !_.includes([CompareFields.quoteDate, CompareFields.receiveDate, CompareFields.priceFixingDate], columnDef.originalField)) {
					formattedValue = '';
				} else {
					if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
						if (dataContext[quoteKey as string] && !_.isString(dataContext[quoteKey as string]) && originalValue) {
							formattedValue = this.utilService.formatValue(FieldType.Date, row, cell, originalValue, columnDef, dataContext);
						}
					}
				}
				break;
			case  CompareRowTypes.quoteVersion:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field) && originalValue) {
					const rawValue = this.utilService.formatValue(FieldType.Integer, row, cell, originalValue, columnDef, dataContext);
					formattedValue = rawValue ? rawValue.toString() : '';
				}
				break;
			case CompareRowTypes.quoteStatus:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
					formattedValue = this.utilService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
						dataServiceToken: BasicsSharedQuoteStatusLookupService,
						displayMember: 'Description',
						imageSelector: ServiceLocator.injector.get(BasicsSharedStatusIconService<IQuoteStatusEntity, T>)
					});
				}
				break;
			case CompareRowTypes.quoteCurrency:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
					formattedValue = this.utilService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
						dataServiceToken: BasicsSharedBasCurrencyLookupService,
						displayMember: 'Currency'
					});
				}
				break;
			case CompareRowTypes.incoterms:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
					formattedValue = this.utilService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
						dataServiceToken: BasicsSharedPaymentTermLookupService,
						displayMember: 'Description'
					});
				}
				break;
			case CompareRowTypes.quotePaymentTermPA:
			case CompareRowTypes.quotePaymentTermFI:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
					formattedValue = this.utilService.lookupFormatter(row, cell, originalValue, dataContext, columnDef, {
						dataServiceToken: BasicsSharedPaymentTermLookupService,
						displayMember: 'Code'
					});
				}
				break;
			case CompareRowTypes.evaluationRank:
			case CompareRowTypes.avgEvaluationRank:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field) && originalValue) {
					const rawValue = this.utilService.formatValue(FieldType.Integer, row, cell, originalValue, columnDef, dataContext);
					formattedValue = rawValue ? rawValue.toString() : '';
				} else {
					formattedValue = '';
				}
				break;
			case CompareRowTypes.quoteExchangeRate:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field) && originalValue) {
					const rawValue = this.utilService.formatValue(FieldType.Quantity, row, cell, originalValue, columnDef, dataContext);
					formattedValue = rawValue ? rawValue.toString() : '';
				} else {
					formattedValue = '';
				}
				break;
			case CompareRowTypes.overallDiscount:
			case CompareRowTypes.overallDiscountOc:
			case CompareRowTypes.overallDiscountPercent:
			case CompareRowTypes.percentDiscount:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
					originalValue = originalValue || 0;
					const rawValue = this.utilService.formatValue(FieldType.Percent, row, cell, (originalValue || 0), columnDef, dataContext) + '%';
					return rawValue ? rawValue.toString() : '';
				} else {
					formattedValue = '';
				}
				break;
			case CompareRowTypes.evaluationResult:
			case CompareRowTypes.billingSchemaGroup:
			case CompareRowTypes.billingSchemaChildren:
			case CompareRowTypes.turnover:
			case CompareRowTypes.avgEvaluationA:
			case CompareRowTypes.avgEvaluationB:
			case CompareRowTypes.avgEvaluationC:
				if (CompareRowTypes.billingSchemaGroup !== dataContext.LineTypeFk && columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field) && originalValue) {
					if (!columnDef.isIdealBidder && _.includes([CompareRowTypes.avgEvaluationA, CompareRowTypes.avgEvaluationB, CompareRowTypes.avgEvaluationC], dataContext.LineTypeFk)) {
						formattedValue = _.isNumber(originalValue) ? Math.round(originalValue) : originalValue;
					} else {
						formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, columnDef.field, originalValue);
					}
					if (summaryTotalRow) {
						const statisticValue = this.utilService.statisticValue(dataContext.totals as IExtendableObject<number>);
						formattedValue = this.utilService.setStyleForCellValueUsingTagSpan(summaryTotalRow.ConditionalFormat, originalValue as number, formattedValue as string, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, columnDef.isVerticalCompareRows);
					}
				} else {
					formattedValue = '';
				}
				break;
			case CompareRowTypes.characteristic:
				formattedValue = this.utilService.formatCharacteristic(dataContext, columnDef, this.dataSvc.compareCache.rfqCharacteristic, quoteKey, originalValue);
				break;
			case CompareRowTypes.generalTotal:
				formattedValue = originalValue;
				break;
			case CompareRowTypes.generalItem:
				if (dataContext.totals) {
					dataContext.totals[quoteKey as string] = originalValue as number;
				}
				formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, '', originalValue);
				if (summaryTotalRow && this.bidderSvc.isNotReference(columnDef.field)) {
					formattedValue = this.utilService.setStyleForCellValueUsingTagSpan(summaryTotalRow.ConditionalFormat, originalValue as number, formattedValue as string, columnDef, dataContext, undefined, undefined, undefined, columnDef.isVerticalCompareRows);
				}
				break;
			case CompareRowTypes.compareField:
				formattedValue = this.dataSvc.readMgr.readCellFormattedValue(row, cell, dataContext, columnDef);
				break;
			case CompareRowTypes.quoteRemark:
				if (_.isFunction(columnDef.domain)) {
					columnDef.domain(dataContext, columnDef);
				}
				formattedValue = _.isFunction(columnDef.dynamicFormatterFn) ? columnDef.dynamicFormatterFn(dataContext) : '';
				break;
			case CompareRowTypes.discountBasis:
			case CompareRowTypes.discountBasisOc:
			case CompareRowTypes.discountAmount:
			case CompareRowTypes.discountAmountOc:
				if (columnDef.isDynamic && this.bidderSvc.isNotReference(columnDef.field)) {
					originalValue = originalValue || 0;
					formattedValue = this.utilService.formatValue(FieldType.Money, row, cell, originalValue, columnDef, dataContext);
				} else {
					formattedValue = '';
				}
				break;
			default:
				formattedValue = originalValue;
		}

		formattedValue = this.customFormatQuoteColumnValue(row, cell, originalValue, formattedValue, columnDef, dataContext, quoteKey, summaryTotalRow, hasQuoteModulePermission);

		return this.toString(formattedValue);
	}

	private applyCustomCssStyleForQuoteColumn(dataContext: T, columnDef: CompareGridColumn<T>, originalValue: unknown, formattedValue?: string | null, quoteKey?: string) {
		const isVerticalCompareRows = columnDef.isVerticalCompareRows;
		if (this.bidderSvc.isNotReference(quoteKey)) {
			const compareField = this.dataSvc.getCompareFieldName(dataContext);
			const isCompareRowCell = isVerticalCompareRows ? columnDef.isVerticalCompareRows && CompareRowLineTypes.includes(dataContext.LineTypeFk) : dataContext.LineTypeFk === CompareRowTypes.compareField;
			const conditionalFormat = isVerticalCompareRows ? this.dataSvc.compareCache.visibleCompareRows.find(e => e.Field === compareField)?.ConditionalFormat : dataContext['ConditionalFormat'];
			if (isCompareRowCell && conditionalFormat && !_.includes(CompareCssStyleLessFields, compareField)) {
				const deviationRow = dataContext[columnDef.id + Constants.deviationRow] as boolean;
				const highlightQtn = dataContext[columnDef.id + Constants.highlightQtn] as boolean;
				formattedValue = this.utilService.setStyleForCellValueUsingTagDiv(conditionalFormat as string, this.dataSvc.deviationFields, compareField, originalValue as number, formattedValue as string, columnDef, dataContext, highlightQtn, deviationRow, undefined, undefined, undefined, columnDef.isVerticalCompareRows);
			}
		}

		return formattedValue;
	}

	private applyCustomFormatterForQuoteColumn(quoteColumns: CompareGridColumn<T>[]) {
		const hasQuoteModulePermission = this.utilService.hasPermissionForModule('procurement.quote');
		const summaryTotalRow = this.dataSvc.compareCache.summaryRows.find(e => e.Field === this.summaryTotalField);

		quoteColumns.forEach(col => {
			col.customFormatter = (row: number, cell: number, value: unknown, columnDef: CompareGridColumn<T>, dataContext: T) => {
				const quoteKey = columnDef.isVerticalCompareRows ? columnDef.quoteKey : columnDef.field;
				const originalValue = this.dataSvc.readMgr.readCellValue(dataContext, columnDef);
				const formattedValue = this.formatQuoteColumnValue(row, cell, originalValue, columnDef, dataContext, quoteKey, summaryTotalRow, hasQuoteModulePermission);
				const cssFormattedValue = this.applyCustomCssStyleForQuoteColumn(dataContext, columnDef, originalValue, formattedValue, quoteKey);
				return this.toString(cssFormattedValue);
			};
		});
	}

	private getGridConfigColumns(configColumns: CompareGridColumn<T>[], staticColumns: CompareGridColumn<T>[], dynamicColumns: CompareGridColumn<T>[], costGroupColumns: CompareGridColumn<T>[]) {
		const columns: CompareGridColumn<T>[] = [];

		const treeColumn = _.find(configColumns, (item) => {
			return item && item.id === 'tree';
		});

		configColumns = _.filter(configColumns, (item) => {
			return item && item.id !== 'tree';
		});

		// extend static and dynamic quote columns with custom settings
		for (let i = 0; i < configColumns.length; i++) {
			const colDef = _.find(staticColumns, col => col.id === configColumns[i].id) || _.find(dynamicColumns, col => col.id === configColumns[i].id);
			if (colDef) {
				colDef.hidden = !colDef.isDynamic ? !configColumns[i].hidden : colDef.hidden;
				colDef.keyboard = configColumns[i].keyboard;
				// colDef.pinOrder = configColumns[i].pinOrder; TODO-DRIZZLE: To be checked.
				colDef.pinned = configColumns[i].pinned;
				colDef.userLabelName = configColumns[i].userLabelName;
				colDef.width = configColumns[i].width;
			}
			if (colDef && !colDef.isDynamic) {
				columns.push(_.cloneDeep(colDef));
			}
		}

		// (2) keep the columns which not exist in config columns, but exsit in static columns
		//    for the old custom config columns in database which is wrong and never shown in UI.
		//    so need be update the config columns from the default static columns
		for (let m = 0; m < staticColumns.length; m++) {
			const staticCol = _.find(configColumns, {id: staticColumns[m].id});
			if (!staticCol) {
				const cloneColumn = _.cloneDeep(staticColumns[m]);
				cloneColumn.hidden = !cloneColumn.hidden;
				columns.push(cloneColumn);
			}
		}

		// (3) add dynamic columns to the right place that user configured.

		const holder = this.getIndexForBidder(configColumns);
		const bidderCol = holder.bidderCol as CompareGridColumn<T>;

		let n = 0, columnStartIndex = holder.holderPos;
		for (; n < dynamicColumns.length && holder.holderPos >= 0; n++) {
			columns.splice(columnStartIndex, 0, dynamicColumns[n]);
			columnStartIndex++;
		}

		// Reset dynamic column's width
		if (bidderCol && bidderCol.children && bidderCol.children.length > 0) {
			const children = bidderCol.children;
			_.each(dynamicColumns, function (col) {
				const terms = (col.field ?? '').split('_');
				const field = terms.length === 5 ? terms[4] : 'LineValue';
				const configCol = _.find(children, {field: field});
				if (configCol) {
					col.width = configCol.width;
				}
			});
		}

		// Cost Group TODO-DRIZZLE: To be migrated.
		// service.mergeCostGroupColumns(costGroupColumns, configColumns, columns, function (item) {
		// 	item.hidden = !item.hidden;
		// });

		// add structure column
		const imageColumns = _.cloneDeep(this.getImageColumns());
		if (treeColumn && imageColumns[1]) {
			imageColumns[1].width = treeColumn.width;
		}

		// TODO-DRIZZLE: To be checked.
		//platformTranslateService.translateGridConfig(allColumns);

		return imageColumns.concat(columns);
	}

	private createQuoteColumns(columnDomainFn: unknown, isVerticalCompareRows: boolean | undefined, isLineValueColumn: boolean | undefined, configColumns: CompareGridColumn<T>[]) {
		let quoteColumns: CompareGridColumn<T>[] = [];
		const compareColumns = this.dataSvc.compareCache.visibleColumns;
		const compareRows = this.dataSvc.compareCache.visibleCompareRows;

		const columnBidder = configColumns.find(col => col.id === '_rt$bidder') as CompareGridColumn<T>;
		let lineValue: CompareGridColumn<T> | null | undefined = null;
		if (columnBidder) {
			lineValue = columnBidder.children ? columnBidder.children.find(col => _.get(col, 'field') === 'LineValue' || _.get(col, 'model') === 'LineValue') : null;
		}
		if (!lineValue) {
			lineValue = configColumns.find(col => col.isLineValue === true) as CompareGridColumn<T>;
		}

		_.forEach(compareColumns, (quoteColumn, index) => {
			let compareColumns: CompareGridColumn<T>[] = [];
			const columnDef = {
				id: quoteColumn.Id,
				label: {
					text: isVerticalCompareRows ? 'Line Value' : quoteColumn.Description || this.utilService.translateTargetOrBaseBoqName(quoteColumn.Id),
					key: isVerticalCompareRows ? 'procurement.pricecomparison.lineValue' : '',
				},
				cssClass: 'cell-right',
				groupName: quoteColumn.Description || this.utilService.translateTargetOrBaseBoqName(quoteColumn.Id),
				name: isVerticalCompareRows ? 'Line Value' : quoteColumn.Description || this.utilService.translateTargetOrBaseBoqName(quoteColumn.Id),
				name$tr$: isVerticalCompareRows ? 'procurement.pricecomparison.lineValue' : '',
				userLabelName: isVerticalCompareRows && lineValue && lineValue.userLabelName ? lineValue?.userLabelName : '',
				model: quoteColumn.Id,
				field: quoteColumn.Id,
				width: 100,
				searchable: true,
				sortable: false,
				hidden: isVerticalCompareRows && !isLineValueColumn,
				isDynamic: true,     // dynamic column
				isLineValue: true,
				isIdealBidder: quoteColumn.IsIdealBidder,
				backgroundColor: quoteColumn.BackgroundColor,
				groupIndex: index,
				readonly: true, // TODO-DRIZZLE: To be checked.
				type: FieldType.Dynamic,
				overload: (ctx: IEntityContext<T>) => {
					return this.customQuoteColumnRowCellEditor(ctx.entity as T, quoteColumn, columnDef, columnDomainFn);
				}
			} as unknown as CompareGridColumn<T>;
			this.setFormatterForQuoteColumn(columnDef, this.dataSvc.compareCache.allRfqCharacteristic, this.dataSvc.compareCache.allQuoteCharacteristic);

			compareColumns.push(columnDef);

			// Vertical additional columns
			if (isVerticalCompareRows) {
				_.each(compareRows, (row) => {
					if (this.utilService.isExcludedCompareRowInVerticalMode(row.Field)) {
						return;
					}
					const quoteKey = quoteColumn.Id;
					const columnField = this.utilService.getCombineCompareField(quoteKey, row.Field);
					const compareColumn = {
						id: columnField,
						label: {
							text: row.DisplayName ? row.DisplayName : row.Description
						},
						cssClass: 'cell-right',
						groupName: quoteColumn.Description || this.utilService.translateTargetOrBaseBoqName(quoteColumn.Id),
						name: row.DisplayName ? row.DisplayName : row.Description,
						model: columnField,
						field: columnField,
						quoteKey: quoteKey,
						originalField: row.Field,
						isVerticalCompareRows: true,
						width: 100,
						searchable: true,
						sortable: false,
						hidden: false,
						isDynamic: true,
						isIdealBidder: quoteColumn.IsIdealBidder,
						backgroundColor: quoteColumn.BackgroundColor,
						groupIndex: index,
						type: FieldType.Dynamic,
						overload: (ctx: IEntityContext<T>) => {
							return this.customQuoteColumnRowCellEditor(ctx.entity as T, quoteColumn, columnDef, columnDomainFn);
						}
					} as unknown as CompareGridColumn<T>;
					this.setFormatterForQuoteColumn(compareColumn, this.dataSvc.compareCache.allRfqCharacteristic, this.dataSvc.compareCache.allQuoteCharacteristic);
					compareColumns.push(compareColumn);
				});
				compareColumns = this.utilService.sortQuoteColumns(compareColumns, columnBidder);
			}

			quoteColumns = quoteColumns.concat(compareColumns);
		});

		this.applyCustomFormatterForQuoteColumn(quoteColumns);

		return quoteColumns;
	}

	private getGridViewColumns(): CompareGridColumn<T>[] {
		const config = this.utilService.getViewConfig(this.dataSvc.containerUuid);
		let columns: CompareGridColumn<T>[] = [];
		if (config && config.Propertyconfig) {
			if (_.isArray(config.Propertyconfig)) {
				columns = config.Propertyconfig as unknown as CompareGridColumn<T>[];
			} else {
				columns = JSON.parse(config.Propertyconfig) as unknown as CompareGridColumn<T>[];
			}
		}
		return columns;
	}

	protected createColumn(id: string, model: string, label: Translatable, type: FieldType, width: number, formatter?: GridFormatter<T>): CompareGridColumn<T> {
		return {
			id: id,
			model: model,
			field: model,
			label: label,
			name: this.utilService.getTranslationText(label),
			type: type,
			sortable: false,
			searchable: true,
			visible: true,
			width: width,
			readonly: true, // TODO-DRIZZLE:To be checked.
			customFormatter: formatter ? formatter : (row: number, col: number, value: string, column: CompareGridColumn<T>, dataContext: T) => {
				const originalValue = dataContext[column.field as string];
				return originalValue === undefined || originalValue === null ? '' : value; // TODO: undefined/null value should be manipulated in platform formatter
			}
		} as unknown as CompareGridColumn<T>;
	}

	protected createLookupColumn<TItem extends object>(id: string, model: string, label: Translatable, width: number, lookupOptions: ILookupOptions<TItem, T>): CompareGridColumn<T> {
		return {
			...this.createColumn(id, model, label, FieldType.Lookup, width), lookupOptions: createLookup(lookupOptions)
		};
	}

	protected getCompareDescriptionColumn(): CompareGridColumn<T> {
		return this.createColumn('compareDescription', 'CompareDescription', {text: 'Compare Description', key: 'procurement.pricecomparison.compareDescription'}, FieldType.Description, 200);
	}

	protected getBidderColumn(): CompareGridColumn<T> {
		return this.createColumn('_rt$bidder', 'Bidder', {text: 'Bidder', key: 'procurement.pricecomparison.printing.bidder'}, FieldType.Dynamic, 80);
	}

	protected getLineValueColumn(): CompareGridColumn<T> {
		return this.createColumn('lineName', 'LineName', {text: 'Line Name', key: 'procurement.pricecomparison.lineName'}, FieldType.Description, 135);
	}

	protected getStatisticsColumns(
		minValueIncludeTargetFormatter?: GridFormatter<T>,
		maxValueIncludeTargetFormatter?: GridFormatter<T>,
		averageValueIncludeTargetFormatter?: GridFormatter<T>,
		minValueExcludeTargetFormatter?: GridFormatter<T>,
		maxValueExcludeTargetFormatter?: GridFormatter<T>,
		averageValueExcludeTargetFormatter?: GridFormatter<T>,
	): CompareGridColumn<T>[] {
		return [
			// MAX MIN AVERAGE Columns
			this.createColumn('minValueIncludeTarget', 'MinimumValue', {text: 'MinT', key: 'procurement.pricecomparison.compareMinValueIncludeTarget'}, FieldType.Money, 80, minValueIncludeTargetFormatter),
			this.createColumn('maxValueIncludeTarget', 'MaximumValue', {text: 'MaxT', key: 'procurement.pricecomparison.compareMaxValueIncludeTarget'}, FieldType.Money, 80, maxValueIncludeTargetFormatter),
			this.createColumn('averageValueIncludeTarget', 'AverageValue', {text: 'AverageT', key: 'procurement.pricecomparison.compareAverageValueIncludeTarget'}, FieldType.Money, 80, averageValueIncludeTargetFormatter),
			this.createColumn('minValueExcludeTarget', 'MinValueExcludeTarget', {text: 'Min', key: 'procurement.pricecomparison.compareMinValueExcludeTarget'}, FieldType.Money, 80, minValueExcludeTargetFormatter),
			this.createColumn('maxValueExcludeTarget', 'MaxValueExcludeTarget', {text: 'Max', key: 'procurement.pricecomparison.compareMaxValueExcludeTarget'}, FieldType.Money, 80, maxValueExcludeTargetFormatter),
			this.createColumn('averageValueExcludeTarget', 'AverageValueExcludeTarget', {text: 'Average', key: 'procurement.pricecomparison.compareAverageValueExcludeTarget'}, FieldType.Money, 80, averageValueExcludeTargetFormatter),
		];
	}

	protected buildCustomColumns(columns: CompareGridColumn<T>[]) {
		return columns;
	}

	protected async showCreateContractDialog(quoteId: number, reqHeaderId?: number | null, quoteGroupName?: Translatable) {
		return await this.contractWizard.showCreateContractWizardDialog({
			loadOptions: async () => {
				const items = await this.contractWizard.load(quoteId, reqHeaderId);
				const hasContractItem = await this.httpSvc.post<boolean>('procurement/common/wizard/hascontracteddata', {MainItemIds: [quoteId], ModuleName: 'procurement.quote'});
				const hasChangeOrder = this.dataSvc.parentService.isSelectedItemHasChangeOrder();
				return {
					selectedQuoteIndex: 0,
					showContractNote: hasContractItem,
					hasChangeOrder: hasChangeOrder,
					evaluatedItemHandleMode: EvaluatedItemHandleMode.Takeover,
					items: items,
					quoteGroupName: quoteGroupName,
					onRequisitionCellChanged: async (evt: CellChangeEvent<ReqHeaderComposite>) => {
						if (evt.column.id === 'isChecked') {
							this.contractWizard.updateSelectedReqHeaderIds(evt.item);
							const reqHeaderIds = this.contractWizard.getSelectedReqHeaderIds();
							const reqHeaders = this.contractWizard.getReqHeaders();
							const invalidReqs: string[] = [];
							return firstValueFrom(this.reqLookupSvc.getList()).then((data) => {
								reqHeaders.forEach((reqHeader) => {
									if (_.includes(reqHeaderIds, reqHeader.Id)) {
										const reqStatus = _.find(data, {Id: reqHeader.ReqStatusFk});
										if (reqStatus && reqStatus.Isordered) {
											invalidReqs.push(reqHeader.Code);
										}
									}
								});

								return {
									status: invalidReqs.length === 0,
									error: invalidReqs.length ? this.utilService.getTranslationText('procurement.pricecomparison.wizard.create.contract.reqStatusIsOrderedDeny', {
										req: invalidReqs.join(' ')
									}) : ''
								};
							});
						}

						return Promise.resolve({status: true});
					},
					onSelectChanged: (selectedItem: CustomCompareColumnComposite) => {
						this.contractWizard.clearSelectedReqHeaderId2ReqVariantIdsMap();
						return Promise.resolve();
					},
					getAllReqHeaders: (selectedItem: CustomCompareColumnComposite, items: CustomCompareColumnComposite[]) => {
						return Promise.resolve(this.contractWizard.getAllReqHeaders());
					},
					customNote: () => {
						const info = this.contractWizard.getSelectedReqTotal();
						return [
							this.utilService.getTranslationText('procurement.pricecomparison.compareQuoteSubtotal'),
							info.count,
							this.utilService.getTranslationText('procurement.pricecomparison.htmlTranslate.items'),
							info.total
						].join(' ');
					}
				};
			}
		});
	}

	public getCostGroupColumns(): CompareGridColumn<T>[] {
		return [];
	}

	public getGridLayoutColumns() {
		const verticalCompareRows = _.filter(this.dataSvc.compareCache.visibleCompareRows, (row) => {
			return !this.utilService.isExcludedCompareRowInVerticalMode(row.Field);
		});
		return this.utilService.getGridLayoutColumns(
			this.getDefaultColumns(),
			this.dataSvc.compareCache.columns,
			verticalCompareRows,
			this.dataSvc.isVerticalCompareRows(),
			this.getCostGroupColumns(),
			this.getGridViewColumns()
		);
	}

	public buildColumns(): CompareGridColumn<T>[] {
		// platformGridAPI.grids.columnGrouping(service.gridId, false);
		let configColumns = this.getGridViewColumns();
		const staticalColumns = this.getAllColumns();
		const costGroupColumns = this.getCostGroupColumns();
		const allColumns = [...staticalColumns, ...costGroupColumns];

		const existing = _.intersectionBy(configColumns, allColumns, 'id');
		if (existing && existing.length === 0) {
			configColumns = _.map(allColumns, column => {
				// column.hidden = !!column.hidden; TODO-DRIZZLE: To be checked.
				return column;
			});
			this.configService.setViewConfig(this.dataSvc.containerUuid, allColumns);
		}

		const isVerticalCompareRows = this.dataSvc.isVerticalCompareRows();
		const isLineValueColumn = this.dataSvc.isLineValueColumnVisible();
		const columnDomainFn = null; // TODO-DRIZZLE: To be migrated.

		const quoteColumns = this.createQuoteColumns(columnDomainFn, isVerticalCompareRows, isLineValueColumn, configColumns);
		const defaultColumns = this.getDefaultColumns();

		const columns = this.getGridConfigColumns(configColumns, defaultColumns, quoteColumns, costGroupColumns);
		_.each(columns, (column, index) => {
			if (!column.pinned && !column.isDynamic) {
				column.groupName = this.utilService.textPadding('', ' ', index + 1);
			}
		});
		return this.buildCustomColumns(this._buildColumns = columns);
	}

	public getBuildColumns(): CompareGridColumn<T>[] {
		return this._buildColumns;
	}
}