/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { ServiceLocator } from '@libs/platform/common';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../compare-data-base.service';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { CompareTypes } from '../../../model/enums/compare.types.enum';
import { ICompareBoqTreeResponse } from '../../../model/entities/boq/compare-boq-tree-response.interface';
import { CompareBoqDataCache } from '../../../model/entities/boq/compare-boq-data-cache.class';
import { CompareBoqTreeBuilder } from '../../../model/entities/boq/compare-boq-tree-builder.class';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { CompareBoqColumnBuilder } from '../../../model/entities/boq/compare-boq-column-builder.class';
import { CompareContainerUuids } from '../../../model/enums/compare-container-uuids.enum';
import { ICompareDataBoqRequest } from '../../../model/entities/boq/compare-data-boq-request.interface';
import { ICompareBoqRange } from '../../../model/entities/boq/compare-boq-range.interface';
import { CompareBoqModifiedState } from '../../../model/entities/boq/compare-boq-modified-state.class';
import { CompareEvents } from '../../../model/enums/compare-events.enum';
import { ICompareDataSaveResult } from '../../../model/entities/compare-data-save-result.interface';
import { CompareDataReadManager } from '../../../model/classes/compare-data-read-manager.class';
import { ICompareDataRowReader } from '../../../model/entities/compare-data-reader.interface';
import { CompareFields } from '../../../model/constants/compare-fields';
import { ProcurementPricecomparisonCompareBoqDataRowReadService } from './compare-boq-data-row-read.service';
import { CompareDataRowReaderBase } from '../../../model/classes/compare-data-row-reader-base.class';
import { ItemDeviationFields } from '../../../model/constants/item/item-deviation-fields';

export abstract class ProcurementPricecomparisonCompareBoqDataBaseService extends ProcurementPricecomparisonCompareDataBaseService<
	ICompositeBoqEntity,
	ICompareBoqTreeResponse
> {
	public constructor() {
		super('procurement/pricecomparison/boq');
	}

	private _modifiedState?: CompareBoqModifiedState;
	private _compareCache?: CompareBoqDataCache;
	private _columnBuilder?: CompareBoqColumnBuilder;
	private _treeBuilder?: CompareBoqTreeBuilder;
	private _readMgr?: CompareDataReadManager<ICompositeBoqEntity>;
	private _dataRowReaders?: ICompareDataRowReader<ICompositeBoqEntity>[];

	protected abstract getTreeBuilder(): CompareBoqTreeBuilder;

	protected abstract getColumnBuilder(): CompareBoqColumnBuilder;

	protected abstract getDataCache(): CompareBoqDataCache;

	public override get containerUuid(): string {
		return CompareContainerUuids.BoQ;
	}

	public override get compareType() {
		return CompareTypes.BoQ;
	}

	public override get compareCache() {
		return this.utilService.createLazy(v => this._compareCache = v, () => this.getDataCache(), this._compareCache);
	}

	public override get treeBuilder() {
		return this.utilService.createLazy(v => this._treeBuilder = v, () => this.getTreeBuilder(), this._treeBuilder);
	}

	public override get columnBuilder() {
		return this.utilService.createLazy(v => this._columnBuilder = v, () => this.getColumnBuilder(), this._columnBuilder);
	}

	public override get modifiedState() {
		return this.utilService.createLazy(v => this._modifiedState = v, () => new CompareBoqModifiedState(), this._modifiedState);
	}

	public override get readMgr() {
		return this.utilService.createLazy(v => this._readMgr = v, () => {
			return new CompareDataReadManager<ICompositeBoqEntity>(
				this.dataReaders,
				() => this.isVerticalCompareRows(),
				() => this.utilService.isShowInSummaryActivated(this.compareCache.summaryRows, CompareFields.finalPrice)
			);
		}, this._readMgr);
	}

	public override get rowReader(): CompareDataRowReaderBase<ICompositeBoqEntity> {
		return ServiceLocator.injector.get(ProcurementPricecomparisonCompareBoqDataRowReadService);
	}

	public override get dataReaders() {
		return this.utilService.createLazy(v => this._dataRowReaders = v, () => {
			return this.rowReader.createDataRowReaders();
		}, this._dataRowReaders);
	}

	public override get deviationFields(){
		return ItemDeviationFields;
	}

	protected override get saveSuccess() {
		return this.eventMgr.create<ICompareDataSaveResult>(CompareEvents.BoqSaved);
	}

	protected override getColumnsFromResponse(response: ICompareBoqTreeResponse): ICustomCompareColumnEntity[] {
		return response.BoqCustomColumn;
	}

	protected override getCompareRowsFromResponse(response: ICompareBoqTreeResponse): ICompareRowEntity[] {
		return response.BoqCustomRow;
	}

	protected override getQuoteRowsFromResponse(response: ICompareBoqTreeResponse): ICompareRowEntity[] {
		return response.BoqCustomQuoteRow;
	}

	protected override getBillingSchemaRowsFromResponse(response: ICompareBoqTreeResponse): ICompareRowEntity[] {
		return response.BoqCustomSchemaRow;
	}

	public override getCompareRows(): ICompareRowEntity[] {
		const boqStructure = this.utilService.getBoqHeaderStructureWithNameUrb(this.compareCache.boqStructures);
		return this.utilService.extendCompareRowWithStructureUrb(super.getCompareRows(), boqStructure);
	}

	public override getCompareFieldName(row: ICompositeBoqEntity): string {
		return this.utilService.getBoqCompareField(row);
	}

	public isCalculateAsPerAdjustedQuantity(): boolean {
		// TODO-DRIZZLE: To be checked.
		return false;
	}

	public getTypeSummary() {
		return this.configService.getBoqTypeSummary(this.compareType);
	}

	public getBoqRanges(): ICompareBoqRange[] {
		return [];
	}

	protected provideCustomLoadPayload(payload: ICompareDataBoqRequest): ICompareDataBoqRequest {
		payload.IsCalculateAsPerAdjustedQuantity = this.isCalculateAsPerAdjustedQuantity();
		payload.RecalculateDisabled = !payload.IsCalculateAsPerAdjustedQuantity;
		return payload;
	}

	protected override buildCustomCache(response: ICompareBoqTreeResponse) {
		this.utilService.concat(this.compareCache.itemTypes, response.ItemTypes);
		this.utilService.concat(this.compareCache.itemTypes2, response.ItemTypes2);
		this.utilService.concat(this.compareCache.boqLineTypes, response.BoqLineType);
		this.utilService.concat(this.compareCache.boqItem2CostGroups, response.BoqItem2CostGroups);
		this.utilService.concat(this.compareCache.boqStructures, this.utilService.extractBoqHeaderStructures(response.Main));
		this.utilService.concat(this.compareCache.boqStructureDetails, this.utilService.extractBoqHeaderStructureDetails(response.Main));
		this.utilService.concat(this.compareCache.costGroups, response.CostGroup);

		if (response.BoqItemCostGroupCats) {
			this.compareCache.costGroupCats = response.BoqItemCostGroupCats;
		}
	}

	protected override processResponse(response: ICompareBoqTreeResponse) {
		this.utilService.attachCostGroupValueToEntity(response.Main, this.compareCache.boqItem2CostGroups, (costGroup: object) => {
			return {
				ReqBoqHeaderId: _.get(costGroup, 'RootItemId'),
				ReqBoqItemId: _.get(costGroup, 'MainItemId')
			};
		}, (item) => {
			return this.utilService.isBoqRow(item.LineTypeFk);
		});
	}

	protected override loadTreeSuccess(loaded: ICompareBoqTreeResponse[]) {
		this.utilService.mergeItemTypes(this.compareCache.itemTypes, this.compareCache.itemTypes2);
	}
}