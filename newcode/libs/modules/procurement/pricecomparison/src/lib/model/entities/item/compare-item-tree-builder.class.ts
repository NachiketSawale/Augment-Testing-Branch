/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { ServiceLocator } from '@libs/platform/common';
import { ProcurementCommonItemCalculationService } from '@libs/procurement/common';
import { CompareTreeBaseBuilder } from '../../classes/compare-tree-base-builder.class';
import { ICompositeDataProcess } from '../composite-data-process.interface';
import { ICompositeItemEntity } from './composite-item-entity.interface';
import { ICompareItemTreeResponse } from './compare-item-tree-response.interface';
import { ProcurementPricecomparisonCompareItemDataBaseService } from '../../../services/data/item/compare-item-data-base.service';
import { CompareRowTypes } from '../../constants/compare-row-types';
import { CompareFields } from '../../constants/compare-fields';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { Constants } from '../../constants/constants';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { EvaluationKeys } from '../../constants/evaluation-keys';
import { ItemEditableCompareFields } from '../../constants/item/item-editable-compare-fields';
import { ItemDeviationFields } from '../../constants/item/item-deviation-fields';
import { IExtendableObject } from '../extendable-object.interface';
import { HighlightFields } from '../../constants/highlight-fields';
import { ICustomPrcItem } from './custom-prc-item.interface';
import { ICustomQuoteItemBase } from '../custom-quote-item-base.interface';

export class CompareItemTreeBuilder extends CompareTreeBaseBuilder<ICompositeItemEntity, ICompareItemTreeResponse> {
	private readonly calcSvc = ServiceLocator.injector.get(ProcurementCommonItemCalculationService);

	public constructor(
		private itemDataSvc: ProcurementPricecomparisonCompareItemDataBaseService
	) {
		super(itemDataSvc);
		this.initializeDataProcessors();
	}

	private _dataProcessors: ICompositeDataProcess<ICompositeItemEntity>[] = [];

	protected override get compareCache() {
		return this.itemDataSvc.compareCache;
	}

	private initializeDataProcessors() {

	}

	private getRemoveItems(item: ICompositeItemEntity, itemTypes: number[], itemTypes2: number[]) {
		let items: ICompositeItemEntity[] = [];
		const isPrcItem = item.LineTypeFk === CompareRowTypes.prcItem;
		const isEmptyTypes = itemTypes.length === 0 && itemTypes2.length === 0;
		const isExcluding = (!_.includes(itemTypes, item.ItemTypeFk) || !_.includes(itemTypes2, item['ItemType2Fk']));
		if (isPrcItem && (isEmptyTypes || isExcluding)) {
			items = items.concat([item]).concat(this.utilService.flatTree(item.Children));
		} else {
			_.each(item.Children, (m) => {
				items = items.concat(this.getRemoveItems(m, itemTypes, itemTypes2));
			});
		}
		return items;
	}

	private removeDataRowsByItemTypes(dataTree: ICompositeItemEntity[], itemTypes: number[], itemTypes2: number[], isSoftRemove: boolean) {
		let removeItems: ICompositeItemEntity[] = [];

		_.each(dataTree, (item) => {
			removeItems = removeItems.concat(this.getRemoveItems(item, itemTypes, itemTypes2));
		});

		const removeIds = _.map(removeItems, (item) => {
			return item.Id;
		});

		return this.utilService.removeDataRowsRecursively(dataTree, (n) => {
			return _.includes(removeIds, n.Id);
		}, isSoftRemove);
	}

	private getFactoredTotalPrice(quoteItem: ICustomPrcItem) {
		return this.calcSvc.getFactoredTotalPrice(quoteItem, quoteItem.PriceUnit);
	}

	private recalculatePrcItemCompareFieldRow(parentItem: ICompositeItemEntity, visibleRow: ICompareRowEntity, newRow: ICompositeItemEntity) {
		// set max/min/average column's compare row's (compare fields) value.
		const fieldValues: number[] = [];
		const fieldValuesExcludeTarget: number[] = [];
		// find highlight
		const differentFields = this.utilService.checkHighlightQtn(this.compareCache.visibleColumns, parentItem.QuoteItems);
		const checkHighlightFields = HighlightFields;
		const fieldKeys: string[] = [];
		const compareField = visibleRow.Field;
		const isVerticalCompareRows = this.itemDataSvc.isVerticalCompareRows();
		this.compareCache.visibleColumns.forEach((column) => {
			const visibleColumn = !isVerticalCompareRows ? column : this.utilService.copyAndExtend(column, {
				Id: this.utilService.getCombineCompareField(column.Id, compareField),
				QuoteKey: column.Id,
				IsHighlightChanges: column.IsHighlightChanges
			});
			const quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: visibleColumn.QuoteKey || visibleColumn.Id});
			const bidderValueProp = visibleColumn.QuoteKey || visibleColumn.Id;
			if (quoteItem) {
				if (compareField === CompareFields.rank && parentItem.ranks) {
					newRow[visibleColumn.Id] = (parentItem.ranks[bidderValueProp] as number) || 0;
				} else if (compareField === CompareFields.percentage && parentItem.percentages) {
					newRow[visibleColumn.Id] = (parentItem.percentages[bidderValueProp] as number) || 0;
				} else {
					// defect: 79827
					// for a change order RFQ,  if it has a change order quote1 for bidder1, but no change order quote2 for bidder2,
					// so in UI, the two compare fields below in quote1 will allow editable, but set readonly in quote2.
					if (_.includes(ItemEditableCompareFields, compareField)) {
						newRow[visibleColumn.Id + '_$hasBidder'] = true;
					}

					if (compareField === CompareFields.prcItemEvaluationFk) {
						newRow[visibleColumn.Id] = (quoteItem && quoteItem[CompareFields.price]) ? quoteItem[CompareFields.price] : 0;
						newRow[visibleColumn.Id + '_$FirstEvaluationFk'] = (quoteItem && quoteItem[CompareFields.prcItemEvaluationFk]) ? quoteItem[CompareFields.prcItemEvaluationFk] : null;
						newRow[visibleColumn.Id + '_$Evaluation_QuoteCode'] = (quoteItem && quoteItem[EvaluationKeys.quoteCode]) ? quoteItem[EvaluationKeys.quoteCode] : null;
						newRow[visibleColumn.Id + '_$Evaluation_QuoteId'] = (quoteItem && quoteItem[EvaluationKeys.quoteId]) ? quoteItem[EvaluationKeys.quoteId] : null;
						newRow[visibleColumn.Id + '_$Evaluation_SourcePrcItemId'] = (quoteItem && quoteItem[EvaluationKeys.sourcePrcItemId]) ? quoteItem[EvaluationKeys.sourcePrcItemId] : null;
					} else if ([
						CompareFields.userDefined1,
						CompareFields.userDefined2,
						CompareFields.userDefined3,
						CompareFields.userDefined4,
						CompareFields.userDefined5,
						CompareFields.discountComment,
						CompareFields.externalCode
					].includes(compareField)) {
						newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : '';
					} else if (compareField === CompareFields.isFreeQuantity) {
						newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : false;
					} else if (compareField === CompareFields.exQtnIsEvaluated) {
						newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : false;
					} else if (compareField === CompareFields.absoluteDifference) {
						const basicQuote = this.utilService.getBasicQuote(parentItem, visibleRow, bidderValueProp, differentFields['markFieldQtn'] as string, this.compareCache.leadingRow.Field, () => this.getTotalField());
						newRow[visibleColumn.Id] = basicQuote.absoluteDifference;
						if (!quoteItem.IsIdealBidder && newRow[visibleColumn.Id] !== Constants.tagForNoQuote) {
							this.utilService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, newRow[visibleColumn.Id] as number, this.compareCache.visibleColumns);
						}
					} else if (compareField === CompareFields.factoredTotalPrice) {
						newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : this.getFactoredTotalPrice(quoteItem);
						// exclude ideal bidders.
						if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
							this.utilService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, newRow[visibleColumn.Id] as number, this.compareCache.visibleColumns);
						}
					} else {
						newRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : 0;
						// exclude ideal bidders.
						if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
							this.utilService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, newRow[visibleColumn.Id] as number, this.compareCache.visibleColumns);
						}
					}
				}
				this.utilService.setConfigFieldReadonly(visibleRow.Field, visibleColumn.Id, newRow, this.qtnMatches, quoteItem, visibleColumn.IsIdealBidder, this.itemDataSvc.isVerticalCompareRows());

				// for highlight function
				// collect the key
				fieldKeys.push(visibleColumn.Id);
				if (visibleColumn.IsHighlightChanges === true && _.includes(checkHighlightFields, compareField)) {
					newRow[visibleColumn.Id + Constants.highlightQtn] = differentFields[compareField] === false;
				}
			} else {
				newRow[visibleColumn.Id] = Constants.tagForNoQuote;
			}

		});

		if (compareField === CompareFields.rank) {
			const ranks = parentItem.ranks as IExtendableObject<string | number>;
			for (const quoteKey1 in ranks) {
				if (Object.prototype.hasOwnProperty.call(ranks, quoteKey1)) {
					const quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey1});
					if (this.bidderIdentitySvc.isNotReference(quoteKey1) && quoteItem && !quoteItem.IsIdealBidder) {
						fieldValuesExcludeTarget.push(ranks[quoteKey1] as number);
					}
					fieldValues.push(ranks[quoteKey1] as number);
				}
			}
		} else if (compareField === CompareFields.percentage) {
			const percentages = parentItem.percentages as IExtendableObject<string | number>;
			for (const quoteKey2 in percentages) {
				if (Object.prototype.hasOwnProperty.call(percentages, quoteKey2)) {
					const quoteItem2 = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey2});
					if (this.bidderIdentitySvc.isNotReference(quoteKey2) && quoteItem2 && !quoteItem2.IsIdealBidder) {
						fieldValuesExcludeTarget.push(percentages[quoteKey2] as number);
					}

					fieldValues.push(percentages[quoteKey2] as number);
				}
			}
		}

		const compareRowPrefix = isVerticalCompareRows ? visibleRow.Field + '_' : '';
		newRow[compareRowPrefix + Constants.maxValueIncludeTarget] = this.utilService.getRepairNumeric(_.max(fieldValues));
		newRow[compareRowPrefix + Constants.minValueIncludeTarget] = this.utilService.getRepairNumeric(_.min(fieldValues));
		newRow[compareRowPrefix + Constants.averageValueIncludeTarget] = this.utilService.getRepairNumeric(this.utilService.calculateAverageValue(fieldValues));
		newRow[compareRowPrefix + Constants.maxValueExcludeTarget] = this.utilService.getRepairNumeric(_.max(fieldValuesExcludeTarget));
		newRow[compareRowPrefix + Constants.minValueExcludeTarget] = this.utilService.getRepairNumeric(_.min(fieldValuesExcludeTarget));
		newRow[compareRowPrefix + Constants.averageValueExcludeTarget] = this.utilService.getRepairNumeric(this.utilService.calculateAverageValue(fieldValuesExcludeTarget));

		// highlight deviation rows
		this.utilService.highlightRows(parentItem, newRow, visibleRow, ItemDeviationFields, fieldKeys, differentFields['markFieldQtn'] as string, this.compareCache.leadingRow.Field, () => this.getTotalField());

		return newRow;
	}

	private setColumnValuesForPrcItemCompareFieldRow(parentItem: ICompositeItemEntity) {
		if (parentItem.LineTypeFk === CompareRowTypes.prcItem) {
			// add the visible rows by custom setting
			this.compareCache.visibleCompareRows.forEach((visibleRow) => {
				if (visibleRow.Field === Constants.generals || visibleRow.Field === Constants.characteristics) {
					return;
				}
				let newRow = _.find(parentItem.Children, {Id: parentItem.Id + '_' + visibleRow.Field});
				if (!newRow) {
					newRow = this.createCompositeBaseRow(parentItem.Id + '_' + visibleRow.Field, parentItem.RfqHeaderId, (visibleRow.DisplayName ? visibleRow.DisplayName : visibleRow.Description), CompareRowTypes.compareField);
					newRow[Constants.rowType] = visibleRow.Field;
					newRow.LineName = '';
					newRow['ConditionalFormat'] = visibleRow.ConditionalFormat; // used to format the cell with this custom style.
					newRow.parentItem = parentItem;
					newRow.Children = [];
					newRow.HasChildren = false;
					newRow.ReqHeaderId = parentItem.ReqHeaderId;

					parentItem.Children.push(newRow);
					parentItem.HasChildren = true;
				}

				this.recalculatePrcItemCompareFieldRow(parentItem, visibleRow, newRow);
			});
		} else {
			if (parentItem.Children && parentItem.Children.length > 0) {
				_.forEach(parentItem.Children, (item) => {
					this.setColumnValuesForPrcItemCompareFieldRow(item);
				});
			}
		}
	}

	protected override setSpecialRowValuesForLineNameColumn(item: ICompositeItemEntity, lineTypeFk: number) {

	}

	protected override getDataProcessors(): ICompositeDataProcess<ICompositeItemEntity>[] {
		return this._dataProcessors;
	}

	protected buildCustomTree(tree: ICompositeItemEntity[]): ICompositeItemEntity[] {
		const summaryInfo = this.itemDataSvc.getTypeSummary();
		const hideInsteadOfDeletingRows = this.itemDataSvc.hideInsteadOfDeletingRows();
		this.removeDataRowsByItemTypes(tree, summaryInfo.checkedItemTypes, summaryInfo.checkedItemTypes2, hideInsteadOfDeletingRows);
		return tree;
	}

	protected getTotalField(): string {
		return CompareFields.total;
	}

	protected sumTotalForRequisitionRow(currentItem: ICompositeItemEntity, visibleColumn: ICustomCompareColumnEntity): number {
		const quoteSum = _.sumBy(_.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id}), CompareFields.total) || 0;

		// sum quote new items
		let quoteNewItemsSum = 0;
		const quoteNewItemTotal = _.find(currentItem.Children, {LineTypeFk: CompareRowTypes.quoteNewItemTotal});
		if (quoteNewItemTotal) {
			quoteNewItemsSum = _.sumBy(_.filter(quoteNewItemTotal.Children, {QuoteKey: visibleColumn.Id}), CompareFields.total) || 0;
		}
		return quoteSum + quoteNewItemsSum;
	}

	protected setColumnValuesForItemRow(currentItem: ICompositeItemEntity): void {
		if (currentItem.LineTypeFk === CompareRowTypes.prcItem) {
			currentItem.ChosenBusinessPartner = undefined;           // only this row need it as a lookup value
			currentItem['ChosenBusinessPartnerPrice'] = null;      // value for the chosen field 'ChosenBusinessPartner'

			const finalPriceValues: number[] = [];
			const finalPriceValuesExcludeTarget: number[] = [];

			// set leading field value
			this.setColumnValuesForLeadingFieldRow(currentItem, finalPriceValues, finalPriceValuesExcludeTarget, CompareFields.total, () => {
				return this.compareCache.leadingRow.Field;
			});

			// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
			currentItem[Constants.maxValueIncludeTarget] = _.max(finalPriceValues) || 0;
			currentItem[Constants.minValueIncludeTarget] = _.min(finalPriceValues) || 0;
			currentItem[Constants.averageValueIncludeTarget] = this.utilService.calculateAverageValue(finalPriceValues) || 0;
			currentItem[Constants.maxValueExcludeTarget] = _.max(finalPriceValuesExcludeTarget) || 0;
			currentItem[Constants.minValueExcludeTarget] = _.min(finalPriceValuesExcludeTarget) || 0;
			currentItem[Constants.averageValueExcludeTarget] = this.utilService.calculateAverageValue(finalPriceValuesExcludeTarget) || 0;

			// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
			this.setColumnValuesForPercentageRow(currentItem, currentItem.leadingFields as IExtendableObject, () => {
				return this.compareCache.leadingRow.Field;
			});

			// set Rank value
			this.setColumnValuesForRankRow(currentItem, currentItem.leadingFields as IExtendableObject);

			// add dynamic compare row (compare fields) for item (Position) and set values for the row's corresponding compare columns (quote bizpartners).
			if (currentItem.LineTypeFk === CompareRowTypes.prcItem && this.compareCache.visibleCompareRows.length) {
				if (!this.itemDataSvc.isVerticalCompareRows()) {
					this.setColumnValuesForPrcItemCompareFieldRow(currentItem);
				} else {
					_.forEach(this.compareCache.visibleCompareRows, (visibleRow) => {
						if (visibleRow.Field !== Constants.generals && visibleRow.Field !== Constants.characteristics) {
							this.recalculatePrcItemCompareFieldRow(currentItem, visibleRow, currentItem);
						}
					});
				}
			}

			// store price origin Value
			this.storePriceOriginalValue(currentItem, (baseItem: ICustomQuoteItemBase) => {
				const quoteItem = baseItem as ICustomPrcItem;
				return {
					QuoteKey: quoteItem.QuoteKey,
					PrcItemId: quoteItem.PrcItemId,
					Price: quoteItem.Price,
					NotSubmitted: quoteItem.NotSubmitted
				};
			});

			// Compare Description
			currentItem.CompareDescription = this.compareCache.summaryRows.map((summaryRow) => {
				return summaryRow.DisplayName;
			}).join(Constants.tagForValueSeparator);
		}
	}
}