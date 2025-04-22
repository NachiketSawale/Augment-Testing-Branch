/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { CompareRowTypes } from '../constants/compare-row-types';
import { ProcurementPricecomparisonUtilService } from '../../services/util.service';
import { CompareFields } from '../constants/compare-fields';
import { ICompareTreeResponseBase } from '../entities/compare-tree-response-base.interface';
import { ICompositeDataProcess } from '../entities/composite-data-process.interface';
import { ICustomQuoteItemBase } from '../entities/custom-quote-item-base.interface';
import { ICustomCompareColumnEntity } from '../entities/custom-compare-column-entity.interface';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../services/compare-data-base.service';
import { ProcurementPricecomparisonBidderIdentityService } from '../../services/bidder-identity.service';
import { Constants } from '../constants/constants';
import { IExtendableObject } from '../entities/extendable-object.interface';
import { ICustomCharacteristicGroup } from '../entities/custom-characteristic-group.interface';
import { ICompareRowEntity } from '../entities/compare-row-entity.interface';
import { BidderIdentities } from '../constants/bidder-identities';
import { CompareRowLineTypes } from '../constants/compare-row-line-types';
import { IOriginPriceExcludeTarget } from '../entities/origin-price-exclude-target.interface';

export abstract class CompareTreeBaseBuilder<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>
> {
	protected readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);
	protected readonly utilService = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly bidderIdentitySvc = ServiceLocator.injector.get(ProcurementPricecomparisonBidderIdentityService);

	public qtnMatches: Map<number, ICustomQuoteItemBase[]> = new Map<number, ICustomQuoteItemBase[]>();

	protected constructor(
		protected dataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>
	) {
	}

	protected abstract setSpecialRowValuesForLineNameColumn(row: T, lineTypeFk: number): void ;

	protected abstract getDataProcessors(): ICompositeDataProcess<T>[];

	protected abstract buildCustomTree(tree: T[]): T[];

	protected abstract getTotalField(): string;

	protected abstract sumTotalForRequisitionRow(currentItem: T, visibleColumn: ICustomCompareColumnEntity): number;

	protected abstract setColumnValuesForItemRow(currentItem: T): void;

	protected get compareCache() {
		return this.dataSvc.compareCache;
	}

	protected createCompositeBaseRow(id: string, rfqHeaderId: number | undefined, descriptionTerm: string | null | undefined, lineTypeFk: number, cssClass?: string): T {
		return {
			Id: id,
			RfqHeaderId: rfqHeaderId ?? 0,
			CompareDescription: this.utilService.getTranslationText(descriptionTerm),
			LineTypeFk: lineTypeFk,
			HasChildren: false,
			Children: [],
			cssClass: cssClass,
			QuoteItems: [],
			IsContracted: false,
			IsFreeQuantity: false,
			PrcHeaderId: false,
			QtnHeaderId: 0,
			QtnVersion: 0,
			Quantity: 0,
			ReqHeaderId: 0,
			UomFk: 0,
			QuoteGeneralItems: []
		} as unknown as T;
	}

	protected setColumnValuesForLeadingFieldRow(currentItem: T, finalPriceValues: number[], finalPriceValuesExcludeTarget: number[], totalField: string, getLeadingField: (currentItem: T) => string, concludeCallback?: (col: ICustomCompareColumnEntity, value: number) => void) {
		const leadingField = getLeadingField(currentItem);

		const leadingFields: IExtendableObject = {};
		let leadingFieldValues: number[] = [];
		let leadingFieldValuesExcludeTarget: number[] = [];

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			_.set(currentItem, visibleColumn.Id, null);
			const quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
			if (quoteItem && !_.isUndefined(quoteItem[leadingField])) {
				const leadingFieldValue = (quoteItem && quoteItem[leadingField]) ? quoteItem[leadingField] as number : 0;
				leadingFields[visibleColumn.Id] = leadingFieldValue;
				// exclude ideal bidders.
				if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
					this.utilService.concludeTargetValue(visibleColumn.Id, leadingFieldValues, leadingFieldValuesExcludeTarget, leadingFieldValue, this.compareCache.visibleColumns);

					// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
					const finalPriceValue = (quoteItem && quoteItem[totalField]) ? quoteItem[totalField] as number : 0;
					this.utilService.concludeTargetValue(visibleColumn.Id, finalPriceValues, finalPriceValuesExcludeTarget, finalPriceValue, this.compareCache.visibleColumns);

					if (concludeCallback) {
						concludeCallback(visibleColumn, finalPriceValue);
					}
				}
			} else {
				leadingFields[visibleColumn.Id] = Constants.tagForNoQuote;
			}
		});

		currentItem.leadingFields = leadingFields;   // store quote keys/values for bidders (include BaseBoq/Target)

		// sort by ascending for calculate rank.
		currentItem.leadingFieldValues = leadingFieldValues = _.sortBy(leadingFieldValues); // store quote values for bidders (include BaseBoq/Target)
		currentItem.leadingFieldValuesExcludeTarget = leadingFieldValuesExcludeTarget = _.sortBy(leadingFieldValuesExcludeTarget); // store quote values for bidders (Exclude BaseBoq/Target)
	}

	protected setColumnValuesForPercentageRow(currentItem: T, leadingFields: IExtendableObject, getLeadingField: (currentItem: T) => string, checkIsBoqLevelRow?: (currentItem: T) => boolean) {
		const percentages: IExtendableObject<string | number> = {};

		// get the min leading Field Values Exclude Target
		const minLeadingField = _.min(currentItem.leadingFieldValuesExcludeTarget) || 0;
		const differentFields = this.utilService.checkHighlightQtn(this.compareCache.visibleColumns, currentItem.QuoteItems);
		const absoluteDiffColumn = _.find(this.compareCache.visibleCompareRows, row => row.Field === CompareFields.absoluteDifference || row.Field === CompareFields.percentage);
		const leadingField = getLeadingField(currentItem);
		const isBoqLevelRow = checkIsBoqLevelRow ? checkIsBoqLevelRow(currentItem) : false;

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			if (this.bidderIdentitySvc.isNotReference(visibleColumn.Id)) {
				const quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
				if (quoteItem) {
					if (CompareRowLineTypes.includes(currentItem.LineTypeFk) && absoluteDiffColumn && absoluteDiffColumn.DeviationReference && absoluteDiffColumn.DeviationReference > 0) {
						const percentageBasicQuote = this.utilService.getBasicQuote(currentItem, absoluteDiffColumn, visibleColumn.Id, differentFields['markFieldQtn'] as string, leadingField, () => this.getTotalField(), isBoqLevelRow);
						percentages[visibleColumn.Id] = percentageBasicQuote.basicPercentage;
					} else {
						if (minLeadingField === 0) {
							percentages[visibleColumn.Id] = 0;
						} else {
							percentages[visibleColumn.Id] = leadingFields[visibleColumn.Id] as number / minLeadingField * 100;
						}
					}
				} else {
					percentages[visibleColumn.Id] = Constants.tagForNoQuote;
				}
			}
		});

		currentItem.percentages = percentages;
	}

	protected setColumnValuesForRankRow(currentItem: T, leadingFields: IExtendableObject) {
		const ranks: IExtendableObject<string | number> = {};

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			const quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
			if (quoteItem) {
				if (this.bidderIdentitySvc.isNotReference(visibleColumn.Id) && !_.isUndefined(leadingFields[visibleColumn.Id])) {
					const rank = _.indexOf(currentItem.leadingFieldValuesExcludeTarget, leadingFields[visibleColumn.Id]);
					ranks[visibleColumn.Id] = rank + 1;
				}
			} else {
				ranks[visibleColumn.Id] = Constants.tagForNoQuote;
			}
		});

		currentItem.ranks = ranks;
	}

	protected storePriceOriginalValue(currentItem: T, getTarget: (quoteItem: ICustomQuoteItemBase) => IOriginPriceExcludeTarget) {
		currentItem.originPriceExcludeTarget = [];  // store quote values for bidders (Exclude Target)

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			const quoteItem = currentItem.QuoteItems.find(e => e.QuoteKey === visibleColumn.Id);
			if (this.bidderIdentitySvc.isNotReference(visibleColumn.Id) && quoteItem && !quoteItem.IsIdealBidder && currentItem.originPriceExcludeTarget) {
				currentItem.originPriceExcludeTarget.push(getTarget(quoteItem));
			}
		});
	}

	private addEvaluatedTotalRowAndSetColumnValues(rfqRows: T[]) {
		const rfqHeaderId = rfqRows && rfqRows.length === 1 ? rfqRows[0].RfqHeaderId : -1;
		const newRow = this.createCompositeBaseRow('evaluated_total_row', rfqHeaderId, 'procurement.pricecomparison.compareEvaluatedTotal', CompareRowTypes.evaluatedTotal);
		this.utilService.setColumnValuesForEvaluatedTotalRow(this.compareCache.visibleColumns, newRow, rfqRows);
		rfqRows.unshift(newRow);
	}

	private addOfferedTotalRowAndSetColumnValues(rfqRows: T[]) {
		const rfqHeaderId = rfqRows && rfqRows.length === 1 ? rfqRows[0].RfqHeaderId : -1;
		const newRow = this.createCompositeBaseRow('offered_total_row', rfqHeaderId, 'procurement.pricecomparison.compareOfferedTotal', CompareRowTypes.offeredTotal);
		this.utilService.setColumnValuesForOfferedTotalRow(this.compareCache.visibleColumns, newRow, rfqRows);
		rfqRows.unshift(newRow);
	}

	public addGrantTotalRankRow(quoteCompareRows: ICompareRowEntity[], grantTotalRow: T,) {
		const grandTotalRank = _.find(quoteCompareRows, {Field: CompareFields.grandTotalRank});
		if (grandTotalRank) {
			const node = this.createCompositeBaseRow('grand_total_row_rank', undefined, grandTotalRank.DisplayName, CompareRowTypes.grandTotalRank);
			node.HasChildren = false;
			grantTotalRow.Children.push(node);
		}
	}

	private addGrandTotalRowAndSetColumnValues(rfqRows: T[]) {
		const rfqHeaderId = rfqRows && rfqRows.length === 1 ? rfqRows[0].RfqHeaderId : -1;
		const newRow = this.createCompositeBaseRow('grand_total_row', rfqHeaderId, 'procurement.pricecomparison.compareGrandTotal', CompareRowTypes.grandTotal, 'font-bold');
		this.addGrantTotalRankRow(this.compareCache.visibleQuoteRows, newRow);
		this.utilService.setColumnValuesForGrandTotalRow(this.compareCache.visibleColumns, newRow, rfqRows);
		rfqRows.unshift(newRow);
	}

	private setRowValuesForLineNameColumn(itemList: T[]) {
		itemList.forEach(item => {
			switch (item.LineTypeFk) {
				case CompareRowTypes.grandTotal:
					item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareGrandTotal');
					break;
				case CompareRowTypes.evaluatedTotal:
					item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareEvaluatedTotal');
					break;
				case CompareRowTypes.offeredTotal:
					item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareOfferedTotal');
					break;
				case CompareRowTypes.rfq:
					item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareRfqTotal');
					break;
				case CompareRowTypes.characteristicTotal:
					item.LineName = this.compareCache.visibleCompareRows.find(r => r.Field === CompareFields.characteristics)?.DisplayName;
					break;
				case CompareRowTypes.characteristicGroup:
					item.LineName = this.compareCache.rfqCharacteristicGroup.find(g => g.Id === _.get(item, 'GroupId') as number)?.Description;
					break;
				case CompareRowTypes.characteristic:
					item.LineName = this.compareCache.rfqCharacteristic.find(c => c.Id === _.get(item, 'CharacteristicDataId') as number)?.Description;
					break;
				case CompareRowTypes.requisition:
					item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareRequisitionTotal');
					break;
				case CompareRowTypes.generalTotal:
					item.LineName = this.compareCache.visibleCompareRows.find(r => r.Field === CompareFields.generals)?.DisplayName;
					break;
				case CompareRowTypes.generalItem:
					item.LineName = '';
					break;
				default:
					this.setSpecialRowValuesForLineNameColumn(item, item.LineTypeFk);
					break;
			}

			if (item.Children && item.Children.length && item.LineTypeFk !== CompareRowTypes.compareField) {
				this.setRowValuesForLineNameColumn(item.Children);
			}
		});
	}

	private setChangeOrderQuoteKey2BaseOrderQuoteKey(row: T) {
		_.forEach(this.compareCache.visibleColumns, (baseOrderCol) => {
			_.forEach(baseOrderCol.Children || [], (changeOrderCol) => {
				_.forEach(row.QuoteItems, (item) => {
					// only reset change order quote item's quoteKey into base order quote item's quoteKey.
					if (item.QuoteKey === changeOrderCol.Id.toString()) {
						const newItem = _.cloneDeep(item);     // deal with the case when the base QTN have two versions
						newItem.OwnQuoteKey = item.QuoteKey;  // keep original quoteKey
						newItem.QuoteKey = baseOrderCol.Id.toString();   // set base order quoteKey
						row.QuoteItems.push(newItem);
					}
				});
			});
		});
		_.forEach(row.Children, (item) => {
			this.setChangeOrderQuoteKey2BaseOrderQuoteKey(item);
		});
	}

	private setColumnValuesForGeneralTotalRow(currentItem: T) {
		if (currentItem.LineTypeFk === CompareRowTypes.generalTotal) {
			// set value for children.
			_.forEach(currentItem.Children, (item) => {
				this.setColumnValuesForGeneralItemRow(item);
			});
		}
	}

	private setColumnValuesForGeneralItemRow(currentItem: T) {
		if (currentItem.LineTypeFk === CompareRowTypes.generalItem) {
			const totals: IExtendableObject<string | number> = {};
			let totalValues: number[] = [];
			const totalValuesExcludeTarget: number[] = [];
			currentItem.totals = totals;
			currentItem.totalValues = totalValues;
			currentItem.totalValuesExcludeTarget = totalValuesExcludeTarget;

			this.compareCache.visibleColumns.forEach((visibleColumn) => {
				const finalParent = currentItem?.parentItem?.parentItem as T;
				const generalItem = _.find(finalParent.QuoteGeneralItems, {
					QuoteKey: visibleColumn.Id,
					ReqHeaderId: finalParent.ReqHeaderId,
					GeneralTypeId: currentItem.GeneralTypeId
				});

				const value = (generalItem && generalItem.Value) ? generalItem.Value : 0;  // 'Value' is an entity's property

				totals[visibleColumn.Id] = value;
				_.set(currentItem, visibleColumn.Id, value);
				this.utilService.concludeTargetValue(visibleColumn.Id, totalValues, totalValuesExcludeTarget, value, this.compareCache.visibleColumns);
			});

			currentItem.totalValues = totalValues = _.sortBy(totalValues); // sort by ascending for calculate rank.

			// set max/min/average column's value.
			_.set(currentItem, Constants.maxValueIncludeTarget, _.max(totalValues));
			_.set(currentItem, Constants.minValueIncludeTarget, _.min(totalValues));
			_.set(currentItem, Constants.averageValueIncludeTarget, this.utilService.calculateAverageValue(totalValues));
			_.set(currentItem, Constants.maxValueExcludeTarget, _.max(totalValuesExcludeTarget));
			_.set(currentItem, Constants.minValueExcludeTarget, _.min(totalValuesExcludeTarget));
			_.set(currentItem, Constants.averageValueExcludeTarget, this.utilService.calculateAverageValue(totalValuesExcludeTarget));
		}
	}

	private setColumnValuesForRequisitionRow(currentItem: T) {
		const totals: IExtendableObject<string | number> = {};
		const ranks: IExtendableObject<number> = {};
		const percentages: IExtendableObject<number | string> = {};
		const leadingFields: IExtendableObject = {};
		let totalValues: number[] = [];
		let totalValuesExcludeTarget: number[] = [];

		currentItem.totals = totals;
		currentItem.totalValues = totalValues;
		currentItem.totalValuesExcludeTarget = totalValuesExcludeTarget;
		currentItem.ranks = ranks;
		currentItem.percentages = percentages;
		currentItem.leadingFields = leadingFields;

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			_.set(currentItem, visibleColumn.Id, null);
			const quoteItem = currentItem.QuoteItems.find(r => r.QuoteKey === visibleColumn.Id);
			if (quoteItem) {
				const totalSum = this.sumTotalForRequisitionRow(currentItem, visibleColumn);
				totals[visibleColumn.Id] = totalSum;
				// exclude ideal bidders.
				if (!quoteItem.IsIdealBidder) {
					this.utilService.concludeTargetValue(visibleColumn.Id, totalValues, totalValuesExcludeTarget, totalSum, this.compareCache.visibleColumns);
				}
			} else {
				totals[visibleColumn.Id] = Constants.tagForNoQuote;
			}

			// set leading value
			const quoteItems = _.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
			if (quoteItems.length > 0) {
				leadingFields[visibleColumn.Id] = _.sumBy(quoteItems, this.compareCache.leadingRow.Field);
			} else {
				leadingFields[visibleColumn.Id] = Constants.tagForNoQuote;
			}
		});

		// sort by ascending for calculate rank.
		currentItem.totalValues = totalValues = _.sortBy(currentItem.totalValues);
		currentItem.totalValuesExcludeTarget = totalValuesExcludeTarget = _.sortBy(totalValuesExcludeTarget);

		// add max/min/average value
		_.set(currentItem, Constants.maxValueIncludeTarget, 0);
		_.set(currentItem, Constants.minValueIncludeTarget, 0);
		_.set(currentItem, Constants.averageValueIncludeTarget, this.utilService.calculateAverageValue(totalValues) || 0);
		_.set(currentItem, Constants.maxValueExcludeTarget, 0);
		_.set(currentItem, Constants.minValueExcludeTarget, 0);
		_.set(currentItem, Constants.averageValueExcludeTarget, this.utilService.calculateAverageValue(totalValuesExcludeTarget) || 0);

		// get the min leading Field Values Exclude Target
		const minLeadingField = _.min(totalValuesExcludeTarget) || 0;
		const differentFields = this.utilService.checkHighlightQtn(this.compareCache.visibleColumns, currentItem.QuoteItems);
		const absoluteDiffRow = _.find(this.compareCache.visibleCompareRows, row => row.Field === CompareFields.absoluteDifference || row.Field === CompareFields.percentage);
		// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			const quoteItem = _.find(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id});
			if (this.bidderIdentitySvc.isNotReference(visibleColumn.Id) && quoteItem) {
				if (differentFields && absoluteDiffRow && absoluteDiffRow.DeviationReference && absoluteDiffRow.DeviationReference > 0) {
					const percentageBasicQuote = this.utilService.getBasicQuote(currentItem, absoluteDiffRow, visibleColumn.Id, differentFields['markFieldQtn'] as string, this.compareCache.leadingRow.Field, () => this.getTotalField());
					percentages[visibleColumn.Id] = percentageBasicQuote.basicPercentage as number;
				} else {
					if (minLeadingField === 0) {
						percentages[visibleColumn.Id] = 0;
					} else {
						percentages[visibleColumn.Id] = leadingFields[visibleColumn.Id] as number / minLeadingField * 100;
					}
				}
			}
			if (!quoteItem) {
				percentages[visibleColumn.Id] = Constants.tagForNoQuote;
			}
		});

		// set rank value
		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			if (this.bidderIdentitySvc.isNotReference(visibleColumn.Id)) {
				const rank = _.indexOf(totalValuesExcludeTarget, totals[visibleColumn.Id]);
				ranks[visibleColumn.Id] = rank + 1;
			}
		});

		// set value for children (general total/ prcItem).
		if (currentItem.Children && currentItem.Children.length > 0) {
			_.forEach(currentItem.Children, (item) => {
				this.setColumnValuesForGeneralTotalRow(item);
				this.setColumnValuesForItemRow(item);
				item.parentItem = currentItem;
			});
			const children = _.filter(currentItem.Children, {LineTypeFk: CompareRowTypes.prcItem});
			this.utilService.combinedMaxMin(currentItem, children as IExtendableObject[]);
		}

		// set budget total
		let budgetTotalSum = 0;
		if (currentItem.QuoteItems && currentItem.QuoteItems.length > 0) {
			budgetTotalSum = _.sumBy(_.filter(currentItem.QuoteItems, quoteItem => {
				return quoteItem.QuoteKey === 'QuoteCol_-1_-1_-1';
			}), CompareFields.budgetTotal) || 0;
		}
		currentItem.BudgetTotal = budgetTotalSum;

		// Compare Description
		let desc = this.utilService.getTranslationText('procurement.pricecomparison.compareTotal');
		_.map(this.compareCache.summaryRows, (summaryRow) => {
			if (summaryRow.Field === CompareFields.rank || summaryRow.Field === CompareFields.percentage) {
				desc = desc + Constants.tagForValueSeparator + summaryRow.DisplayName;
			}
		});
		currentItem.CompareDescription = desc;
	}

	private retrieveComboQuotes(quoteItems: ICustomQuoteItemBase[], bidderQuotes: ICustomCompareColumnEntity[]) {
		const comboQuotes: ICustomQuoteItemBase[] = [];
		_.forEach(quoteItems, (item) => {
			const quote = {
				QuoteKey: item.QuoteKey,
				OwnQuoteKey: item.OwnQuoteKey,
				BusinessPartnerId: item.BusinessPartnerId,
				QtnVersion: item.QtnVersion,
				ReqHeaderId: item.ReqHeaderId,
				PrcHeaderId: item.PrcHeaderId,
				PrcItemId: item.PrcItemId,
				QtnHeaderId: item.QtnHeaderId,
				ConfigurationId: this.utilService.tryGetQuoteConfigurationId(this.compareCache.quotes, item.QtnHeaderId)
			} as unknown as ICustomQuoteItemBase;

			const quoteId = _.parseInt((quote.OwnQuoteKey ? quote.OwnQuoteKey : quote.QuoteKey).split('_')[1]);
			const quoteList = this.compareCache.quotes;
			const originalQuote = _.find(quoteList, {Id: quoteId});
			if (originalQuote) {
				quote.Id = originalQuote.Id;
				quote.RfqHeaderId = originalQuote.RfqHeaderFk;
				quote.ExchangeRate = originalQuote.ExchangeRate || 1;
				quote.BillingSchemaFk = originalQuote.BillingSchemaFk;
				quote.RubricCategoryFk = originalQuote.RubricCategoryFk;
				quote.ProjectId = originalQuote.ProjectFk;
				quote.IsIdealBidder = originalQuote.IsIdealBidder || false;
			}

			const bidderQuote = _.find(bidderQuotes, {Id: quote.QuoteKey});
			if (bidderQuote) {
				quote['EvaluationList'] = bidderQuote.EvaluationList;
			}

			comboQuotes.push(quote);
		});
		return comboQuotes;
	}

	private createRfqRow(requisitionRows: T[]): T {
		const rfqId = requisitionRows[0].RfqHeaderId as number;
		const rfqRow = this.createCompositeBaseRow('rfq_row_' + rfqId, undefined, 'procurement.pricecomparison.compareSubtotal', CompareRowTypes.rfq, 'font-bold');
		rfqRow.HasChildren = true;
		rfqRow.Children = requisitionRows;
		rfqRow.RfqHeaderId = rfqId;
		rfqRow.ReqHeaderId = requisitionRows[0].ReqHeaderId;
		rfqRow.ChosenBusinessPartner = true;
		const rfqHeader = this.compareCache.rfqHeaders.find(e => e.Id === rfqId);
		if (rfqHeader) {
			_.set(rfqRow, 'StatusFk', rfqHeader.RfqStatusFk);
			_.set(rfqRow, 'ItemNo', rfqHeader.Code);
			_.set(rfqRow, 'Description1', rfqHeader.Description);
			_.set(rfqRow, 'PaymentTermFiFk', rfqHeader.PaymentTermFiFk);
			_.set(rfqRow, 'PaymentTermPaFk', rfqHeader.PaymentTermPaFk);
			_.set(rfqRow, 'Reference', rfqHeader.Code);
			_.set(rfqRow, 'Brief', rfqHeader.Description);
		}
		this.setColumnValuesForRfqRow(rfqRow);
		return rfqRow;
	}

	private setColumnValuesForRfqRow(rfqRow: T) {
		const ranks: IExtendableObject<number> = {};
		const totals: IExtendableObject<number | string> = {};
		const percentages: IExtendableObject<number> = {};
		const finalBillingSchemas: IExtendableObject = {};
		let totalValues: number[] = [];
		let totalValuesExcludeTarget: number[] = [];

		rfqRow.totals = totals;
		rfqRow.ranks = ranks;
		rfqRow.percentages = percentages;
		rfqRow.finalBillingSchemas = finalBillingSchemas;
		rfqRow.totalValues = totalValues;
		rfqRow.totalValuesExcludeTarget = totalValuesExcludeTarget;

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			const requisitionRows = _.filter(rfqRow.Children, (item) => {
				return item.LineTypeFk === CompareRowTypes.requisition;
			});
			let sum = _.sumBy(requisitionRows, (item) => {
				return item.totals ? (item.totals[visibleColumn.Id] === Constants.tagForNoQuote ? 0 : item.totals[visibleColumn.Id] as number) : 0;
			});
			const quoteItemList: ICustomQuoteItemBase[] = [];
			_.forEach(requisitionRows, (item) => {
				const quoteItem = _.find(item.QuoteItems, {QuoteKey: visibleColumn.Id});
				if (quoteItem) {
					quoteItemList.push(quoteItem);
				}
			});

			if (quoteItemList && quoteItemList.length > 0) {
				totals[visibleColumn.Id] = sum;
				const ownQuoteKey = this.utilService.getOwnQuoteKey(this.qtnMatches, visibleColumn.Id, rfqRow.RfqHeaderId);
				const currentQuoteId = this.utilService.getQuoteId(ownQuoteKey);
				const finalBillingSchema = this.compareCache.finalBillingSchema.find(e => e.HeaderFk === currentQuoteId);
				if (this.dataSvc.isFinalShowInTotal() && finalBillingSchema) {
					sum = finalBillingSchema.Result;
					totals[visibleColumn.Id] = finalBillingSchema.Result;
					finalBillingSchemas[visibleColumn.Id] = finalBillingSchema;
				}
				// exclude ideal bidders.
				if (!visibleColumn.IsIdealBidder) {
					this.utilService.concludeTargetValue(visibleColumn.Id, totalValues, totalValuesExcludeTarget, sum, this.compareCache.visibleColumns);
				}
			} else {
				totals[visibleColumn.Id] = Constants.tagForNoQuote;
			}
		});

		rfqRow.totalValues = totalValues = _.sortBy(totalValues);
		rfqRow.totalValuesExcludeTarget = totalValuesExcludeTarget = _.sortBy(totalValuesExcludeTarget); // sort by ascending for calculate rank.

		// set Max/ Min/ Average value
		_.set(rfqRow, Constants.maxValueIncludeTarget, 0);
		_.set(rfqRow, Constants.minValueIncludeTarget, 0);
		_.set(rfqRow, Constants.averageValueIncludeTarget, this.utilService.calculateAverageValue(totalValues) || 0);
		_.set(rfqRow, Constants.maxValueExcludeTarget, 0);
		_.set(rfqRow, Constants.minValueExcludeTarget, 0);
		_.set(rfqRow, Constants.averageValueExcludeTarget, this.utilService.calculateAverageValue(totalValuesExcludeTarget) || 0);

		// set Percentage/ Rank value (currently they don't needed, just only for using in the feature).
		const minValueField = _.min(totalValuesExcludeTarget) || 0;

		this.compareCache.visibleColumns.forEach((visibleColumn) => {
			if (this.bidderIdentitySvc.isNotReference(visibleColumn.Id)) {
				// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
				if (minValueField === 0) {
					percentages[visibleColumn.Id] = 0;
				} else {
					percentages[visibleColumn.Id] = (totals[visibleColumn.Id] as number) / minValueField * 100;
				}

				// set Rank value
				const rank = _.indexOf(totalValuesExcludeTarget, totals[visibleColumn.Id]);
				ranks[visibleColumn.Id] = rank + 1;
			}
		});

		// set Max/ Min/ Average value
		if (rfqRow && rfqRow.Children && rfqRow.Children.length) {
			const children = _.filter(rfqRow.Children, {LineTypeFk: CompareRowTypes.requisition});
			this.utilService.combinedMaxMin(rfqRow, children as IExtendableObject[]);
		}
	}

	private addCharacteristicGroupRow(parentItem: ICompositeBaseEntity<T>, groups: ICustomCharacteristicGroup[]) {
		_.forEach(groups, (group) => {
			const groupRow = this.createCompositeBaseRow('characteristic_group_row_' + parentItem.RfqHeaderId + '_' + group.Id, parentItem.RfqHeaderId, '', CompareRowTypes.characteristicGroup);

			// TODO-DRIZZLE: To be checked, why can't access with index?
			// groupRow['GroupId'] = group.Id;
			// groupRow['SectionId'] = group.SectionId;

			_.set(groupRow, 'GroupId', group.Id);
			_.set(groupRow, 'SectionId', group.SectionId);

			groupRow.HasChildren = false;
			groupRow.Children = [];
			groupRow.ReqHeaderId = parentItem.ReqHeaderId;

			// add child group row
			this.addCharacteristicGroupRow(groupRow, group.Children);

			parentItem.Children.push(groupRow);
			parentItem.HasChildren = true;
		});
	}

	private addCharacteristicRow(groups: T[], qtnMatchCache: Map<number, ICustomQuoteItemBase[]>) {
		groups.forEach((group) => {
			// add characteristics to group (filter by section id and group id)
			const characteristics = this.compareCache.rfqCharacteristic.filter(e => {
				return e.SectionId === group['SectionId'] && e.GroupId === group['GroupId'];
			});

			characteristics.forEach((item) => {
				const itemRow = this.createCompositeBaseRow('characteristic_row_' + item.Id, group.RfqHeaderId, undefined, CompareRowTypes.characteristic);

				// TODO-DRIZZLE: To be checked, why can't access with index?
				// itemRow.CharacteristicDataId = item.Id;   // used for set row line name.
				// itemRow.GroupId = group.GroupId;
				// itemRow.CharacteristicId = item.CharacteristicId;
				// itemRow.Reference = item.Code;
				// itemRow.CharacteristicTypeId = item.CharacteristicTypeId;

				_.set(itemRow, 'CharacteristicDataId', _.get(item, 'Id'));
				_.set(itemRow, 'GroupId', _.get(group, 'GroupId'));
				_.set(itemRow, 'CharacteristicId', _.get(item, 'CharacteristicId'));
				_.set(itemRow, 'Reference', _.get(item, 'Code'));
				_.set(itemRow, 'CharacteristicTypeId', _.get(item, 'CharacteristicTypeId'));

				itemRow.HasChildren = false;
				itemRow.Children = [];
				itemRow.ReqHeaderId = group.ReqHeaderId;

				// add quote column's value for the characteristic row
				_.forEach(this.compareCache.visibleColumns, (quoteColumn) => {
					const itemList = qtnMatchCache.get(group.RfqHeaderId);
					const itemConfig = itemList ? _.find(itemList, function (item) {
						return item.QuoteKey === quoteColumn.Id;
					}) : null;
					const quoteId = itemConfig ? itemConfig.QtnHeaderId : quoteColumn.QuoteHeaderId;

					if (quoteColumn.QuoteHeaderId === BidderIdentities.targetValue) {
						_.set(itemRow, quoteColumn.Id, item.ValueText || '');
					} else if (quoteColumn.QuoteHeaderId !== BidderIdentities.baseBoqValue) {
						const quoteHeader = this.compareCache.quoteCharacteristic.find(e => {
							return e.ObjectId === quoteId && e.CharacteristicId === (_.get(itemRow, 'CharacteristicId') as number);
						}, {
							ObjectId: quoteId,
							CharacteristicId: _.get(itemRow, 'CharacteristicId') as number
						});
						if (quoteHeader) {
							_.set(itemRow, quoteColumn.Id + '_$hasBidder', true);
						}
						if (_.get(itemRow, 'CharacteristicTypeId') as number === 10) {
							_.set(itemRow, quoteColumn.Id, quoteHeader ? quoteHeader.CharacteristicValueId : -1);
						} else {
							_.set(itemRow, quoteColumn.Id, quoteHeader ? quoteHeader.ValueText : '');
						}
					}
				});
				this.compareCache.childrenCharacter.push(itemRow);
				group.Children.push(itemRow);
				group.HasChildren = true;
			});

			// add characteristics to group's childGroup
			this.addCharacteristicRow(group.Children, qtnMatchCache);
		});
	}

	private addCharacteristicTotalRow2RfqRow(qtnMatchCache: Map<number, ICustomQuoteItemBase[]>, itemList: T[], rfqCharacteristicGroups: ICustomCharacteristicGroup[], quoteCompareRows: ICompareRowEntity[]) {
		const characterConfig = quoteCompareRows.find(e => e.Field === CompareFields.characteristics);
		if (characterConfig && characterConfig.Visible && !_.isEmpty(rfqCharacteristicGroups)) {
			const rfqHeaderId = itemList.length ? itemList[0].RfqHeaderId : 0;
			const totalRow = this.createCompositeBaseRow('characteristic_total_row_' + rfqHeaderId, rfqHeaderId, '', CompareRowTypes.characteristicTotal);
			totalRow.HasChildren = false;
			totalRow.Children = [];

			this.addCharacteristicGroupRow(totalRow, rfqCharacteristicGroups);   // add group to characteristic total row
			this.addCharacteristicRow(totalRow.Children, qtnMatchCache);  // add characteristic to characteristic group row

			itemList.unshift(totalRow);
		}
	}

	private addSchemaCompareFieldRows(itemList: T[], rfqHeaderId: number, reqHeaderId: number) {
		const parentRow = this.createCompositeBaseRow('quote_row_total' + rfqHeaderId, rfqHeaderId, undefined, CompareRowTypes.billingSchemaGroup);
		parentRow.LineName = this.utilService.getTranslationText('procurement.common.billingSchema');
		parentRow.HasChildren = true;
		parentRow.Children = [];
		parentRow.ReqHeaderId = reqHeaderId;

		parentRow.BudgetPerUnit = 0;
		parentRow.BudgetTotal = 0;

		_.each(_.reverse(this.compareCache.visibleBillingSchemaRows), (schemaRow, index) => {
			if (schemaRow.Visible) {
				const newRow = this.createCompositeBaseRow('quote_row_' + rfqHeaderId + '_' + schemaRow.Id, rfqHeaderId, schemaRow.DisplayName, CompareRowTypes.billingSchemaChildren);
				newRow.LineName = '';
				newRow.HasChildren = false;
				newRow.Children = [];
				newRow.ReqHeaderId = reqHeaderId;
				newRow.CompareField = schemaRow.Field;

				if (index === 0) {
					itemList.unshift(parentRow);
				}
				parentRow.Children.unshift(newRow);

				let hasValue = false;
				const totalValues: number[] = []; // store quote values for bidders (including Target)
				const totalValuesExcludeTarget: number[] = [];   // store quote values for bidders (Exclude Target)
				this.compareCache.visibleColumns.forEach((item) => {
					hasValue = false;
					_.set(newRow, item.Id, 0);
					let billingSchema = _.find(item.BillingSchemaList, (entity) => {
						return entity.CostLineTypeId.toString() === schemaRow.Id;
					});
					if (billingSchema) {
						if (this.bidderIdentitySvc.isReference(item.Id)) {
							totalValues.push(billingSchema.CostLineTypeResult);
							_.set(newRow, item.Id, billingSchema.CostLineTypeResult);
							hasValue = true;
						} else if (item.RfqHeaderId === rfqHeaderId) {
							if (!item.IsIdealBidder) {
								totalValues.push(billingSchema.CostLineTypeResult);
								totalValuesExcludeTarget.push(billingSchema.CostLineTypeResult);
							}
							_.set(newRow, item.Id, billingSchema.CostLineTypeResult);
							hasValue = true;
						}
					}

					if (item.RfqHeaderId !== rfqHeaderId && item.Children && item.Children.length > 0) {
						const child = _.find(item.Children, {RfqHeaderId: rfqHeaderId});
						if (child) {
							billingSchema = _.find(child.BillingSchemaList, function (entity) {
								return entity.CostLineTypeId.toString() === schemaRow.Id;
							});
							if (!item.IsIdealBidder) {
								totalValues.push(billingSchema ? billingSchema.CostLineTypeResult : 0);
								totalValuesExcludeTarget.push(billingSchema ? billingSchema.CostLineTypeResult : 0);
							}
							_.set(newRow, item.Id, billingSchema ? billingSchema.CostLineTypeResult : 0);
							hasValue = true;
						}
					}

					if (!hasValue) { // give default value to calculate the max,min,avg value
						if (!item.IsIdealBidder) {
							this.utilService.concludeTargetValue(item.Id, totalValues, totalValuesExcludeTarget, 0, this.compareCache.visibleColumns);
						}
					}
				});

				newRow.totalArray = totalValuesExcludeTarget;
				this.utilService.recalculateValue(newRow, totalValues, totalValuesExcludeTarget);

				newRow.BudgetTotal = 0;
				newRow.BudgetPerUnit = 0;
			}
		});

		this.utilService.recalculateValue(parentRow, [], []);
	}

	private addQuoteCompareFieldRows(quoteCompareRows: ICompareRowEntity[], itemList: T[], isChangeOrder: boolean, rfqHeaderId: number, reqHeaderId: number, isVerticalCompareRows: boolean) {
		const compareColumns = this.compareCache.visibleColumns;
		const visibleCompareRowsCache = this.compareCache.visibleCompareRows;
		const evaluationTotal = this.utilService.collectEvalValue(compareColumns, rfqHeaderId);
		const evalTotalValues = evaluationTotal.totalValues;
		const evalTotalExcludeTarget = evaluationTotal.excludeTarget;
		const excludeFields = [
			CompareFields.grandTotalRank,
			CompareFields.characteristics,
			CompareFields.evaluatedTotal,
			CompareFields.offeredTotal
		];

		const quoteHeaderRow = this.createCompositeBaseRow('quote_row_' + rfqHeaderId, undefined, undefined, CompareRowTypes.quoteTotal, 'font-bold');
		quoteHeaderRow.HasChildren = true;
		quoteHeaderRow.LineName = '';
		quoteHeaderRow.Children = [];

		const quoteItems: Array<{
			QuoteHeaderId: number,
			QuoteKey: string
		}> = [];
		_.each(quoteCompareRows, (quoteRow) => {
			if (quoteRow.Visible && !_.includes(excludeFields, quoteRow.Field)) {
				const newRow = this.createCompositeBaseRow('quote_row_' + rfqHeaderId + '_' + quoteRow.Field, rfqHeaderId, quoteRow.DisplayName, -1000);
				newRow.LineName = '';
				newRow.ReqHeaderId = reqHeaderId;
				newRow.HasChildren = false;
				newRow.QuoteField = quoteRow.Field;
				newRow.Children = [];
				this.utilService.setQuoteRowValueForLineType(quoteRow, newRow);
				quoteHeaderRow.Children.push(newRow);

				if (CompareFields.evaluationResult === quoteRow.Field) {
					this.utilService.recalculateValue(newRow, evalTotalValues, evalTotalExcludeTarget);
				}
				_.forEach(compareColumns, (baseCol) => {
					if (CompareFields.evaluationResult === quoteRow.Field) {
						this.utilService.evalResultStructure(rfqHeaderId, baseCol, newRow, evalTotalExcludeTarget);
						return;
					} else if (CompareFields.evaluationRank === quoteRow.Field) {
						this.utilService.evalRankStructure(rfqHeaderId, baseCol, newRow, evalTotalExcludeTarget);
						return;
					} else if (CompareFields.turnover === quoteRow.Field) {
						this.utilService.evalTurnover(newRow, baseCol.Id, baseCol.BusinessPartnerId, baseCol.IsIdealBidder, this.compareCache.turnovers);
						return;
					} else if (CompareFields.avgEvaluationRank === quoteRow.Field) {
						this.utilService.evalAvgEvaluationRank(newRow, baseCol.Id, compareColumns, quoteCompareRows, baseCol.IsIdealBidder, this.compareCache.businessPartnerAvgEvaluationValues);
						return;
					} else if (_.includes([
						CompareFields.avgEvaluationA,
						CompareFields.avgEvaluationB,
						CompareFields.avgEvaluationC
					], quoteRow.Field)) {
						this.utilService.evalAvgEvaluationValue(newRow, baseCol.Id, quoteRow.Field, baseCol.BusinessPartnerId, baseCol.IsIdealBidder, this.compareCache.businessPartnerAvgEvaluationValues);
						return;
					}

					if (isChangeOrder) {
						const childCol = _.find(baseCol['Children'] || [], {
							RfqHeaderId: rfqHeaderId,
							BusinessPartnerId: baseCol.BusinessPartnerId
						});
						_.set(newRow, baseCol.Id, childCol ? this.utilService.getColumnValuesForQuoteCompareFieldRows(this.compareCache.quotes, rfqHeaderId, childCol.QuoteHeaderId, baseCol.Id, quoteRow.Field) : '');
					} else {
						_.set(newRow, baseCol.Id, this.utilService.getColumnValuesForQuoteCompareFieldRows(this.compareCache.quotes, rfqHeaderId, baseCol.QuoteHeaderId, baseCol.Id, quoteRow.Field));
					}
					const quoteItem = _.find(quoteItems, {QuoteHeaderId: baseCol.QuoteHeaderId});
					if (!quoteItem) {
						quoteItems.push({
							QuoteHeaderId: baseCol.QuoteHeaderId,
							QuoteKey: baseCol.Id
						});
					}
				});
			}
		});
		if (isVerticalCompareRows) {
			_.forEach(quoteItems, (quoteItem) => {
				_.forEach(quoteHeaderRow.Children, (newRow) => {
					_.forEach(visibleCompareRowsCache, (row) => {
						const column = quoteItem.QuoteKey + '_' + row.Field;
						_.set(newRow, column, this.utilService.getColumnValuesForQuoteCompareFieldRows(this.compareCache.quotes, rfqHeaderId, quoteItem.QuoteHeaderId, quoteItem.QuoteKey, row.Field));
						if (!newRow[column]) {
							_.set(newRow, column, '');
						}
					});
				});
			});
		}
		itemList.unshift(quoteHeaderRow);
	}

	private restructureCompareData(response: RT, isChangeOrder: boolean): T {
		let qtnKeyMatch: ICustomQuoteItemBase[] = [];
		_.forEach(response.Main, (requisitionRow) => {
			requisitionRow.cssClass = 'font-bold';
			this.setChangeOrderQuoteKey2BaseOrderQuoteKey(requisitionRow);
			qtnKeyMatch = qtnKeyMatch.concat(this.retrieveComboQuotes(requisitionRow.QuoteItems, this.compareCache.columns));

			this.utilService.addGeneralTotalRow2RequisitionRow(requisitionRow, this.compareCache.visibleCompareRows, this.compareCache.generalTypes);
			this.setColumnValuesForRequisitionRow(requisitionRow);
		});

		this.qtnMatches.set(response.Main[0].RfqHeaderId, qtnKeyMatch);

		const rfqRow = this.createRfqRow(response.Main);

		this.addCharacteristicTotalRow2RfqRow(this.qtnMatches, rfqRow.Children, this.compareCache.rfqCharacteristicGroup, this.compareCache.visibleQuoteRows);

		// add billing schema compare field
		this.addSchemaCompareFieldRows(rfqRow.Children, rfqRow.RfqHeaderId, rfqRow.ReqHeaderId);

		// add quote compare field
		this.addQuoteCompareFieldRows(this.compareCache.visibleQuoteRows, rfqRow.Children, isChangeOrder, rfqRow.RfqHeaderId, rfqRow.ReqHeaderId, this.dataSvc.isVerticalCompareRows());

		this.utilService.attachValueFromParent(rfqRow, [{
			sourceProp: 'Id',
			targetProp: 'ParentId'
		}]);

		return rfqRow;
	}

	public buildTree(loaded: RT[]) {
		let tree: T[] = [];

		if (!loaded || !loaded.length) {
			return tree;
		}

		loaded.forEach((res, idx) => {
			const isChangeOrder = idx > 0;
			const rfqRow = this.restructureCompareData(res, isChangeOrder);
			tree.push(rfqRow);
		});

		if (this.utilService.isEvaluatedTotalVisible(this.compareCache.visibleQuoteRows)) {
			this.addEvaluatedTotalRowAndSetColumnValues(tree);
		}

		if (this.utilService.isOfferedTotalVisible(this.compareCache.visibleQuoteRows)) {
			this.addOfferedTotalRowAndSetColumnValues(tree);
		}

		this.addGrandTotalRowAndSetColumnValues(tree);
		this.utilService.setRowValuesForStructureColumn(tree);
		this.setRowValuesForLineNameColumn(tree);

		tree = this.buildCustomTree(tree);

		this.utilService.attachExtraValueToTreeRows(tree, this.getDataProcessors());

		return tree;
	}
}