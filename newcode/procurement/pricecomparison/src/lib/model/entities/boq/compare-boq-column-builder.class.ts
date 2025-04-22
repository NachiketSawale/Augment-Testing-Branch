/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable, from } from 'rxjs';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedItemType2LookupService, BasicsSharedItemTypeLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ConcreteFieldOverload, createLookup, FieldType } from '@libs/ui/common';
import { CompareColumnBaseBuilder } from '../../classes/compare-column-base-builder.class';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';
import { ICompareBoqTreeResponse } from './compare-boq-tree-response.interface';
import { CompareGridColumn } from '../compare-grid-column.interface';
import { ProcurementPricecomparisonCompareBoqDataBaseService } from '../../../services/data/boq/compare-boq-data-base.service';
import { ProcurementPricecomparisonSingleQuoteContractWizardBoqService } from '../../../services/wizard/single-quote-contract-wizard.service';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { CompareFields } from '../../constants/compare-fields';
import { CompareRowTypes } from '../../constants/compare-row-types';
import { Constants } from '../../constants/constants';
import { boqSummaryFields } from '../../constants/boq/boq-summary-fields';
import { CompareBoqColumnFormatter } from './compare-boq-column-formatter.class';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { BoqEditableCompareFields } from '../../constants/boq/boq-editable-compare-fields';
import { BoqAllowEditVisibleFields } from '../../constants/boq/boq-allow-edit-visible-fields';

export class CompareBoqColumnBuilder extends CompareColumnBaseBuilder<ICompositeBoqEntity, ICompareBoqTreeResponse> {
	private colFormatter = new CompareBoqColumnFormatter();

	public constructor(
		private boqDataSvc: ProcurementPricecomparisonCompareBoqDataBaseService
	) {
		super(boqDataSvc, ServiceLocator.injector.get(ProcurementPricecomparisonSingleQuoteContractWizardBoqService));
	}

	public get summaryTotalField(): string {
		return CompareFields.finalPrice;
	}

	private getBasicsColumns(): CompareGridColumn<ICompositeBoqEntity>[] {
		return [
			// Compare Description Column
			super.getCompareDescriptionColumn(),
			// Common Columns
			super.createColumn('boqLineType', 'BoqLineType', {text: 'BoQ Line Type', key: 'boq.main.BoqLineTypeFk'}, FieldType.Description, 100),
			super.createColumn('reference', 'Reference', {text: 'Reference No.', key: 'boq.main.Reference'}, FieldType.Description, 105),
			super.createColumn('brief', 'Brief', {text: 'Outline Specification', key: 'cloud.common.entityBriefInfo'}, FieldType.Description, 130),
			super.createColumn('itemInfo', 'ItemInfo', {text: 'ItemInfo', key: 'boq.main.ItemInfo'}, FieldType.Description, 130),
			super.createColumn('aan', 'Aan', {text: 'AAN', key: 'boq.main.AAN'}, FieldType.Description, 80),
			super.createColumn('agn', 'Agn', {text: 'AGN', key: 'boq.main.AGN'}, FieldType.Description, 80),
			super.createColumn('budgetperunit', 'BudgetPerUnit', {text: 'Budget/Unit', key: 'boq.main.BudgetPerUnit'}, FieldType.Description, 80),
			super.createColumn('budgettotal', 'BudgetTotal', {text: 'Budget Total', key: 'boq.main.BudgetTotal'}, FieldType.Description, 80),
			super.createColumn('budgetdifference', 'BudgetDifference', {text: 'Budget Difference', key: 'boq.main.BudgetDifference'}, FieldType.Description, 80),
			super.createLookupColumn('BasItemTypeFk', 'BasItemTypeFk', {text: 'Item Type Stand/Opt', key: 'boq.main.BasItemTypeFk'}, 125, {
				dataServiceToken: BasicsSharedItemTypeLookupService
			}),
			super.createLookupColumn('BasItemType2Fk', 'BasItemType2Fk', {text: 'Item Type Base/Alt', key: 'boq.main.BasItemType2Fk'}, 125, {
				dataServiceToken: BasicsSharedItemType2LookupService
			}),
			// Common Columns2
			super.createColumn('quantity', 'Quantity', {text: 'Quantity', key: 'cloud.common.entityQuantity'}, FieldType.Description, 80, this.colFormatter.quantity()),
			super.createColumn('quantityAdjustment', 'QuantityAdjustment', {text: 'AQ-Quantity', key: 'boq.main.QuantityAdj'}, FieldType.Description, 85),
			super.createColumn('uomFk', 'UomFk', {text: 'UoM', key: 'cloud.common.entityUoM'}, FieldType.Description, 85, this.colFormatter.uom()),
			super.createColumn('isDisabled', 'IsDisabled', {text: 'Disabled', key: 'boq.main.IsDisabled'}, FieldType.Boolean, 75, this.colFormatter.isDisable()),
			super.createColumn('isNotApplicable', 'IsNotApplicable', {text: 'N/A', key: 'boq.main.IsNotApplicable'}, FieldType.Boolean, 95, this.colFormatter.isNotApplicable()),
			super.createColumn('isFreeQuantity', 'IsFreeQuantity', {text: 'Free Quantity', key: 'boq.main.IsFreeQuantity'}, FieldType.Boolean, 95, this.colFormatter.isFreeQuantity()),
			super.createColumn('isLeadDescription', 'IsLeadDescription', {text: 'Lead Description', key: 'boq.main.IsLeadDescription'}, FieldType.Boolean, 95, this.colFormatter.isLeadDescription()),
			super.createColumn('isNoLeadQuantity', 'IsNoLeadQuantity', {text: 'Lead Quantity', key: 'procurement.pricecomparison.leadQuantity'}, FieldType.Boolean, 95, this.colFormatter.isNoLeadQuantity()),
			super.createColumn('isContracted', 'IsContracted', {text: 'Contracted in other PKG', key: 'procurement.common.entityIsContractedInOtherPkg'}, FieldType.Boolean, 150, this.colFormatter.isContracted()),
			super.createColumn('externalcode', 'ExternalCode', {text: 'External Code', key: 'boq.main.ExternalCode'}, FieldType.Description, 80),
			super.createColumn('UserDefined1', 'UserDefined1', {text: 'User-Defined1', key: 'procurement.common.userDefined1'}, FieldType.Description, 100),
			super.createColumn('UserDefined2', 'UserDefined2', {text: 'User-Defined2', key: 'procurement.common.userDefined2'}, FieldType.Description, 100),
			super.createColumn('UserDefined3', 'UserDefined3', {text: 'User-Defined3', key: 'procurement.common.userDefined3'}, FieldType.Description, 100),
			super.createColumn('UserDefined4', 'UserDefined4', {text: 'User-Defined4', key: 'procurement.common.userDefined4'}, FieldType.Description, 100),
			super.createColumn('UserDefined5', 'UserDefined5', {text: 'User-Defined5', key: 'procurement.common.userDefined5'}, FieldType.Description, 100)
		];
	}

	public formatShowInSummaryRows(dataContext: ICompositeBoqEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, quoteKey?: string, isVerticalCompareRows?: boolean): string {
		const quoteItem = dataContext.QuoteItems.find(e => e.QuoteKey === quoteKey);
		return this.boqDataSvc.treeBuilder.filteredShowInSummaryRowsByRowType(dataContext).map((row) => {
			if (!quoteItem) {
				return Constants.tagForNoQuote;
			}
			if ([CompareFields.percentage, CompareFields.rank].includes(row.Field)) {
				return this.formatPercentageAndRank(row, dataContext, columnDef, quoteKey, isVerticalCompareRows);
			} else {
				if (dataContext.LineTypeFk === CompareRowTypes.requisition && dataContext.totals) {
					const formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, row.Field, dataContext.totals[quoteKey as string]);
					if (this.bidderSvc.isNotReference(columnDef.field)) {
						const statisticValue = this.utilService.statisticValue(dataContext.totalValuesExcludeTarget as number[]);
						return this.utilService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataContext.totals[quoteKey as string] as number, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, isVerticalCompareRows);
					} else {
						return formattedValue;
					}
				} else if (this.utilService.isBoqRow(dataContext.LineTypeFk)) {
					let originalValue = quoteItem[row.Field];
					if (this.utilService.isBoqPositionRow(dataContext.LineTypeFk)) {
						if (quoteItem && ([3, 5].includes(quoteItem.BasItemType2Fk as number) || [2].includes(quoteItem.BasItemTypeFk)) && [CompareFields.itemTotal, CompareFields.itemTotalOc, CompareFields.finalPrice, CompareFields.finalPriceOc].includes(row.Field)) {
							originalValue = quoteItem ? quoteItem[row.Field + '_BaseAlt'] : 0;
						}
					}
					let formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, row.Field, originalValue);
					if (this.bidderSvc.isNotReference(columnDef.field)) {
						const fieldValuesExcludeTarget: number[] = [];
						dataContext.QuoteItems.forEach((item) => {
							if (this.bidderSvc.isNotReference(item.QuoteKey)) {
								fieldValuesExcludeTarget.push(item[row.Field] as number);
							}
						});
						const statisticValue = this.utilService.statisticValue(fieldValuesExcludeTarget as number[]);
						formattedValue = this.utilService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, originalValue as number, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, isVerticalCompareRows);
					}

					if (this.utilService.isBoqPositionRow(dataContext.LineTypeFk)) {
						if (quoteItem && ([3, 5].includes(quoteItem.BasItemType2Fk as number) || [2].includes(quoteItem.BasItemTypeFk)) && [CompareFields.itemTotal, CompareFields.itemTotalOc, CompareFields.finalPrice, CompareFields.finalPriceOc].includes(row.Field)) {
							formattedValue = '( ' + formattedValue + ' )';
						}
					}
					return formattedValue;
				} else {
					return '';
				}
			}
		}).join(Constants.tagForValueSeparator);
	}

	private getCreateQuoteBoqItemButton(column: CompareGridColumn<ICompositeBoqEntity>, entity: ICompositeBoqEntity, disabled: boolean) {
		return this.utilService.createGridCellButtonTemplateAsNavigator(column, entity, 'procurement.pricecomparison.wizard.createQuoteItem', () => {
			this.showAddOrInsertDialog(column, entity, {
				headerText: this.utilService.getTranslationText('procurement.pricecomparison.wizard.createQuoteItem')
			});
		}, {
			icon: 'ico-boq-item-new',
			disabled: disabled
		});
	}

	public getAllColumns(): CompareGridColumn<ICompositeBoqEntity>[] {
		return [
			...this.getBasicsColumns(),
			...super.getStatisticsColumns(),
			super.getBidderColumn(),
			super.getLineValueColumn()
		];
	}

	public getDefaultColumns(): CompareGridColumn<ICompositeBoqEntity>[] {
		return [
			...this.getBasicsColumns(),
			...super.getStatisticsColumns(
				this.colFormatter.minValueIncludeTarget(),
				this.colFormatter.maxValueIncludeTarget(),
				this.colFormatter.averageValueIncludeTarget(),
				this.colFormatter.minValueExcludeTarget(),
				this.colFormatter.maxValueExcludeTarget(),
				this.colFormatter.averageValueExcludeTarget()
			),
			super.getLineValueColumn()
		];
	}

	public override getCostGroupColumns(): CompareGridColumn<ICompositeBoqEntity>[] {
		return []; // TODO-DRIZZLE: To be migrated.
	}

	public override getCreateContractOptions() {
		return {
			quoteGroupName: 'procurement.pricecomparison.wizard.create.contract.onlyBoq',
			buttonName: 'procurement.pricecomparison.wizard.createContractForBoQ'
		};
	}

	public override customFormatQuoteColumnValue(row: number, cell: number, originalValue: unknown, formattedValue: unknown, columnDef: CompareGridColumn<ICompositeBoqEntity>, dataContext: ICompositeBoqEntity, quoteKey?: string, summaryTotalRow?: ICompareRowEntity, hasQuoteModulePermission?: boolean): string | null | undefined {
		switch (dataContext.LineTypeFk) {
			case CompareRowTypes.requisition: {
				if (columnDef.isVerticalCompareRows) {
					formattedValue = '';
				} else {
					let button = '';
					if (this.bidderSvc.isNotReference(columnDef.field)) {
						if (this.permissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
							button = this.generateCreateContractButtonTemplate(dataContext, columnDef) + ' ';
						}
					}
					formattedValue = button + this.formatShowInSummaryRows(dataContext, columnDef, quoteKey, columnDef.isVerticalCompareRows);
				}
				break;
			}
			default: {
				if (boqSummaryFields.includes(dataContext.LineTypeFk)) {
					formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, '', originalValue);
					if ([CompareRowTypes.summaryOptionalWITDiscountTotal, CompareRowTypes.summaryAlternativeDiscountTotal].includes(dataContext.LineTypeFk)) {
						if (originalValue === undefined) {
							formattedValue = this.utilService.isLineValueColumn(columnDef) ? '( ' + Constants.tagForNoQuote + ' )' : '';
						} else {
							formattedValue = '( ' + formattedValue + ' )';
						}
					}
					if (formattedValue && summaryTotalRow && this.bidderSvc.isNotReference(quoteKey)) {
						formattedValue = this.utilService.setStyleForCellValueUsingTagSpan(summaryTotalRow.ConditionalFormat, originalValue as number, formattedValue as string, columnDef, dataContext, undefined, undefined, undefined, columnDef.isVerticalCompareRows);
					}
					formattedValue = formattedValue ? formattedValue : (this.utilService.isLineValueColumn(columnDef) ? Constants.tagForNoQuote : '');
				} else if (this.utilService.isBoqRow(dataContext.LineTypeFk)) {
					if (columnDef.isVerticalCompareRows) {
						if (this.utilService.isBoqRow(dataContext.LineTypeFk)) {
							return this.dataSvc.readMgr.readCellFormattedValue(row, cell, dataContext, columnDef);
						} else {
							formattedValue = originalValue;
						}
					} else {
						let button = '';
						if (this.bidderSvc.isNotReference(columnDef.field)) {
							const quoteId = this.utilService.getQuoteId(columnDef.id);
							const quote = this.dataSvc.compareCache.originalFields.find(e => e.QtnHeaderId === quoteId);
							if (quote) {
								const quoteItem = dataContext.QuoteItems.find(e => e.QuoteKey === columnDef.field && e.LinkBoqFk === dataContext.LinkBoqFk && e.LinkItemFk === dataContext.LinkItemFk);
								const quoteStatus = this.dataSvc.compareCache.quoteStatus.find(e => e.Id === quote.StatusFk);
								const canCreate = this.utilService.isBoqPositionRow(dataContext.LineTypeFk) && dataContext.parentItem ? dataContext.parentItem['CanCreateQuoteBoqItem'] : dataContext['CanCreateQuoteBoqItem'];
								if (canCreate) {
									const disabled = !(quoteItem && quoteStatus && !quoteStatus.IsReadonly) || columnDef.isIdealBidder || dataContext['isONORM'] as boolean;
									if (this.utilService.isBoqPositionRow(dataContext.LineTypeFk)) {
										button = this.createInsertItemButton(columnDef, dataContext, disabled, () => {
											const selectedItem = dataContext.QuoteItems.find(e => e.QuoteKey === columnDef.field);
											const parentItem = dataContext.parentItem?.QuoteItems.find(e => e.QuoteKey === columnDef.field);
											return {
												SelectedBoq: {
													Id: selectedItem?.BoqItemId,
													BoqItemFk: parentItem?.BoqItemId
												},
												InsertBefore: false
											};
										}, 'procurement.pricecomparison.wizard.insertBoQNote') + ' ';
									} else {
										button = this.getCreateQuoteBoqItemButton(columnDef, dataContext, disabled) + ' ';
									}
								}
							}
						}
						return button + this.formatShowInSummaryRows(dataContext, columnDef, quoteKey, columnDef.isVerticalCompareRows);
					}
				}
				break;
			}
		}

		return this.toString(formattedValue);
	}

	public customQuoteColumnRowCellEditor(dataContext: ICompositeBoqEntity, quoteColumn: ICustomCompareColumnEntity, columnDef: CompareGridColumn<ICompositeBoqEntity>, columnDomainFn: unknown): Observable<ConcreteFieldOverload<ICompositeBoqEntity>> {
		const compareFiled = this.utilService.getBoqCompareField(dataContext, columnDef);

		if (compareFiled === CompareFields.prcItemEvaluationFk) {
			// TODO-DRIZZLE: To be checked.
			/*let filterKey = col.isIdealBidder ? 'procurement-pricecomparison-ideal-boq-prcitemevaluationfk-filter' : 'procurement-pricecomparison-boq-prcitemevaluationfk-filter';
			col.editorOptions = {
				lookupDirective: 'procurement-pricecomparison-prc-item-evaluation-combobox',
				lookupOptions: {
					lookupMember: col.field + '_$PrcItemEvaluationFk',
					getPrcItemEvaluation: commonService.getPrcItemEvaluation,
					getPriceByPrcItemEvaluation: function (prcItemEvaluationFk, field, entity) {
						if (!service.hasSelection() && !entity) {
							return;
						}
						// cache the original values of compare field before recalculation by the selected evaluation item
						let selectedRow = service.getSelected() ? service.getSelected() : entity;
						return boqHelperService.getPriceByPrcItemEvaluation(prcItemEvaluationFk, field, selectedRow, boqDataStructureService, service.isVerticalCompareRows());
					},
					updateQuoteItemPrice: function (entity, sourceQuoteItemOrEvalValue, lookupMember, field) {
						updateQuoteItemPriceForEvaluation(entity, sourceQuoteItemOrEvalValue, lookupMember, field, col);
					},
					entityType: 'boq',
					showClearButton: !col.isIdealBidder,
					markAsModified: function (entityBeforeValueChange, entity) {
						collectQuoteModifiedFieldFromEntity(entityBeforeValueChange, entity, col);
					},
					itemEvaluationChanged: itemEvaluationChanged
				}
			};
			col.validator = validatePrice;
			if (filterKey) {
				col.editorOptions.lookupOptions.filterKey = filterKey;
			}*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					// TODO-DRIZZLE: To be checked.
				})
			}]);
		} else if (compareFiled === CompareFields.quantity) {
			// TODO-DRIZZLE: To be checked.
			// col.validator = validatePrice;
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Quantity
			}]);
		} else if (compareFiled === CompareFields.uomFk) {
			// TODO-DRIZZLE: To be checked.
			// col.validator = validateUomFk;
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService
				})
			}]);
		} else if (compareFiled === CompareFields.isLumpsum || compareFiled === CompareFields.included || compareFiled === CompareFields.notSubmitted) {
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Boolean
			}]);
		} else if (compareFiled === CompareFields.alternativeBid) {
			// TODO-DRIZZLE: To be checked.
			/*col.editorOptions = {
				lookupDirective: 'procurement-price-comparison-basicsitemtype85-combobox',
				lookupType: 'PrcItemType85'
			};*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					// TODO-DRIZZLE: To be checked.
				})
			}]);
		} else if (compareFiled === CompareFields.prcPriceConditionFk) {
			// TODO-DRIZZLE: To be checked.
			/*col.editorOptions = {
				lookupDirective: 'basics-material-price-condition-simple-combobox',
				lookupType: 'prcpricecondition',
				lookupOptions: {
					showClearButton: true,
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								handlePriceConditionChanged(args.entity, col.formatterOptions.dynamicField, col.formatterOptions.lookupMember, args.selectedItem, undefined, undefined, col);
								return true;
							}
						}
					]
				}
			};*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					// TODO-DRIZZLE: To be checked.
				})
			}]);
		} else if ([CompareFields.commentContractor, CompareFields.commentClient, CompareFields.bidderComments].includes(compareFiled)) {
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Remark
			}]);
		} else if (BoqEditableCompareFields.includes(compareFiled) || dataContext.LineTypeFk === CompareRowTypes.generalItem) {
			// TODO-DRIZZLE: To be checked.
			/*col.validator = validatePrice;
			col.editorOptions = null;*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Money
			}]);
		} else if (dataContext.LineTypeFk === CompareRowTypes.characteristic) {
			// TODO-DRIZZLE: To be checked.
			// domain = commonService.characteristicDomain(boqConfigService, boqConfigService.boqQtnMatchCache, row, col);
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Description
			}]);
		} else if (dataContext.LineTypeFk === CompareRowTypes.quoteExchangeRate) {
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Quantity
			}]);
		} else if (dataContext.LineTypeFk === CompareRowTypes.quoteRemark) {
			// TODO-DRIZZLE: To be checked.
			/*col.editorOptions = {
				lookupDirective: 'show-draw-down-text-directive',
				lookupOptions: {
					lookupMember: col.field
				}
			};*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					// TODO-DRIZZLE: To be checked.
				})
			}]);
		} else if (dataContext.LineTypeFk === CompareRowTypes.quotePaymentTermPA || dataContext.LineTypeFk === CompareRowTypes.quotePaymentTermFI || compareFiled === CompareFields.paymentTermPA || compareFiled === CompareFields.paymentTermFI) {
			// TODO-DRIZZLE: To be checked.
			/*col.editorOptions = {
				lookupDirective: 'basics-lookupdata-payment-term-lookup',
				lookupType: 'PaymentTerm',
				lookupOptions: {
					showClearButton: true
				}
			};
			col.validator = null;*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					// TODO-DRIZZLE: To be checked.
				})
			}]);
		} else if (BoqAllowEditVisibleFields.includes(compareFiled) && compareFiled !== CompareFields.priceOc) {
			// TODO-DRIZZLE: To be checked.
			/*col.validator = function (entity, value, field) {
				const parentItem = commonHelperService.tryGetParentItem(entity, col.isVerticalCompareRows);
				const quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: field}) || {};
				const exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
				if(_.includes(commonService.boqNeedRemovePriceConditionFields, compareFiled)) {
					service.onCompareRowsAllowEditVisibleFieldsChanged.fire({
						selectedQuoteBoq: quoteItem,
						exchangeRate: exchangeRate
					});
				}
				validatePrice(entity, value, field);
			};
			col.editorOptions = null;*/
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Money
			}]);
		} else {
			return from<ConcreteFieldOverload<ICompositeBoqEntity>[]>([{
				label: columnDef.label,
				type: FieldType.Description
			}]);
		}
	}
}