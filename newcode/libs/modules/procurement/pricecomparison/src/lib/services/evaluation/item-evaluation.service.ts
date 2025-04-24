/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { inject, Injectable } from '@angular/core';
import { IItemEvaluationOption } from '../../model/entities/compare-item-evaluation-option.interface';
import { ProcurementPricecomparisonCompareItemDataService } from '../data/item/compare-item-data.service';
import { ProcurementPricecomparisonCompareBoqDataService } from '../data/boq/compare-boq-data.service';
import { CompareRowTypes } from '../../model/constants/compare-row-types';
import { ServiceLocator } from '@libs/platform/common';
import { ProcurementPricecomparisonUtilService } from '../util.service';
import { ProcurementCommonVatPercentageService } from '@libs/procurement/common';
import { ProcurementPricecomparisonCompareExchangeRateService } from '../compare-exchange-rate.service';
import { ProcurementShareQuoteLookupService } from '@libs/procurement/shared';
import { ICustomPrcItem } from '../../model/entities/item/custom-prc-item.interface';
import { ICustomBoqItem } from '../../model/entities/boq/custom-boq-item.interface';
import { ICompositeBoqEntity } from '../../model/entities/boq/composite-boq-entity.interface';
import { ICompositeItemEntity } from '../../model/entities/item/composite-item-entity.interface';
import { ICustomCompareColumnEntity } from '../../model/entities/custom-compare-column-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPriceComparisonItemEvaluationService {
	protected readonly quoteLookupSvc = inject(ProcurementShareQuoteLookupService);
	protected readonly getVatPercentService = inject(ProcurementCommonVatPercentageService);
	protected readonly utilService = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly exchangeRateService = inject(ProcurementPricecomparisonCompareExchangeRateService);
	private readonly itemService = inject(ProcurementPricecomparisonCompareItemDataService);
	private readonly boqService = inject(ProcurementPricecomparisonCompareBoqDataService);

	public doEvaluate(evaluateOption: IItemEvaluationOption) {
		_.forEach(evaluateOption.quotes, quote => {
			this.evaluateItem(quote, evaluateOption);
			this.evaluateBoq(quote, evaluateOption);
		});
		//TODO: redraw tree
		/*if (isEvaluateBoq()) {
			this.boqService.redrawTree(false, null);
		}
		if (isEvaluateItem()) {
			this.itemService.redrawTree(false, null);
		}*/
	}

	private isEvaluateItem(){
		//TODO: check the container is exist or not
		//return platformGridAPI.grids.exist(itemGridId()) && itemService.getTree() && itemService.getTree().length > 0;
	}

	private isEvaluateBoq(){
		//TODO: check the container is exist or not
		//return platformGridAPI.grids.exist(boqGridId()) && boqService.getTree() && boqService.getTree().length > 0;
	}

	private evaluateItem(quote: ICustomCompareColumnEntity, evaluateOption: IItemEvaluationOption) {
		const itemTree = this.itemService.getTree();
		if (itemTree && itemTree.length > 0) {
			const rfqRow = _.find(itemTree, { LineTypeFk: -12 });
			if (rfqRow !== undefined) {
				const reqRows = _.filter(rfqRow.Children, { LineTypeFk: CompareRowTypes.requisition });
				_.forEach(reqRows, reqRow => {
					_.forEach(reqRow.Children, reqItem => {
						const quoteItems = _.filter(reqItem.QuoteItems as ICustomPrcItem[], { QuoteKey: quote.Id }) as ICustomPrcItem[];
						let targetItems: ICustomPrcItem[] = [];
						const selectedPrcItems = evaluateOption.prcItems;
						if (selectedPrcItems && selectedPrcItems.length > 0) {
							const selectedPrcItemIds = selectedPrcItems.map(e => e.Id);
							targetItems = targetItems.concat(_.filter(quoteItems, item => {
								return _.indexOf(selectedPrcItemIds, item.Id) > -1;
							}));
							_.forEach(targetItems, item => {
								const vatPercent = item.QtnHeaderVatGroupFk? this.getVatPercentService.getVatPercent(item.TaxCodeFk, item.QtnHeaderVatGroupFk) : 1;
								const currentQuote = _.find(this.quoteLookupSvc.cache.getList(), { Id: item.QtnHeaderId });
								const exchangeRate = currentQuote && currentQuote.RfqHeaderFk ? this.exchangeRateService.getExchangeRate(currentQuote.RfqHeaderFk, currentQuote.Id, 'QuoteCol_-1_-1_-1') : 1;
								const isVerticalCompareRows = this.itemService.isVerticalCompareRows();
								const priceRow = _.find(reqItem.Children, { Id: reqItem.PrcItemId + '_Price' });
								const targetValue = this.getItemEvaluationValue(evaluateOption.itemEvaluationValue, isVerticalCompareRows, priceRow, item, 'PrcItemId', reqItem);
								if (targetValue !== undefined && targetValue !== -1) {
									const allQuoteItems = this.utilService.getAllQuoteItems(itemTree, 'Children');
									const originalQuoteItems = _.filter(allQuoteItems, function(i) {
										return i.PrcItemId === item.PrcItemId && i.QtnHeaderId === item.QtnHeaderId;
									});
									_.each(originalQuoteItems, entity => {
										entity.Price = targetValue;
										entity.PrcItemEvaluationId = evaluateOption.itemEvaluationValue;
										entity.ExQtnIsEvaluated = true;
										this.utilService.setPricePriceOcPriceGrossPriceGrossOc(entity, entity.Price, 'Price', vatPercent, exchangeRate);
									});
									if (item.Price > 0) {
										item.NotSubmitted = false;
										if (!isVerticalCompareRows) {
											const notSubmittedItem = _.find(reqItem.Children, { Id: reqItem.Id + '_NotSubmitted' });
											if (notSubmittedItem) {
												// TODO: To be checked.
												//platformRuntimeDataService.readonly(notSubmittedItem, [{
												//	field: item.QuoteKey,
												//	readonly: false
												//}]);
											}
										} else {
											// TODO: To be checked.
											//platformRuntimeDataService.readonly(reqItem, [{
											//	field: item.QuoteKey + '_NotSubmitted',
											//	readonly: false
											//}]);
										}
									}

									//TODO: if modified data to save
									//commonService.assignItemEvaluation(evaluateOption.itemEvaluation, isVerticalCompareRows, item, reqItem, 'Children');
									//itemService.collectItemEvaluationModifiedDataFromWizard(item);
									//itemHelperService.recalculatePrcItem(originalQuoteItems, item, false);
								}
							});
						}
					});
				});
			}
		}
	}

	private evaluateBoq(quote: ICustomCompareColumnEntity, evaluateOption: IItemEvaluationOption) {
		//TODO: save modifiedItems
		/*const modifiedData = {
			modifiedItems: [],
			originalQuoteItems: []
		};*/
		const boqTree = this.boqService.getTree();
		if (boqTree && boqTree.length > 0) {
			const rfqRow = _.find(boqTree, { LineTypeFk: -12 });
			if (rfqRow) {
				const requisitions = _.filter(rfqRow.Children, { LineTypeFk: CompareRowTypes.requisition });
				_.forEach(requisitions, requisition => {
					_.forEach(requisition.Children, root => {
						this.evaluatePositionBoqItems(root.Children, quote, evaluateOption);
					});
				});
				//TODO: save modifiedItems
				/*if (modifiedData.modifiedItems.length > 0) {
					this.boqService.recalculateList(quote.Id, modifiedData.modifiedItems);
				}*/
			}
		}
	}

	public evaluatePositionBoqItems(boqItems: ICompositeBoqEntity[], quote: ICustomCompareColumnEntity, evaluateOption: IItemEvaluationOption) {
		_.forEach(boqItems, parent => {
			if (this.utilService.isBoqPositionRow(parent.LineTypeFk)) {
				this.evaluatePositionBoqItem(parent, quote, evaluateOption);
			} else {
				if (parent && this.isPositionBoqItemParent(parent)) {
					_.forEach(parent.Children, childItem => {
						if (this.utilService.isBoqPositionRow(childItem.LineTypeFk)) {
							this.evaluatePositionBoqItem(childItem, quote, evaluateOption);
						}
					});
				} else {
					if (parent && Object.prototype.hasOwnProperty.call(parent, 'Children')) {
						this.evaluatePositionBoqItems(parent.Children, quote, evaluateOption);
					}
				}
			}
		});
	}

	public evaluatePositionBoqItem(positionBoqItem: ICompositeBoqEntity, quote: ICustomCompareColumnEntity, evaluateOption: IItemEvaluationOption) {
		const quoteItems = _.filter(positionBoqItem.QuoteItems, {QuoteKey: quote.Id}) as ICustomBoqItem[];
		let targetItems: ICustomBoqItem[] = [];
		const selectedBoqItems = evaluateOption.boqItems;
		if (selectedBoqItems && selectedBoqItems.length > 0) {
			const selectedBoqItemIds = selectedBoqItems.map(e => e.Id);
			targetItems = targetItems.concat(_.filter(quoteItems, function(item){
				return _.indexOf(selectedBoqItemIds, item.BoqItemId) > -1;
			}));
			_.forEach(targetItems, boqItem => {
				const isVerticalCompareRows = this.boqService.isVerticalCompareRows();
				const priceRow = _.find(positionBoqItem.Children, { Id: positionBoqItem.BoqItemId + '_Price' });
				const targetValue = this.getItemEvaluationValue(evaluateOption.itemEvaluationValue, isVerticalCompareRows, priceRow, boqItem, 'BoqItemId', positionBoqItem);
				if (targetValue !== undefined && targetValue !== -1) {
					//TODO: Save modified data
					//modifiedData.originalQuoteItems.push(boqItem);
					boqItem.Price = targetValue;
					boqItem.PrcItemEvaluationId = evaluateOption.itemEvaluationValue;
					boqItem.ExQtnIsEvaluated = true;
					if (boqItem.Price > 0) {
						boqItem.NotSubmitted = false;
						if (!isVerticalCompareRows) {
							const notSubmittedItem = _.find(positionBoqItem.Children, { Id: positionBoqItem.Id + '_NotSubmitted' });
							if (notSubmittedItem) {
								// TODO: To be checked.
								//platformRuntimeDataService.readonly(notSubmittedItem, [{ field: boqItem.QuoteKey, readonly: false }]);
							}
						} else {
							// TODO: To be checked.
							//platformRuntimeDataService.readonly(positionBoqItem, [{
							//	field: boqItem.QuoteKey + '_NotSubmitted',
							//	readonly: false
							//}]);
						}

						boqItem.Included = false;
						if (!isVerticalCompareRows) {
							const includedItem = _.find(positionBoqItem.Children, { Id: positionBoqItem.Id + '_Included' });
							if (includedItem) {
								// TODO: To be checked.
								//platformRuntimeDataService.readonly(includedItem, [{ field: boqItem.QuoteKey, readonly: false }]);
							}
						} else {
							// TODO: To be checked.
							//platformRuntimeDataService.readonly(positionBoqItem, [{
							//	field: boqItem.QuoteKey + '_Included',
							//	readonly: false
							//}]);
						}
					}

					//TODO: if modified data to save
					//commonService.assignItemEvaluation(evaluateOption.itemEvaluation, isVerticalCompareRows, boqItem, positionBoqItem, 'BoqItemChildren');
					//this.boqService.collectBoqEvaluationModifiedDataFromWizard(boqItem, quote.RfqHeaderId);
					//modifiedData.modifiedItems.push(angular.copy(boqItem));
				}
			});
		}
	}

	public isPositionBoqItemParent(boqItem: ICompositeBoqEntity) {
		if (Object.prototype.hasOwnProperty.call(boqItem, 'BoqItemChildren')) {
			const boqItemChildren = _.filter(boqItem.Children, { BoqLineTypeFk: 0 });
			return boqItemChildren && boqItemChildren.length > 0;
		} else {
			return false;
		}
	}

	public getItemEvaluationValue(itemEvaluation: number, isVerticalCompareRows: boolean, priceRow: ICompositeItemEntity | ICompositeBoqEntity | undefined, currentItem: ICustomPrcItem | ICustomBoqItem, idField: string, parentItem: ICompositeItemEntity | ICompositeBoqEntity) {
		const currentFieldValues: number[] = [];
		const targetItems = _.filter(parentItem.originPriceExcludeTarget, function (item) {
			return _.get(item, idField) !== _.get(currentItem, idField) && !item.NotSubmitted;
		});

		_.forEach(targetItems,
			function (quoteItem) {
				currentFieldValues.push(quoteItem.Price);
			});

		let targetValue = -1;
		switch (itemEvaluation) {
			case 4: {// requisition price
				if (!isVerticalCompareRows && priceRow) {
					targetValue = priceRow['QuoteCol_-1_-1_-1'] as number;
				} else {
					targetValue = parentItem['QuoteCol_-1_-1_-1_Price'] as number;
				}
				break;
			}
			case 5: {// average
				targetValue = this.utilService.calculateAverageValue(currentFieldValues) || 0;
				break;
			}
			case 6: {// minimum
				targetValue = this.utilService.getRepairNumeric(_.min(currentFieldValues));
				break;
			}
			case 7: {// maximum
				targetValue = this.utilService.getRepairNumeric(_.max(currentFieldValues));
				break;
			}
			case 10: {// requisition budget unit
				targetValue = parentItem.BudgetPerUnit? parentItem.BudgetPerUnit : 0;
				break;
			}
			default: {
				break;
			}
		}
		return targetValue;
	}
}