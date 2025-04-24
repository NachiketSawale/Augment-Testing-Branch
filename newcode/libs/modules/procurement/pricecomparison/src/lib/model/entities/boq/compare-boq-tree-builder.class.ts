/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { IBoqTextComplementEntity } from '@libs/boq/interfaces';
import { CompareTreeBaseBuilder } from '../../classes/compare-tree-base-builder.class';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';
import { ICompareBoqTreeResponse } from './compare-boq-tree-response.interface';
import { BoqLineType } from '../../constants/boq/boq-line-type';
import { ICompositeDataProcess } from '../composite-data-process.interface';
import { ICustomBoqItem } from './custom-boq-item.interface';
import { ProcurementPricecomparisonCompareBoqDataBaseService } from '../../../services/data/boq/compare-boq-data-base.service';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { ICompareBoqTypeSummary } from './compare-boq-type-summary.interface';
import { boqSummaryFields } from '../../constants/boq/boq-summary-fields';
import { ICustomBoqStructure } from './custom-boq-structure.interface';
import { CompareRowTypes } from '../../constants/compare-row-types';
import { ICompareBoqRange } from './compare-boq-range.interface';
import { BoqSummaryRowTypes } from '../../constants/boq/boq-summary-row-types';
import { Constants } from '../../constants/constants';
import { ICompareSummaryRowInfo } from './compare-summary-row-info.interface';
import { BoqSummaryTypes } from '../../constants/boq/boq-summary-types';
import { CompareFields } from '../../constants/compare-fields';
import { BidderIdentities } from '../../constants/bidder-identities';
import { IExtendableObject } from '../extendable-object.interface';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { UnitRateBreakDownFields } from '../../constants/boq/unit-rate-break-down-fields';
import { BoqDeviationFields } from '../../constants/boq/boq-deviation-fields';
import { HighlightFields } from '../../constants/highlight-fields';
import { BoqEditableCompareFields } from '../../constants/boq/boq-editable-compare-fields';
import { EvaluationKeys } from '../../constants/evaluation-keys';
import { BoqSummaryRowDefinition } from '../../constants/boq/boq-summary-row-definition';
import { ICustomQuoteItemBase } from '../custom-quote-item-base.interface';

export class CompareBoqTreeBuilder extends CompareTreeBaseBuilder<ICompositeBoqEntity, ICompareBoqTreeResponse> {
	public constructor(
		private boqDataSvc: ProcurementPricecomparisonCompareBoqDataBaseService
	) {
		super(boqDataSvc);
		this.initializeDataProcessors();
	}

	private _dataProcessors: ICompositeDataProcess<ICompositeBoqEntity>[] = [];

	protected override get compareCache() {
		return this.boqDataSvc.compareCache;
	}

	private initializeDataProcessors() {
		this._dataProcessors.push(this.utilService.createRowProcessor('QuoteCol_-1_-1_-1', [
			{rowProp: 'UserDefined1', targetProp: 'Userdefined1'},
			{rowProp: 'UserDefined2', targetProp: 'Userdefined2'},
			{rowProp: 'UserDefined3', targetProp: 'Userdefined3'},
			{rowProp: 'UserDefined4', targetProp: 'Userdefined4'},
			{rowProp: 'UserDefined5', targetProp: 'Userdefined5'},
			'ExternalCode'
		], (row) => {
			return this.utilService.isBoqRow(row.LineTypeFk);
		}));

		// Budget
		this._dataProcessors.push({
			isMatched: (row) => {
				return this.utilService.isBoqRow(row.LineTypeFk);
			},
			process: (row) => {
				const target = _.find(row.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'}) as ICustomBoqItem;
				if (target) {
					if (this.utilService.isBoqPositionRow(row.LineTypeFk)) {
						row.BudgetPerUnit = target.BudgetPerUnit;
					}
					if (this.utilService.isBoqRootRow(row.LineTypeFk) || this.utilService.isBoqLevelRow(row.LineTypeFk)) {
						row.BudgetDifference = target.BudgetDifference;
					} else {
						row.BudgetDifference = null;
					}
					row.BudgetTotal = target.BudgetTotal;
				}
			}
		});

		// ONORM
		const structure = this.compareCache.boqStructures[0];
		const isONORM = !!structure && structure.StandardId === 5;
		this._dataProcessors.push({
			isMatched: row => true,
			process: row => {
				row['isONORM'] = isONORM;
			}
		});
	}

	private getLineName(lineTypeFk: number) {
		return this.compareCache.boqLineTypes.find(l => l.Id === lineTypeFk)?.Description;
	}

	private getStructureDetail(lineTypeFk: number): string {
		const structureDetail = this.compareCache.boqStructureDetails.find(e => e.LineTypeId === lineTypeFk);
		let description = structureDetail && structureDetail.Description ? structureDetail.Description : '';
		if (!description) {
			const lineName = this.getLineName(lineTypeFk);
			if (lineName) {
				description = lineName;
			}
		}
		return description;
	}

	private retrieveTotalDescription(itemTypeValue: number, itemTypeLookupName: string, summaryInfo: ICompareBoqTypeSummary) {
		const itemType = this.compareCache.itemTypes.find(e => e.Id === itemTypeValue);
		if (itemType) {
			const itemTypeInfos = itemTypeLookupName === 'itemTypes' ? summaryInfo.boqItemTypesInfos : summaryInfo.boqItemTypes2Infos;
			const targetInfo = itemTypeInfos ? itemTypeInfos.find(e => e.Id === itemType.Id) : null;
			return (targetInfo && targetInfo.UserLabelName) ? targetInfo.UserLabelName : itemType.DisplayName;
		}
		return '';
	}

	private mergeRowOptions(bidderColumns: ICustomCompareColumnEntity[], levelOptions?: ICompareSummaryRowInfo[], positionOptions?: ICompareSummaryRowInfo[], defaultOptionsFn?: () => ICompareSummaryRowInfo[]) {
		if (levelOptions && positionOptions) {
			_.each(levelOptions, rowOpt => {
				const summaryTypeTarget = _.find(positionOptions, {summaryType: rowOpt.summaryType});
				_.each(rowOpt.rows, row => {
					const rowTarget = _.find(summaryTypeTarget ? summaryTypeTarget.rows : [], {Id: row.Id});
					_.each(bidderColumns, bidder => {
						if (_.includes([
							BoqSummaryRowTypes.total,
							BoqSummaryRowTypes.abs,
							BoqSummaryRowTypes.discountTotal
						], row.SummaryRowType) && _.isNumber(row[bidder.Id]) && rowTarget && rowTarget[bidder.Id]) {
							row[bidder.Id] = (row[bidder.Id] as number) + (rowTarget[bidder.Id] as number);
						}
					});
				});
			});
		}
		return levelOptions || positionOptions || (defaultOptionsFn ? defaultOptionsFn() : []);
	}

	private createCompositeBoqEntity(parent: ICompositeBoqEntity, summaryRowType: string, boqLineType: number, rowType: string, description: string, cssClass?: string, _rt$Deleted?: boolean): ICompositeBoqEntity {
		return {
			Id: parent.Id + '_' + rowType,
			ParentId: parent.Id,
			CompareDescription: description,
			SummaryRowType: summaryRowType,
			rowType: rowType,
			LineTypeFk: boqLineType,
			cssClass: cssClass,
			_rt$Deleted: _rt$Deleted,
			Children: [],
			HasChildren: false
		} as unknown as ICompositeBoqEntity;
	}

	private createRowOptions(parent: ICompositeBoqEntity, summaryInfo: ICompareBoqTypeSummary): ICompareSummaryRowInfo[] {
		const discountAbsText = this.utilService.getTranslationText('procurement.pricecomparison.printing.discountAbs');
		const discountPercentText = this.utilService.getTranslationText('procurement.pricecomparison.printing.discountPercent');
		const summaryTotalTerm = 'procurement.pricecomparison.printing.summaryTotal';
		const rowOptions: ICompareSummaryRowInfo[] = [{
			rows: [
				this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.total, CompareRowTypes.summaryStandardTotal, 'standard_total', this.retrieveTotalDescription(1, 'itemTypes', summaryInfo)),
				this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.abs, CompareRowTypes.summaryStandardABS, 'standard_abs', discountAbsText),
				this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.percent, CompareRowTypes.summaryStandardPercent, 'standard_percent', discountPercentText),
				this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.discountTotal, CompareRowTypes.summaryStandardDiscountTotal, 'standard_discountTotal', this.utilService.getTranslationText(summaryTotalTerm, {
					p_0: this.retrieveTotalDescription(1, 'itemTypes', summaryInfo)
				}), 'font-bold'),
			],
			summaryType: BoqSummaryTypes.standard
		},
			{
				rows: [
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.total, CompareRowTypes.summaryOptionalITTotal, 'optIT_total', this.retrieveTotalDescription(5, 'itemTypes', summaryInfo)),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.abs, CompareRowTypes.summaryOptionalITABS, 'optIT_abs', discountAbsText),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.percent, CompareRowTypes.summaryOptionalITPercent, 'optIT_percent', discountPercentText),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.discountTotal, CompareRowTypes.summaryOptionalITDiscountTotal, 'optIT_discountTotal', this.utilService.getTranslationText(summaryTotalTerm, {
						p_0: this.retrieveTotalDescription(5, 'itemTypes', summaryInfo)
					}), 'font-bold'),
				],
				summaryType: BoqSummaryTypes.optionWithIT
			},
			{
				rows: [
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.total, CompareRowTypes.summaryOptionalWITTotal, 'optWIT_total', this.retrieveTotalDescription(2, 'itemTypes', summaryInfo)),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.abs, CompareRowTypes.summaryOptionalWITABS, 'optWIT_abs', discountAbsText),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.percent, CompareRowTypes.summaryOptionalWITPercent, 'optWIT_percent', discountPercentText),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.discountTotal, CompareRowTypes.summaryOptionalWITDiscountTotal, 'optWIT_discountTotal', this.utilService.getTranslationText(summaryTotalTerm, {
						p_0: this.retrieveTotalDescription(2, 'itemTypes', summaryInfo)
					}), 'font-bold'),
				],
				summaryType: BoqSummaryTypes.optionWithoutIT
			},
			{
				rows: [
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.total, CompareRowTypes.summaryAlternativeTotal, 'alternative_total', this.retrieveTotalDescription(5, 'itemTypes2', summaryInfo), undefined, true),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.abs, CompareRowTypes.summaryAlternativeABS, 'alternative_abs', discountAbsText, undefined, true),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.percent, CompareRowTypes.summaryAlternativePercent, 'alternative_percent', discountPercentText, undefined, true),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.discountTotal, CompareRowTypes.summaryAlternativeDiscountTotal, 'alternative_discountTotal', this.utilService.getTranslationText(summaryTotalTerm, {
						p_0: this.retrieveTotalDescription(5, 'itemTypes2', summaryInfo)
					}), 'font-bold'),
				],
				summaryType: BoqSummaryTypes.alternative
			},
			{
				rows: [
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.total, CompareRowTypes.summaryGrandTotal, 'grand_total', this.utilService.getTranslationText('procurement.pricecomparison.printing.grantItems')),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.abs, CompareRowTypes.summaryGrandABS, 'grand_abs', discountAbsText),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.percent, CompareRowTypes.summaryGrandPercent, 'grand_percent', discountPercentText),
					this.createCompositeBoqEntity(parent, BoqSummaryRowTypes.discountTotal, CompareRowTypes.summaryGrandDiscountTotal, 'grand_discountTotal', this.utilService.getTranslationText('procurement.pricecomparison.printing.grandDiscountItems'), 'font-bold'),
				],
				summaryType: BoqSummaryTypes.grand
			}
		];

		_.each(rowOptions, (opt) => {
			_.each(opt.rows, (row) => {
				row.nodeInfo = {
					level: parent.nodeInfo ? parent.nodeInfo.level + 1 : 1,
					collapsed: true,
					lastElement: true,
					children: false
				};
			});
		});

		return rowOptions;
	}

	private processSummaryDataRowChildren(parent: ICompositeBoqEntity, bidderColumns: ICustomCompareColumnEntity[], summaryInfo: ICompareBoqTypeSummary) {
		if (this.utilService.isBoqRootRow(parent.LineTypeFk) || this.utilService.isBoqLevelRow(parent.LineTypeFk)) {
			const children = parent.Children;
			const levels = _.filter(children, (child) => {
				return this.utilService.isBoqLevelRow(child.LineTypeFk);
			});
			const positions = _.filter(children, (child) => {
				return this.utilService.isBoqPositionRow(child.LineTypeFk);
			});
			let levelRowOptions: ICompareSummaryRowInfo[] | undefined = undefined;
			let positionRowOptions: ICompareSummaryRowInfo[] | undefined = undefined;

			if (levels.length) {
				levelRowOptions = this.createRowOptions(parent, summaryInfo);
				// Current row contains levels.
				_.each(children, (child) => {
					this.processSummaryDataRowChildren(child, bidderColumns, summaryInfo);
				});

				let discountItems: ICompositeBoqEntity[] = [];
				_.each(children, (child) => {
					const summaryItems = _.filter(child.Children, (item) => {
						return _.includes([BoqSummaryRowTypes.discountTotal], item.SummaryRowType);
					});
					discountItems = discountItems.concat(summaryItems);
				});

				_.each(bidderColumns, (bidder) => {
					const parentQuote = _.find(parent.QuoteItems, {QuoteKey: bidder.Id});
					if (parentQuote) {
						const totalSum = _.sumBy(_.filter(discountItems, {LineTypeFk: CompareRowTypes.summaryGrandDiscountTotal}), bidder.Id);
						const currDiscountPercent = this.getProcessSummaryCurrentBidderDiscount(parentQuote, totalSum);
						_.each(levelRowOptions, (rowOpt) => {
							let items: ICompositeBoqEntity[] = [];
							switch (rowOpt.summaryType) {
								case BoqSummaryTypes.standard:
									items = _.filter(discountItems, {LineTypeFk: CompareRowTypes.summaryStandardDiscountTotal});
									break;
								case BoqSummaryTypes.optionWithIT:
									items = _.filter(discountItems, {LineTypeFk: CompareRowTypes.summaryOptionalITDiscountTotal});
									break;
								case BoqSummaryTypes.optionWithoutIT:
									items = _.filter(discountItems, {LineTypeFk: CompareRowTypes.summaryOptionalWITDiscountTotal});
									break;
								case BoqSummaryTypes.grand:
									items = _.filter(discountItems, {LineTypeFk: CompareRowTypes.summaryGrandDiscountTotal});
									break;
								case BoqSummaryTypes.alternative:
									items = _.filter(discountItems, {LineTypeFk: CompareRowTypes.summaryAlternativeDiscountTotal});
									break;
							}
							_.each(rowOpt.rows, (row) => {
								this.processSummaryDataRowLevelBidderColumns(rowOpt.rows, items, row, bidder, currDiscountPercent, bidder.Id);
							});
						});
					} else {
						_.each(levelRowOptions, (rowOpt) => {
							_.each(rowOpt.rows, (row) => {
								this.processSummaryEmptyDataRowLevelBidderColumns(row, bidder);
							});
						});
					}
				});
			}

			if (positions.length) {
				positionRowOptions = this.createRowOptions(parent, summaryInfo);
				// Current row contains positions.
				let quoteItems: ICustomBoqItem[] = [];
				_.each(children, (child) => {
					if (child.LineTypeFk === BoqLineType.position) {
						quoteItems = quoteItems.concat(child.QuoteItems);
					}
				});
				_.each(bidderColumns, (bidder) => {
					const parentQuote = _.find(parent.QuoteItems, {QuoteKey: bidder.Id});
					if (parentQuote) {
						const bidderItems = _.filter(quoteItems, {QuoteKey: bidder.Id});
						_.each(positionRowOptions, (rowOpt) => {
							let items: ICustomBoqItem[] = [];
							let sumProp: string | ((item: ICustomBoqItem | ICompositeBoqEntity) => number) = 'Finalprice';
							switch (rowOpt.summaryType) {
								case BoqSummaryTypes.standard:
									items = _.filter(bidderItems, (item) => {
										return this.utilService.isStandardBoq(item.BasItemTypeFk, item.BasItemType2Fk);
									});
									break;
								case BoqSummaryTypes.optionWithIT:
									items = _.filter(bidderItems, (item) => {
										return this.utilService.isOptionalWithItBoq(item.BasItemTypeFk, item.BasItemType2Fk);
									});
									break;
								case BoqSummaryTypes.optionWithoutIT:
									items = _.filter(bidderItems, (item) => {
										return this.utilService.isOptionalWithoutItBoq(item.BasItemTypeFk);
									});
									sumProp = 'Finalprice_BaseAlt';
									break;
								case BoqSummaryTypes.grand:
									items = _.filter(bidderItems, {QuoteKey: bidder.Id});
									sumProp = (item: ICustomBoqItem | ICompositeBoqEntity): number => {
										if (item.BasItemTypeFk === 2 || item.BasItemType2Fk === 5) {
											return item['Finalprice_BaseAlt'] as number;
										}
										return item['Finalprice'] as number;
									};
									break;
								case  BoqSummaryTypes.alternative:
									items = _.filter(bidderItems, (item) => {
										return this.utilService.isAlternativeBoq(item.BasItemType2Fk);
									});
									sumProp = 'Finalprice_BaseAlt';
									break;
							}
							const totalSum = _.sumBy(bidderItems, sumProp);
							const currDiscountPercent = this.getProcessSummaryCurrentBidderDiscount(parentQuote, totalSum);
							_.each(rowOpt.rows, (row) => {
								this.processSummaryDataRowLevelBidderColumns(rowOpt.rows, items, row, bidder, currDiscountPercent, sumProp);
							});
						});
					} else {
						_.each(positionRowOptions, (rowOpt) => {
							_.each(rowOpt.rows, (row) => {
								this.processSummaryEmptyDataRowLevelBidderColumns(row, bidder);
							});
						});
					}
				});
			}

			const rowOptions = this.mergeRowOptions(bidderColumns, levelRowOptions, positionRowOptions, () => this.createRowOptions(parent, summaryInfo));

			// Insert new rows into children node.
			let tempChildren = parent.Children ? parent.Children : [];
			const currRowOptions = this.processSummaryDataRowValueComparison(rowOptions.reverse(), bidderColumns);
			_.each(currRowOptions, (rowOpt) => {
				_.each(rowOpt.rows, row => {
					row.parentItem = parent;
				});
				tempChildren = _.concat(rowOpt.rows, tempChildren);
			});
			parent.Children = tempChildren;
		}
	}

	private processSummaryDataRowValueComparison(rowOptions: ICompareSummaryRowInfo[], bidderColumns: ICustomCompareColumnEntity[]) {
		_.each(rowOptions, (rowOpt) => {
			_.each(rowOpt.rows, (row) => {
				const excludeTargetValues: number[] = [];
				const includeTargetValues: number[] = [];
				_.each(bidderColumns, (bidder) => {
					if (_.isNumber(row[bidder.Id])) {
						this.utilService.concludeTargetValue(bidder.Id, includeTargetValues, excludeTargetValues, row[bidder.Id] as number, bidderColumns);
					}
				});

				// Calculate max/min/average value by exclude target.
				row[Constants.minValueExcludeTarget] = _.min(excludeTargetValues);
				row[Constants.maxValueExcludeTarget] = _.max(excludeTargetValues);
				row[Constants.averageValueExcludeTarget] = this.utilService.calculateAverageValue(excludeTargetValues);

				// Calculate max/min/average values by include target.
				row[Constants.minValueIncludeTarget] = _.min(includeTargetValues);
				row[Constants.maxValueIncludeTarget] = _.max(includeTargetValues);
				row[Constants.averageValueIncludeTarget] = this.utilService.calculateAverageValue(includeTargetValues);
			});
		});
		return rowOptions;
	}

	private processSummaryDataRowLevelBidderColumns(rows: ICompositeBoqEntity[], sumItems: ICustomBoqItem[] | ICompositeBoqEntity[], row: ICompositeBoqEntity, bidder: ICustomCompareColumnEntity, currDiscountPercent: number, totalSumProp: string | ((item: ICustomBoqItem | ICompositeBoqEntity) => number)) {
		// This function's logic constrains that the row sorting should be like total->abs->percent->discountTotal
		let absTotal = null;
		switch (row.SummaryRowType) {
			case BoqSummaryRowTypes.total: {
				const actualSumItems = _.filter(sumItems, (item: ICustomBoqItem | ICompositeBoqEntity) => {
					const sumValue = _.isString(totalSumProp) ? _.get(item, totalSumProp) : totalSumProp(item);
					return _.isNumber(sumValue);
				});
				_.set(row, bidder.Id, _.sumBy(actualSumItems, totalSumProp));
				break;
			}
			case BoqSummaryRowTypes.abs: {
				const absTotalRow = _.find(rows, {SummaryRowType: BoqSummaryRowTypes.total});
				absTotal = _.get(absTotalRow, bidder.Id) as number;
				_.set(row, bidder.Id, absTotal * currDiscountPercent / 100);
				break;
			}
			case BoqSummaryRowTypes.percent: {
				const absTotalRow = _.find(rows, {SummaryRowType: BoqSummaryRowTypes.total});
				absTotal = _.get(absTotalRow, bidder.Id) as number;
				_.set(row, bidder.Id, absTotal === 0 ? 0 : currDiscountPercent);
				break;
			}
			case BoqSummaryRowTypes.discountTotal: {
				const totalRow = _.find(rows, {SummaryRowType: BoqSummaryRowTypes.total});
				const total = _.get(totalRow, bidder.Id) as number;
				const absRow = _.find(rows, {SummaryRowType: BoqSummaryRowTypes.abs});
				const abs = _.get(absRow, bidder.Id) as number;
				_.set(row, bidder.Id, total - abs);
				break;
			}
		}
	}

	private processSummaryEmptyDataRowLevelBidderColumns(row: ICompositeBoqEntity, bidder: ICustomCompareColumnEntity) {
		_.set(row, bidder.Id, undefined);
	}

	private getProcessSummaryCurrentBidderDiscount(parentQuote: ICustomBoqItem, totalSum: number) {
		let currDiscountPercent = 0;
		const discount = parentQuote.Discount;
		const discountPercentIt = parentQuote.DiscountPercentIt;
		if (discountPercentIt > 0) {
			currDiscountPercent = discountPercentIt;
		}
		if (discount > 0) {
			currDiscountPercent = (discount && totalSum > 0 ? discount / totalSum : 0) * 100;
		}
		return currDiscountPercent;
	}

	private getRemoveBoQsByRanges(dataTree: ICompositeBoqEntity[], boqRanges: ICompareBoqRange[]) {
		const dataRows = this.utilService.flatTree(dataTree);
		let removeItems: ICompositeBoqEntity[] = [];
		const rfqNodes = _.filter(dataRows, (item) => {
			return item.LineTypeFk === CompareRowTypes.rfq;
		});
		_.each(rfqNodes, (rfq) => {
			const dataSource = this.utilService.flatTree([rfq]);
			_.each(boqRanges, (range) => {
				const root = _.find(dataSource, (row) => {
					return row.LineTypeFk === BoqLineType.root && row.Reference === range.ReferenceNo;
				});
				if (!root) {
					return;
				}
				let index = 0;
				root.Sorting = index;
				const flatList = this.utilService.flatTree<ICompositeBoqEntity>([root]);
				_.each(flatList, (item) => {
					item.Sorting = ++index;
				});

				const fromBoq = _.find(flatList, {BoqItemId: range.FromId});
				let toBoq = _.find(flatList, {BoqItemId: range.ToId});
				if (toBoq && this.utilService.isBoqPositionRow(toBoq.LineTypeFk) && toBoq.Children.length > 0) {
					toBoq = _.last(this.utilService.flatTree([toBoq]));
				}
				removeItems = removeItems.concat(_.filter(flatList, (item) => {
					return item.Sorting ? (fromBoq && fromBoq.Sorting ? item.Sorting < fromBoq.Sorting : false) || (toBoq && toBoq.Sorting ? item.Sorting > toBoq.Sorting : false) : false;
				}));
			});
		});

		return removeItems;
	}

	private getRemoveBoQsByItemTypes(item: ICompositeBoqEntity, itemTypes: number[], itemTypes2: number[], boqStructure?: ICustomBoqStructure) {
		const isPosition = this.utilService.isBoqPositionRow(item.LineTypeFk);
		const isCRB = boqStructure && boqStructure.StandardId === 4;
		const isEmptyTypes = itemTypes.length === 0 && itemTypes2.length === 0;
		const isExcluding = item.BasItemTypeFk === 0 ? false : (!_.includes(itemTypes, item.BasItemTypeFk) || !_.includes(itemTypes2, item.BasItemType2Fk));
		let items: ICompositeBoqEntity[] = [];

		if ((isPosition) && (!isCRB) && (isEmptyTypes || isExcluding)) {
			items = items.concat([item]).concat(this.utilService.flatTree(item.Children));
		} else {
			_.each(item.Children, (m) => {
				items = items.concat(this.getRemoveBoQsByItemTypes(m, itemTypes, itemTypes2, boqStructure));
			});
		}
		return items;
	}

	private getRemoveBoQsByZeroValue(item: ICompositeBoqEntity, bidderColumns: ICustomCompareColumnEntity[]) {
		const isPositionRow = this.utilService.isBoqPositionRow(item.LineTypeFk);
		const isSummaryRow = _.includes(boqSummaryFields, item.LineTypeFk);
		const isRowMatched = isPositionRow || isSummaryRow;
		const isMatched = isRowMatched && _.sumBy(bidderColumns, (column) => {
			if (isSummaryRow) {
				const value = _.get(item, column.Id);
				return Math.abs(_.isNumber(value) ? value : 0);
			} else {
				const boqItem = _.find(item.QuoteItems, {QuoteKey: column.Id});
				const prop = _.includes([3, 5], item.BasItemType2Fk) || _.includes([2], item.BasItemTypeFk) ? 'ItemTotal_BaseAlt' : 'ItemTotal';
				return Math.abs(boqItem ? boqItem[prop] : 0);
			}
		}) === 0;
		let items: ICompositeBoqEntity[] = [];

		if (isMatched) {
			items = items.concat([item]).concat(this.utilService.flatTree(item.Children));
		} else {
			_.each(item.Children, (m) => {
				items = items.concat(this.getRemoveBoQsByZeroValue(m, bidderColumns));
			});
		}
		return items;
	}

	private getRemoveBoQsBySummaryChildren(parent: ICompositeBoqEntity, checkedLineTypes: number[], bidderColumns: ICustomCompareColumnEntity[]) {
		const children = parent.Children;
		let removeItems: ICompositeBoqEntity[] = [];

		if (parent.LineTypeFk === BoqLineType.root || (parent.LineTypeFk >= BoqLineType.level1 && parent.LineTypeFk <= BoqLineType.level9)) {
			if (!_.includes(checkedLineTypes, parent.LineTypeFk)) {
				const summaryRows = _.filter(children, (item) => {
					return _.includes(boqSummaryFields, item.LineTypeFk);
				});
				removeItems = _.concat(removeItems, summaryRows);
			}
		}

		_.each(parent.Children, (child) => {
			removeItems = removeItems.concat(this.getRemoveBoQsBySummaryChildren(child, checkedLineTypes, bidderColumns));
		});

		removeItems = _.concat(removeItems);
		return removeItems;
	}

	private removeBoQDataRowsByRanges(dataTree: ICompositeBoqEntity[], boqRanges: ICompareBoqRange[], isSoftRemove: boolean) {
		const removeItems = this.getRemoveBoQsByRanges(dataTree, boqRanges);
		const removeIds = _.map(removeItems, (item) => {
			return item.Id;
		});

		return this.utilService.removeDataRowsRecursively(dataTree, (n: ICompositeBoqEntity) => {
			return _.includes(removeIds, n.Id);
		}, isSoftRemove);
	}

	private removeBoQDataRowsByItemTypes(dataTree: ICompositeBoqEntity[], itemTypes: number[], itemTypes2: number[], isSoftRemove: boolean) {
		let removeItems: ICompositeBoqEntity[] = [];
		const boqStructure = _.first(this.compareCache.boqStructures);

		_.each(dataTree, (item) => {
			removeItems = removeItems.concat(this.getRemoveBoQsByItemTypes(item, itemTypes, itemTypes2, boqStructure));
		});

		const removeIds = _.map(removeItems, function (item) {
			return item.Id;
		});

		return this.utilService.removeDataRowsRecursively(dataTree, (n: ICompositeBoqEntity) => {
			return _.includes(removeIds, n.Id);
		}, isSoftRemove);
	}

	private removeSummaryDataRows(dataTree: ICompositeBoqEntity[], checkedLineTypes: number[], bidderColumns: ICustomCompareColumnEntity[], isSoftRemove: boolean) {
		const flatDataRows = this.utilService.flatTree(dataTree);
		const boqRoots = _.filter(flatDataRows, {LineTypeFk: BoqLineType.root});
		let removeItems: ICompositeBoqEntity[] = [];
		_.each(boqRoots, (root) => {
			removeItems = removeItems.concat(this.getRemoveBoQsBySummaryChildren(root, checkedLineTypes, bidderColumns));
		});
		const removeIds = _.map(removeItems, (row) => {
			return row.Id;
		});
		return this.utilService.removeDataRowsRecursively(dataTree, (n: ICompositeBoqEntity) => {
			return _.includes(removeIds, n.Id);
		}, isSoftRemove);
	}

	private removeZeroValueRows(dataTree: ICompositeBoqEntity[], bidderColumns: ICustomCompareColumnEntity[], isSoftRemove: boolean) {
		let removeItems: ICompositeBoqEntity[] = [];

		_.each(dataTree, (item) => {
			removeItems = removeItems.concat(this.getRemoveBoQsByZeroValue(item, bidderColumns));
		});

		const removeIds = _.map(removeItems, (item) => {
			return item.Id;
		});

		return this.utilService.removeDataRowsRecursively(dataTree, (n: ICompositeBoqEntity) => {
			return _.includes(removeIds, n.Id);
		}, isSoftRemove);
	}

	private clearSummaryDataRows(dataTree: ICompositeBoqEntity[]) {
		return this.utilService.removeDataRowsRecursively(dataTree, (n: ICompositeBoqEntity) => {
			return _.includes(boqSummaryFields, n.LineTypeFk);
		}, false);
	}

	private addSummaryDataRows(dataTree: ICompositeBoqEntity[], bidderColumns: ICustomCompareColumnEntity[], summaryInfo: ICompareBoqTypeSummary) {
		const flatDataRows = this.utilService.flatTree(dataTree);
		const boqRoots = _.filter(flatDataRows, {LineTypeFk: BoqLineType.root});
		_.each(boqRoots, (root) => {
			this.processSummaryDataRowChildren(root, bidderColumns, summaryInfo);
		});
	}

	private setBidderCompareRowValue(
		entity: ICompositeBoqEntity,
		visibleColumn: ICustomCompareColumnEntity,
		visibleRow: ICompareRowEntity,
		currRow: ICompositeBoqEntity,
		fieldKeys: string[],
		fieldValues: number[],
		checkHighlightFields: string[],
		differentFields: { [p: string]: unknown },
		fieldValuesExcludeTarget: number[]
	) {
		const bidderValueProp = visibleColumn.QuoteKey || visibleColumn.Id;
		const quoteItem = _.find(entity.QuoteItems, {QuoteKey: visibleColumn.QuoteKey || visibleColumn.Id});
		const compareField = visibleRow.Field;

		if (quoteItem) {
			if (compareField === CompareFields.rank && entity.ranks) {
				currRow[visibleColumn.Id] = entity.ranks[bidderValueProp] || 0;
			} else if (compareField === CompareFields.bidderComments) {
				let textComplement: IBoqTextComplementEntity | undefined = undefined;
				if (quoteItem && quoteItem.TextComplement) {
					textComplement = quoteItem.TextComplement.find(e => e.ComplCaption === currRow['ComplCaption']);
				}
				currRow[visibleColumn.Id + '_$hasBidder'] = true;
				currRow[visibleColumn.Id + '_Id'] = textComplement ? textComplement.Id : null;
				currRow[visibleColumn.Id] = textComplement ? textComplement.ComplBody : '';
			} else {
				// defect: 79827
				// for a change order RFQ,  if it has a change order quote1 for bidder1, but no change order quote2 for bidder2,
				// so in UI, the two compare fields below in quote1 will allow editable, but set readonly in quote2.
				if (_.includes(BoqEditableCompareFields, compareField)) {
					currRow[visibleColumn.Id + '_$hasBidder'] = true;
				}

				if (compareField === CompareFields.prcItemEvaluationFk) {
					currRow[visibleColumn.Id] = (quoteItem && quoteItem[CompareFields.discountedUnitPrice]) ? quoteItem[CompareFields.discountedUnitPrice] : 0;
					currRow[visibleColumn.Id + '_$FirstEvaluationFk'] = (quoteItem && quoteItem[CompareFields.prcItemEvaluationFk]) ? quoteItem[CompareFields.prcItemEvaluationFk] : null;
					currRow[visibleColumn.Id + '_$Evaluation_QuoteCode'] = (quoteItem && quoteItem[EvaluationKeys.quoteCode]) ? quoteItem[EvaluationKeys.quoteCode] : null;
					currRow[visibleColumn.Id + '_$Evaluation_QuoteId'] = (quoteItem && quoteItem[EvaluationKeys.quoteId]) ? quoteItem[EvaluationKeys.quoteId] : null;
					currRow[visibleColumn.Id + '_$Evaluation_SourceBoqHeaderId'] = (quoteItem && quoteItem[EvaluationKeys.sourceBoqHeaderId]) ? quoteItem[EvaluationKeys.sourceBoqHeaderId] : null;
					currRow[visibleColumn.Id + '_$Evaluation_SourceBoqItemId'] = (quoteItem && quoteItem[EvaluationKeys.sourceBoqItemId]) ? quoteItem[EvaluationKeys.sourceBoqItemId] : null;
				} else if ([
					CompareFields.userDefined1,
					CompareFields.userDefined2,
					CompareFields.userDefined3,
					CompareFields.userDefined4,
					CompareFields.userDefined5,
					CompareFields.externalCode
				].includes(compareField)) {
					currRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : '';
				} else if (compareField === CompareFields.commentContractor || compareField === CompareFields.commentClient) {
					currRow[visibleColumn.Id] = quoteItem ? quoteItem[compareField] : null;
				} else if (compareField === CompareFields.isLumpsum || compareField === CompareFields.included || compareField === CompareFields.notSubmitted) {
					currRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : false;
				} else if (compareField === CompareFields.absoluteDifference || compareField === CompareFields.percentage) {
					let leadingField = this.compareCache.leadingRow.Field;
					let isBoqLevelRow = false;
					// root and level node should always take the total field.
					if (this.utilService.isBoqLevelRow(entity.LineTypeFk) || this.utilService.isBoqRootRow(entity.LineTypeFk)) {
						leadingField = CompareFields.itemTotal;
						isBoqLevelRow = true;
					}
					const basicQuote = this.utilService.getBasicQuote(entity, visibleRow, bidderValueProp, differentFields['markFieldQtn'] as string, leadingField, () => this.getTotalField(), isBoqLevelRow);
					currRow[visibleColumn.Id] = compareField === CompareFields.absoluteDifference ? basicQuote.absoluteDifference : basicQuote.basicPercentage;
					if (!quoteItem.IsIdealBidder && currRow[visibleColumn.Id] !== Constants.tagForNoQuote) {
						this.utilService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, currRow[visibleColumn.Id] as number, this.compareCache.visibleColumns);
					}
				} else {
					currRow[visibleColumn.Id] = (quoteItem && quoteItem[compareField]) ? quoteItem[compareField] : 0;
					// exclude ideal bidders.
					if (!quoteItem.IsIdealBidder && quoteItem.PrcItemEvaluationId !== 2) {
						this.utilService.concludeTargetValue(visibleColumn.QuoteKey || visibleColumn.Id, fieldValues, fieldValuesExcludeTarget, currRow[visibleColumn.Id] as number, this.compareCache.visibleColumns);
					}
				}
			}
			this.utilService.setConfigFieldReadonly(visibleRow.Field, visibleColumn.Id, currRow, this.qtnMatches, quoteItem, visibleColumn.IsIdealBidder, this.boqDataSvc.isVerticalCompareRows());

			// for highlight function
			if (visibleColumn.IsHighlightChanges === true && _.includes(checkHighlightFields, compareField)) {
				_.set(currRow, visibleColumn.Id + Constants.highlightQtn, differentFields[compareField] === false);
			}
			fieldKeys.push(visibleColumn.Id);
		} else {
			_.set(currRow, visibleColumn.Id, Constants.tagForNoQuote);
		}
	}

	private setOrRecalculateColumnValuesForCompareFieldRow(parentItem: ICompositeBoqEntity, visibleRow: ICompareRowEntity, newRow: ICompositeBoqEntity) {
		// set max/min/average column's compare row's (compare fields) value.
		let fieldValues: number[] = [];
		let fieldValuesExcludeTarget: number[] = [];
		const differentFields = this.utilService.checkHighlightQtn(this.compareCache.visibleColumns, parentItem.QuoteItems);
		const checkHighlightFields = HighlightFields;
		const fieldKeys: string[] = [];
		const isVerticalCompareRows = this.boqDataSvc.isVerticalCompareRows();
		_.each(this.compareCache.visibleColumns, (visibleColumn) => {
			const currColumn = isVerticalCompareRows && !this.utilService.isExcludedCompareRowInVerticalMode(visibleRow.Field) ? this.utilService.copyAndExtend(visibleColumn, {
				Id: this.utilService.getCombineCompareField(visibleColumn.Id, visibleRow.Field),
				QuoteKey: visibleColumn.Id,
				IsHighlightChanges: visibleColumn.IsHighlightChanges,
				IsIdealBidder: visibleColumn.IsIdealBidder
			}) : visibleColumn;

			this.setBidderCompareRowValue(parentItem, currColumn, visibleRow, newRow, fieldKeys, fieldValues, checkHighlightFields, differentFields, fieldValuesExcludeTarget);
		});

		if (visibleRow.Field === CompareFields.rank) {
			const ranks = parentItem.ranks as IExtendableObject<string | number>;
			for (const quoteKey1 in parentItem.ranks) {
				const quoteItem1 = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey1});
				if (this.bidderIdentitySvc.isNotReference(quoteKey1) && quoteItem1 && !quoteItem1.IsIdealBidder) {
					fieldValuesExcludeTarget.push(ranks[quoteKey1] as number);
				}
				fieldValues.push(ranks[quoteKey1] as number);
			}
		} else if (visibleRow.Field === CompareFields.percentage) {
			const percentages = parentItem.percentages as IExtendableObject<string | number>;
			for (const quoteKey2 in parentItem.percentages) {
				const quoteItem2 = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey2});
				if (this.bidderIdentitySvc.isNotReference(quoteKey2) && quoteItem2 && !quoteItem2.IsIdealBidder) {
					fieldValuesExcludeTarget.push(percentages[quoteKey2] as number);
				}
				fieldValues.push(percentages[quoteKey2] as number);
			}
		} else if (!visibleRow.Field) {
			fieldValues = [];
			fieldValuesExcludeTarget = [];
		}
		const compareRowPrefix = isVerticalCompareRows ? visibleRow.Field + '_' : '';
		newRow[compareRowPrefix + Constants.maxValueIncludeTarget] = this.utilService.getRepairNumeric(_.max(fieldValues));
		newRow[compareRowPrefix + Constants.minValueIncludeTarget] = this.utilService.getRepairNumeric(_.min(fieldValues));
		newRow[compareRowPrefix + Constants.averageValueIncludeTarget] = this.utilService.getRepairNumeric(this.utilService.calculateAverageValue(fieldValues));
		newRow[compareRowPrefix + Constants.maxValueExcludeTarget] = this.utilService.getRepairNumeric(_.max(fieldValuesExcludeTarget));
		newRow[compareRowPrefix + Constants.minValueExcludeTarget] = this.utilService.getRepairNumeric(_.min(fieldValuesExcludeTarget));
		newRow[compareRowPrefix + Constants.averageValueExcludeTarget] = this.utilService.getRepairNumeric(this.utilService.calculateAverageValue(fieldValuesExcludeTarget));

		let isBoqLevelRow = false;
		let leadingField = this.compareCache.leadingRow.Field;
		if (this.utilService.isBoqLevelRow(newRow.LineTypeFk) || this.utilService.isBoqRootRow(newRow.LineTypeFk)) {
			leadingField = CompareFields.itemTotal;
			isBoqLevelRow = true;
		}
		// highlight deviation rows
		this.utilService.highlightRows(parentItem, newRow, visibleRow, BoqDeviationFields, fieldKeys, differentFields['markFieldQtn'] as string, leadingField, () => this.getTotalField(), isBoqLevelRow);

		return newRow; // return object only used in recalculation by the changed 'PrcItemEvaluationFk' value.
	}

	private setColumnValuesForCompareFieldRow(parentItem: ICompositeBoqEntity, visibleCompareRows: ICompareRowEntity[], isVerticalCompareRows: boolean) {
		// add the visible rows by custom setting
		visibleCompareRows.forEach((visibleRow) => {
			if (isVerticalCompareRows && !this.utilService.isExcludedCompareRowInVerticalMode(visibleRow.Field)) {
				this.setOrRecalculateColumnValuesForCompareFieldRow(parentItem, visibleRow, parentItem);
			} else {
				if (visibleRow.Field !== CompareFields.bidderComments) {

					// the Unit Rate Break Down is equal to 0 (or the Unit Rate Break Down Flag is not checked)
					if (_.includes(UnitRateBreakDownFields, visibleRow.Field) && !this.utilService.showUrbData(parentItem, visibleRow.Field)) {
						return;
					}

					let newRow = _.find(parentItem.Children, {Id: parentItem.Id + '_' + visibleRow.Field});
					if (!newRow) {
						newRow = this.createCompositeBaseRow(parentItem.Id + '_' + visibleRow.Field, parentItem.RfqHeaderId, visibleRow.DisplayName, CompareRowTypes.compareField);
						newRow[Constants.rowType] = visibleRow.Field;
						if (_.includes(UnitRateBreakDownFields, visibleRow.Field)) {
							const currRow = _.find(this.compareCache.visibleCompareRows, {Field: visibleRow.Field});
							newRow.LineName = currRow ? currRow.FieldName : visibleRow.Field;
						} else {
							newRow.LineName = '';
						}
						newRow['ConditionalFormat'] = visibleRow.ConditionalFormat; // used to format the cell with this custom style.
						newRow.parentItem = parentItem;
						newRow.Children = [];
						newRow.HasChildren = false;
						newRow.CompareDescription = visibleRow.DisplayName as string;
						newRow.RfqHeaderId = parentItem.RfqHeaderId;
						newRow.ReqHeaderId = parentItem.ReqHeaderId;

						// using custom name for compare field 'Urb1/Urb2/Urb3/Urb4/Urb5/Urb6' which stored in target (requisition) BoqHeader's structures.
						if (_.includes(UnitRateBreakDownFields, visibleRow.Field)) {
							const boqStructure = this.utilService.getBoqHeaderStructureWithNameUrb(this.compareCache.boqStructures);
							newRow.CompareDescription = visibleRow.UserLabelName ?? this.utilService.getStructureUrbDisplayName(visibleRow.Field, visibleRow.DisplayName, boqStructure);
						}
						if (parentItem && this.utilService.isBoqPositionRow(parentItem.LineTypeFk)) {
							parentItem.Children.push(newRow);
						} else {
							parentItem.Children.unshift(newRow); // put Discount row at first in Level 1-9
						}
						parentItem.HasChildren = true;
					}
					this.setOrRecalculateColumnValuesForCompareFieldRow(parentItem, visibleRow, newRow);
				}

				// add the bidders
				if (CompareFields.bidderComments === visibleRow.Field && parentItem.QuoteItems && parentItem.QuoteItems.length > 0) {
					// get all allTextComplement
					const allTextComplement = this.utilService.getAllTextComplement(parentItem.QuoteItems);
					_.forEach(allTextComplement, (text) => {
						const complCaption = parentItem.Id + '_' + text.ComplCaption;
						let newRowText = _.find(parentItem.Children, {Id: complCaption});
						if (!newRowText) {
							newRowText = this.createCompositeBaseRow(complCaption, undefined, visibleRow.DisplayName, CompareRowTypes.compareField);
							newRowText[Constants.rowType] = visibleRow.Field;
							newRowText.LineName = 'BC: ' + text.ComplCaption;  // add the string 'BC:' to mark the bidder message
							newRowText['ComplCaption'] = text.ComplCaption;
							newRowText['ConditionalFormat'] = visibleRow.ConditionalFormat; // used to format the cell with this custom style.
							newRowText.parentItem = parentItem;
							parentItem.Children.push(newRowText);
							parentItem.HasChildren = true;
							this.setOrRecalculateColumnValuesForCompareFieldRow(parentItem, {Field: CompareFields.bidderComments} as ICompareRowEntity, newRowText);
						}
					});
				}
			}
		});
	}

	private addBoqTotalRank(parentItem: ICompositeBoqEntity, isVerticalCompareRows: boolean) {
		const visibleRow = _.find(this.compareCache.visibleCompareRows, {Field: CompareFields.boqTotalRank});
		if (visibleRow) {
			let currentItem = parentItem;
			if (!isVerticalCompareRows) {
				const id = parentItem.Id + '_' + visibleRow.Field;
				let totalRankItem = _.find(parentItem.Children, {Id: id});
				if (!totalRankItem) {
					totalRankItem = this.createCompositeBaseRow(id, parentItem.RfqHeaderId, visibleRow.DisplayName, CompareRowTypes.compareField);
					totalRankItem[Constants.rowType] = visibleRow.Field;
					totalRankItem.LineName = '';
					totalRankItem.parentItem = parentItem;
					totalRankItem.Children = [];
					totalRankItem.HasChildren = false;
					totalRankItem.ReqHeaderId = parentItem.ReqHeaderId;
					parentItem.Children.unshift(totalRankItem);
				}
				currentItem = totalRankItem;
			}
			const bidderTotalRanks = _.filter(parentItem.finalPriceFields, (item, key) => {
				return this.bidderIdentitySvc.isNotReference(key);
			});
			const totalRankValues = _.sortBy(_.values(bidderTotalRanks));
			_.forEach(parentItem.finalPriceFields, (value, key) => {
				if (this.bidderIdentitySvc.isNotReference(key)) {
					const propName = isVerticalCompareRows ? this.utilService.getCombineCompareField(key, visibleRow.Field) : key;
					const rank = _.indexOf(totalRankValues, value);
					_.set(currentItem, propName, rank + 1);
				}
			});
		}
	}

	public filteredShowInSummaryRowsByRowType(currentItem: ICompositeBoqEntity) {
		const summaryRows = this.dataSvc.compareCache.summaryRows;
		if (this.utilService.isBoqRow(currentItem.LineTypeFk)) {
			let includeRows: string[] = [];
			if (this.utilService.isBoqRootRow(currentItem.LineTypeFk)) {
				includeRows = BoqSummaryRowDefinition.boqRoot;
			} else if (this.utilService.isBoqLevelRow(currentItem.LineTypeFk)) {
				includeRows = BoqSummaryRowDefinition.boqLevel;
			} else {
				includeRows = BoqSummaryRowDefinition.boqPosition;
			}
			return _.filter(summaryRows, (row) => {
				return _.includes(includeRows, row.Field);
			});
		}
		return summaryRows;
	}

	protected override setSpecialRowValuesForLineNameColumn(item: ICompositeBoqEntity, lineTypeFk: number) {
		switch (lineTypeFk) {
			case BoqLineType.root:
				item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareBoqName');
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level1:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level2:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level3:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level4:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level5:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level6:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level7:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level8:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.level9:
				item.LineName = this.getLineName(lineTypeFk);
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				break;
			case BoqLineType.position:
				item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareItem');
				item.BoqLineType = this.getStructureDetail(lineTypeFk);
				if (item['IsQuoteNewItem']) {
					item.LineName = this.utilService.getTranslationText('procurement.pricecomparison.compareNewItem');
				}
				break;
		}
	}

	protected override getDataProcessors(): ICompositeDataProcess<ICompositeBoqEntity>[] {
		return this._dataProcessors;
	}

	protected buildCustomTree(tree: ICompositeBoqEntity[]): ICompositeBoqEntity[] {
		const summaryInfo = this.boqDataSvc.getTypeSummary();
		const boqRanges = this.boqDataSvc.getBoqRanges();
		const hideInsteadOfDeletingRows = this.boqDataSvc.hideInsteadOfDeletingRows();

		this.clearSummaryDataRows(tree);

		this.addSummaryDataRows(tree, this.compareCache.columns, summaryInfo);

		// Item Type options
		this.removeBoQDataRowsByItemTypes(tree, summaryInfo.checkedBoqItemTypes || [], summaryInfo.checkedBoqItemTypes2 || [], hideInsteadOfDeletingRows);

		// BoQ Range options
		this.removeBoQDataRowsByRanges(tree, boqRanges, hideInsteadOfDeletingRows);

		// Summary options
		this.removeSummaryDataRows(tree, summaryInfo.checkedLineTypes || [], this.compareCache.columns, hideInsteadOfDeletingRows);

		// Zero value options
		if (summaryInfo.hideZeroValueLines) {
			this.removeZeroValueRows(tree, this.compareCache.columns, hideInsteadOfDeletingRows);
		}

		return tree;
	}

	protected getTotalField(): string {
		return CompareFields.itemTotal;
	}

	protected sumTotalForRequisitionRow(currentItem: ICompositeBoqEntity, visibleColumn: ICustomCompareColumnEntity): number {
		const targetSum = _.sumBy(_.filter(currentItem.QuoteItems, {QuoteKey: BidderIdentities.targetKey}), CompareFields.finalPrice) || 0;
		let quoteSum = _.sumBy(_.filter(currentItem.QuoteItems, {QuoteKey: visibleColumn.Id}), CompareFields.finalPrice) || 0;

		/**
		 * special case: package has boq (base boq), but requisition/quotations only has items (no boq);
		 * when calculate grand total (base boq total > 0, target total = 0, quote total = 0), this is not correct.
		 * we should set base boq total = 0 when target total = 0
		 */
		if (this.bidderIdentitySvc.isBase(visibleColumn.Id) && targetSum === 0) {
			quoteSum = 0;
		}
		return quoteSum;
	}

	protected setColumnValuesForItemRow(currentItem: ICompositeBoqEntity): void {
		if (this.utilService.isBoqRow(currentItem.LineTypeFk)) {

			const finalPriceFields: IExtendableObject<number> = {};
			currentItem.finalPriceFields = finalPriceFields;
			const finalPriceValues: number[] = [];
			const finalPriceValuesExcludeTarget: number[] = [];

			// set leading field value
			this.setColumnValuesForLeadingFieldRow(currentItem, finalPriceValues, finalPriceValuesExcludeTarget, CompareFields.finalPrice, () => {
				return this.utilService.isBoqLevelRow(currentItem.LineTypeFk) || this.utilService.isBoqRootRow(currentItem.LineTypeFk) ? CompareFields.itemTotal : this.compareCache.leadingRow.Field;
			}, (col: ICustomCompareColumnEntity, value: number) => {
				finalPriceFields[col.Id] = value;
			});

			// set Average column's boq item tree's value.
			currentItem[Constants.averageValueIncludeTarget] = this.utilService.calculateAverageValue(finalPriceValues) || 0;
			currentItem[Constants.averageValueExcludeTarget] = this.utilService.calculateAverageValue(finalPriceValuesExcludeTarget) || 0;

			// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
			this.setColumnValuesForPercentageRow(currentItem, currentItem.leadingFields as IExtendableObject, () => {
				return this.utilService.isBoqLevelRow(currentItem.LineTypeFk) || this.utilService.isBoqRootRow(currentItem.LineTypeFk) ? CompareFields.itemTotal : this.compareCache.leadingRow.Field;
			}, currentItem => {
				return this.utilService.isBoqLevelRow(currentItem.LineTypeFk) || this.utilService.isBoqRootRow(currentItem.LineTypeFk);
			});

			// set Rank value
			this.setColumnValuesForRankRow(currentItem, currentItem.leadingFields as IExtendableObject);

			// set value for children.
			if (currentItem.Children && currentItem.Children.length > 0) {
				currentItem.Children.forEach((item) => {
					this.setColumnValuesForItemRow(item);
					item.parentItem = currentItem;
				});
			}

			// store price origin Value
			this.storePriceOriginalValue(currentItem, (baseItem: ICustomQuoteItemBase) => {
				const quoteItem = baseItem as ICustomBoqItem;
				return {
					QuoteKey: quoteItem.QuoteKey,
					BoqItemId: quoteItem.BoqItemId,
					Price: quoteItem.Price,
					NotSubmitted: quoteItem.NotSubmitted
				};
			});

			// (1) add dynamic compare row (compare fields) for boq item (Position) and set the row values for of bidder columns (quote bizpartners).
			//    Note: if it's a QuoteNewItem, don't add compare field rows for it.
			//    ** @namespace item.IsQuoteNewItem */
			if (this.utilService.isBoqPositionRow(currentItem.LineTypeFk)) {
				const visibleRowsForPosition = _.filter(this.compareCache.visibleCompareRows, (item) => {
					return !this.utilService.isExcludedCompareRowOnBoqPosition(item.Field);
				});
				if (!_.isEmpty(visibleRowsForPosition)) {
					this.setColumnValuesForCompareFieldRow(currentItem, visibleRowsForPosition, this.boqDataSvc.isVerticalCompareRows());
				}
				// Leading Field should not affect the MaxT,MinT,AvgT,Max,Min,Avg
				// set Max/ Min/ Average value
				currentItem[Constants.maxValueIncludeTarget] = _.max(finalPriceValues) || 0;
				currentItem[Constants.minValueIncludeTarget] = _.min(finalPriceValues) || 0;
				currentItem[Constants.maxValueExcludeTarget] = _.max(finalPriceValuesExcludeTarget) || 0;
				currentItem[Constants.minValueExcludeTarget] = _.min(finalPriceValuesExcludeTarget) || 0;
			}

			// (2)add dynamic compare field row 'Discount' (Discount ABS.IT) only for boq item (Root and Leve1-9)
			if (!this.utilService.isBoqPositionRow(currentItem.LineTypeFk)) {
				const percentageLevels = this.boqDataSvc.getTypeSummary().percentageLevels;
				if (this.utilService.isBoqRootRow(currentItem.LineTypeFk)) {
					const visibleRowsForRoot = _.filter(this.compareCache.visibleCompareRows, (item) => {
						return this.utilService.isIncludedCompareRowOnBoqRoot(item.Field);
					});
					if (!_.isEmpty(visibleRowsForRoot)) {// jshint ignore: line
						_.remove(visibleRowsForRoot, function (item) {
							return item.Field === CompareFields.boqTotalRank;
						});
						// according to compare setting of 'percentageLevels' whether display percentage and absoluteDifference or not.
						if (!percentageLevels) {
							_.remove(visibleRowsForRoot, function (item) {
								return _.includes([CompareFields.percentage, CompareFields.absoluteDifference], item.Field);
							});
						}
						this.setColumnValuesForCompareFieldRow(currentItem, visibleRowsForRoot, this.boqDataSvc.isVerticalCompareRows());
					}

					// add Boq Total rank for Root
					this.addBoqTotalRank(currentItem, this.boqDataSvc.isVerticalCompareRows());
				}

				if (this.utilService.isBoqLevelRow(currentItem.LineTypeFk)) {
					const visibleRowsForLevel = _.filter(this.compareCache.visibleCompareRows, (item) => {
						return this.utilService.isIncludedCompareRowOnBoqLevel(item.Field);
					});
					if (!_.isEmpty(visibleRowsForLevel)) {// jshint ignore: line
						// according to compare setting of 'percentageLevels' whether display percentage and absoluteDifference or not.
						if (!percentageLevels) {
							_.remove(visibleRowsForLevel, (item) => {
								return _.includes([CompareFields.percentage, CompareFields.absoluteDifference], item.Field);
							});
						}
						this.setColumnValuesForCompareFieldRow(currentItem, visibleRowsForLevel, this.boqDataSvc.isVerticalCompareRows());
					}
				}

				if (currentItem.Children && currentItem.Children.length) {
					const children = _.filter(currentItem.Children, (child) => {
						return this.utilService.isBoqPositionRow(child.LineTypeFk) || this.utilService.isBoqLevelRow(child.LineTypeFk);
					});
					this.utilService.combinedMaxMin(currentItem, children as IExtendableObject[]);
				}
			}

			// Compare Description
			currentItem.CompareDescription = _.map(this.filteredShowInSummaryRowsByRowType(currentItem), function (summaryRow) {
				return summaryRow.DisplayName;
			}).join(Constants.tagForValueSeparator);

			// Bold
			if (this.utilService.isBoqRootRow(currentItem.LineTypeFk)) {
				currentItem.cssClass = 'font-bold';
			}
		}
	}
}