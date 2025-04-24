/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { PlatformDateService, PlatformHttpService, PlatformTranslateService, Translatable, TranslationParamsSource } from '@libs/platform/common';
import { ColumnDef, FieldType, ILookupOptions, StandardDialogButtonId } from '@libs/ui/common';
import { SimpleUploadService } from '@libs/basics/common';
import { BasicsSharedCharacteristicTypeHelperService, BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule as roundingModule, BasicsSharedUomLookupService, ITaxCodeEntity } from '@libs/basics/shared';
import { IMdcTaxCodeMatrixEntity, IPrcGeneralsTypeEntity } from '@libs/basics/interfaces';
import { IQuoteHeaderLookUpEntity, ProcurementShareQuoteLookupService } from '@libs/procurement/shared';
import { IBoqTextComplementEntity } from '@libs/boq/interfaces';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { BoqLineType } from '../model/constants/boq/boq-line-type';
import { CompareFields } from '../model/constants/compare-fields';
import { CompareRowTypes } from '../model/constants/compare-row-types';
import { ProcurementPricecomparisonBidderIdentityService } from './bidder-identity.service';
import { ICompositeBoqEntity } from '../model/entities/boq/composite-boq-entity.interface';
import { CompareGridColumn } from '../model/entities/compare-grid-column.interface';
import { ICompositeBaseEntity } from '../model/entities/composite-base-entity.interface';
import { Constants } from '../model/constants/constants';
import { ICompareRowEntity } from '../model/entities/compare-row-entity.interface';
import { CompareTypes } from '../model/enums/compare.types.enum';
import { BoqMainItemTypes } from '../model/enums/boq/boq-main-item-types.enum';
import { BoqMainItemTypes2 } from '../model/enums/boq/boq-main-item-types2.enum';
import { IQuoteHeaderEntity } from '@libs/procurement/quote';
import { ICustomItemType } from '../model/entities/boq/custom-item-type.interface';
import { ICompositeDataFields, ICompositeDataProcess } from '../model/entities/composite-data-process.interface';
import { IOriginalField } from '../model/entities/original-field.interface';
import { ICustomBoqStructure } from '../model/entities/boq/custom-boq-structure.interface';
import { BidderIdentities } from '../model/constants/bidder-identities';
import { ICustomBoqStructureDetail } from '../model/entities/boq/custom-boq-structure-detail.interface';
import { ICustomQuoteItemBase } from '../model/entities/custom-quote-item-base.interface';
import { ICustomCompareColumnEntity } from '../model/entities/custom-compare-column-entity.interface';
import { ComparePrintConstants } from '../model/constants/print/compare-print-constats';
import { ICompositeItemEntity } from '../model/entities/item/composite-item-entity.interface';
import { IQuoteLookupViewEntity } from '../model/entities/quote-lookup-view-entity.interface';
import { IExtendableObject } from '../model/entities/extendable-object.interface';
import { ProcurementPricecomparisonCompareExchangeRateService } from './compare-exchange-rate.service';
import { IconCssClass } from '../model/constants/icon-css-class';
import { HighlightFields } from '../model/constants/highlight-fields';
import { ValuableLeadingFields } from '../model/constants/valuable-leading-fields';
import { UnitRateBreakDownFields } from '../model/constants/boq/unit-rate-break-down-fields';
import { ICustomBoqItem } from '../model/entities/boq/custom-boq-item.interface';
import { BoqEditableCompareFields } from '../model/constants/boq/boq-editable-compare-fields';
import { ItemEditableCompareFields } from '../model/constants/item/item-editable-compare-fields';
import { ItemCompareFields } from '../model/constants/item/item-compare-fields';
import { ICompareDataSaveResult } from '../model/entities/compare-data-save-result.interface';
import { ICompareDataManager } from '../model/entities/compare-data-manager.interface';
import { ProcurementPricecomparisonCompareCommonDialogService } from './compare-common-dialog.service';
import { CompareDataSaveTypes } from '../model/enums/compare-data-save-types.enum';
import { ICompareExportLookupMap } from '../model/entities/export/compare-export-lookup-map.interface';
import { ICompareExportUserDataBase } from '../model/entities/export/compare-export-user-data.interface';
import { ICompareExportCellFormulaRule } from '../model/entities/export/compare-export-formula-rule.interface';
import { ICompareExportDataRowDic } from '../model/entities/export/compare-export-data-row-dic.interface';
import { ICustomCharacteristicData } from '../model/entities/custom-characteristic-data.interface';
import { CompareRowLineTypes } from '../model/constants/compare-row-line-types';
import { ICustomPrcItem } from '../model/entities/item/custom-prc-item.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonUtilService {
	private readonly http = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dateService = inject(PlatformDateService);
	private readonly simpleUploadSvc = inject(SimpleUploadService);
	private readonly commonDlgSvc = inject(ProcurementPricecomparisonCompareCommonDialogService);
	private readonly exchangeRateSvc = inject(ProcurementPricecomparisonCompareExchangeRateService);
	private readonly bidderIdentityService = inject(ProcurementPricecomparisonBidderIdentityService);
	private readonly bpLookupSvc = inject(BusinessPartnerLookupService);
	private readonly quoteLookupSvc = inject(ProcurementShareQuoteLookupService);
	private readonly characteristicTypeSvc = inject(BasicsSharedCharacteristicTypeHelperService);
	private readonly materialRoundingSvc = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);

	public createLazy<T>(cacheFn: (v: T) => void, factory: () => T, v?: T,) {
		if (!v) {
			v = factory();
			cacheFn(v);
		}
		return v;
	}

	public isNullOrUndefined(value: unknown) {
		return value === null || value === undefined;
	}

	public isExcludedCompareRowOnBoqPosition(row: string) {
		const excludeRows = [
			CompareFields.discount,
			CompareFields.discountPercentIT,
			CompareFields.lumpsumPrice,
			CompareFields.isLumpsum,
			CompareFields.boqTotalRank,
			CompareFields.generals,
			CompareFields.characteristics
		];
		return _.includes(excludeRows, row);
	}

	public isIncludedCompareRowOnBoqLevel(row: string) {
		const includeRows = [
			CompareFields.discount,
			CompareFields.discountPercentIT,
			CompareFields.lumpsumPrice,
			CompareFields.isLumpsum,
			CompareFields.itemTotal,
			CompareFields.itemTotalOc,
			CompareFields.externalCode,
			CompareFields.percentage,
			CompareFields.absoluteDifference,
			CompareFields.prcItemEvaluationFk,
			CompareFields.finalPrice,
			CompareFields.finalPriceOc
		];
		return _.includes(includeRows, row);
	}

	public isIncludedCompareRowOnBoqRoot(row: string) {
		const includeRows = [
			CompareFields.discount,
			CompareFields.discountPercentIT,
			CompareFields.lumpsumPrice,
			CompareFields.isLumpsum,
			CompareFields.itemTotal,
			CompareFields.itemTotalOc,
			CompareFields.boqTotalRank,
			CompareFields.externalCode,
			CompareFields.percentage,
			CompareFields.absoluteDifference,
			CompareFields.prcItemEvaluationFk,
			CompareFields.finalPrice,
			CompareFields.finalPriceOc
		];
		return _.includes(includeRows, row);
	}

	public isExcludedCompareRowInVerticalMode(row: string) {
		const excludeRows = [
			CompareFields.bidderComments,
			CompareFields.urBreakdown1,
			CompareFields.urBreakdown2,
			CompareFields.urBreakdown3,
			CompareFields.urBreakdown4,
			CompareFields.urBreakdown5,
			CompareFields.urBreakdown6,
			CompareFields.generals,
			CompareFields.characteristics
		];
		return _.includes(excludeRows, row);
	}

	public isBoqCompareCellEditable(row: ICompositeBoqEntity, column: CompareGridColumn<ICompositeBoqEntity>) {
		const quoteKey = column.isVerticalCompareRows ? column.quoteKey : column.field as string;
		const compareField = this.getBoqCompareField(row, column);
		const isNotReference = this.bidderIdentityService.isNotReference(quoteKey as string);
		const hasBidder = row[column.field + '_$hasBidder'] === true;
		const isEditableFields = _.includes(BoqEditableCompareFields, compareField);
		const isCompareField = row.LineTypeFk === CompareRowTypes.compareField;
		return (isCompareField || this.isBoqRow(row.LineTypeFk)) && isEditableFields && column.isDynamic && isNotReference && hasBidder;
	}

	public isPrcCompareCellEditable(row: ICompositeItemEntity, column: CompareGridColumn<ICompositeItemEntity>) {
		const quoteKey = column.isVerticalCompareRows ? column.quoteKey : column.field;
		const compareField = this.getPrcCompareField(row, column);
		const isEditableFields = _.includes(ItemEditableCompareFields, compareField);
		const isNotReference = this.bidderIdentityService.isNotReference(quoteKey as string);
		const hasBidder = row[column.field + '_$hasBidder'] === true;
		const isCompareField = row.LineTypeFk === CompareRowTypes.compareField;
		const isPrcItemRow = row.LineTypeFk === CompareRowTypes.prcItem;
		const isPrcEvaluationRow = compareField === ItemCompareFields.prcItemEvaluationFk;
		return (isCompareField || isPrcItemRow) && isEditableFields && column.isDynamic && isNotReference && hasBidder && (!column.isIdealBidder || isPrcEvaluationRow);
	}

	public getBoqCompareField(row: ICompositeBoqEntity, column?: CompareGridColumn<ICompositeBoqEntity>) {
		return column && column.isVerticalCompareRows && this.isBoqRow(row.LineTypeFk) ? column.originalField as string : row.rowType as string;
	}

	public getPrcCompareField(row: ICompositeItemEntity, column?: CompareGridColumn<ICompositeItemEntity>) {
		return column && column.isVerticalCompareRows && row.LineTypeFk === CompareRowTypes.prcItem ? column.originalField as string : row.rowType as string;
	}

	public getCombineCompareField(quoteKey: string, originalField: string) {
		return quoteKey + '_' + originalField;
	}

	public extractCompareInfoFromFieldName(fieldName?: string) {
		// todo: It should be taken from data structure not the field name.
		const name = fieldName ?? '';
		const values = name.split('_');
		const result = {quoteKey: name, field: name, isVerticalCompareRows: false};
		if (values.length === 5) {
			result.field = values.pop() as string;
			result.quoteKey = values.join('_');
			result.isVerticalCompareRows = result.quoteKey !== result.field;
		}
		return result;
	}

	public tryGetParentItem<T extends ICompositeBaseEntity<T>>(entity: T, isSelf?: boolean) {
		return isSelf ? entity : entity.parentItem;
	}

	public textPadding(text: string, p: string, l: number, s?: 'l' | 'r' | 'both') {
		for (let i = 0; i < l; i++) {
			switch (s) {
				case 'l':
					text = p + text;
					break;
				case 'r':
					text = text + p;
					break;
				default:
					text = p + text + p;
					break;
			}
		}
		return text;
	}

	public isDataPropReadonly(item: unknown, field: string) {
		/* TODO-DRIZZLE: To be migrated.
		return item.__rt$data && !!_.find(item.__rt$data.readonly, {field: field, readonly: true});*/
	}

	public addGeneralTotalRow2RequisitionRow<T extends ICompositeBaseEntity<T>>(parentItem: T, compareRowsCache: ICompareRowEntity[], generalTypesCache: IPrcGeneralsTypeEntity[]) {
		const generalsConfig = compareRowsCache.find(r => r.Field === Constants.generals);
		if (parentItem.LineTypeFk === CompareRowTypes.requisition && generalsConfig && generalsConfig.Visible) {
			const totalRow = {
				Id: 'general_total_row_' + parentItem.ReqHeaderId,
				RfqHeaderId: parentItem.RfqHeaderId,
				ReqHeaderId: parentItem.ReqHeaderId,
				LineTypeFk: CompareRowTypes.generalTotal,
				parentItem: parentItem,
				HasChildren: false,
				Children: [],
				CompareDescription: '' // show nothing
			} as unknown as T;

			// add general item compare rows if the requisition has general items, else do not add it.
			const generalItems = parentItem.QuoteGeneralItems.filter(r => r.QuoteKey === BidderIdentities.targetKey);
			if (_.isEmpty(generalItems)) {
				return;
			}

			_.forEach(generalItems, function (item) {
				const itemRow = {
					Id: 'general_item_row_' + item.Id,
					GeneralTypeId: item.GeneralTypeId, // row type identifier (important: used to filter the exact bidder's quote value)
					LineTypeFk: CompareRowTypes.generalItem,
					parentItem: totalRow,
					RfqHeaderId: parentItem.RfqHeaderId,
					ReqHeaderId: parentItem.ReqHeaderId,
					HasChildren: false,
					Children: [],
					CompareDescription: generalTypesCache.find(r => r.Id === item.GeneralTypeId)?.DescriptionInfo?.Translated ?? ''
				} as unknown as T;

				totalRow.Children.push(itemRow);
				totalRow.HasChildren = true;
			});

			parentItem.Children.unshift(totalRow); // insert at the first
			parentItem.HasChildren = true;
		}
	}

	public extraMergeCompareConfigData(configRow: ICompareRowEntity) {
		return {
			DefaultDescription: configRow.DefaultDescription,
			FieldName: configRow.FieldName,
			UserLabelName: configRow.UserLabelName,
			DisplayName: configRow.DisplayName
		};
	}

	public mergeCompareConfig(mergeOptions: Array<{ target: ICompareRowEntity[], source: ICompareRowEntity[] }>) {
		_.each(mergeOptions, (option) => {
			_.each(option.target, (row) => {
				const configRow = _.find(option.source, {Field: row.Field});
				if (configRow) {
					_.extend(row, this.extraMergeCompareConfigData(configRow));
				}
			});
		});
	}

	public bidderCompatible(bidders: ICustomCompareColumnEntity[]) {
		const columnNames: string[] = [];
		bidders.forEach((column) => {
			const names = _.filter(columnNames, (name) => {
				return name === column.Description;
			});
			columnNames.push(column.Description);
			if (names.length > 0) {
				column.Description = this.textPadding(column.Description, ' ', names.length);
			}
		});
	}

	public checkMaxBidderWidth(item: ICustomCompareColumnEntity, allBidders: ICustomCompareColumnEntity[], allBidderWidth: number) {
		let currencyTotalSize = 0;
		allBidders.forEach((bidder) => {
			let bidderWidth = bidder.Width ?? 0;
			if (!bidder.Width && bidder.Visible) {
				bidder.Width = bidderWidth = 0;
			}
			if (bidder.Visible === true && bidder.GroupSequence === item.GroupSequence) {
				if (!bidder.CompareColumnFk) {
					const tempTotalSize = currencyTotalSize + bidderWidth;
					if (tempTotalSize > allBidderWidth) {
						// leave width
						bidder.Width = bidderWidth = Math.round((allBidderWidth - currencyTotalSize) * 100) / 100;
					}
					currencyTotalSize += bidderWidth;
				} else {
					const parent = _.find(allBidders, function (item) {
						return bidder.CompareColumnFk === item.Id;
					}) as ICustomCompareColumnEntity;
					bidder.Width = parent.Width;
				}
			}
		});
	}

	public addBidderMessage(maxBidderNum: number, bidderWidth: number, allBidders: ICustomCompareColumnEntity[]) {
		let index = 1;
		allBidders.forEach((item) => {
			if (item.Visible && !item.CompareColumnFk) {
				item.GroupSequence = Math.ceil(index / maxBidderNum);
				item.Width = bidderWidth;
				index++;
			} else if (item.Visible && !!item.CompareColumnFk) {
				const parent = _.find(allBidders, (bidder) => {
					return bidder.Id === item.CompareColumnFk;
				}) as ICustomCompareColumnEntity;
				item.GroupSequence = parent.GroupSequence;
				item.Width = parent.Width;
			} else {
				item.GroupSequence = null;
				item.Width = null;
			}
		});
	}

	public updateBidderMessage(maxBidderNum: number, bidderWidth: number, allBidders: ICustomCompareColumnEntity[], item: ICustomCompareColumnEntity) {
		if (item && parseInt(item.CompareColumnFk) > 0) {
			if (item.Visible) {
				const parent = allBidders.find(e => e.Id === item.CompareColumnFk) as ICustomCompareColumnEntity;
				item.GroupSequence = parent.GroupSequence;
				item.Width = parent.Width;
			} else {
				item.GroupSequence = null;
				item.Width = null;
			}
		} else {
			this.addBidderMessage(maxBidderNum, bidderWidth, allBidders);
		}
	}

	public async getCompareColumns(compareType: CompareTypes, quotes: ICustomCompareColumnEntity[]) {
		const quoteIds = quotes.map(q => q.QtnHeaderFk);
		const response = await this.http.get<{
			BaseColumn: ICustomCompareColumnEntity[],
			Quotes: IQuoteLookupViewEntity[]
		}>('procurement/pricecomparison/print/getcomparecolumns?comparetype=' + compareType + '&headers=' + quoteIds.join('_'));

		const quoteColumns = quotes.concat(response.BaseColumn.filter((column) => {
			return !quotes.some(q => q.Id === column.Id);
		}));
		return this.flatTree(this.restructureQuoteCompareColumns(quoteColumns, response.Quotes));
	}

	public setWidthReadonly(item: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let readonlyField = [{field: 'Width', readonly: (!item.Visible || !!item.CompareColumnFk)}];
		platformRuntimeDataService.readonly(item, readonlyField);*/
	}

	public getAllBidders(bidders: ICustomCompareColumnEntity[], baseBidders?: ICustomCompareColumnEntity[]) {
		const cloneBidders = _.clone(bidders) || [];
		if (baseBidders) {
			_.remove(cloneBidders, (bidder) => {
				return this.bidderIdentityService.isReference(bidder.Id);
			});
		}
		return (baseBidders || []).concat(cloneBidders);
	}

	public getVisibleBidderLength(bidders: ICustomCompareColumnEntity[]) {
		const visibleBidders = bidders.filter(b => b.Visible === true);
		return visibleBidders.length;
	}

	public getBaseBidders(bidders: ICustomCompareColumnEntity[]) {
		return _.filter(bidders, (item) => {
			return this.bidderIdentityService.isReference(item.Id);
		});
	}

	public reorderCompareColumns<T extends ICompositeBaseEntity<T>>(compareQuoteRows: ICompareRowEntity[], compareColumns: ICustomCompareColumnEntity[], items: T[]) {
		if (_.isEmpty(items)) {
			return compareColumns;
		}
		const grandRankField = _.find(compareQuoteRows, {Field: CompareFields.grandTotalRank});
		if (grandRankField && grandRankField.IsSorting) {
			const grandRow = _.find(items, (item) => {
				return item.LineTypeFk === CompareRowTypes.grandTotal;
			}) as T;
			const rankRow = _.find(grandRow.Children, (item) => {
				return item.LineTypeFk === CompareRowTypes.grandTotalRank;
			});
			const rankValues = _.map(compareColumns, (column) => {
				return {key: column.Id, rank: _.get(rankRow, column.Id) as number};
			});

			compareColumns = _.sortBy(compareColumns, (item) => {
				const result = _.find(rankValues, {key: item.Id}) as { rank: number };
				return result.rank;
			});
		}
		return compareColumns;
	}

	public setRowValuesForStructureColumn<T extends ICompositeBaseEntity<T>>(itemList: T[], parentItem?: T) {
		itemList.forEach((item) => {
			let image = 'ico-folder-empty';
			let level = 0;

			if (parentItem && parentItem.nodeInfo) {
				level = parentItem.nodeInfo.level + 1;
			}
			switch (item.LineTypeFk) {
				case CompareRowTypes.grandTotal:
				case CompareRowTypes.turnover:
				case CompareRowTypes.evaluatedTotal:
				case CompareRowTypes.offeredTotal:
					image = IconCssClass.row.grandTotal;
					break;
				case CompareRowTypes.rfq:
					image = IconCssClass.row.rfqTotal;
					break;
				case CompareRowTypes.quoteDate:
					image = IconCssClass.row.quoteDate;
					break;
				case CompareRowTypes.quoteVersion:
					image = IconCssClass.row.quoteVersion;
					break;
				case CompareRowTypes.quoteStatus:
					image = IconCssClass.row.quoteStatus;
					break;
				case CompareRowTypes.quoteCode:
					image = IconCssClass.row.code;
					break;
				case CompareRowTypes.quoteDescription:
					image = IconCssClass.row.description;
					break;
				case CompareRowTypes.quoteExchangeRate:
					image = IconCssClass.row.exchangeRate;
					break;
				case CompareRowTypes.quoteCurrency:
					image = IconCssClass.row.currency;
					break;
				case CompareRowTypes.quotePaymentTermPADesc:
				case CompareRowTypes.quotePaymentTermPA:
					image = IconCssClass.row.paymentTermPA;
					break;
				case CompareRowTypes.quotePaymentTermFIDesc:
				case CompareRowTypes.quotePaymentTermFI:
					image = IconCssClass.row.paymentTermFI;
					break;
				case CompareRowTypes.evaluationRank:
					image = IconCssClass.row.evaluationRank;
					break;
				case CompareRowTypes.evaluationResult:
					image = IconCssClass.row.evaluationResult;
					break;
				case CompareRowTypes.billingSchemaChildren:
					image = IconCssClass.row.description;
					break;
				case CompareRowTypes.characteristicTotal:
					image = IconCssClass.row.characteristicTotal;
					break;
				case CompareRowTypes.characteristicGroup:
					image = IconCssClass.row.characteristicGroup; // according to the rfq's characteristic group
					break;
				case CompareRowTypes.characteristic:
					image = IconCssClass.row.characteristicItem; // according to the rfq's characteristic item
					break;
				case CompareRowTypes.requisition:
					image = IconCssClass.row.requisitionTotal; // calculated by it's boq root item rows
					break;
				case CompareRowTypes.generalTotal:
					image = IconCssClass.row.generalTotal;
					break;
				case CompareRowTypes.generalItem:
					image = IconCssClass.row.generalItem; // according to the requisition's generals item
					break;
				case CompareRowTypes.prcItem:
				case CompareRowTypes.quoteNewItem:
					image = IconCssClass.row.procurementItem; // item (position -> only this item has compare field row)
					break;
				case BoqLineType.root:
					image = IconCssClass.row.boqRoot; // boq item (root)
					break;
				case  BoqLineType.level1: // boq item (division, has possible 9 level)
				case  BoqLineType.level2:
				case  BoqLineType.level3:
				case  BoqLineType.level4:
				case  BoqLineType.level5:
				case  BoqLineType.level6:
				case  BoqLineType.level7:
				case  BoqLineType.level8:
				case  BoqLineType.level9:
					image = IconCssClass.row.boqLevel;
					break;
				case  BoqLineType.position:
					image = IconCssClass.row.boqItem;
					break;
				case CompareRowTypes.compareField:
					image = IconCssClass.row.compareField;
					break;
				case  CompareRowTypes.grandTotalRank:
					image = IconCssClass.row.evaluationRank;
					break;
				case CompareRowTypes.quoteUserDefined:
					image = IconCssClass.row.description;
					break;
				case CompareRowTypes.quoteRemark:
					image = IconCssClass.row.description;
					break;
				case CompareRowTypes.overallDiscount:
				case CompareRowTypes.overallDiscountOc:
				case CompareRowTypes.overallDiscountPercent:
					image = IconCssClass.row.overallDiscount;
					break;
				case CompareRowTypes.quoteTotal:
					image = IconCssClass.row.quoteTotal;
					break;
				case CompareRowTypes.discountBasis:
				case CompareRowTypes.discountBasisOc:
				case CompareRowTypes.percentDiscount:
				case CompareRowTypes.discountAmount:
				case CompareRowTypes.discountAmountOc:
					image = IconCssClass.row.description;
					break;
				default:
					break;
			}

			item.HasChildren = !_.isEmpty(item.Children);
			item.nodeInfo = {
				children: item.HasChildren,
				collapsed: true,
				level: level,
				lastElement: !item.HasChildren
			};

			_.set(item, 'image', image);

			if (item.Children && item.Children.length) {
				this.setRowValuesForStructureColumn(item.Children, item);
			}
		});
	}

	public setColumnValuesForGrandTotalRow<T extends ICompositeBaseEntity<T>>(compareColumns: ICustomCompareColumnEntity[], grandTotalRow: T, rootRows: T[]) {
		const totals: IExtendableObject<string | number> = {};
		const ranks: IExtendableObject<number> = {};
		const percentages: IExtendableObject<number> = {};
		let totalValues: number[] = [];
		let totalValuesExcludeTarget: number[] = [];

		grandTotalRow.totals = totals;
		grandTotalRow.ranks = ranks;
		grandTotalRow.percentages = percentages;
		grandTotalRow.totalValues = totalValues;
		grandTotalRow.totalValuesExcludeTarget = totalValuesExcludeTarget;

		_.each(compareColumns, (visibleColumn) => {
			const rfqRows = _.filter(rootRows, function (item) {
				return item.LineTypeFk === CompareRowTypes.rfq;
			});
			const sum = _.sumBy(rfqRows, (item) => {
				return item.totals ? (item.totals[visibleColumn.Id] === Constants.tagForNoQuote ? 0 : item.totals[visibleColumn.Id]) as number : 0;
			});

			totals[visibleColumn.Id] = sum;
			// exclude ideal bidders.
			if (!visibleColumn.IsIdealBidder) {
				this.concludeTargetValue(visibleColumn.Id, totalValues, totalValuesExcludeTarget, sum, compareColumns);
			}
		});

		// Grant total rank
		if (grandTotalRow.Children && grandTotalRow.Children.length) {
			const rankRow = grandTotalRow.Children.find((item) => {
				return item.LineTypeFk === CompareRowTypes.grandTotalRank;
			});
			let rankValues: Array<{
				key: string,
				value: string | number
			}> = [];
			let referRankValues: Array<{
				key: string,
				value: string | number
			}> = [];
			let quoteRankValues: Array<{
				key: string,
				value: string | number
			}> = [];
			if (rankRow) {
				_.each(compareColumns, (visibleColumn) => {
					rankValues.push({key: visibleColumn.Id, value: totals[visibleColumn.Id]});
				});
				rankValues = _.sortBy(rankValues, 'value');
				referRankValues = _.filter(rankValues, (rank) => {
					return this.bidderIdentityService.isReference(rank.key);
				});
				quoteRankValues = _.filter(rankValues, (rank) => {
					return this.bidderIdentityService.isNotReference(rank.key);
				});
				_.each(referRankValues, (rank, i) => {
					_.set(rankRow, rank.key, 0 - i);
				});
				_.each(quoteRankValues, (rank, i) => {
					_.set(rankRow, rank.key, i + 1);
				});
			}
		}

		grandTotalRow.totalValues = totalValues = _.sortBy(totalValues); // sort by ascending for calculate rank.
		grandTotalRow.totalValuesExcludeTarget = totalValuesExcludeTarget = _.sortBy(totalValuesExcludeTarget);

		// set Max/ Min/ Average value
		_.set(grandTotalRow, Constants.maxValueIncludeTarget, 0);
		_.set(grandTotalRow, Constants.minValueIncludeTarget, 0);
		_.set(grandTotalRow, Constants.averageValueIncludeTarget, this.calculateAverageValue(totalValues) || 0);
		_.set(grandTotalRow, Constants.maxValueExcludeTarget, 0);
		_.set(grandTotalRow, Constants.minValueExcludeTarget, 0);
		_.set(grandTotalRow, Constants.averageValueExcludeTarget, this.calculateAverageValue(totalValuesExcludeTarget) || 0);

		const minValueField = _.min(totalValuesExcludeTarget) || 0;
		// set Percentage/ Rank value (currently they don't needed, just only for using in the feature).
		_.each(compareColumns, (visibleColumn) => {
			if (minValueField === 0) {
				percentages[visibleColumn.Id] = 0;
			} else {
				percentages[visibleColumn.Id] = (totals[visibleColumn.Id] as number) / minValueField * 100;
			}
		});
		_.each(compareColumns, (visibleColumn) => {
			const rank = _.indexOf(totalValuesExcludeTarget, totals[visibleColumn.Id]);
			ranks[visibleColumn.Id] = rank + 1;
		});

		// set Percentage/ Rank value (currently they don't needed, just only for using in the feature).
		// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
		_.forEach(compareColumns, (visibleColumn) => {
			if (this.bidderIdentityService.isNotReference(visibleColumn.Id)) {
				if (minValueField === 0) {
					percentages[visibleColumn.Id] = 0;
				} else {
					percentages[visibleColumn.Id] = (totals[visibleColumn.Id] as number) / minValueField * 100;
				}
			}
		});

		// set Rank value
		_.forEach(compareColumns, (visibleColumn) => {
			if (this.bidderIdentityService.isNotReference(visibleColumn.Id)) {
				const rank = _.indexOf(totalValuesExcludeTarget, totals[visibleColumn.Id]);
				ranks[visibleColumn.Id] = rank + 1;
			}
		});

		// set Max/ Min/ Average value
		const children = _.filter(rootRows, function (item) {
			return item.LineTypeFk === CompareRowTypes.rfq;
		});
		this.combinedMaxMin(grandTotalRow, children);
	}

	public restructureQuoteCompareColumns(mainEntities: ICustomCompareColumnEntity[], rfqQuotes: Array<{ Id: number; BusinessPartnerFk: number }>, enableBoqTarget?: boolean, baseColumns?: ICustomCompareColumnEntity[]) {
		const basicQuotes: IQuoteHeaderLookUpEntity[] = [];
		// set rows 'BaseBoq/Target' readonly and  set the BusinessPartnerFk data
		_.forEach(mainEntities, (item) => {
			if (this.bidderIdentityService.isReference(item.Id)) {
				if (baseColumns) {
					if (baseColumns.length === 0) {
						item.Visible = true;
					}
					if (baseColumns.length > 0) {
						const baseColumn = baseColumns.find(c => c.QtnHeaderFk === item.QtnHeaderFk);
						if (baseColumn) {
							item.Visible = baseColumn.Visible;
							item.IsCountInTarget = baseColumn.IsCountInTarget;
							item.DescriptionInfo.Translated = baseColumn.DescriptionInfo?.Translated;
							item.ApplyReqChangesToQuote = baseColumn.ApplyReqChangesToQuote;
						}
					}
				}

				if (!item.DescriptionInfo.Translated) {
					item.DescriptionInfo.Translated = this.translateTargetOrBaseBoqName(item.Id);
				}
				basicQuotes.push({
					Id: item.QtnHeaderFk,
					Description: this.translateTargetOrBaseBoqName(item.Id),
				} as IQuoteHeaderLookUpEntity);
			}

			// set the BusinessPartnerFk data
			item.BusinessPartnerFk = -1;
			const quote = _.find(rfqQuotes, (quote) => {
				return quote.Id === item.QtnHeaderFk;
			});
			if (quote) {
				item.BusinessPartnerFk = quote.BusinessPartnerFk;
			}
		});

		this.quoteLookupSvc.cache.setItems(basicQuotes);

		const mainData = _.cloneDeep(mainEntities);
		const baseQuotes: ICustomCompareColumnEntity[] = [];
		const changeQuotes: ICustomCompareColumnEntity[] = [];

		_.forEach(mainData, function (item) {
			if (!item.CompareColumnFk) {
				baseQuotes.push(item);
			} else {
				changeQuotes.push(item);
			}
		});

		_.forEach(baseQuotes, (baseRfq) => {
			baseRfq.Children = _.filter(changeQuotes, (rfq) => {
				return rfq.CompareColumnFk === baseRfq.Id && rfq.BusinessPartnerFk === baseRfq.BusinessPartnerFk;
			});
		});

		// if have deviation, fire a message
		// TODO-DRIZZLE: To be checked.
		// commonService.highlightColumnChangedFire(baseQuotes);

		return baseQuotes;
	}

	public setQuoteCompareFieldsReadOnly(readData: unknown, gridId: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		_.forEach(readData, function (item) {
			let readonlyFields = [];
			if (item.Field !== CompareFields.grandTotalRank) {
				readonlyFields.push({field: 'IsSorting', readonly: true});
			} else {
				readonlyFields.push({
					field: 'IsSorting',
					readonly: this.isDataPropReadonly(item, 'Visible') || !item.Visible
				});
			}
			platformRuntimeDataService.readonly(item, readonlyFields);
		});
		if (gridId) {
			platformGridAPI.grids.invalidate(gridId);
		}*/
	}

	public getReqCount(reqCounts: Array<{ QtnId: number, ReqCount: number }>, quoteId: number) {
		const reqCountItem = reqCounts.find(e => e.QtnId === quoteId);
		return reqCountItem ? reqCountItem.ReqCount : null;
	}

	public getSubTotal(totals: Array<{ QtnId: number, subTotal: number }>, quoteId: number) {
		const subTotalItem = totals.find(e => e.QtnId === quoteId);
		return subTotalItem ? subTotalItem.subTotal : null;
	}

	public getGrandTotal(quotes: IQuoteHeaderLookUpEntity[], totals: Array<{ QtnId: number, subTotal: number }>, businessPartnerId: number, version: number) {
		const kinds = quotes.filter((item) => {
			return item.BusinessPartnerFk === businessPartnerId && item.QuoteVersion === version;
		});
		const subItems = totals.filter((total) => {
			return kinds.find(e => e.Id === total.QtnId);
		});
		return _.sumBy(subItems, 'subTotal');
	}

	public getRepairNumeric(number?: number, defaultValue?: number) {
		if (number === Infinity || number === -Infinity || _.isNaN(number)) {
			return _.isNumber(defaultValue) ? defaultValue : 0;
		}
		return number as number;
	}

	public concludeTargetValue(bidderColumnId: string, includedValues: number[], excludedValues: number[], value: number, bidderColumns: ICustomCompareColumnEntity[], isCountInTargetFn?: ((bidders: ICustomCompareColumnEntity[], bidderId: string) => boolean) | boolean) {
		const targetFn = _.isFunction(isCountInTargetFn) ? isCountInTargetFn : (bidders: ICustomCompareColumnEntity[], bidderId: string) => {
			const temp = bidders.find((bidder) => {
				return bidder.Id === bidderId || _.get(bidder, 'id') as unknown as string === bidderId;
			}) || {} as ICustomCompareColumnEntity;
			return temp.IsCountInTarget !== false;
		};

		const temp = bidderColumns.find((bidder) => {
			return bidder.Id === bidderColumnId || _.get(bidder, 'id') as unknown as string === bidderColumnId;
		}) || {} as ICustomCompareColumnEntity;
		if (this.bidderIdentityService.isIncludedTargetCalculationColumn(bidderColumnId) && targetFn(bidderColumns, bidderColumnId) && temp.IsIdealBidder !== true && temp.PrcItemEvaluationId !== 2) {
			includedValues.push(value);
		}

		if (this.bidderIdentityService.isExcludedTargetCalculationColumn(bidderColumnId) && temp.IsIdealBidder !== true && temp.PrcItemEvaluationId !== 2) {
			excludedValues.push(value);
		}
	}

	public copyAndExtend<T>(source: T, extentObj: Partial<T>) {
		const cloneObj = _.cloneDeep(source);
		return _.extend(cloneObj, extentObj);
	}

	public isCompareFieldRow(boqLineTypeFk: number) {
		return boqLineTypeFk === CompareRowTypes.compareField;
	}

	public isBoqRow(boqLineTypeFk: number) {
		return (boqLineTypeFk === BoqLineType.root || (boqLineTypeFk >= BoqLineType.position && boqLineTypeFk <= BoqLineType.level9));
	}

	public isBoqRootRow(boqLineTypeFk: number) {
		return boqLineTypeFk === BoqLineType.root;
	}

	public isBoqLevelRow(boqLineTypeFk: number) {
		return boqLineTypeFk >= BoqLineType.level1 && boqLineTypeFk <= BoqLineType.level9;
	}

	public isBoqPositionRow(boqLineTypeFk: number) {
		return boqLineTypeFk === BoqLineType.position;
	}

	public isPrcItemRow(lineType: number) {
		return lineType === CompareRowTypes.prcItem;
	}

	public isQuoteFieldRow(row: { QuoteField?: string | null }) {
		return !_.isNil(row.QuoteField);
	}

	public registerEvent(scopeName: unknown, eventName: unknown, eventHandler: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let scopes = this.__eventScope || {},
			scope = scopes[scopeName] || {},
			event = scope[eventName] || new PlatformMessenger();

		event.register(eventHandler);

		scope[eventName] = event;
		scopes[scopeName] = scope;

		this.__eventScope = scopes;*/
	}

	public unregisterEvent(scopeName: unknown, eventName: unknown, eventHandler: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let scopes = this.__eventScope;
		if (scopes && scopes[scopeName] && scopes[scopeName][eventName]) {
			let event = scopes[scopeName][eventName];
			event.unregister(eventHandler);
		}*/
	}

	public fireEvent(scopeName: unknown, eventName: unknown, args: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let scopes = this.__eventScope;
		if (scopes && scopes[scopeName] && scopes[scopeName][eventName]) {
			let event = scopes[scopeName][eventName];
			event.fire(args);
		}*/
	}

	public moveSelectedItemTo(type: unknown, gridId: unknown, treeOptions: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		function isChildren(selectedItems) {
			return treeOptions && _.every(selectedItems, function (s) {
				return s[treeOptions.parentProp];
			});
		}

		function getParent(items, child) {
			return treeOptions ? _.find(items, function (p) {
				return p[treeOptions.idProp] === child[treeOptions.parentProp];
			}) : null;
		}

		function getGridSelectedInfos(gridId) {
			// platformGridAPI.rows.selection -> only for single items
			// but, multi-selection get not a toolbar function, this is maybe the solution
			let selectedInfo = {};
			let gridInstance = platformGridAPI.grids.element('id', gridId).instance;
			let gridItems = _.isDefined(gridInstance) ? gridInstance.getData().getItems() : [];
			let targetItems = gridItems;

			// one or multiple selection
			selectedInfo.selectedRows = _.isDefined(gridInstance) ? gridInstance.getSelectedRows() : [];

			// need for selection in grid
			selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
				// get row-data
				return gridInstance.getDataItem(row);
			});

			if (isChildren(selectedInfo.selectedItems)) {
				let parent = getParent(gridItems, selectedInfo.selectedItems[0]);
				if (parent) {
					targetItems = parent[treeOptions.childrenProp];
				}
			}

			selectedInfo.selectedRows = selectedInfo.selectedItems.map(function (item) {
				return _.findIndex(targetItems, item);
			});

			return selectedInfo;
		}

		let items = platformGridAPI.items.data(gridId);
		let selectedData = getGridSelectedInfos(gridId);
		let targetItems = items;
		let i, j;

		selectedData.selectedRows = selectedData.selectedRows.sort(function (a, b) {
			return a - b;
		});

		if (treeOptions && isChildren(selectedData.selectedItems)) {
			let parent = getParent(items, selectedData.selectedItems[0]);
			if (parent) {
				targetItems = parent[treeOptions.childrenProp];
			}
		}

		switch (type) {
			case 1:
				// moveUp
				for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
					targetItems.splice(selectedData.selectedRows[i] - 1, 0, targetItems.splice(selectedData.selectedRows[i], 1)[0]);
				}
				break;
			case 2:
				// push upwards
				for (i = 1, j = 0; i <= selectedData.selectedRows.length; i++, j++) {
					targetItems.splice((j), 0, targetItems.splice(selectedData.selectedRows[i - 1], 1)[0]);
				}
				break;
			case 3:
				// moveDown
				selectedData.selectedRows = selectedData.selectedRows.reverse();
				for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] + 1 < targetItems.length); i++) {
					targetItems.splice(selectedData.selectedRows[i] + 1, 0, targetItems.splice(selectedData.selectedRows[i], 1)[0]);
				}
				break;
			case 4:
				// push down
				for (i = 1, j = selectedData.selectedRows.length; i <= selectedData.selectedRows.length; i++, j--) {
					targetItems.splice(targetItems.length - i, 0, targetItems.splice(selectedData.selectedRows[j - 1], 1)[0]);
				}
				break;
		}

		// refresh grid content
		platformGridAPI.items.data(gridId, items);
		platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});*/
	}

	public mergeGridColumnWithConfiguration<T extends ICompositeBaseEntity<T>>(gridId: string, columns: CompareGridColumn<T>[]) {
		const config = this.getViewConfig(gridId);
		if (config && config.Propertyconfig) {
			const configColumns = _.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
			_.each(columns, (col) => {
				const target = _.find(configColumns, {id: col.id});
				if (target) {
					col.width = target.width;
					col.pinned = target.pinned;
				}
			});
		}
		return columns;
	}

	public flatTree<T extends object>(itemTree: T[], results: T[] = [], childrenProp: string = 'Children'): T[] {
		_.each(itemTree, (item: T) => {
			results.push(item);
			const children = _.get(item, childrenProp) as T[];
			if (children && children.length > 0) {
				this.flatTree(children, results);
			}
		});
		return results;
	}

	public attachValueFromParent<T extends ICompositeBaseEntity<T>>(
		tree: Array<ICompositeBaseEntity<T>> | ICompositeBaseEntity<T>,
		attachOptions: Array<{
			sourceProp: string;
			targetProp: string;
			attachFn?: (c: ICompositeBaseEntity<T>, n: ICompositeBaseEntity<T>, s: string, p: string, tree: Array<ICompositeBaseEntity<T>> | ICompositeBaseEntity<T>) => void
		}>
	) {
		const dataTree = _.isArray(tree) ? tree : [tree];
		_.each(dataTree, (n) => {
			if (_.isArray(n.Children)) {
				_.each(n.Children, (c) => {
					_.each(attachOptions, (opt) => {
						if (opt.sourceProp && opt.targetProp) {
							if (_.isFunction(opt['attachFn'])) {
								opt['attachFn'](c, n, opt.sourceProp, opt.targetProp, tree);
							} else {
								_.set(c, opt.targetProp, _.get(n, opt.sourceProp));
							}
						}
					});

				});
				this.attachValueFromParent(n.Children, attachOptions);
			}
		});
	}

	public reorderToolbarItems(items: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let boundaryEle = null;
		_.each(items, function itemIterator(item, i) {
			if (item.type === 'divider' && _.isUndefined(item.sort)) {
				if (i > 0) {
					boundaryEle = items[i - 1];
					item.sort = boundaryEle.sort;
				} else {
					item.sort = 0;
				}
			}
		});
		return _.sortBy(items, 'sort');*/
	}

	public updateOverflowToolbar(items: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let overflowItem = _.find(items, {type: 'overflow-btn'});
		if (overflowItem) {
			let actionItems = _.filter(items, function actionItemsFilter(item) {
				return item.type !== 'overflow-btn';
			});
			while (actionItems.length > 0 && actionItems[actionItems.length - 1].type === 'divider') {
				actionItems.pop();
			}
			overflowItem.list.items = actionItems;
		}*/
	}

	public refactorToolbarItems(items: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let sortItems = this.reorderToolbarItems(items);

		this.updateOverflowToolbar(sortItems);

		return sortItems;*/
	}

	public collectGeneralModifiedData(quoteGeneralItems: unknown, id: unknown, value: unknown, field: unknown, reqHeaderId: unknown, generalTypeId: unknown, prcHeaderId: unknown, oldPrcHeaderId: unknown, quoteId: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		if (!commonService.PrcGeneralsToSave) {
			commonService.PrcGeneralsToSave = [];
		}
		let generalItems = _.filter(quoteGeneralItems, {
			QuoteKey: field,
			ReqHeaderId: reqHeaderId,
			GeneralTypeId: generalTypeId
		});
		if (generalItems && generalItems.length) {
			_.each(generalItems, function (generalItem) {
				generalItem.Value = value;
				let modifiedItem = _.find(commonService.PrcGeneralsToSave, {Id: generalItem.Id});
				if (modifiedItem) {
					modifiedItem.Value = value;
					return;
				}
				let item = {
					Id: generalItem.Id,
					QuoteHeaderId: quoteId,
					PrcHeaderFk: prcHeaderId,
					ReqHeaderId: reqHeaderId,
					PrcGeneralstypeFk: generalTypeId,
					Value: value
				};
				commonService.PrcGeneralsToSave.push(item);
			});
		} else {
			let newItemToSave = _.find(commonService.PrcGeneralsToSave, {Id: -id});
			if (newItemToSave) {
				newItemToSave.Value = value;
				return;
			}
			let newItem = {
				Id: -id,
				QuoteHeaderId: quoteId,
				OldPrcHeaderId: oldPrcHeaderId,
				PrcHeaderFk: prcHeaderId,
				ReqHeaderId: reqHeaderId,
				PrcGeneralstypeFk: generalTypeId,
				Value: value
			};
			commonService.PrcGeneralsToSave.push(newItem);
		}*/
	}

	public generalModifiedDataChange(item: unknown, field: unknown, qtnMatchCache: unknown, visibleCompareColumnsCache: unknown, fromRefresh: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let qtnMatch = _.find(qtnMatchCache[item.RfqHeaderId], function (item) {
			return item.QuoteKey === field;
		});
		item.totals[field] = item[field];
		item.totalValues = [];
		item.totalValuesExcludeTarget = [];
		_.forIn(item.totals, function (val, key) {
			this.concludeTargetValue(key, item.totalValues, item.totalValuesExcludeTarget, val, CompareTypeEnum.boq, visibleCompareColumnsCache);
		});
		commonService.recalculateValue(item, item.totalValues, item.totalValuesExcludeTarget); // recalculate max,min,avg
		if (!fromRefresh) {
			let generalId = item.Id.split('_')[3];
			let reqGeneralItem = _.find(commonService.generalItems[item.RfqHeaderId], {QuoteKey: BidderIdentities.targetKey});
			let quoteGenerals = commonService.generalItems[item.RfqHeaderId];
			if (quoteGenerals && item.parentItem && item.parentItem.parentItem && item.parentItem.parentItem.QuoteGeneralItems) {
				_.each(item.parentItem.parentItem.QuoteGeneralItems, function (general) {
					quoteGenerals.push(general);
				});
			}
			this.collectGeneralModifiedData(quoteGenerals, generalId, item[field], field, item.ReqHeaderId, item.GeneralTypeId, qtnMatch.PrcHeaderId, reqGeneralItem.PrcHeaderId, qtnMatch.QtnHeaderId);
		}*/
	}

	public resetGenerals(tree: unknown, children: unknown, lineType: unknown, eventValue: unknown, qtnMatchCache: unknown, visibleCompareColumnsCache: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let subTree = _.find(tree, function (item) {
			return item[lineType] === CompareRowTypes.rfq && item.RfqHeaderId === eventValue.entity.RfqHeaderId;
		});

		if (!subTree) {
			return;
		}
		let qtnTree = _.find(subTree[children], function (item) {
			return item[lineType] === CompareRowTypes.requisition && item.ReqHeaderId === eventValue.entity.ReqHeaderId;
		});

		if (!qtnTree) {
			return;
		}
		let generalTotal = _.find(qtnTree[children], function (item) {
			return item[lineType] === CompareRowTypes.generalTotal;
		});

		if (!generalTotal) {
			return;
		}
		let currGeneral = _.find(generalTotal[children], function (item) {
			return item[lineType] === CompareRowTypes.generalItem && item.Id === eventValue.entity.Id;
		});
		if (!currGeneral) {
			return;
		}
		currGeneral[eventValue.key] = eventValue.value;
		this.generalModifiedDataChange(currGeneral, eventValue.field, qtnMatchCache, visibleCompareColumnsCache, true);*/
	}

	public itemTypeReadonlyFire(itemObj: unknown, rows: unknown, itemType: unknown, tryTimes: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let checkedItems = _.filter(rows, {'IsChecked': true});
		if (checkedItems.length <= 0) {
			commonService.onItemTypeReadonly.fire({
				itemType: itemType,
				readonly: true,
				tryTimes
			});
		} else if (!itemObj || !itemObj.item || (checkedItems.length === 1 && itemObj.item.IsChecked)) {
			commonService.onItemTypeReadonly.fire({
				itemType: itemType,
				readonly: false,
				tryTimes
			});
		}*/
	}

	public itemTypeReadonlyRegister(eventInfo: unknown, gridId: unknown, itemType: unknown, headerCheckHelperService: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		if (eventInfo.itemType === itemType) {
			if (eventInfo.readonly) {
				headerCheckHelperService.disabledHeaderCheckBox(gridId, ['IsChecked'], true, eventInfo.tryTimes);
			} else {
				headerCheckHelperService.enabledHeaderCheckBox(gridId, ['IsChecked'], true, eventInfo.tryTimes);

			}
			platformGridAPI.grids.refresh(gridId, true);
		}*/
	}

	public itemTypeReadonlyOnload() {
		/* TODO-DRIZZLE: To be migrated.
		let rows1 = platformGridAPI.items.data('F47D1AA927604D7EAABE5CBCC0DEDFC9');
		let rows2 = platformGridAPI.items.data('4759D4BC86CC454FABA90BB287CD9D58');
		let checkedItems1 = _.filter(rows1, {'IsChecked': true});
		let checkedItems2 = _.filter(rows2, {'IsChecked': true});
		if (checkedItems1.length <= 0 && checkedItems2.length > 0) {
			this.itemTypeReadonlyFire(null, rows1, 'itemType1', 10);
		} else if (checkedItems2.length <= 0 && checkedItems1.length > 0) {
			this.itemTypeReadonlyFire(null, rows2, 'itemType2', 10);
		}*/
	}

	public setConfigFieldReadonly(field: unknown, key: unknown, item: unknown, qtnMatchCache: unknown, quoteItem: unknown, isIdealBidder: unknown, isVerticalCompareRows: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		if (_.includes(commonService.configReadonlyFields, field)) {
			let qtnStatus = commonService.getQtnStatusById(qtnMatchCache, key, item.RfqHeaderId);
			if (this.bidderIdentityService.isReference(key) || (qtnStatus && qtnStatus.IsReadonly) || (qtnStatus && qtnStatus.IsProtected) || isIdealBidder) {
				let readonlyFields = [
					{field: key, readonly: true}
				];
				commonService.setFieldReadOnly(item, readonlyFields);
			}
		}
		// note: to do #135815 ,quantity field should not rely 'is free quantity' field.
		/!* if (field === commonService.itemCompareFields.quantity && !quoteItem.IsFreeQuantity) {
			commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
		} *!/

		if (field === CompareFields.lumpsumPrice && !quoteItem.IsLumpsum) {
			commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
		}

		if (field === CompareFields.notSubmitted && quoteItem.Price === 0) {
			commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
		}

		if (field === CompareFields.included && quoteItem.Price === 0) {
			commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
		}

		if (field === commonService.itemCompareFields.exQtnIsEvaluated) {
			commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
		}

		if (field === commonService.itemCompareFields.isFreeQuantity && quoteItem.ItemTypeFk === 7) {
			commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
		}

		if (isVerticalCompareRows) {
			if (field === CompareFields.isLumpsum || field === CompareFields.included || field === CompareFields.notSubmitted) {
				if (_.includes(['QuoteCol_-1_-1_-1', 'QuoteCol_-2_-2_-2'], quoteItem.QuoteKey)) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				}
			}
		}*/
	}

	public recalculateBillingSchema(dataService: unknown, quoteHeaderId: unknown, exchangeRate: unknown, prcItemModifiedItems: unknown, boqModifiedItems: unknown, prcItemModifiedData: unknown, boqModifiedData: unknown, billingSchema: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		if ((!prcItemModifiedItems || prcItemModifiedItems.length <= 0) && (!boqModifiedItems || boqModifiedItems.length <= 0) && !billingSchema) {
			return;
		}
		if (quoteHeaderId < 0) {
			return;
		}
		let billingSchemaService = $injector.get('priceComparisonBillingSchemaService');
		let selectQuote = dataService.selectedQuote;
		let tempBillingSchema = billingSchema || billingSchemaService.getList();
		let schema = _.cloneDeep(tempBillingSchema);
		return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/recalculatebillingschema', {
			prcItemModifiedItems: !_.isEmpty(prcItemModifiedItems) ? prcItemModifiedItems : [],
			boqModifiedItems: !_.isEmpty(boqModifiedItems) ? boqModifiedItems : [],
			prcItemModifiedData: prcItemModifiedData,
			boqModifiedData: boqModifiedData,
			quoteHeaderId: quoteHeaderId,
			exchangeRate: exchangeRate,
			billingSchema: schema,
			prcGenerals: commonService.PrcGeneralsToSave ? commonService.PrcGeneralsToSave : []
		}).then(function (response) {
			if (response.data['BillingSchemas']) {
				billingSchemaService.updateBillingSchemaData(response.data['BillingSchemas']);
				dataService.resetBillingSchemaValue(response.data['BillingSchemaTypes'], selectQuote, response.data['BillingSchemas']);
			}
			return billingSchemaService.getList();
		});*/
	}

	public getNumericFormattedValue(value: unknown, domain: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let culture = platformContextService.culture();
		let cultureInfo = platformLanguageService.getLanguageInfo(culture);
		let domainInfo = platformDomainService.loadDomain(domain);

		if (_.isNumber(value)) {
			value = accounting.formatNumber(value, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
		}
		return value;*/
	}

	public attachCostGroupValueToEntity(roots: ICompositeBoqEntity[], costGroupValues: object[], identityGetter: (item: object) => object, findPredicate: (item: ICompositeBoqEntity) => boolean) {
		const flatList = this.flatTree(roots, []);
		const filteredList = flatList.filter(findPredicate);
		_.each(filteredList, function (item) {
			const target = _.find(item.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});
			item.ReqBoqHeaderId = target ? _.get(target, 'BoqHeaderId') : undefined;
			item.ReqBoqItemId = target ? _.get(target, 'BoqItemId') : undefined;
		});
		// TODO-DRIZZLE: basicsCostGroupAssignmentService.attachCostGroupValueToEntity(flatList, costGroupValues, identityGetter);
	}

	public attachExtraValueToTreeRows<T extends ICompositeBaseEntity<T>>(roots: T[], processors: ICompositeDataProcess<T>[]) {
		const flatList = this.flatTree(roots, []);
		_.each(flatList, (row) => {
			const matches = _.filter(processors, (item) => {
				return item.isMatched(row);
			});
			_.each(matches, (match) => {
				match.process(row);
			});
		});
	}

	public createRowProcessor<T extends ICompositeBaseEntity<T>>(quoteKey: string, fields: ICompositeDataFields, isMatchedFn: (row: T) => boolean, findTarget?: (row: T) => ICustomQuoteItemBase, defaultValue?: unknown): ICompositeDataProcess<T> {
		const getTargetValue = function (row: T, target: ICustomQuoteItemBase | undefined, targetProp: ICompositeDataFields, defValue?: unknown) {
			let returnValue: unknown;
			if (target) {
				returnValue = _.get(target, targetProp as string);
			} else {
				if (_.isObject(defValue)) {
					returnValue = _.get(defValue, targetProp as string);
				} else {
					returnValue = defValue;
				}
			}
			return returnValue;
		};
		const fieldAssignFn = function (row: T, target: ICustomQuoteItemBase | undefined, assignFields: ICompositeDataFields, defValue?: unknown) {
			if (_.isArray(assignFields)) {
				_.each(assignFields, function (field) {
					fieldAssignFn(row, target, field, defValue);
				});
			} else if (_.isObject(assignFields)) {
				_.set(row, assignFields.rowProp, getTargetValue(row, target, assignFields.targetProp, defValue));
			} else {
				_.set(row, assignFields, getTargetValue(row, target, assignFields, defValue));
			}
		};
		return {
			isMatched: (row) => {
				return isMatchedFn(row);
			},
			process: (row) => {
				let target: ICustomQuoteItemBase | undefined;
				if (findTarget && _.isFunction(findTarget)) {
					target = findTarget(row);
				} else {
					target = _.find(row.QuoteItems, {QuoteKey: quoteKey});
				}
				fieldAssignFn(row, target, fields, defaultValue);
			}
		};
	}

	public encodeEntity(text: string) {
		return text ? text.replace(/</g, '&lt;').replace(/>/g, '&gt;') : text;
	}

	public tryGetQuoteHeader(quotes: IQuoteHeaderEntity[], headerFk: number) {
		return quotes.find(e => e.Id === headerFk);
	}

	public tryGetQuoteConfigurationId(quotes: IQuoteHeaderEntity[], headerFk: number) {
		const header = this.tryGetQuoteHeader(quotes, headerFk);
		return header ? header.PrcConfigurationFk : null;
	}

	public tryGetTaxCodeFK<T extends ICompositeBaseEntity<T>>(row: T, tree: T[], quoteKey: string, defaultTaxCodeFk?: number, isFlatTree?: boolean) {
		let targetItem = _.find(row.QuoteItems, {QuoteKey: quoteKey});
		let taxCodeFk = targetItem ? targetItem['TaxCodeFk'] as number : undefined;

		if (!taxCodeFk) {
			const flatTree = isFlatTree ? tree : this.flatTree(tree);
			let currRow: T | undefined = row;
			while (!taxCodeFk && currRow && currRow.ParentId) {
				currRow = flatTree.find(e => currRow && currRow.ParentId === e.Id);
				targetItem = currRow ? _.find(currRow.QuoteItems, {QuoteKey: quoteKey}) : undefined;
				if (targetItem) {
					taxCodeFk = targetItem['TaxCodeFk'] as number;
				}
			}
		}

		return taxCodeFk || defaultTaxCodeFk;
	}

	public tryGetTaxCodeFromMatrix(taxCodeFk: unknown, vatGroupFk: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let taxCode = null;
		let taxCodeMatrix = lookupDescriptorService.getData('TaxCodeMatrix');

		if (taxCodeMatrix) {
			taxCode = _.find(taxCodeMatrix, {
				VatGroupFk: vatGroupFk,
				TaxCodeFk: taxCodeFk
			});
		}

		if (!taxCode) {
			let taxCodes = lookupDescriptorService.getData('TaxCode');
			taxCode = _.find(taxCodes, {Id: taxCodeFk});
		}

		return taxCode;*/
	}

	public isLayoutBidderLineValueColumn<T extends ICompositeBaseEntity<T>>(column: CompareGridColumn<T> | string) {
		const id = '_rt$bidder_linevalue';
		return _.isString(column) ? column === id : column.id === id;
	}

	public sortQuoteColumns<T extends ICompositeBaseEntity<T>>(quoteColumns: CompareGridColumn<T>[], columnBidder: CompareGridColumn<T>) {
		if (columnBidder && columnBidder.children) {
			const children = columnBidder.children;
			quoteColumns.sort((a, b) => {
				const aCol = this.extractCompareInfoFromFieldName(a.field as string);
				const bCol = this.extractCompareInfoFromFieldName(b.field as string);
				const aField = aCol.quoteKey === aCol.field ? 'LineValue' : aCol.field;
				const bField = bCol.quoteKey === bCol.field ? 'LineValue' : bCol.field;
				const aIndex = children.findIndex((m) => {
					return m.field === aField;
				});
				const bIndex = children.findIndex((n) => {
					return n.field === bField;
				});
				return aIndex !== -1 && bIndex !== -1 ? aIndex - bIndex : 0;
			});
		}
		return quoteColumns;
	}

	public getDefaultConditionalFormat() {
		const objConditionalFormat = {
			'MAX()': 'color:red;',
			'AVG()': 'color:blue;',
			'MIN()': 'color:green;'
		};
		return JSON.stringify(objConditionalFormat);
	}

	public getConditionalFormatterList(customFormatter?: string) {
		let formatterObj: IExtendableObject;
		const formatterList: Array<{
			Script: string,
			Style: unknown
		}> = [];

		if (customFormatter && Object.getOwnPropertyNames(customFormatter).length > 0) {
			formatterObj = JSON.parse(customFormatter);
		} else {
			formatterObj = JSON.parse(this.getDefaultConditionalFormat());
		}

		_.forEach(formatterObj, (value, key) => {
			formatterList.push({Script: key, Style: value});
		});

		return formatterList;
	}

	public hasPermissionForModule(moduleName: string) {
		/* TODO-DRIZZLE: To be migrated.
		return naviPermissionService.hasPermissionForModule(moduleName);*/
		return true;
	}

	public getColumnsFromViewConfig(gridId: string) {
		const config = this.getViewConfig(gridId);
		let columns = [];
		if (config && config.Propertyconfig) {
			columns = _.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
		}
		return columns;
	}

	public setStyleForCellValueUsingTagDiv<T extends ICompositeBaseEntity<T>>(
		styleList: string | IExtendableObject<string>,
		deviationFields: string[],
		compareField: string,
		value: number,
		formattedValue: string,
		column: CompareGridColumn<T>,
		row: T,
		highlightQtn: boolean,
		deviationRow: boolean,
		minValue?: number,
		maxValue?: number,
		avgValue?: number,
		isVerticalCompareRows?: boolean
	) {
		const isCompareRow = this.isCompareRow(row.LineTypeFk);
		let styles = '';
		const styleListObj = _.isString(styleList) ? JSON.parse(styleList) as IExtendableObject<string> : styleList;
		_.map(styleListObj, (style, script) => {
			if (this.parseConditionalFormatScript(column, script, value, row, minValue, maxValue, avgValue, isVerticalCompareRows, isCompareRow)) {
				styles += style;
			}
		});
		if (_.includes(deviationFields, compareField) && deviationRow === true) {
			formattedValue = '<i class="block-image control-icons ico-pricecomp-deviation" title="Highlight Changes From Deviation"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
		}
		if (_.includes(HighlightFields, compareField) && highlightQtn === true) {
			formattedValue = '<i class="block-image control-icons ico-pricecomp-various" title="Highlight Changes Among QTN"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
		}
		if (styles) {
			styles = '<div style="' + styles + '">' + formattedValue + '</div>';
		} else {
			styles = formattedValue;
		}
		return styles;
	}

	public isCompareRow(lineTypeFk: number) {
		return CompareRowLineTypes.includes(lineTypeFk);
	}

	public setStyleForCellValueUsingTagSpan<T extends ICompositeBaseEntity<T>>(
		styleList: string | IExtendableObject<string> | null | undefined,
		value: number,
		formattedValue: string,
		column: CompareGridColumn<T>,
		row: T,
		minValue?: number,
		maxValue?: number,
		avgValue?: number,
		isVerticalCompareRows?: boolean
	) {
		const isCompareRow = this.isCompareRow(row.LineTypeFk);
		let styles = '';
		const styleListObj = styleList ? (_.isString(styleList) ? JSON.parse(styleList) as IExtendableObject<string> : styleList) : {};
		_.map(styleListObj, (style, script) => {
			if (this.parseConditionalFormatScript(column, script, value, row, minValue, maxValue, avgValue, isVerticalCompareRows, isCompareRow)) {
				styles += style;
			}
		});
		if (styles) {
			styles = '<span style="' + styles + '">' + formattedValue + '</span>';
		} else {
			styles = formattedValue;
		}

		return styles;
	}

	public parseConditionalFormatScript<T extends ICompositeBaseEntity<T>>(
		column: CompareGridColumn<T>,
		script: string,
		value: number,
		row: T,
		minValue?: number,
		maxValue?: number,
		avgValue?: number,
		isVerticalCompareRows?: boolean,
		isCompareRow?: boolean
	) {
		const prefix = isVerticalCompareRows && column.isVerticalCompareRows && isCompareRow ? column.originalField + '_' : '';
		let newMinValue = minValue ? minValue : (_.get(row, prefix + Constants.minValueExcludeTarget) ? _.get(row, prefix + Constants.minValueExcludeTarget) as number : 0);
		let newMaxValue = maxValue ? maxValue : (_.get(row, prefix + Constants.maxValueExcludeTarget) ? _.get(row, prefix + Constants.maxValueExcludeTarget) as number : 0);
		let newAvgValue = avgValue ? avgValue : (_.get(row, prefix + Constants.averageValueExcludeTarget) ? _.get(row, prefix + Constants.averageValueExcludeTarget) as number : 0);

		// Fixed issue # 133350 # Price Comparison: Highlight Color is twisted for Quote Evaluation Result. Best is "Red" and worst is "green" - should be the other way around
		// Fixed issue # 139159 # Colors are wrong for BP Evaluation in Price Comparison - please turn it around higher=better
		// This is just workaround, the best practice is every row has owner color setting.
		if (_.includes([CompareRowTypes.evaluationResult, CompareRowTypes.avgEvaluationA, CompareRowTypes.avgEvaluationB, CompareRowTypes.avgEvaluationC], row.LineTypeFk)) {
			value = -value;

			const minValueTemp = newMinValue;
			const maxValueTemp = newMaxValue;
			newMinValue = -maxValueTemp;
			newMaxValue = -minValueTemp;

			newAvgValue = -newAvgValue;
		}

		let result: boolean;
		const expression = {
			name: 'methods',
			methods: {
				MAX: function () {
					return value - newMaxValue >= 0; // for each cell in that row, it's the Maximum value
				},
				MIN: function () {
					return value - newMinValue <= 0; // for each cell in that row, it's the Minimum value
				},
				AVG: function () {
					return value - newAvgValue === 0; // for each cell in that row, it's the Average value
				},
				// usage: VAL() > 100 && VAL() < 200, which means,
				// for each cell in that row, is the cell value between 100 and 200
				VAL: function (field: string) {
					if (!_.isUndefined(field) && !_.isUndefined(row[field])) {
						return row[field];
					} else {
						return value;
					}
				}
			}
		};

		try {
			result = eval('expression' + '.' + expression.name + '.' + script.toUpperCase());
		} catch (e) {
			result = false;
		}

		return result;
	}

	public postAsForm(url: string, formData: unknown) {
		return this.http.post(url, formData, {
			headers: {
				'Content-Type': ''
			}
		});
	}

	public lookupFormatter<T extends ICompositeBaseEntity<T>, TItem extends object>(row: number, cell: number, value: unknown, dataContext: T, column: CompareGridColumn<T>, formatterOptions: ILookupOptions<TItem, T>) {
		if (_.includes([Constants.tagForNoQuote, '', null, undefined], value)) {
			return value;
		}

		const formatterColumn: CompareGridColumn<T> = {
			...column,
			...formatterOptions
		};

		const entity = _.clone(dataContext);

		_.set(entity, column.field as string, value);

		return this.formatValue(FieldType.Lookup, row, cell, value, formatterColumn, dataContext, formatterOptions);
	}

	public uomLookupFormatter<T extends ICompositeBaseEntity<T>>(row: number, cell: number, value: unknown, dataContext: ICompositeBaseEntity<T>, column: CompareGridColumn<T>) {
		return this.lookupFormatter(row, cell, value, dataContext, column, {
			dataServiceToken: BasicsSharedUomLookupService
		});
	}

	public projectChangeFormatter(row: number, cell: number, value: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let items = lookupDescriptorService.getData('projectchange');
		let item = _.find(items, item => item.Id === value);
		return item ? item.Code : '';*/
		return 'TODO';
	}

	public projectChangeStatusFormatter(row: number, cell: number, value: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let status = _.find(this.__projectChangeStatus, item => item.Id === value);
		let formatString = '';
		if (status) {
			let imageUrl = platformStatusIconService.select(status);
			let isCss = platformStatusIconService.hasOwnProperty('isCss') ? platformStatusIconService.isCss() : false;
			formatString = (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
				'<span style="padding-left: .1em;">' + status.Description + '</span>';
		}
		return formatString;*/
		return 'TODO';
	}

	public statisticValue(items: number[] | IExtendableObject<number>) {
		const array = _.isArray(items) ? items : _.values(items);
		return {
			minValue: _.min(array),
			maxValue: _.max(array),
			avgValue: this.calculateAverageValue(array)
		};
	}

	public isBidderColumn<T extends ICompositeBaseEntity<T>>(column: CompareGridColumn<T>) {
		return _.startsWith(column.field as string, 'QuoteCol_');
	}

	public isLineValueColumn<T extends ICompositeBaseEntity<T>>(column: CompareGridColumn<T>) {
		return /QuoteCol_-?\d+_-?\d+_-?\d+$/.test(column.field as string);
	}

	public clearButtonTag(text: string) {
		if (_.isString(text)) {
			text = text.replace(/<\/?button[^>]*>/g, '');
		}
		return text;
	}

	public registerDataReader(registerService: unknown, columnValueFunctions: unknown, compareType: unknown, isVerticalCompareRowsFn: unknown, isShowInSummaryActivatedFn: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let prop = compareType === commonService.constant.compareType.boqItem ? 'LineTypeFk' : 'LineTypeFk';

		registerService.getRowReader = function (dataContext) {
			return _.find(columnValueFunctions, r => {
				return _.isFunction(r.compareValue) ? r.compareValue(dataContext, isVerticalCompareRowsFn()) : dataContext[prop] === r.compareValue;
			});
		};

		registerService.getCellReader = function (dataContext, columnDef, rowReader) {
			if (!rowReader) {
				rowReader = this.getRowReader(dataContext);
			}
			return _.find(rowReader.cell, r => {
				return _.isFunction(r.compareValue) ? r.compareValue(columnDef, isVerticalCompareRowsFn()) : columnDef.field === r.compareValue;
			});
		};

		registerService.readCellValue = function (dataContext, columnDef, cellReader, rowReader) {
			if (!cellReader) {
				cellReader = this.getCellReader(dataContext, columnDef, rowReader);
			}
			return cellReader ? cellReader.readValue(dataContext, columnDef) : null;
		};

		registerService.readCellFormattedValue = function (row, cell, dataContext, columnDef, cellReader, rowReader) {
			if (!cellReader) {
				cellReader = this.getCellReader(dataContext, columnDef, rowReader);
			}
			return cellReader ? cellReader.readFormattedValue(row, cell, dataContext, columnDef) : null;
		};

		registerService.readCellValueType = function (dataContext, columnDef, cellReader, rowReader) {
			if (!cellReader) {
				cellReader = this.getCellReader(dataContext, columnDef, rowReader);
			}
			return cellReader ? (_.isFunction(cellReader.readValueType) ? cellReader.readValueType(dataContext, columnDef, isShowInSummaryActivatedFn()) : cellReader.valueType) : null;
		};

		registerService.readCellFormatCode = function (dataContext, columnDef, cellReader, rowReader) {
			if (!cellReader) {
				cellReader = this.getCellReader(dataContext, columnDef, rowReader);
			}
			return cellReader ? (_.isFunction(cellReader.readFormatCode) ? cellReader.readFormatCode(dataContext, columnDef, isShowInSummaryActivatedFn()) : cellReader['formatCode']) : null;
		};*/
	}

	public updateCompareConfig<T extends ICompositeBaseEntity<T>>(
		compareRows: ICompareRowEntity[],
		billingSchemaRows: ICompareRowEntity[],
		quoteRows: ICompareRowEntity[],
		customRows: ICompareRowEntity[],
		customQuoteRows: ICompareRowEntity[],
		customSchemaRows: ICompareRowEntity[],
		customColumns: ICustomCompareColumnEntity[]
	) {
		this.mergeCompareConfig([{
			target: customRows,
			source: compareRows
		}, {
			target: customQuoteRows,
			source: quoteRows
		}, {
			target: customSchemaRows,
			source: billingSchemaRows
		}]);
		this.bidderCompatible(customColumns);
	}

	public getVatPercentExpressionValue(taxCodes: ITaxCodeEntity[], taxCodeMatrixes: IMdcTaxCodeMatrixEntity[], taxCodeFk?: number | null, vatGroupFk?: number | null) {
		let rowIndex = -1;
		if (!!taxCodeFk && !!vatGroupFk) {
			rowIndex = _.findIndex(taxCodeMatrixes, item => item.MdcTaxCodeFk === taxCodeFk && item.BpdVatgroupFk === vatGroupFk);
		}
		if (rowIndex > -1) {
			rowIndex = taxCodes.length + rowIndex;
		} else if (taxCodeFk) {
			rowIndex = _.findIndex(taxCodes, item => item.Id === taxCodeFk);
		} else {
			rowIndex = taxCodes.length + taxCodeMatrixes.length; // vatPercent : 0
		}
		return rowIndex !== -1 ? this.formatExpressionValue(rowIndex, 2) : null;
	}

	public getFieldCellIndex<T extends ICompositeBaseEntity<T>>(rows: T[], currRow: T, columns: CompareGridColumn<T>[], col: CompareGridColumn<T>, colIndex: number, isVerticalCompareRows: boolean, leadingField: string) {
		let rowIndex: number;
		if (isVerticalCompareRows) {
			rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
			colIndex = _.findIndex(columns, column => column.id === col.quoteKey + '_' + leadingField);
		} else {
			rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.LineTypeFk === CompareRowTypes.compareField && row.ParentId === currRow.ParentId);
		}
		return rowIndex !== -1 && colIndex !== -1 ? this.formatExpressionValue(rowIndex, colIndex) : null;
	}

	public getDeviationReferenceFieldIndex<T extends ICompositeBaseEntity<T>>(
		rows: T[],
		currRow: T,
		columns: CompareGridColumn<T>[],
		colIndex: number,
		isVerticalCompareRows: boolean,
		leadingField: string,
		visibleCompareRows: ICompareRowEntity[],
		visibleCompareColumns: ICustomCompareColumnEntity[]
	) {
		const visibleRow = _.find(visibleCompareRows, {Field: CompareFields.absoluteDifference}) as ICompareRowEntity;
		let indexStr = this.getSelectedLookupMes(visibleRow.DeviationReference);
		const quoteItems = isVerticalCompareRows ? currRow.QuoteItems : currRow.parentItem?.QuoteItems;
		const differentFields = this.checkHighlightQtn(visibleCompareColumns, quoteItems);
		const basicQuoteKey = differentFields['markFieldQtn'] as string;
		let rowIndex = -1;
		if (isVerticalCompareRows) {
			rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
			if (indexStr === Constants.deviationColumn && !!basicQuoteKey) {
				colIndex = _.findIndex(columns, item => item.field === basicQuoteKey + '_' + leadingField);
			} else {
				if (this.bidderIdentityService.isReference(indexStr)) {
					switch (visibleRow.DeviationReference) {
						case 4: {
							colIndex = _.findIndex(columns, item => item.field === indexStr + '_' + leadingField);
							break;
						}
						case 10: {
							colIndex = _.findIndex(columns, item => item.field === CompareFields.budgetPerUnit);
							break;
						}
						case 11: {
							colIndex = _.findIndex(columns, item => item.field === CompareFields.budgetTotal);
							break;
						}
						default:
							break;
					}
				}
			}
		} else {
			if (indexStr === Constants.deviationColumn && !!basicQuoteKey) {
				indexStr = basicQuoteKey;
				rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.ParentId === currRow.ParentId && (row.LineTypeFk === CompareRowTypes.compareField));
			} else {
				switch (visibleRow.DeviationReference) {
					case 4: {
						rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.ParentId === currRow.ParentId && (row.LineTypeFk === CompareRowTypes.compareField));
						break;
					}
					case 10: {
						indexStr = CompareFields.budgetPerUnit;
						rowIndex = _.findIndex(rows, row => row.Id === currRow.ParentId);
						break;
					}
					case 11: {
						indexStr = CompareFields.budgetTotal;
						rowIndex = _.findIndex(rows, row => row.Id === currRow.ParentId);
						break;
					}
					default:
						break;
				}
			}
			colIndex = _.findIndex(columns, item => item.field === indexStr);
		}
		return rowIndex !== -1 && colIndex !== -1 ? this.formatExpressionValue(rowIndex, colIndex) : null;
	}

	public getBidderReferenceFieldIndex<T extends ICompositeBaseEntity<T>>(
		rows: T[],
		currRow: T,
		columns: CompareGridColumn<T>[],
		isVerticalCompareRows: boolean,
		leadingField: string
	) {
		let rowIndex = -1;
		let results: Array<[number, number]>;
		if (isVerticalCompareRows) {
			rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
			results = _.filter(columns, column => {
				return this.bidderIdentityService.isNotReference(column.quoteKey) && column.originalField === leadingField;
			}).map(c => {
				const columnIndex = _.findIndex(columns, column => {
					return column.field === c.field;
				});
				return [rowIndex, columnIndex];
			});
		} else {
			rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.LineTypeFk === CompareRowTypes.compareField && row.ParentId === currRow.ParentId);
			results = _.filter(columns, column => {
				return this.bidderIdentityService.isNotReference(column.field) && this.isBidderColumn(column);
			}).map(c => {
				const columnIndex = _.findIndex(columns, column => {
					return column.field === c.field;
				});
				return [rowIndex, columnIndex];
			});
		}
		return results.map(m => this.formatExpressionValue(m[0], m[1])).join(',');
	}

	public deviationDifferenceFormula<T extends ICompositeBaseEntity<T>>(
		currRow: T,
		isVerticalCompareRows: boolean,
		userData: ICompareExportUserDataBase
	) {
		const visibleRow = _.find(userData.visibleCompareRows, {Field: CompareFields.absoluteDifference}) as ICompareRowEntity;
		const indexStr = this.getSelectedLookupMes(visibleRow.DeviationReference);
		const differentFields = this.checkHighlightQtn(userData.visibleCompareColumns, isVerticalCompareRows ? currRow.QuoteItems : currRow.parentItem?.QuoteItems);
		const basicQuoteKey = differentFields['markFieldQtn'];
		if (indexStr === Constants.deviationColumn && !!basicQuoteKey) {
			const targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === basicQuoteKey) : _.find(currRow.parentItem?.QuoteItems, item => item.QuoteKey === basicQuoteKey);
			return targetItem ? '{leadingField}-{deviationReference}' : '{leadingField}';
		} else {
			if (this.bidderIdentityService.isReference(indexStr)) {
				const targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === indexStr) : _.find(currRow.parentItem?.QuoteItems, item => item.QuoteKey === indexStr);
				return targetItem ? '{leadingField}-{deviationReference}' : '{leadingField}';
			} else {
				if (indexStr === Constants.averageValueExcludeTarget) {
					return '{leadingField}-AVERAGE({bidderReference})';
				} else if (indexStr === Constants.minValueExcludeTarget) {
					return '{leadingField}-MIN({bidderReference})';
				} else if (indexStr === Constants.maxValueExcludeTarget) {
					return '{leadingField}-MAX({bidderReference})';
				} else { // unset DeviationReference
					return 'IF(MIN({bidderReference})=0,0,{leadingField}-MIN({bidderReference}))';
				}
			}
		}
	}

	public percentageFormula<T extends ICompositeBaseEntity<T>>(
		currRow: T,
		isVerticalCompareRows: boolean,
		userData: ICompareExportUserDataBase
	) {
		const visibleRow = _.find(userData.visibleCompareRows, {Field: CompareFields.absoluteDifference}) as ICompareRowEntity;
		const indexStr = this.getSelectedLookupMes(visibleRow.DeviationReference);
		const differentFields = this.checkHighlightQtn(userData.visibleCompareColumns, isVerticalCompareRows ? currRow.QuoteItems : currRow.parentItem?.QuoteItems);
		const basicQuoteKey = differentFields['markFieldQtn'] as string;
		if (indexStr === Constants.deviationColumn && !!basicQuoteKey) {
			const targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === basicQuoteKey) : _.find(currRow.parentItem?.QuoteItems, item => item.QuoteKey === basicQuoteKey);
			return targetItem ? 'IF({deviationReference}=0,0,{leadingField}/{deviationReference})' : '0';
		} else {
			if (this.bidderIdentityService.isReference(indexStr)) {
				const targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === indexStr) : _.find(currRow.parentItem?.QuoteItems, item => item.QuoteKey === indexStr);
				return targetItem ? 'IF({deviationReference}=0,0,{leadingField}/{deviationReference})' : '0';
			} else {
				if (indexStr === Constants.averageValueExcludeTarget) {
					return 'IF(AVERAGE({bidderReference})=0,0,{leadingField}/AVERAGE({bidderReference}))';
				} else if (indexStr === Constants.minValueExcludeTarget) {
					return 'IF(MIN({bidderReference})=0,0,{leadingField}/MIN({bidderReference}))';
				} else if (indexStr === Constants.maxValueExcludeTarget) {
					return 'IF(MAX({bidderReference})=0,0,{leadingField}/MAX({bidderReference}))';
				} else { // unset DeviationReference
					return 'IF(MIN({bidderReference})=0,0,{leadingField}/MIN({bidderReference}))';
				}
			}
		}
	}

	public createQuoteRowFinder<T extends ICompositeBaseEntity<T>>(lineType: number) {
		return (rows: T[], currRow: T, columns: CompareGridColumn<T>[], col: CompareGridColumn<T>, colIndex: number, isVerticalCompareRows: boolean) => {
			const rowIndex = _.findIndex(rows, (row) => {
				return row.LineTypeFk === lineType;
			});
			const targetColIndex = isVerticalCompareRows ? _.findIndex(columns, c => {
				return c.field === col.quoteKey;
			}) : colIndex;
			return rowIndex !== -1 && targetColIndex !== -1 ? this.formatExpressionValue(rowIndex, targetColIndex) : null;
		};
	}

	public formatExpressionValue(row: number, cell: number) {
		return '[' + row + ',' + cell + ']';
	}

	public setColumnValuesForEvaluatedTotalRow<T extends ICompositeBaseEntity<T>>(compareColumns: ICustomCompareColumnEntity[], evaluatedTotalRow: T, rootRows: T[]) {
		/* TODO-DRIZZLE: To be migrated.
		let lineTypeProp = compareType === CompareTypeEnum.boq ? 'LineTypeFk' : 'LineTypeFk',
			childProp = compareType === CompareTypeEnum.boq ? 'BoqItemChildren' : 'Children',
			positionType = compareType === CompareTypeEnum.boq ? BoqLineType.position : CompareRowTypes.prcItem,
			childTotal = compareType === CompareTypeEnum.boq ? commonService.boqCompareFields.itemTotal : commonService.itemCompareFields.total;
		evaluatedTotalRow.totals = {};
		evaluatedTotalRow.ranks = {};
		evaluatedTotalRow.percentages = {};
		evaluatedTotalRow.totalValues = [];
		evaluatedTotalRow.totalValuesExcludeTarget = [];

		_.each(compareColumns, function (visibleColumn) {
			evaluatedTotalRow[visibleColumn.Id] = 0;
		});

		let childRows = _.filter(this.flatTree(rootRows, childProp), item => item[lineTypeProp] === positionType && checkBidderService.isNotReference(item.QuoteKey));
		_.each(compareColumns, function (visibleColumn) {
			_.each(childRows, childRow => {
				let quoteItem = _.find(childRow.QuoteItems, item => item.QuoteKey === visibleColumn.Id);
				if (quoteItem) {
					if (quoteItem.PrcItemEvaluationId && quoteItem.ExQtnIsEvaluated && Object.hasOwnProperty.call(evaluatedTotalRow, visibleColumn.Id)) {
						evaluatedTotalRow[visibleColumn.Id] += quoteItem[childTotal];
					}
				}
			});
		});
		_.each(compareColumns, function (visibleColumn) {
			if (checkBidderService.isNotReference(visibleColumn.Id)) {
				evaluatedTotalRow.totals[visibleColumn.Id] = evaluatedTotalRow[visibleColumn.Id];
				evaluatedTotalRow.totalValues.push(evaluatedTotalRow[visibleColumn.Id]);
				if (!visibleColumn.IsIdealBidder) {
					evaluatedTotalRow.totalValuesExcludeTarget.push(evaluatedTotalRow[visibleColumn.Id]);
				}
			}
		});

		evaluatedTotalRow.totalValues = _.sortBy(evaluatedTotalRow.totalValues); // sort by ascending for calculate rank.
		evaluatedTotalRow.totalValuesExcludeTarget = _.sortBy(evaluatedTotalRow.totalValuesExcludeTarget);

		// set Max/ Min/ Average value
		evaluatedTotalRow[Constants.maxValueIncludeTarget] = _.max(evaluatedTotalRow.totalValues) || 0;
		evaluatedTotalRow[Constants.minValueIncludeTarget] = _.min(evaluatedTotalRow.totalValues) || 0;
		evaluatedTotalRow[Constants.averageValueIncludeTarget] = commonService.calculateAverageValue(evaluatedTotalRow.totalValues) || 0;
		evaluatedTotalRow[Constants.maxValueExcludeTarget] = _.max(evaluatedTotalRow.totalValuesExcludeTarget) || 0;
		evaluatedTotalRow[Constants.minValueExcludeTarget] = _.min(evaluatedTotalRow.totalValuesExcludeTarget) || 0;
		evaluatedTotalRow[Constants.averageValueExcludeTarget] = commonService.calculateAverageValue(evaluatedTotalRow.totalValuesExcludeTarget) || 0;*/
	}

	public setColumnValuesForOfferedTotalRow<T extends ICompositeBaseEntity<T>>(compareColumns: ICustomCompareColumnEntity[], offeredTotalRow: T, rootRows: T[]) {
		/* TODO-DRIZZLE: To be migrated.
		let lineTypeProp = compareType === CompareTypeEnum.boq ? 'LineTypeFk' : 'LineTypeFk',
			childProp = compareType === CompareTypeEnum.boq ? 'BoqItemChildren' : 'Children',
			positionType = compareType === CompareTypeEnum.boq ? BoqLineType.position : CompareRowTypes.prcItem,
			childTotal = compareType === CompareTypeEnum.boq ? commonService.boqCompareFields.itemTotal : commonService.itemCompareFields.total;
		offeredTotalRow.totals = {};
		offeredTotalRow.ranks = {};
		offeredTotalRow.percentages = {};
		offeredTotalRow.totalValues = [];
		offeredTotalRow.totalValuesExcludeTarget = [];

		_.each(compareColumns, function (visibleColumn) {
			offeredTotalRow[visibleColumn.Id] = 0;
		});

		let childRows = _.filter(this.flatTree(rootRows, childProp), item => item[lineTypeProp] === positionType && checkBidderService.isNotReference(item.QuoteKey));
		_.each(compareColumns, function (visibleColumn) {
			_.each(childRows, childRow => {
				let quoteItem = _.find(childRow.QuoteItems, item => item.QuoteKey === visibleColumn.Id);
				if (quoteItem) {
					if (!quoteItem.ExQtnIsEvaluated && Object.hasOwnProperty.call(offeredTotalRow, visibleColumn.Id)) {
						offeredTotalRow[visibleColumn.Id] += quoteItem[childTotal];
					}
				}
			});
		});
		_.each(compareColumns, function (visibleColumn) {
			if (checkBidderService.isNotReference(visibleColumn.Id)) {
				offeredTotalRow.totals[visibleColumn.Id] = offeredTotalRow[visibleColumn.Id];
				offeredTotalRow.totalValues.push(offeredTotalRow[visibleColumn.Id]);
				if (!visibleColumn.IsIdealBidder) {
					offeredTotalRow.totalValuesExcludeTarget.push(offeredTotalRow[visibleColumn.Id]);
				}
			}
		});

		offeredTotalRow.totalValues = _.sortBy(offeredTotalRow.totalValues); // sort by ascending for calculate rank.
		offeredTotalRow.totalValuesExcludeTarget = _.sortBy(offeredTotalRow.totalValuesExcludeTarget);

		// set Max/ Min/ Average value
		offeredTotalRow[Constants.maxValueIncludeTarget] = _.max(offeredTotalRow.totalValues) || 0;
		offeredTotalRow[Constants.minValueIncludeTarget] = _.min(offeredTotalRow.totalValues) || 0;
		offeredTotalRow[Constants.averageValueIncludeTarget] = commonService.calculateAverageValue(offeredTotalRow.totalValues) || 0;
		offeredTotalRow[Constants.maxValueExcludeTarget] = _.max(offeredTotalRow.totalValuesExcludeTarget) || 0;
		offeredTotalRow[Constants.minValueExcludeTarget] = _.min(offeredTotalRow.totalValuesExcludeTarget) || 0;
		offeredTotalRow[Constants.averageValueExcludeTarget] = commonService.calculateAverageValue(offeredTotalRow.totalValuesExcludeTarget) || 0;*/
	}

	public buildEvaluatedTotalExpress<T extends ICompositeBaseEntity<T>>(
		rows: T[],
		columns: CompareGridColumn<T>[],
		col: CompareGridColumn<T>,
		colIndex: number,
		isVerticalCompareRows: boolean,
		totalField: string,
		lineTypeFk: number
	) {
		let results: Array<[number, number]>;
		let targetRows: T[];
		if (isVerticalCompareRows) {
			targetRows = rows.filter(item => item.LineTypeFk === lineTypeFk);
			results = targetRows.map(r => {
				const rowIndex = _.findIndex(rows, row => {
					return row.Id === r.Id;
				});
				const quoteItem = _.find(r.QuoteItems, quoteItem => quoteItem.QuoteKey === col.id);
				colIndex = columns.findIndex(column => (column.id === col.id + '_' + totalField) && quoteItem && quoteItem.PrcItemEvaluationId && quoteItem.ExQtnIsEvaluated);
				return [rowIndex, colIndex];
			});
		} else {
			targetRows = _.filter(rows, row => {
				return row.LineTypeFk === CompareRowTypes.compareField && row.rowType === totalField;
			});
			targetRows = targetRows.filter(row => {
				const quoteItem = row.parentItem?.QuoteItems.find(quoteItem => quoteItem.QuoteKey === col.id);
				return quoteItem && quoteItem.PrcItemEvaluationId && quoteItem.ExQtnIsEvaluated;
			});
			results = targetRows.map(r => {
				const rowIndex = _.findIndex(rows, row => {
					return row.Id === r.Id;
				});
				return [rowIndex, colIndex];
			});
		}
		results = _.filter(results, r => {
			return r[0] > -1 && r[1] > -1;
		});
		return results.map(m => this.formatExpressionValue(m[0], m[1])).join(',');
	}

	public removeDataRowsRecursively<T extends ICompositeBaseEntity<T>>(dataTree: T[], predicate: (item: T) => boolean, isSoftRemove: boolean): T[] {
		let removeItems: T[] = [];
		const items = _.isArray(dataTree) ? dataTree : [dataTree];

		if (isSoftRemove) {
			const predicatedItems = _.filter(items, predicate);
			_.each(predicatedItems, (item) => {
				item._rt$Deleted = true;
			});
			removeItems = removeItems.concat(predicatedItems);
		} else {
			removeItems = removeItems.concat(_.remove(items, predicate));
		}

		_.each(items, (node: ICompositeBaseEntity<T>) => {
			if (node.Children && node.Children.length > 0) {
				removeItems = removeItems.concat(this.removeDataRowsRecursively(node.Children, predicate, isSoftRemove));
			}

			if (isSoftRemove) {
				node.HasChildren = !_.isNil(node.Children) && _.filter(node.Children, function (item) {
					return !item._rt$Deleted;
				}).length > 0;
			} else {
				node.HasChildren = !_.isNil(node.Children) && node.Children.length > 0;
			}
			if (node.nodeInfo) {
				node.nodeInfo.children = node.HasChildren;
				node.nodeInfo.lastElement = !node.HasChildren;
			}
		});
		return removeItems;
	}

	public isStandardBoq(basItemTypeFk: BoqMainItemTypes, basItemType2Fk?: BoqMainItemTypes2 | null) {
		return basItemTypeFk === BoqMainItemTypes.Standard && _.includes([BoqMainItemTypes2.Normal, BoqMainItemTypes2.Base, BoqMainItemTypes2.AlternativeAwarded], basItemType2Fk);
	}

	public isOptionalWithItBoq(basItemTypeFk: BoqMainItemTypes, basItemType2Fk?: BoqMainItemTypes2 | null) {
		return basItemTypeFk === BoqMainItemTypes.OptionalWithIT && _.includes([BoqMainItemTypes2.Normal, BoqMainItemTypes2.Base, BoqMainItemTypes2.AlternativeAwarded], basItemType2Fk);
	}

	public isOptionalWithoutItBoq(basItemTypeFk: BoqMainItemTypes) {
		return basItemTypeFk === BoqMainItemTypes.OptionalWithoutIT;
	}

	public isAlternativeBoq(basItemType2Fk?: BoqMainItemTypes2 | null) {
		return basItemType2Fk === BoqMainItemTypes2.Alternative;
	}

	public isItemWithITBoq(basItemTypeFk: BoqMainItemTypes, basItemType2Fk?: BoqMainItemTypes2 | null) {
		return (basItemTypeFk === BoqMainItemTypes.Empty || basItemTypeFk === BoqMainItemTypes.Standard || basItemTypeFk === BoqMainItemTypes.OptionalWithIT)
			&& (basItemType2Fk === null || basItemType2Fk === BoqMainItemTypes2.Normal || basItemType2Fk === BoqMainItemTypes2.Base || basItemType2Fk === BoqMainItemTypes2.AlternativeAwarded);
	}

	public isBoqDisabledOrNA(item: ICompositeBoqEntity) {
		return item.IsDisabled || item.IsNotApplicable;
	}

	public processQuote(items: IQuoteHeaderEntity[]) {
		const dateFields = ['DateDelivery', 'DateEffective', 'DateQuoted', 'DatePricefixing', 'DateReceived', 'UserDefinedDate01'];
		// translate additional quotes(Id<0) #135243
		_.forEach(items, (item) => {
			if (this.bidderIdentityService.isReference(item.Id)) {
				item.Description = this.translateTargetOrBaseBoqName(item.Id);
			}
		});

		return this.processDate(items, dateFields);
	}

	public processDate<T extends object>(items: T[], dateFields: string[]) {
		if (!_.isEmpty(items) && !_.isEmpty(dateFields)) {
			items.forEach(item => {
				dateFields.forEach(field => {
					if (_.get(item, field)) {
						_.set(item, field, this.dateService.getUTC((_.get(item, field) as string)));
					}
				});
			});
		}
		return items;
	}

	public isAverageMaxMinCol<T extends ICompositeBaseEntity<T>>(columnDef: CompareGridColumn<T>) {
		return columnDef.field === Constants.maxValueIncludeTarget ||
			columnDef.field === Constants.minValueIncludeTarget ||
			columnDef.field === Constants.averageValueIncludeTarget ||
			columnDef.field === Constants.maxValueExcludeTarget ||
			columnDef.field === Constants.minValueExcludeTarget ||
			columnDef.field === Constants.averageValueExcludeTarget;
	}

	public getAverageMaxMinValue<T extends ICompositeBaseEntity<T>>(dataContext: ICompositeBaseEntity<T>, columnDef: CompareGridColumn<T>) {
		/* TODO-DRIZZLE: To be migrated.
		switch (columnDef.field) {
			case Constants.maxValueIncludeTarget:
				return _.max(dataContext.totalValues);
			case Constants.minValueIncludeTarget:
				return _.min(dataContext.totalValues);
			case Constants.averageValueIncludeTarget:
				return commonService.calculateAverageValue(dataContext.totalValues);
			case Constants.maxValueExcludeTarget:
				return _.max(dataContext.totalValuesExcludeTarget);
			case Constants.minValueExcludeTarget:
				return _.min(dataContext.totalValuesExcludeTarget);
			case Constants.averageValueExcludeTarget:
				return commonService.calculateAverageValue(dataContext.totalValuesExcludeTarget);
		}*/
	}

	public createStatisticCells<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(totalField: string): ICompareExportCellFormulaRule<T, UT>[] {
		return [
			this.createStatisticCell<T, UT>(Constants.maxValueIncludeTarget, totalField),
			this.createStatisticCell<T, UT>(Constants.maxValueExcludeTarget, totalField),
			this.createStatisticCell<T, UT>(Constants.minValueIncludeTarget, totalField),
			this.createStatisticCell<T, UT>(Constants.minValueExcludeTarget, totalField),
			this.createStatisticCell<T, UT>(Constants.averageValueIncludeTarget, totalField),
			this.createStatisticCell<T, UT>(Constants.averageValueExcludeTarget, totalField)
		];
	}

	public createStatisticCell<
		T extends ICompositeBaseEntity<T>,
		UT extends ICompareExportUserDataBase
	>(field: string, totalField: string): ICompareExportCellFormulaRule<T, UT> {
		let formula = '';
		switch (field) {
			case Constants.maxValueIncludeTarget:
			case Constants.maxValueExcludeTarget:
				formula = 'MAX({total})';
				break;
			case Constants.minValueIncludeTarget:
			case Constants.minValueExcludeTarget:
				formula = 'MIN({total})';
				break;
			case Constants.averageValueIncludeTarget:
			case Constants.averageValueExcludeTarget:
				formula = 'IF(ISNUMBER(AVERAGE({total})),AVERAGE({total}),0)';
		}
		return {
			formula: formula,
			cell: (row: T, column: CompareGridColumn<T>, isVerticalCompareRows: boolean) => {
				return column.field === field;
			},
			expression: {
				total: (rows: T[], currRow: T, columns: CompareGridColumn<T>[], col: CompareGridColumn<T>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>) => {
					let results: Array<[number, number]>;
					let rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
					if (isVerticalCompareRows) {
						let targetColumns: CompareGridColumn<T>[];
						if (this.isBoqPositionRow(currRow.LineTypeFk) || currRow.LineTypeFk === CompareRowTypes.prcItem) {
							targetColumns = _.filter(columns, column => column.field === column.quoteKey + '_' + CompareFields.itemTotal && !column.isIdealBidder && this.bidderIdentityService.isNotReference(column.quoteKey));
						} else {
							targetColumns = _.filter(columns, column => this.isLineValueColumn(column) && !column.isIdealBidder && this.bidderIdentityService.isNotReference(column.field));
						}
						if (!this.isExcludeTargetColumn(col)) {
							const countInTargetColumnIds = _.filter(userData.visibleCompareColumns, item => item.IsCountInTarget).map(item => item.Id);
							targetColumns = _.filter(targetColumns, bidderColumn => {
								return _.indexOf(countInTargetColumnIds, bidderColumn.field) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
							});
						}
						results = targetColumns.map(targetColumn => {
							colIndex = _.findIndex(columns, column => column.id === targetColumn.id);
							return [rowIndex, colIndex];
						});
					} else {
						let bidderColumns = _.filter(columns, column => this.isLineValueColumn(column) && this.bidderIdentityService.isNotReference(column.field) && !column.isIdealBidder);
						if (!this.isExcludeTargetColumn(col)) {
							const countInTargetColumnIds = _.filter(userData.visibleCompareColumns, item => item.IsCountInTarget).map(item => item.Id);
							bidderColumns = _.filter(bidderColumns, bidderColumn => {
								return _.indexOf(countInTargetColumnIds, bidderColumn.id) > -1;
							});
						}
						if (this.isBoqPositionRow(currRow.LineTypeFk) || currRow.LineTypeFk === CompareRowTypes.prcItem) {
							const itemTotalRow = _.find(currRow.Children, childRow => {
								return childRow.rowType === totalField;
							});
							if (itemTotalRow) {
								rowIndex = _.findIndex(rows, row => row.Id === itemTotalRow.Id);
							}
							results = bidderColumns.map(bidderColumn => {
								const colIndex = _.findIndex(columns, column => {
									return column.field === bidderColumn.field;
								});
								return [rowIndex, colIndex];
							});
						} else {
							results = bidderColumns.map(bidderColumn => {
								const colIndex = _.findIndex(columns, column => {
									return column.field === bidderColumn.field;
								});
								return [rowIndex, colIndex];
							});
						}
					}
					return results.map(m => this.formatExpressionValue(m[0], m[1])).join(',');
				}
			}
		};
	}

	public isExcludeTargetColumn<T extends ICompositeBaseEntity<T>>(col: CompareGridColumn<T>) {
		const excludeColumns = [Constants.maxValueExcludeTarget, Constants.minValueExcludeTarget, Constants.averageValueExcludeTarget];
		return _.indexOf(excludeColumns, col.id) > -1 || _.indexOf(excludeColumns, col.field) > -1;
	}

	public createGridCellButtonTemplateAsNavigator<T extends ICompositeBaseEntity<T>>(column: CompareGridColumn<T>, entity: ICompositeBaseEntity<T>, toolTip: string, callbackFn: () => void, options: object) {
		return '';
		/* TODO-DRIZZLE: To be migrated.
		let navOptions = {
			field: column.field,
			navigator: {
				moduleName: 'procurement.pricecomparison',
				navFunc: callbackFn,
				toolTip: toolTip,
				toolTip$tr$: toolTip
			}
		};

		let createOptions = _.extend({
			disabled: false,
			icon: 'ico-goto'
		}, options);

		let navEntity = {};
		navEntity[column.field] = true;

		let navBtnHtml = platformGridDomainService.getNavigator(navOptions, navEntity);
		// need css-class navigator-dynamic for the context-menu function. Without the css, hover-button is not shown in grid-cell.
		let navDom = $(navBtnHtml).css('position', 'relative').removeClass('ico-goto').addClass(createOptions.icon).addClass('navigator-dynamic');

		if (createOptions.disabled) {
			navDom.attr('disabled', createOptions.disabled);
		}

		return $('<div></div>').append(navDom).html();*/
	}

	public isEvaluatedTotalVisible(rows: ICompareRowEntity[]) {
		const evaluatedTotal = rows.find(r => r.Field === CompareFields.evaluatedTotal);
		return evaluatedTotal && evaluatedTotal.Visible;
	}

	public isOfferedTotalVisible(rows: ICompareRowEntity[]) {
		const offeredTotal = rows.find(r => r.Field === CompareFields.offeredTotal);
		return offeredTotal && offeredTotal.Visible;
	}

	public clearItemEvaluationRecalculateRowCache(itemEvaluationNodes: unknown, modifiedData: unknown, isVerticalCompareRows: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let modifiedKeys = _.keys(modifiedData);
		let targetEvaluationNodes = _.filter(itemEvaluationNodes, node => {
			let targetRow = isVerticalCompareRows ? node : node.parentItem;
			return _.some(targetRow.QuoteItems, item => {
				return _.includes(modifiedKeys, _.toString(item.QtnHeaderId));
			});
		});
		_.each(targetEvaluationNodes, node => {
			if (node.allRecaluclateRows) {
				node.allRecaluclateRows = null;
			}
		});*/
	}

	public getCompareFieldNode(dataService: unknown, compareType: unknown, quoteItem: unknown, quoteKey: unknown, itemKey: unknown, compareField: unknown) {
		/* TODO-DRIZZLE: To be migrated.
		let compareFieldNode = {};
		let grid = platformGridAPI.grids.element('id', dataService.gridId).instance;
		let rows = platformGridAPI.rows.getRows(dataService.gridId);

		if (dataService.isVerticalCompareRows()) {
			compareFieldNode.item = quoteItem;
			let compareFieldCol = _.find(grid.getColumns(), function (col) {
				return col.id === quoteKey + '_' + compareField;
			});
			if (compareFieldCol) {
				let index = compareFieldCol._index;
				let targetRow = _.find(rows, function (row) {
					return row.Id === itemKey;
				});
				let rowIndex = _.indexOf(rows, targetRow);
				compareFieldNode.node = grid.getCellNode(rowIndex, index);
			}
			return compareFieldNode;
		}

		let Children = compareType === Constants.compareType.prcItem ? quoteItem.Children : quoteItem.BoqItemChildren;
		if (Children) {
			let compareFieldItem = _.find(Children, function (item) {
				return item.Id === quoteItem.Id + '_' + compareField;
			});
			compareFieldNode.item = compareFieldItem;
			if (compareFieldItem) {
				let index = Children.indexOf(compareFieldItem);
				let activeCell = grid.getActiveCell();
				if (activeCell) {
					compareFieldNode.node = grid.getCellNode(activeCell.row + index, activeCell.cell);
				}
			}
		}
		return compareFieldNode;*/
	}

	public setCompareFieldReadOnly(dataService: object, compareType: CompareTypes, parentItem: object, quoteKey: string, itemKey: string, compareField: string, checked: boolean) {
		/* TODO-DRIZZLE: To be migrated.
		let node = this.getCompareFieldNode(dataService, compareType, parentItem, quoteKey, itemKey, compareField);
		if (node && node.item) {
			// includedNode.node[0].childNodes[0].checked = includeChecked;
			if (dataService.isVerticalCompareRows()) {
				platformRuntimeDataService.readonly(node.item, [{field: quoteKey + '_' + compareField, readonly: checked}]);
			} else {
				platformRuntimeDataService.readonly(node.item, [{field: quoteKey, readonly: checked}]);
			}
		}*/
	}

	public normalizeField(field: string) {
		const specialFields: { [p: string]: string } = {
			'TotalOCGross': 'TotalGrossOc',
			'PriceOCGross': 'PriceGrossOc',
			'TotalPriceOCGross': 'TotalPriceGrossOc',
			'FactoredQuantity': 'QuantityConverted'
		};
		return Object.prototype.hasOwnProperty.call(specialFields, field) ? specialFields[field] : field;
	}

	public assignDecimalPlacesOptions(options: object, specifiedField: string) {
		const normalizedField = this.normalizeField(specifiedField);
		const roundFields = this.materialRoundingSvc.fieldsRoundType;
		return Object.prototype.hasOwnProperty.call(roundFields, normalizedField) ? _.extend({}, options, {
			decimalPlaces: (() => {
				return this.materialRoundingSvc.getDecimalPlaces(normalizedField);
			}).bind(this)
		}) : options;
	}

	public toDictionary<T extends object, KT = number>(items: T[], keySelector: ((item: T) => KT) | string) {
		const map = new Map<KT, { value: T, index: number }>();
		const keyGetter = !_.isFunction(keySelector) ? (item: T) => _.get(item, (keySelector || 'Id')) as KT : keySelector;

		items.forEach((item, index) => {
			const key = keyGetter(item);
			map.set(key, {
				value: item,
				index: index
			});
		});

		return map;
	}

	public shrinkBoqTree(tree: ICompositeBoqEntity[], maxSize: number) {
		/* TODO-DRIZZLE: To be migrated.
		_.each(tree, item => {
			const targets = _.filter(item.BoqItemChildren, child => _.includes([103, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], child.LineTypeFk));
			if (targets.length > maxSize) {
				const results = targets.slice(0, maxSize + 1);
				_.remove(item.BoqItemChildren, child => _.includes([103, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], child.LineTypeFk) && !_.includes(results, child));
			} else {
				this.shrinkBoqTree(item.BoqItemChildren, maxSize);
			}
		});*/
	}

	public stringToFile(text: string, fileName: string, mimeType: string) {
		const blob = new Blob([text], {type: mimeType});
		return new File([blob], fileName, {type: mimeType});
	}

	public uploadLargeObjectAsFile(obj: object, fileName?: string, mineType?: string): Promise<{
		Uuid: string
	}> {
		const text = JSON.stringify(obj);
		const file = this.stringToFile(text, fileName || 'default', mineType || 'text/plain');
		return firstValueFrom(this.simpleUploadSvc.uploadFile(file, {
			basePath: 'procurement/pricecomparison/upload/',
			customRequest: {
				OriginalFileName: file.name
			}
		}));
	}

	public findIndexFromDicCache<T, KT = number>(predicate: (row: T) => boolean, rows: T[], caches: Map<KT, { value: T, index: number }>, keyProp: string) {
		let index = -1;
		const target = _.find(rows, predicate);
		if (target) {
			index = this.findIndexByKeyFromDicCache<T, KT>(_.get(target, keyProp) as KT, caches);
		}
		return index;
	}

	public findIndexByKeyFromDicCache<T, KT = number>(key: KT, caches: Map<KT, { value: T, index: number }>) {
		const cache = caches.get(key);
		return cache ? cache.index : -1;
	}

	public getCostLineTypeId(key: string) {
		return key.split('_').pop();
	}

	public translateTargetOrBaseBoqName(quoteKey: string | number) {
		if (this.bidderIdentityService.isTarget(quoteKey)) {
			return this.getTranslationText('procurement.pricecomparison.RequisitionBasic');
		} else if (this.bidderIdentityService.isBase(quoteKey)) {
			return this.getTranslationText('procurement.pricecomparison.packageBasic');
		} else if (this.bidderIdentityService.isTargetPrice(quoteKey)) {
			return this.getTranslationText('procurement.pricecomparison.compareColumnTarget');
		} else if (this.bidderIdentityService.isMaterialPrice(quoteKey)) {
			return this.getTranslationText('procurement.pricecomparison.CataloguePrice');
		} else {
			return '';
		}
	}

	public getTranslationText(key: Translatable | null | undefined, interpolateParams?: TranslationParamsSource): string {
		return key ? this.translateService.instant(key, interpolateParams).text : '';
	}

	public mergeItemTypes(itemTypes: ICustomItemType[], itemTypes2: ICustomItemType[]) {
		if (itemTypes && itemTypes.length) {
			_.each(itemTypes, (itemType) => {
				itemType.DisplayName = itemType.DescriptionInfo.Translated;
			});
		}

		if (itemTypes2 && itemTypes2.length) {
			_.each(itemTypes2, (itemType) => {
				itemType.DisplayName = itemType.DescriptionInfo.Translated;
			});
		}
	}

	public buildTree<T extends object>(treeItems: T[], idProp: string, parentProp: string, childrenProp: string, startId?: unknown) {
		let parents: T[];

		if (!startId) {
			parents = treeItems.filter(t => {
				return !_.get(t, parentProp);
			});
		} else {
			parents = treeItems.filter(t => {
				return _.get(t, parentProp) === startId;
			});
		}

		parents.forEach(r => {
			const id = _.get(r, idProp);
			const children = this.buildTree(treeItems, idProp, parentProp, childrenProp, id);
			_.set(r, childrenProp, children);
		});

		return parents;
	}

	public extractOriginalFields<T extends ICompositeBaseEntity<T>>(items: T[]) {
		const originalFields: IOriginalField[] = [];
		_.forEach(items, (item) => {
			if (item.OriginalFields) {
				_.forEach(item.OriginalFields, (originalObj) => {
					originalFields.push(originalObj);
				});
			}
		});
		return originalFields;
	}

	public extractBoqHeaderStructures(items: ICompositeBoqEntity[]) {
		const structures: ICustomBoqStructure[] = [];
		_.forEach(items, (item) => {
			if (item.QuoteItems) {
				const targetQuoteItems = _.filter(item.QuoteItems, (quoteItem) => {
					return quoteItem.QuoteKey === BidderIdentities.targetKey;
				});
				_.forEach(targetQuoteItems, function (targetItem) {
					if (targetItem.BoqStructure) {
						structures.push(targetItem.BoqStructure);
					}
				});
			}
		});

		return structures;
	}

	public extractBoqHeaderStructureDetails(items: ICompositeBoqEntity[]) {
		let structureDetails: ICustomBoqStructureDetail[] = [];
		_.forEach(items, (item) => {
			if (item.QuoteItems) {
				const targetQuoteItems = _.filter(item.QuoteItems, (quoteItem) => {
					return quoteItem.QuoteKey === BidderIdentities.targetKey;
				});
				_.forEach(targetQuoteItems, function (targetItem) {
					if (targetItem['BoqStructureDetail']) {
						structureDetails = structureDetails.concat(targetItem['BoqStructureDetail']);
					}
				});
			}
		});

		return structureDetails;
	}

	public concat<T>(targets: T[], sources: T[], distinct?: boolean, equalFn?: (s: T, t: T) => boolean) {
		if (sources && sources.length) {
			sources.forEach(s => {
				if (!distinct || (equalFn && !targets.some(t => equalFn(s, t)))) {
					targets.push(s);
				}
			});
		}
		return targets;
	}

	public getBaseColumns(columns: ICustomCompareColumnEntity[]) {
		return columns.filter(col => this.bidderIdentityService.isReference(col.Id));
	}

	public mergeCostGroupColumns<T extends ICompositeBaseEntity<T>>(costGroupColumns: CompareGridColumn<T>[], configColumns: CompareGridColumn<T>[], columns: CompareGridColumn<T>[], extendFn?: (target: CompareGridColumn<T>) => void) {
		if (costGroupColumns && costGroupColumns.length) {
			const cgConfColumns = _.filter(configColumns, function (col) {
				return _.startsWith(col.id, 'costgroup_');
			});
			const cgSortedColumns = _.sortBy(costGroupColumns, function (cg) {
				const index = _.findIndex(cgConfColumns, {id: cg.id});
				return index !== -1 ? index : cgConfColumns.length + costGroupColumns.length;
			});
			_.each(cgSortedColumns, (item) => {
				const target = _.find(configColumns, {id: item.id});
				let targetItem = _.assign({
					hidden: false
				}, item) as CompareGridColumn<T>;
				if (target) {
					targetItem = _.assign({}, item, {
						width: target.width,
						hidden: target.hidden,
						hide: target.hidden,
						userLabelName: target.userLabelName,
						sortable: target.sortable,
						pinned: target.pinned
					});

					const targetIndex = _.findIndex(configColumns, target);
					if (targetIndex === 0 || _.includes(['indicator', 'tree'], configColumns[targetIndex - 1].id)) {
						columns.unshift(targetItem);
					} else {
						const prevItem = configColumns[targetIndex - 1];
						let nextIndex = -1;

						if (prevItem.id === '_rt$bidder' || _.startsWith(prevItem.id, 'QuoteCol_')) {
							nextIndex = _.findLastIndex(columns, function (col) {
								return _.startsWith(col.id, 'QuoteCol_') || col.id === '_rt$bidder';
							}) + 1;
						} else {
							nextIndex = _.findIndex(columns, function (col) {
								return col.id === prevItem.id;
							}) + 1;
						}
						columns.splice(nextIndex, 0, targetItem);
					}

				} else {
					const cgLastIndex = _.findLastIndex(columns, function (col) {
						return _.startsWith(col.id, 'costgroup_');
					});
					if (cgLastIndex === -1) {
						columns.push(targetItem);
					} else {
						columns.splice(cgLastIndex + 1, 0, targetItem);
					}
				}
				if (_.isFunction(extendFn)) {
					extendFn(targetItem);
				}
			});
		}
	}

	public getIndexForBidder<T extends ICompositeBaseEntity<T>>(configColumns: CompareGridColumn<T>[]) {
		const userColumns = configColumns.filter((col) => {
			return !_.includes(['indicator', 'tree'], col.id);
		});
		const bidderCol = userColumns.find((item) => {
			return item.id === '_rt$bidder' && item.hidden;
		});

		let dynamicCol = userColumns.find((item) => {
			return _.startsWith(item.id, 'QuoteCol_') && item.hidden;
		});

		const firstDynamicCol = userColumns.find((item) => {
			return _.startsWith(item.id, 'QuoteCol_');
		});

		if (dynamicCol && firstDynamicCol) {
			dynamicCol = firstDynamicCol;
		}

		const holderPos = bidderCol ? userColumns.findIndex((item) => {
			return item.id === bidderCol.id;
		}) : (!dynamicCol ? -1 : userColumns.findIndex((item) => {
			return dynamicCol && dynamicCol.id === item.id;
		}));

		return {
			bidderCol: bidderCol,
			holderPos: holderPos
		};
	}

	public checkBidderColumn<T extends ICompositeBaseEntity<T>>(configColumns: CompareGridColumn<T>[], quoteColumns: ICustomCompareColumnEntity[], verticalCompareRows: ICompareRowEntity[], isVerticalCompareRows: boolean) {
		let bidderColumn = _.find(configColumns, {id: '_rt$bidder'});
		let lineValue = bidderColumn && bidderColumn.children ? _.find(bidderColumn.children, {field: 'LineValue'}) : null;
		if (!lineValue) {
			lineValue = _.find(configColumns, {isLineValue: true});
		}

		const visibleColumns: CompareGridColumn<T>[] = verticalCompareRows.map(row => {
			return {
				id: row.Field,
				field: row.Field,
				name: row.FieldName,
				userLabelName: row.UserLabelName,
				name$tr$: '',
				width: 100,
				type: FieldType.Description,
				sortable: false
			};
		});
		visibleColumns.unshift({
			id: 'LineValue',
			field: 'LineValue',
			name: this.getTranslationText('procurement.pricecomparison.lineValue'),
			userLabelName: lineValue ? lineValue.userLabelName : '',
			name$tr$: '',
			width: 100,
			type: FieldType.Description,
			sortable: false
		});

		if (!bidderColumn) {
			bidderColumn = {
				id: '_rt$bidder',
				field: 'Bidder',
				name: 'Bidder',
				name$tr$: this.getTranslationText('procurement.pricecomparison.printing.bidder'),
				hidden: false,
				pinned: false,
				searchable: true,
				sortable: false,
				width: 100 * (verticalCompareRows.length + 1) * quoteColumns.length,
				type: FieldType.Description
			};

			const compareColumns = _.filter(configColumns, function (col) {
				return _.startsWith(col.id, 'QuoteCol_');
			});
			if (compareColumns.length > 0) {
				const visible = _.find(compareColumns, {hidden: true});
				if (visible) {
					bidderColumn.hidden = true;
				}
				const quoteKey = compareColumns[0].id.split('_').slice(0, 4).join('_');
				const groupCols = _.filter(configColumns, function (item) {
					return _.startsWith(item.id, quoteKey);
				});
				if (groupCols.length > 0) {
					_.each(groupCols, function (quoteCol) {
						const terms = (quoteCol.field || quoteCol.id).split('_');
						const field = terms.length === 5 ? terms[4] : 'LineValue';
						const target = _.find(visibleColumns, {field: field});
						if (target && quoteCol.width) {
							target.width = quoteCol.width;
						}
					});
				}
			}
		} else {
			_.extend(bidderColumn, {
				field: 'Bidder',
				name: 'Bidder',
				name$tr$: this.getTranslationText('procurement.pricecomparison.printing.bidder')
			});
		}

		const createChildren = (row: CompareGridColumn<T>, bidderColumn?: CompareGridColumn<T>): CompareGridColumn<T> => {
			return {
				id: bidderColumn?.id + '_' + row.field?.toLowerCase(),
				parentId: bidderColumn?.id,
				field: row.field,
				name: row.name,
				name$tr$: row.name$tr$,
				userLabelName: row.userLabelName,
				hidden: bidderColumn?.hidden || false,
				pinned: bidderColumn?.pinned || false,
				searchable: bidderColumn?.searchable || false,
				sortable: bidderColumn?.sortable || false,
				width: row.width,
				type: FieldType.Description
			};
		};

		if (!bidderColumn.children) {
			bidderColumn.children = _.map(visibleColumns, (row) => {
				return createChildren(row, bidderColumn);
			});
		}

		_.each(bidderColumn.children, function (child) {
			const target = _.find(visibleColumns, {field: child.field});
			if (target) {
				child.name = target.name;
				child.name$tr$ = target.name$tr$;
			}
		});
		_.each(visibleColumns, (row) => {
			if (bidderColumn?.children && !_.some(bidderColumn.children, {field: row.field})) {
				bidderColumn.children.push(createChildren(row, bidderColumn));
			}
		});
		if (!isVerticalCompareRows) {
			_.remove(bidderColumn.children, function (child) {
				return child.field !== 'LineValue';
			});
		} else {
			_.remove(bidderColumn.children, function (child) {
				return !_.some(visibleColumns, {field: child.field});
			});
		}
		bidderColumn.width = _.sumBy(bidderColumn.children, 'width') * quoteColumns.length;

		bidderColumn.children = _.uniqBy(bidderColumn.children, 'id');
		const childrenColumn = bidderColumn.children;

		const lvIndex = childrenColumn.findIndex((c) => {
			return this.isLayoutBidderLineValueColumn(c.id);
		});
		const lvCol = childrenColumn[lvIndex];
		const lvPrevCol = lvIndex > 0 ? childrenColumn[lvIndex - 1] : null;
		const compareColumns = _.filter(childrenColumn, (cCol) => {
			return !this.isLayoutBidderLineValueColumn(cCol.id);
		});

		compareColumns.sort((a, b) => {
			return visibleColumns.findIndex((m) => {
				return m.field === a.field;
			}) - visibleColumns.findIndex((n) => {
				return n.field === b.field;
			});
		});

		const newChildrenColumn = compareColumns;
		if (lvPrevCol) {
			const lvPrevIndex = newChildrenColumn.findIndex(function (p) {
				return p.id === lvPrevCol.id;
			});
			newChildrenColumn.splice(lvPrevIndex + 1, 0, lvCol);
		} else {
			newChildrenColumn.unshift(lvCol);
		}

		bidderColumn.children = newChildrenColumn;

		return bidderColumn;
	}

	public getGridLayoutColumns<T extends ICompositeBaseEntity<T>>(staticColumns: CompareGridColumn<T>[], quoteColumns: ICustomCompareColumnEntity[], verticalCompareRows: ICompareRowEntity[], isVerticalCompareRows: boolean, costGroupColumns: CompareGridColumn<T>[], allConfigColumns: CompareGridColumn<T>[]) {
		const columns: CompareGridColumn<T>[] = [];
		const bidderColumn = this.checkBidderColumn(allConfigColumns, quoteColumns, verticalCompareRows, isVerticalCompareRows);

		// staticColumns.unshift(bidderColumn);
		_.forEach(allConfigColumns, (col) => {
			const colDef = _.find(staticColumns, {id: col.id});
			if (colDef) {
				// some filed can't always use the custom settings in database to avoid not updating when changed in client.
				delete colDef.cssClass;
				colDef.hidden = col.hidden;
				colDef.keyboard = col.keyboard;
				// TODO-DRIZZLE: To be checked.
				//colDef.pinOrder = col.pinOrder;
				colDef.pinned = col.pinned;
				colDef.userLabelName = col.userLabelName;
				colDef.width = col.width;
				const copyCol = _.cloneDeep(colDef);
				copyCol.name = this.getTranslationText(copyCol.name$tr$);
				columns.push(copyCol);
			}
		});

		_.forEach(staticColumns, (staticCol) => {
			const configCol = _.find(columns, {id: staticCol.id});
			if (!configCol) {
				delete staticCol.cssClass;
				const copyStatic = _.cloneDeep(staticCol);
				copyStatic.name = this.getTranslationText(copyStatic.name$tr$);
				if (staticCol.id === bidderColumn.id) {
					columns.unshift(copyStatic);
				} else {
					columns.push(copyStatic);
				}
			}
		});

		allConfigColumns = _.filter(allConfigColumns, (item) => {
			return item && item.id !== 'tree';
		});
		const holder = this.getIndexForBidder(allConfigColumns);
		columns.splice(holder.holderPos, 0, bidderColumn);

		// Cost Group
		this.mergeCostGroupColumns(costGroupColumns, allConfigColumns, columns);

		return columns;
	}

	public propCompletion(target: unknown, source: unknown) {
		if (!_.isUndefined(target) && !_.isUndefined(source) && _.isObject(source) && _.isObject(target)) {
			for (const prop in source) {
				if (Object.prototype.hasOwnProperty.call(source, prop)) {
					if (!Object.prototype.hasOwnProperty.call(target, prop)) {
						_.set(target, prop, _.cloneDeep(_.get(source, prop)));
					} else {
						this.propCompletion(_.get(target, prop), _.get(source, prop));
					}
				}
			}
		}
	}

	public assignPercentDeviation(compareRows: ICompareRowEntity[]) {
		const percentage = _.find(compareRows, {Field: CompareFields.percentage});
		const discountAbsolute = _.find(compareRows, {Field: CompareFields.absoluteDifference});
		if (percentage && discountAbsolute) {
			percentage.DeviationField = discountAbsolute.DeviationField;
			percentage.DeviationPercent = discountAbsolute.DeviationPercent;
			percentage.DeviationReference = discountAbsolute.DeviationReference;
		}
	}

	public parseTemplate(template: string, contextData: object): string {
		if (contextData && template) {
			for (const name in contextData) {
				if (Object.prototype.hasOwnProperty.call(contextData, name)) {
					const regPattern = name.replace('[', '\\[').replace(']', '\\]');
					template = template.replace(new RegExp(regPattern, 'gi'), _.get(contextData, name));
				}
			}
		}
		return template;
	}

	public calculateAverageValue(values: number[]) {
		let total = 0;
		_.forEach(values, (value) => {
			total += value;
		});

		return values.length > 0 ? total / values.length : 0;
	}

	public getPrintPaperWidth(paperSize: number, orientation: string, useDpi?: number) {
		const constants = ComparePrintConstants;
		const currDpi = useDpi || constants.screenDpi.D72;
		const currOrientation = orientation.toString();
		const portrait = constants.orientation.portrait.toString();
		let width: number;
		if (paperSize === constants.paperSize.A4) {
			width = currOrientation === portrait ? constants.paperSizeWidth.A4_portrait : constants.paperSizeWidth.A4_landscape;
		} else if (paperSize === constants.paperSize.A3) {
			width = currOrientation === portrait ? constants.paperSizeWidth.A3_portrait : constants.paperSizeWidth.A3_landscape;
		} else {
			width = currOrientation === portrait ? constants.paperSizeWidth.letter_portrait : constants.paperSizeWidth.letter_landscape;
		}
		return width * currDpi;
	}

	public isOptionalWithoutITSummaryField(boqLineType: number) {
		return _.includes([
			CompareRowTypes.summaryOptionalWITTotal,
			CompareRowTypes.summaryOptionalWITABS,
			CompareRowTypes.summaryOptionalWITPercent,
			CompareRowTypes.summaryOptionalWITDiscountTotal
		], boqLineType);
	}

	public combinedMaxMin(currentItem: IExtendableObject, childrenItem: IExtendableObject[]) {
		currentItem[Constants.maxValueIncludeTarget] = _.sumBy(childrenItem, Constants.maxValueIncludeTarget) || 0;
		currentItem[Constants.minValueIncludeTarget] = _.sumBy(childrenItem, Constants.minValueIncludeTarget) || 0;
		currentItem[Constants.maxValueExcludeTarget] = _.sumBy(childrenItem, Constants.maxValueExcludeTarget) || 0;
		currentItem[Constants.minValueExcludeTarget] = _.sumBy(childrenItem, Constants.minValueExcludeTarget) || 0;
	}

	public getOwnQuoteKey(qtnMatchCache: Map<number, ICustomQuoteItemBase[]>, field: string, rfqHeaderId: number) {
		const qtnMatch = qtnMatchCache.get(rfqHeaderId);
		const itemConfig = qtnMatch ? qtnMatch.find((item) => {
			return item.QuoteKey === field && item.OwnQuoteKey;
		}) : null;

		return itemConfig ? itemConfig.OwnQuoteKey : field;
	}

	public getQuoteId(quoteKey: string, defValue: number = -1) {
		if (quoteKey && _.includes(quoteKey, Constants.columnFieldSeparator)) {
			return _.parseInt(quoteKey.split(Constants.columnFieldSeparator)[1]);
		}
		return defValue;
	}

	public recalculateValue(item: IExtendableObject, totalValues: number[], totalValuesExcludeTarget: number[]) {
		item[Constants.maxValueIncludeTarget] = _.max(totalValues) || 0;
		item[Constants.minValueIncludeTarget] = _.min(totalValues) || 0;
		item[Constants.averageValueIncludeTarget] = this.calculateAverageValue(totalValues) || 0;
		item[Constants.maxValueExcludeTarget] = _.max(totalValuesExcludeTarget) || 0;
		item[Constants.minValueExcludeTarget] = _.min(totalValuesExcludeTarget) || 0;
		item[Constants.averageValueExcludeTarget] = this.calculateAverageValue(totalValuesExcludeTarget) || 0;
	}

	public collectEvalValue(compareColumns: ICustomCompareColumnEntity[], rfqHeaderId: number) {
		const totalValues: number[] = []; // store quote values for bidders (including Target)
		let totalValuesExcludeTarget: number[] = [];  // store quote values for bidders (Exclude Target)

		_.forEach(compareColumns, (item) => {
			if (this.bidderIdentityService.isTarget(item.Id)) {
				if (item.IsCountInTarget) {
					totalValues.push(item.EvaluationResult);
				}
			} else if (item.RfqHeaderId === rfqHeaderId && this.bidderIdentityService.isNotReference(item.Id)) {
				if (item.IsCountInTarget) {
					totalValues.push(item.EvaluationResult);
				}
				totalValuesExcludeTarget.push(item.EvaluationResult);
			} else if (item.RfqHeaderId !== rfqHeaderId && item.Children && item.Children.length > 0 && this.bidderIdentityService.isNotReference(item.Id)) {
				const child = _.find(item.Children, {RfqHeaderId: rfqHeaderId});
				if (item.IsCountInTarget) {
					totalValues.push(child ? child.EvaluationResult : 0);
				}
				totalValuesExcludeTarget.push(child ? child.EvaluationResult : 0);
			}
		});

		// sort by ascending for calculate rank.
		totalValuesExcludeTarget = _.reverse(_.sortBy(totalValuesExcludeTarget));

		return {
			totalValues: totalValues,
			excludeTarget: totalValuesExcludeTarget
		};
	}

	public evalResultStructure<T extends ICompositeBaseEntity<T>>(rfqHeaderId: number, baseCol: ICustomCompareColumnEntity, newRow: T, totalValuesExcludeTarget: number[]) {
		if (this.bidderIdentityService.isNotReference(baseCol.Id)) {
			if (baseCol.RfqHeaderId === rfqHeaderId) {
				_.set(newRow, baseCol.Id, Math.round((baseCol.EvaluationResult || 0) * 100) / 100);
			} else if (baseCol.RfqHeaderId !== rfqHeaderId && !!baseCol.Children && baseCol.Children.length > 0) {
				const child = _.find(baseCol.Children, {RfqHeaderId: rfqHeaderId});
				_.set(newRow, baseCol.Id, Math.round(((child ? child.EvaluationResult || 0 : 0)) * 100) / 100);
			} else {
				_.set(newRow, baseCol.Id, Math.round(0) / 100);
			}
		} else {
			_.set(newRow, baseCol.Id, Math.round(0) / 100);
		}
		newRow.totalArray = totalValuesExcludeTarget;
	}

	public evalRankStructure<T extends ICompositeBaseEntity<T>>(rfqHeaderId: number, baseCol: ICustomCompareColumnEntity, newRow: T, totalValuesExcludeTarget: number[]) {
		let rank = 0;
		if (this.bidderIdentityService.isNotReference(baseCol.Id)) {
			if (baseCol.RfqHeaderId === rfqHeaderId) {
				rank = _.indexOf(totalValuesExcludeTarget, baseCol.EvaluationResult);
				_.set(newRow, baseCol.Id, rank + 1);
			} else if (baseCol.RfqHeaderId !== rfqHeaderId && !!baseCol.Children && baseCol.Children.length > 0) {
				const child = _.find(baseCol.Children, {RfqHeaderId: rfqHeaderId});
				rank = _.indexOf(totalValuesExcludeTarget, (child ? child.EvaluationResult || 0 : 0));
				_.set(newRow, baseCol.Id, rank + 1);
			} else {
				rank = _.indexOf(totalValuesExcludeTarget, 0);
				_.set(newRow, baseCol.Id, rank + 1);
			}
		}
	}

	public evalTurnover<T extends ICompositeBaseEntity<T>>(
		newRow: T,
		columnId: string,
		businessPartnerId: number,
		isIdealBidder: boolean,
		turnovers: Array<{
			Id: number,
			Turnover: number
		}>) {
		if (isIdealBidder || this.bidderIdentityService.isReference(columnId)) {
			return;
		}
		const tmpProp = '_totals';
		const item = _.find(turnovers, {Id: businessPartnerId});
		if (item) {
			_.set(newRow, columnId, item.Turnover);
			let tempTotal = _.get(newRow, tmpProp) as { [p: number]: number };
			if (!newRow.totalArray) {
				newRow.totalArray = [];
			}
			if (!tempTotal) {
				tempTotal = {} as { [p: number]: number };
				_.set(newRow, tmpProp, tempTotal);
			}
			if (_.isUndefined(tempTotal[businessPartnerId])) {
				tempTotal[businessPartnerId] = item.Turnover;
				newRow.totalArray.push(item.Turnover);
			}
		}
	}

	public evalAvgEvaluationValue<T extends ICompositeBaseEntity<T>>(
		newRow: T,
		columnId: string,
		field: string,
		businessPartnerId: number,
		isIdealBidder: boolean,
		avgEvaluations: Array<{
			Id: number,
			AvgEvaluationA: number | null,
			AvgEvaluationB: number | null,
			AvgEvaluationC: number | null
		}>
	) {
		if (isIdealBidder || this.bidderIdentityService.isReference(columnId)) {
			return;
		}
		const tmpProp = '_totals';
		const item = _.find(avgEvaluations, {Id: businessPartnerId});
		if (item) {
			const value = _.get(item, field);
			_.set(newRow, columnId, !_.isNil(value) ? value : 0);
			let tempTotal = _.get(newRow, tmpProp) as { [p: number]: number };
			if (!newRow.totalArray) {
				newRow.totalArray = [];
			}
			if (!tempTotal) {
				tempTotal = {} as { [p: number]: number };
				_.set(newRow, tmpProp, tempTotal);
			}
			if (_.isUndefined(tempTotal[businessPartnerId])) {
				tempTotal[businessPartnerId] = value;
				newRow.totalArray.push(value);
			}
		}
	}

	public evalAvgEvaluationRank<T extends ICompositeBaseEntity<T>>(
		newRow: T,
		columnId: string,
		compareColumns: ICustomCompareColumnEntity[],
		quoteCompareRows: ICompareRowEntity[],
		isIdealBidder: boolean,
		avgEvaluations: Array<{
			Id: number,
			AvgEvaluationA: number | null,
			AvgEvaluationB: number | null,
			AvgEvaluationC: number | null
		}>
	) {
		if (isIdealBidder || this.bidderIdentityService.isReference(columnId)) {
			return;
		}
		const tmpProp = '_totals';
		const avgEvaluationFields = _.filter(quoteCompareRows, row => {
			return _.includes([
				CompareFields.avgEvaluationA,
				CompareFields.avgEvaluationB,
				CompareFields.avgEvaluationC
			], row.Field);
		});
		if (!_.isEmpty(avgEvaluationFields)) {
			if (!_.get(newRow, tmpProp)) {
				const filterQuotes = _.filter(compareColumns, col => {
					return !this.bidderIdentityService.isReference(col.Id) && !col.IsIdealBidder;
				});
				const totals = _.map(filterQuotes, col => {
					const item = _.find(avgEvaluations, {Id: col.BusinessPartnerId});
					const total = item ? _.sumBy(avgEvaluationFields, avgField => {
						const avgValue = _.get(item, avgField.Field);
						return !_.isNil(avgValue) ? avgValue : 0;
					}) : 0;
					return {
						Id: col.Id,
						Total: total
					};
				});
				const sortedTotals = _.sortBy(totals, 'Total').reverse();
				const value = _.reduce(sortedTotals, (result: Array<{ Id: string, Total: number, Rank: number }>, curr, index) => {
					if (_.isEmpty(result)) {
						result.push(_.extend(curr, {
							Rank: index + 1
						}));
					} else {
						const prev = result[result.length - 1];
						if (curr.Total === prev.Total) {
							result.push(_.extend(curr, {
								Rank: prev.Rank
							}));
						} else {
							result.push(_.extend(curr, {
								Rank: prev.Rank + 1
							}));
						}
					}
					return result;
				}, []);
				_.set(newRow, tmpProp, value);
			}
			const tmpTotals = _.get(newRow, tmpProp) as Array<{ Id: string; Rank: number }>;
			const rank = _.find(tmpTotals, {Id: columnId})?.Rank;
			_.set(newRow, columnId, rank);
		}
	}

	public getColumnValuesForQuoteCompareFieldRows(quotes: IQuoteHeaderEntity[], rfqHeaderId: number, qtnHeaderId: number, quoteKey: string, quoteProperty: string) {
		const originalItem = _.find(quotes, {Id: qtnHeaderId});
		// set exchange rate
		if (originalItem) {
			this.exchangeRateSvc.setExchangeRate(rfqHeaderId, qtnHeaderId, quoteKey, originalItem.ExchangeRate, originalItem.CurrencyFk);
		}
		return originalItem ? _.get(originalItem, quoteProperty) as string : '';
	}

	public setQuoteRowValueForLineType<T extends ICompositeBaseEntity<T>>(quoteRow: ICompareRowEntity, newRow: T) {
		switch (quoteRow.Field) {
			case CompareFields.code:
				newRow.LineTypeFk = CompareRowTypes.quoteCode;
				break;
			case CompareFields.description:
				newRow.LineTypeFk = CompareRowTypes.quoteDescription;
				break;
			case CompareFields.receiveDate:
				newRow.LineTypeFk = CompareRowTypes.receiveDate;
				break;
			case CompareFields.priceFixingDate:
				newRow.LineTypeFk = CompareRowTypes.priceFixingDate;
				break;
			case CompareFields.quoteDate:
			case CompareFields.userDefinedDate01:
				newRow.LineTypeFk = CompareRowTypes.quoteDate;
				break;
			case CompareFields.quoteStatus:
				newRow.LineTypeFk = CompareRowTypes.quoteStatus;
				break;
			case CompareFields.quoteVersion:
				newRow.LineTypeFk = CompareRowTypes.quoteVersion;
				break;
			case CompareFields.exchangeRate:
				newRow.LineTypeFk = CompareRowTypes.quoteExchangeRate;
				break;
			case CompareFields.currency:
				newRow.LineTypeFk = CompareRowTypes.quoteCurrency;
				break;
			case CompareFields.incoterms:
				newRow.LineTypeFk = CompareRowTypes.incoterms;
				break;
			case CompareFields.paymentTermFI:
				newRow.LineTypeFk = CompareRowTypes.quotePaymentTermFI;
				break;
			case CompareFields.paymentTermPA:
				newRow.LineTypeFk = CompareRowTypes.quotePaymentTermPA;
				break;
			case CompareFields.paymentTermFIDesc:
				newRow.LineTypeFk = CompareRowTypes.quotePaymentTermFIDesc;
				break;
			case CompareFields.paymentTermPADesc:
				newRow.LineTypeFk = CompareRowTypes.quotePaymentTermPADesc;
				break;
			case CompareFields.evaluationRank:
				newRow.LineTypeFk = CompareRowTypes.evaluationRank;
				break;
			case CompareFields.evaluationResult:
				newRow.LineTypeFk = CompareRowTypes.evaluationResult;
				break;
			case CompareFields.quoteUserDefined1:
			case CompareFields.quoteUserDefined2:
			case CompareFields.quoteUserDefined3:
			case CompareFields.quoteUserDefined4:
			case CompareFields.quoteUserDefined5:
				newRow.LineTypeFk = CompareRowTypes.quoteUserDefined;
				break;
			case CompareFields.remark:
				newRow.LineTypeFk = CompareRowTypes.quoteRemark;
				break;
			case CompareFields.overallDiscount:
				newRow.LineTypeFk = CompareRowTypes.overallDiscount;
				break;
			case CompareFields.overallDiscountOc:
				newRow.LineTypeFk = CompareRowTypes.overallDiscountOc;
				break;
			case CompareFields.overallDiscountPercent:
				newRow.LineTypeFk = CompareRowTypes.overallDiscountPercent;
				break;
			case CompareFields.turnover:
				newRow.LineTypeFk = CompareRowTypes.turnover;
				break;
			case CompareFields.avgEvaluationA:
				newRow.LineTypeFk = CompareRowTypes.avgEvaluationA;
				break;
			case CompareFields.avgEvaluationB:
				newRow.LineTypeFk = CompareRowTypes.avgEvaluationB;
				break;
			case CompareFields.avgEvaluationC:
				newRow.LineTypeFk = CompareRowTypes.avgEvaluationC;
				break;
			case CompareFields.avgEvaluationRank:
				newRow.LineTypeFk = CompareRowTypes.avgEvaluationRank;
				break;
			case CompareFields.discountBasis:
				newRow.LineTypeFk = CompareRowTypes.discountBasis;
				break;
			case CompareFields.discountBasisOc:
				newRow.LineTypeFk = CompareRowTypes.discountBasisOc;
				break;
			case CompareFields.percentDiscount:
				newRow.LineTypeFk = CompareRowTypes.percentDiscount;
				break;
			case CompareFields.discountAmount:
				newRow.LineTypeFk = CompareRowTypes.discountAmount;
				break;
			case CompareFields.discountAmountOc:
				newRow.LineTypeFk = CompareRowTypes.discountAmountOc;
				break;
			default:
				break;
		}
	}

	public checkHighlightQtn(compareColumnsCache: ICustomCompareColumnEntity[], quoteItems?: ICustomQuoteItemBase[]) {
		const differentFields: {
			[p: string]: unknown
		} = {};
		const differentNumbers: {
			[p: string]: number
		} = {};
		if (!compareColumnsCache || !quoteItems) {
			return differentFields;
		}
		compareColumnsCache.forEach((col) => {
			if (col.IsHighlightChanges === true) {
				const quoteItem = quoteItems.find(e => e.QuoteKey === col.Id);
				if (quoteItem) {
					HighlightFields.forEach((field) => {
						const tempField = differentNumbers[field];
						if ((tempField || tempField === 0) && tempField !== (quoteItem[field] as number)) {
							differentFields[field] = false;
						}
						if ((!tempField && tempField !== 0)) {
							differentNumbers[field] = quoteItem[field] as number;
						}
					});
				}
			}
			if (col.IsDeviationRef === true && !col.CompareColumnFk) {
				differentFields['markFieldQtn'] = col.Id;
			}
		});

		return differentFields;
	}

	public getSelectedLookupMes(id?: number | null) {
		let result = '';
		switch (id) {
			case 3:
				result = BidderIdentities.baseBoqKey;
				break;
			case 4:
			case 10:
			case 11:
				result = BidderIdentities.targetKey;
				break;
			case 5:
				result = Constants.averageValueExcludeTarget;
				break;
			case 6:
				result = Constants.minValueExcludeTarget;
				break;
			case 7:
				result = Constants.maxValueExcludeTarget;
				break;
			case 100:
				result = Constants.deviationColumn;
				break;
		}
		return result;
	}

	public getBasicQuote<T extends ICompositeBaseEntity<T>>(
		parentItem: T,
		visibleRow: ICompareRowEntity,
		quoteKey: string,
		markFieldQtn: string,
		leadingField: string,
		totalFieldFn: () => string,
		isBoqLevelRow?: boolean
	): {
		absoluteDifference: number | string,
		basicPercentage: number | string
	} {
		if (this.bidderIdentityService.isReference(quoteKey)) {
			return {
				absoluteDifference: Constants.tagForNoQuote,
				basicPercentage: Constants.tagForNoQuote
			};
		}

		if (!_.includes(ValuableLeadingFields, leadingField)) {
			return {
				absoluteDifference: 0,
				basicPercentage: 0
			};
		}

		const indexStr = this.getSelectedLookupMes(visibleRow.DeviationReference as number);
		const currentQuoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey});
		let absoluteDifference: number | string = 0;
		let basicPercentage = 0;
		let basicFieldValue: number | undefined = 0;
		let basicQuoteKey = markFieldQtn;
		const quoteItemsExclude = _.filter(parentItem.QuoteItems, (item) => {
			return this.bidderIdentityService.isNotReference(item.QuoteKey) && !item.IsIdealBidder;
		});
		let deviationField = leadingField;
		// select 'Is Deviation Reference' bidder as the Basic Quote, Leading Field is 'Price'
		if (indexStr === Constants.deviationColumn && !!markFieldQtn) {
			const qtnItem = _.find(parentItem.QuoteItems, {QuoteKey: markFieldQtn});
			basicFieldValue = qtnItem ? qtnItem[deviationField] as number : 0;

			if (parentItem.LineTypeFk === CompareRowTypes.requisition) {
				const totalValue = _.sumBy(_.filter(parentItem.QuoteItems, {QuoteKey: quoteKey}), deviationField);
				absoluteDifference = totalValue - basicFieldValue;
				if (basicFieldValue) {
					basicPercentage = totalValue / basicFieldValue * 100;
				}
			} else {
				absoluteDifference = (currentQuoteItem ? currentQuoteItem[deviationField] as number : 0) - basicFieldValue;
				if (basicFieldValue) {
					basicPercentage = (currentQuoteItem ? currentQuoteItem[deviationField] as number : 0) / basicFieldValue * 100;
				}
			}
		} else if (indexStr) {
			switch (visibleRow.DeviationReference) {
				case 10:
					deviationField = CompareFields.price;
					break;
				case 11: {
					deviationField = totalFieldFn();
					break;
				}
				default:
					break;
			}
			// select the min, leading field is DeviationReference as Basic Quote
			// (DeviationReference => baseBoqKey,targetKey,averageValueExcludeTarget,minValueExcludeTarget,maxValueExcludeTarget)
			basicFieldValue = this.getDeviationRefByIndexStr(parentItem, visibleRow, markFieldQtn, leadingField, isBoqLevelRow, indexStr);

			if (parentItem.LineTypeFk === CompareRowTypes.requisition) {
				const totalValue = _.sumBy(_.filter(parentItem.QuoteItems, {QuoteKey: quoteKey}), deviationField);
				absoluteDifference = totalValue - (basicFieldValue as number);
				if (basicFieldValue) {
					basicPercentage = totalValue / (basicFieldValue as number) * 100;
				}
			} else {
				absoluteDifference = (currentQuoteItem ? currentQuoteItem[deviationField] as number : 0) - (basicFieldValue as number);
				if (basicFieldValue) {
					basicPercentage = (currentQuoteItem ? currentQuoteItem[deviationField] as number : 0) / (basicFieldValue as number) * 100;
				}
			}
		} else {
			// the old leading field logic,select the min, leading field(checkbox) as Basic Quote
			const minLeadingFieldItem = _.minBy(quoteItemsExclude, deviationField);
			if (minLeadingFieldItem) {
				basicQuoteKey = minLeadingFieldItem.QuoteKey;
				basicFieldValue = minLeadingFieldItem[deviationField] as number;

				if (parentItem.LineTypeFk === CompareRowTypes.requisition) {
					const totalValue = _.sumBy(_.filter(parentItem.QuoteItems, {QuoteKey: quoteKey}), deviationField);
					absoluteDifference = totalValue - basicFieldValue;
					if (basicFieldValue) {
						basicPercentage = totalValue / basicFieldValue * 100;
					}
				} else {
					absoluteDifference = (currentQuoteItem ? currentQuoteItem[deviationField] as number : 0) - basicFieldValue;
					if (basicFieldValue) {
						basicPercentage = (currentQuoteItem ? currentQuoteItem[deviationField] as number : 0) / basicFieldValue * 100;
					}
				}
			}
		}

		if (basicQuoteKey === quoteKey) {
			absoluteDifference = Constants.tagForNoQuote;
		}
		return {
			absoluteDifference: absoluteDifference,
			basicPercentage: basicPercentage
		};
	}

	public showUrbData<T extends ICompositeBaseEntity<T>>(parentItem: T, urbField: string) {
		const urbHasFlag = _.find(parentItem.QuoteItems, {IsUrb: true});
		if (urbHasFlag) {
			const urbNotEqualZero = _.find(parentItem.QuoteItems, function (qtnItem) {
				return qtnItem[urbField] !== null && qtnItem[urbField] !== 0;
			});
			return !!urbNotEqualZero;
		}
		return false;
	}

	public getBoqHeaderStructureWithNameUrb(structures: ICustomBoqStructure[]) {
		return structures.find((item) => {
			return item.NameUrb1 || item.NameUrb2 || item.NameUrb3 || item.NameUrb4 || item.NameUrb5 || item.NameUrb6;
		});
	}

	public extendCompareRowWithStructureUrb(rows: ICompareRowEntity[], boqStructure?: ICustomBoqStructure) {
		if (!boqStructure) {
			return rows;
		}

		rows.forEach((item) => {
			if (UnitRateBreakDownFields.includes(item.Field)) {
				switch (item.Field) {
					case  CompareFields.urBreakdown1:
						item.DisplayName = boqStructure.NameUrb1 ? (item.UserLabelName || boqStructure.NameUrb1) : item.DisplayName;
						item.FieldName = boqStructure.NameUrb1 ? boqStructure.NameUrb1 : item.FieldName;
						break;
					case  CompareFields.urBreakdown2:
						item.DisplayName = boqStructure.NameUrb2 ? (item.UserLabelName || boqStructure.NameUrb2) : item.DisplayName;
						item.FieldName = boqStructure.NameUrb2 ? boqStructure.NameUrb2 : item.FieldName;
						break;
					case  CompareFields.urBreakdown3:
						item.DisplayName = boqStructure.NameUrb3 ? (item.UserLabelName || boqStructure.NameUrb3) : item.DisplayName;
						item.FieldName = boqStructure.NameUrb3 ? boqStructure.NameUrb3 : item.FieldName;
						break;
					case  CompareFields.urBreakdown4:
						item.DisplayName = boqStructure.NameUrb4 ? (item.UserLabelName || boqStructure.NameUrb4) : item.DisplayName;
						item.FieldName = boqStructure.NameUrb4 ? boqStructure.NameUrb4 : item.FieldName;
						break;
					case  CompareFields.urBreakdown5:
						item.DisplayName = boqStructure.NameUrb5 ? (item.UserLabelName || boqStructure.NameUrb5) : item.DisplayName;
						item.FieldName = boqStructure.NameUrb5 ? boqStructure.NameUrb5 : item.FieldName;
						break;
					case  CompareFields.urBreakdown6:
						item.DisplayName = boqStructure.NameUrb6 ? (item.UserLabelName || boqStructure.NameUrb6) : item.DisplayName;
						item.FieldName = boqStructure.NameUrb6 ? boqStructure.NameUrb6 : item.FieldName;
						break;
				}
			}
		});
		return rows;
	}

	public getStructureUrbDisplayName(field: string, altName?: string, structure?: ICustomBoqStructure) {
		let displayName = altName;
		switch (field) {
			case CompareFields.urBreakdown1:
				displayName = (structure && structure.NameUrb1) ? structure.NameUrb1 : altName;
				break;
			case CompareFields.urBreakdown2:
				displayName = (structure && structure.NameUrb2) ? structure.NameUrb2 : altName;
				break;
			case CompareFields.urBreakdown3:
				displayName = (structure && structure.NameUrb3) ? structure.NameUrb3 : altName;
				break;
			case CompareFields.urBreakdown4:
				displayName = (structure && structure.NameUrb4) ? structure.NameUrb4 : altName;
				break;
			case CompareFields.urBreakdown5:
				displayName = (structure && structure.NameUrb5) ? structure.NameUrb5 : altName;
				break;
			case CompareFields.urBreakdown6:
				displayName = (structure && structure.NameUrb6) ? structure.NameUrb6 : altName;
				break;
		}
		return displayName as string;
	}

	public getAllTextComplement(quoteItems: ICustomBoqItem[]) {
		const textComplement: IBoqTextComplementEntity[] = [];
		if (!quoteItems) {
			return textComplement;
		}
		_.forEach(quoteItems, (item) => {
			_.forEach(item.TextComplement, (text) => {
				const findText = _.find(textComplement, {ComplCaption: text.ComplCaption});
				if (!findText) {
					textComplement.push(text);
				}
			});
		});
		return textComplement;
	}

	public getDeviationRefByIndexStr<T extends ICompositeBaseEntity<T>>(
		parentItem: T,
		visibleRow: ICompareRowEntity,
		markFieldQtn: string,
		leadingField: string,
		isBoqLevelRow?: boolean,
		indexStr?: string
	): number | undefined {
		let basicFieldValue: number | undefined = undefined;
		const budgetPerUnit = CompareFields.budgetPerUnit;
		const budgetTotal = CompareFields.budgetTotal;
		if (this.bidderIdentityService.isReference(indexStr)) {
			const noBidderItems = _.filter(parentItem.QuoteItems, {QuoteKey: indexStr});
			switch (visibleRow.DeviationReference) {
				case 4:
					basicFieldValue = noBidderItems ? _.sumBy(noBidderItems, leadingField) : 0;
					break;
				case 10:
					basicFieldValue = noBidderItems ? _.sumBy(noBidderItems, budgetPerUnit) : 0;
					break;
				case 11: {
					basicFieldValue = noBidderItems ? _.sumBy(noBidderItems, budgetTotal) : 0;
					break;
				}
				default:
					break;
			}
		} else {
			const quoteItemsExclude = _.filter(parentItem.QuoteItems, (item) => {
				return this.bidderIdentityService.isNotReference(item.QuoteKey) && !item.IsIdealBidder;
			});
			const priceValuesExclude = _.map(quoteItemsExclude, leadingField) as number[];
			if (indexStr === Constants.averageValueExcludeTarget) {
				if (parentItem.LineTypeFk === CompareRowTypes.requisition) {
					basicFieldValue = parentItem[Constants.averageValueExcludeTarget] ? parentItem[Constants.averageValueExcludeTarget] as number : 0;
				} else {
					basicFieldValue = this.calculateAverageValue(priceValuesExclude);
				}
			} else if (indexStr === Constants.minValueExcludeTarget) {
				basicFieldValue = parentItem.LineTypeFk === CompareRowTypes.requisition ? basicFieldValue = _.min(parentItem.totalValuesExcludeTarget) : basicFieldValue = _.min(priceValuesExclude);
			} else if (indexStr === Constants.maxValueExcludeTarget) {
				basicFieldValue = parentItem.LineTypeFk === CompareRowTypes.requisition ? basicFieldValue = _.max(parentItem.totalValuesExcludeTarget) : basicFieldValue = _.max(priceValuesExclude);
			}
		}

		return basicFieldValue;
	}

	public highlightRows<T extends ICompositeBaseEntity<T>>(
		parentItem: T,
		newRow: T,
		visibleRow: ICompareRowEntity,
		deviationFields: string[],
		fieldKeys: string[],
		markFieldQtn: string,
		leadingField: string,
		totalFieldFn: () => string,
		isBoqLevelRow?: boolean
	) {
		if (newRow && _.includes(deviationFields, visibleRow.Field) && visibleRow.DeviationField) {
			let deviationRef: number | undefined = undefined;
			const indexStr = this.getSelectedLookupMes(visibleRow.DeviationReference as number);

			if (indexStr === Constants.deviationColumn && !!markFieldQtn) {
				if (visibleRow.Field === CompareFields.percentage) {
					if (newRow.percentages) {
						deviationRef = newRow.percentages[markFieldQtn] as number;
					} else {
						deviationRef = newRow[markFieldQtn] as number;
					}
				} else if (visibleRow.Field === CompareFields.absoluteDifference) {
					deviationRef = 0;
				} else {
					const qtnItem = _.find(parentItem.QuoteItems, {QuoteKey: markFieldQtn});
					deviationRef = qtnItem ? qtnItem[visibleRow.Field] as number : undefined;
				}
			} else {
				let deviationField = visibleRow.Field;
				if (visibleRow.Field === CompareFields.absoluteDifference || visibleRow.Field === CompareFields.percentage) {
					deviationField = leadingField;
					switch (visibleRow.DeviationReference) {
						case 10:
							deviationField = CompareFields.price;
							break;
						case 11: {
							deviationField = totalFieldFn();
							break;
						}
						default:
							break;
					}
				}
				deviationRef = this.getDeviationRefByIndexStr(parentItem, visibleRow, markFieldQtn, deviationField, isBoqLevelRow, indexStr);
			}

			if (!!deviationRef || deviationRef === 0) {
				let minDeviation = (deviationRef as number) * (1 - (visibleRow.DeviationPercent as number) / 100);
				let maxDeviation = (deviationRef as number) * (1 + (visibleRow.DeviationPercent as number) / 100);
				// deal with the case when the deviationRef is negative value
				if (minDeviation > maxDeviation) {
					const tempDeviation = maxDeviation;
					maxDeviation = minDeviation;
					minDeviation = tempDeviation;
				}
				_.forIn(newRow, (val, key) => {
					if (_.includes(fieldKeys, key)) {
						let rowValue: number = val as number;
						if (visibleRow.Field === CompareFields.absoluteDifference) {
							rowValue = (deviationRef as number) + (val as number);
						} else if (visibleRow.Field === CompareFields.percentage) {
							rowValue = (deviationRef as number) * (val as number) / 100;
						}
						_.set(newRow, key + Constants.deviationRow, (rowValue < minDeviation || rowValue > maxDeviation));
					}
				});
			}
		}
	}

	public mergeCompareRows(basicsRows: ICompareRowEntity[], customRows: ICompareRowEntity[]) {
		customRows.forEach((item) => {
			const basicsRow = basicsRows.find(e => e.Field === item.Field);
			if (basicsRow) {
				item.DefaultDescription = basicsRow.DefaultDescription;
				item.UserLabelName = basicsRow.UserLabelName;
				item.FieldName = basicsRow.FieldName;
				item.DescriptionInfo = _.cloneDeep(basicsRow.DescriptionInfo);
				item.DisplayName = basicsRow.DisplayName;
			}
		});
		const newRows: ICompareRowEntity[] = [];
		basicsRows.forEach((basicsRow) => {
			const customRow = customRows.find(e => e.Field === basicsRow.Field);
			if (!customRow) {
				newRows.push(_.cloneDeep(basicsRow));
			}
		});

		if (newRows.length) {
			customRows.push(...newRows);
		}

		return customRows.sort((a, b) => a.Sorting - b.Sorting);
	}

	public async reloadNewVersion(baseRfqId: number, compareType: CompareTypes, quoteHeaderNews?: IQuoteHeaderEntity[], qtnIds?: number[], callback?: () => void) {
		if (quoteHeaderNews && quoteHeaderNews.length > 0) {
			const compareColumns: ICustomCompareColumnEntity[] = [];
			const biznessPartners = this.bpLookupSvc.syncService?.getListSync();
			let newItemId = Constants.newCustomColumnVale;
			_.forEach(quoteHeaderNews, (quoteHeaderNew) => {
				const biznessPartner = _.find(biznessPartners, {Id: quoteHeaderNew.BusinessPartnerFk});
				const newItem: ICustomCompareColumnEntity = {
					BillingSchemaList: [],
					BusinessPartnerFk: 0,
					CompareColumnFk: '',
					Description: '',
					EvaluationList: [],
					EvaluationResult: 0,
					IsCountInTarget: false,
					IsDeviationRef: false,
					IsHighlightChanges: false,
					IsIdealBidder: false,
					QuoteHeaderId: 0,
					QuoteVersion: 0,
					RfqHeaderId: 0,
					QtnHeaderFk: quoteHeaderNew.Id,
					Visible: true,
					BusinessPartnerId: quoteHeaderNew.BusinessPartnerFk,
					Children: [],
					Id: newItemId.toString(),
					DescriptionInfo: {
						Translated: biznessPartner ? biznessPartner.BusinessPartnerName1 ?? '' : '',
						Description: biznessPartner ? biznessPartner.BusinessPartnerName1 ?? '' : '',
						DescriptionTr: 0,
						VersionTr: 0,
						OtherLanguages: null,
						Modified: false,
						DescriptionModified: false
					}
				};
				newItemId--;
				compareColumns.push(newItem);
			});

			const result = await this.http.post<void>('procurement/pricecomparison/compareview/updatenewcomparecolumn', {
				RfqHeaderFk: baseRfqId,
				CompareType: compareType,
				OldQuoteIds: qtnIds,
				compareColumns: compareColumns
			});
			if (_.isFunction(callback)) {
				callback();
			}
			return result;
		}
		return Promise.resolve();
	}

	public getQuoteIds(response: ICompareDataSaveResult, isSaveAll?: boolean) {
		let oldQtnIds: number[] = [];

		if (isSaveAll && response.result && response.result.AllQuoteIds) {
			_.forEach(response.result.AllQuoteIds, function (id) {
				if (id > 0) {
					oldQtnIds.push(id);
				}
			});
		} else {
			if (!_.isEmpty(response.state.modifiedData)) {
				oldQtnIds = _.keys(response.state.modifiedData).map(key => parseInt(key));
			} else if (!_.isEmpty(response.result?.ModifiedData)) {
				oldQtnIds = _.keys(response.result?.ModifiedData).map(key => parseInt(key));
			} else if (response.result && response.result.ModifiedQuoteIds && response.result.ModifiedQuoteIds.length) {
				oldQtnIds = response.result.ModifiedQuoteIds;
			}
		}
		return oldQtnIds;
	}

	public async reloadNewVersionData(
		baseRfqId: number,
		compareType: CompareTypes,
		currResult: ICompareDataSaveResult,
		currSvc: ICompareDataManager,
		siblingSvcFn?: () => ICompareDataManager | undefined,
		hasCommonChanged?: boolean,
		isLoadAll?: boolean
	) {
		const siblingSvc = siblingSvcFn ? siblingSvcFn() : undefined;
		if (!hasCommonChanged || !siblingSvc) {
			if (currResult.type === CompareDataSaveTypes.Original) {
				return this.commonDlgSvc.showReloadInfoDialog([currSvc]);
			}

			const r = await this.commonDlgSvc.showReloadNewVersionDialog();
			if (r && r.closingButtonId !== StandardDialogButtonId.Ok) {
				return;
			}

			await this.reloadNewVersion(baseRfqId, compareType, currResult.result?.QuoteHeaderNews, this.getQuoteIds(currResult, currResult.isSaveAll), () => currSvc.reload());
			if (isLoadAll && siblingSvc) {
				return this.reloadNewVersion(baseRfqId, compareType, currResult.result?.QuoteHeaderNews, this.getQuoteIds(currResult, currResult.isSaveAll), () => siblingSvc.reload());
			}
		} else {
			const otherResult = await siblingSvc.saveToQuote(CompareDataSaveTypes.Original, currResult.result, currResult.type === CompareDataSaveTypes.New, currResult.isSaveAll);
			if (currResult.type === CompareDataSaveTypes.Original) {
				return this.commonDlgSvc.showReloadInfoDialog([currSvc, siblingSvc]);
			}
			const r = await this.commonDlgSvc.showReloadNewVersionDialog();
			if (r && r.closingButtonId !== StandardDialogButtonId.Ok) {
				return;
			}
			await this.reloadNewVersion(baseRfqId, compareType, currResult.result?.QuoteHeaderNews, this.getQuoteIds(currResult, currResult.isSaveAll), () => currSvc.reload());
			if (otherResult.status) {
				return this.reloadNewVersion(baseRfqId, compareType, currResult.result?.QuoteHeaderNews, this.getQuoteIds(currResult, currResult.isSaveAll), () => siblingSvc.reload());
			}
		}
	}

	public mergeWithRequiredFields(rows: ICompareRowEntity[], requiredFields: string[], additionalFields: ICompareRowEntity[] | null, exportHideRows: string[]) {
		if (additionalFields) {
			rows = _.concat(rows, additionalFields);
		}
		return _.map(rows, row => {
			const cloneRow = _.clone(row);
			const isRequired = _.includes(requiredFields, cloneRow.Field);
			if (isRequired && !cloneRow.Visible) {
				exportHideRows.push(cloneRow.Field);
			}
			cloneRow.Visible = isRequired ? true : cloneRow.Visible;
			return cloneRow;
		});
	}

	public buildAdditionalCompareField(field: string, description: string, sorting: number): ICompareRowEntity {
		return {
			AllowEdit: false,
			ConditionalFormat: '{"MAX()":"color:red;","AVG()":"color:blue;","MIN()":"color:green;"}',
			DefaultDescription: description,
			DescriptionInfo: {
				Description: '',
				DescriptionModified: false,
				DescriptionTr: 0,
				Modified: false,
				OtherLanguages: null,
				Translated: description,
				VersionTr: 0
			},
			DeviationField: false,
			DeviationPercent: null,
			DeviationReference: null,
			DisplayName: description,
			Field: field,
			FieldName: description,
			FieldType: 0,
			Id: 'CompareField_' + field,
			IsLeading: false,
			IsQuoteField: false,
			IsSorting: false,
			ShowInSummary: false,
			Sorting: sorting,
			UserLabelName: '',
			Visible: false,
		};
	}

	public buildExportColumns<T extends ICompositeBaseEntity<T>>(columns: CompareGridColumn<T>[], hideCompareFields: string[], hideColumns: string[], exportRequiredColumns: string[]) {
		let currColumns: CompareGridColumn<T>[] = [];
		_.forEach(columns, (col) => {
			const column = _.clone(col);
			if (this.isBidderColumn(column)) {
				const compareColumns = [];
				if (!column.hidden) {
					const columnInfo = this.extractCompareInfoFromFieldName(column.field);
					if (_.includes(hideCompareFields, columnInfo.field)) {
						hideColumns.push(column.field as string);
					}
					compareColumns.push(column);
				}
				_.each(compareColumns, function (c) {
					const terms = (c.field || '').split('_');
					const field = terms.length === 5 ? terms[4] : 'LineValue';
					const configCol = _.find(column.children, {field: field});
					if (configCol) {
						c.width = configCol.width;
					}
					c.groupName = column.groupName;
				});
				currColumns = currColumns.concat(compareColumns);
			} else {
				if (column.id && column.id !== 'indicator' && (!column.hidden || _.includes(exportRequiredColumns, column.field))) {
					if (_.includes(exportRequiredColumns, column.field) && column.hidden) {
						hideColumns.push(column.field as string);
					}
					const item = column;
					item.width = column.width;
					item.name = column.userLabelName || this.getTranslationText(item.name$tr$) || item.name;
					currColumns.push(item);
				}
			}
		});
		return currColumns;
	}

	public isShowInSummaryActivated(summaryRows: ICompareRowEntity[], summaryField: string) {
		const showInSummaryRows = summaryRows.filter(e => e.ShowInSummary);
		return showInSummaryRows.some((r) => {
			return r.Field === summaryField;
		}) && !showInSummaryRows.some((r) => {
			return _.includes([CompareFields.rank, CompareFields.percentage], r.Field);
		});
	}

	public formatValue<T extends object, TItem extends object = object>(fieldType: FieldType, row: number, cell: number, originalValue: unknown, columnDef: ColumnDef<T>, dataContext: T, lookupFormatterOptions?: ILookupOptions<TItem, T>): string {
		// TODO-DRIZZLE: To be migration
		// descriptionFormatter: platformGridDomainService.formatter('description'),
		// percentFormatter: platformGridDomainService.formatter('percent'),
		// integerFormatter: platformGridDomainService.formatter('integer'),
		// moneyFormatter: platformGridDomainService.formatter('money'),
		// quantityFormatter: platformGridDomainService.formatter('quantity'),
		// booleanFormatter: platformGridDomainService.formatter('boolean'),
		// lookupFormatter: platformGridDomainService.formatter('lookup'),
		// dateFormatter: platformGridDomainService.formatter('dateutc'),
		// datetimeFormatter: platformGridDomainService.formatter('datetimeutc')
		return _.toString(originalValue);
	}

	public formatValueByCharacteristicTypeId<T extends ICompositeBaseEntity<T>>(dataContext: T, columnDef: ColumnDef<T>, characteristicData: ICustomCharacteristicData, value: unknown, isNoEditable?: boolean) {
		switch (characteristicData.CharacteristicTypeId) {
			case 1:
				// Note (special case): <value === 'ture'> is needed here, because value is a 'true/false' string bool value.
				// return '<input type="checkbox" disabled="disabled"' + (value === 'true' ? ' checked="checked"' : '') + '>';
				return '<div class="text-center domain-type-boolean grid-control ng-scope">' +
					'<input type="checkbox" ' + (value === true ? ' checked="checked"' : '') + (isNoEditable === true ? ' disabled="disabled"' : '') +
					'data-grid="true"' + 'class="ng-pristine ng-valid ng-not-empty ng-touched" >' +
					'</div>';
			case 2:
				return this.formatValue(FieldType.Description, 0, 0, value, columnDef, dataContext);
			case 3:
				return this.formatValue(FieldType.Integer, 0, 0, value, columnDef, dataContext);  // value is a string, here need the original value (type: number)
			case 4:
				return this.formatValue(FieldType.Percent, 0, 0, value, columnDef, dataContext); // + ' %';
			case 5:
				return this.formatValue(FieldType.Money, 0, 0, value, columnDef, dataContext);
			case 6:
				return this.formatValue(FieldType.Quantity, 0, 0, value, columnDef, dataContext);
			case 7:
				return this.formatValue(FieldType.Date, 0, 0, value, columnDef, dataContext);
			case 8:
				return this.formatValue(FieldType.DateTime, 0, 0, value, columnDef, dataContext);
			default:
				return this.formatValue(FieldType.Description, 0, 0, value, columnDef, dataContext);
		}
	}

	public formatCharacteristic<T extends ICompositeBaseEntity<T>>(
		dataContext: T,
		columnDef: CompareGridColumn<T>,
		rfqCharacteristics: ICustomCharacteristicData[],
		quoteKey?: string,
		value?: unknown
	) {
		if (quoteKey === BidderIdentities.targetKey) {
			const rfqCharacteristic = rfqCharacteristics.find(e => e.Id === dataContext['CharacteristicDataId']);

			if (!rfqCharacteristic) {
				return Constants.columnFieldSeparator;
			}
			if (!this.characteristicTypeSvc.isLookupType(rfqCharacteristic.CharacteristicTypeId)) {
				value = this.characteristicTypeSvc.convertValue(value as (string | number), rfqCharacteristic.CharacteristicTypeId);
			}
			return this.formatValueByCharacteristicTypeId(dataContext, columnDef, rfqCharacteristic, value, true);
		} else if (quoteKey !== BidderIdentities.baseBoqKey) {
			if (!dataContext[quoteKey + '_$hasBidder']) {   // if it has no bidder, return '-'
				return Constants.columnFieldSeparator;
			}
			if (_.isFunction(columnDef.domain)) {
				columnDef.domain(dataContext, columnDef);
			}
			return (columnDef.dynamicFormatterFn || function () {
				return '';
			})(dataContext) || '';
		}
		return '';
	}

	public getNavigationToQuote<T extends ICompositeBaseEntity<T>>(columnDef: CompareGridColumn<T>, entity: T, disabled: boolean) {
		return '';
		// TODO-DRIZZLE: To be checked.
		/*const column = _.cloneDeep(columnDef);

		// specify it this way to tell the getNavData function in quote module to pass the quote header id
		const qtnHeaderId =this.getQuoteId(column.id);
		const options = {
			navigator: {
				moduleName: 'procurement.quote',
				registerService: 'procurementQuoteHeaderDataService'
			}
		};

		_.extend(options, column);

		// a simple way to pass qtnHeaderId as entity to navigate to module 'quote'.
		const navBtnHtml = platformGridDomainService.getNavigator(options, qtnHeaderId, null);
		// make the arrow to the left, because the number is right align
		const navDom = $(navBtnHtml).css('position', 'relative');

		if (disabled) {
			navDom.attr('disabled');
		}

		return $('<div></div>').append(navDom).html();*/
	}

	// TODO-DRIZZLE: Below code frames to be removed.
	public _currentActiveView: object = {};

	public getViewConfig(uuid: string): {
		Guid: string,
		BasModuletabviewFk: number,
		Propertyconfig: string | null | Array<object>,
		Gridconfig: string | object,
		Viewdata: string | object
	} | null {
		const configEntities = _.get(this._currentActiveView, 'ModuleTabViewConfigEntities') as unknown as {
			Guid: string,
			BasModuletabviewFk: number,
			Propertyconfig: string | null | Array<object>,
			Gridconfig: string | object,
			Viewdata: string | object
		}[];

		const config = configEntities.find(c => c.Guid === uuid && c.BasModuletabviewFk === _.get(this._currentActiveView, 'Id') as unknown as number);

		if (config) {
			if (config.Propertyconfig === 'null') {
				config.Propertyconfig = null;
			}
			if (config.Gridconfig && _.isString(config.Gridconfig)) {
				config.Gridconfig = JSON.parse(config.Gridconfig);
			}
			if (config.Viewdata && _.isString(config.Viewdata)) {
				config.Viewdata = JSON.parse(config.Viewdata);
			}
		}

		return config ? _.cloneDeep(config) : null;
	}

	public customData<T>(uuid: string, key: string): T | null {
		const view = this.getViewConfig(uuid);
		if (view && view.Viewdata && _.isObject(view.Viewdata)) {
			return _.get(view.Viewdata, key) as T;
		}
		return null;
	}

	public setPricePriceOcPriceGrossPriceGrossOc(quoteItem: unknown, price: number, field: string, vatPercent: number, exchangeRate: number){
		//TODO: implement setPricePriceOcPriceGrossPriceGrossOc
	}

	public getAllQuoteItems(list: ICompositeItemEntity[], childProp: string): ICustomPrcItem[] {
		const quoteItems: ICustomPrcItem[] = [];
		list.forEach(item => {
			quoteItems.push(...(item.QuoteItems ?? []));
			quoteItems.push(...this.getAllQuoteItems(_.get(item, childProp) as ICompositeItemEntity[], childProp));
		});
		return quoteItems;
	}
}