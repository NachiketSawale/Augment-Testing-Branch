/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../compare-data-base.service';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { CompareTypes } from '../../../model/enums/compare.types.enum';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { ICompareItemTreeResponse } from '../../../model/entities/item/compare-item-tree-response.interface';
import { CompareItemTreeBuilder } from '../../../model/entities/item/compare-item-tree-builder.class';
import { CompareItemDataCache } from '../../../model/entities/item/compare-item-data-cache.class';
import { CompareItemColumnBuilder } from '../../../model/entities/item/compare-item-column-builder.class';
import { CompareContainerUuids } from '../../../model/enums/compare-container-uuids.enum';
import { ICompareDataItemRequest } from '../../../model/entities/item/compare-data-item-request.interface';
import { ICompareItemTypeSummary } from '../../../model/entities/item/compare-item-type-summary.interface';
import { CompareItemModifiedState } from '../../../model/entities/item/compare-item-modified-state.class';
import { ICompareDataSaveResult } from '../../../model/entities/compare-data-save-result.interface';
import { CompareEvents } from '../../../model/enums/compare-events.enum';
import { CompareDataReadManager } from '../../../model/classes/compare-data-read-manager.class';
import { CompareFields } from '../../../model/constants/compare-fields';
import { ICompareDataRowReader } from '../../../model/entities/compare-data-reader.interface';
import { ProcurementPricecomparisonCompareItemDataRowReadService } from './compare-item-data-row-read.service';
import { CompareDataRowReaderBase } from '../../../model/classes/compare-data-row-reader-base.class';
import { BoqDeviationFields } from '../../../model/constants/boq/boq-deviation-fields';

export abstract class ProcurementPricecomparisonCompareItemDataBaseService extends ProcurementPricecomparisonCompareDataBaseService<
	ICompositeItemEntity,
	ICompareItemTreeResponse
> {
	public constructor() {
		super('procurement/pricecomparison/item');
	}

	private _modifiedState?: CompareItemModifiedState;
	private _compareCache?: CompareItemDataCache;
	private _treeBuilder?: CompareItemTreeBuilder;
	private _columnBuilder?: CompareItemColumnBuilder;
	private _readMgr?: CompareDataReadManager<ICompositeItemEntity>;
	private _dataRowReaders?: ICompareDataRowReader<ICompositeItemEntity>[];

	protected abstract getTreeBuilder(): CompareItemTreeBuilder;

	protected abstract getColumnBuilder(): CompareItemColumnBuilder;

	protected abstract getDataCache(): CompareItemDataCache;

	public override get containerUuid(): string {
		return CompareContainerUuids.Item;
	}

	public override get compareType() {
		return CompareTypes.Item;
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
		return this.utilService.createLazy(v => this._modifiedState = v, () => new CompareItemModifiedState(), this._modifiedState);
	}

	public override get readMgr() {
		return this.utilService.createLazy(v => this._readMgr = v, () => {
			return new CompareDataReadManager<ICompositeItemEntity>(
				this.dataReaders,
				() => this.isVerticalCompareRows(),
				() => this.utilService.isShowInSummaryActivated(this.compareCache.summaryRows, CompareFields.total)
			);
		}, this._readMgr);
	}

	public override get rowReader(): CompareDataRowReaderBase<ICompositeItemEntity> {
		return ServiceLocator.injector.get(ProcurementPricecomparisonCompareItemDataRowReadService);
	}

	public override get dataReaders() {
		return this.utilService.createLazy(v => this._dataRowReaders = v, () => {
			return this.rowReader.createDataRowReaders();
		}, this._dataRowReaders);
	}

	public override get deviationFields(){
		return BoqDeviationFields;
	}

	protected override get saveSuccess() {
		return this.eventMgr.create<ICompareDataSaveResult>(CompareEvents.ItemSaved);
	}

	protected override getColumnsFromResponse(response: ICompareItemTreeResponse): ICustomCompareColumnEntity[] {
		return response.ItemCustomColumn;
	}

	protected override getCompareRowsFromResponse(response: ICompareItemTreeResponse): ICompareRowEntity[] {
		return response.ItemCustomRow;
	}

	protected override getQuoteRowsFromResponse(response: ICompareItemTreeResponse): ICompareRowEntity[] {
		return response.ItemCustomQuoteRow;
	}

	protected override getBillingSchemaRowsFromResponse(response: ICompareItemTreeResponse): ICompareRowEntity[] {
		return response.ItemCustomSchemaRow;
	}

	public override getCompareFieldName(row: ICompositeItemEntity): string {
		return this.utilService.getPrcCompareField(row);
	}

	public getTypeSummary(): ICompareItemTypeSummary {
		return {
			checkedItemTypes: [],
			checkedItemTypes2: []
		};
	}

	protected provideCustomLoadPayload(payload: ICompareDataItemRequest): ICompareDataItemRequest {
		return payload;
	}

	protected override buildCustomCache(response: ICompareItemTreeResponse) {
		this.utilService.concat(this.compareCache.prcPackages, response.PrcPackage);
		this.utilService.concat(this.compareCache.prcStructures, response.PrcStructure);
		this.utilService.concat(this.compareCache.taxCodes, response.TaxCode);
		this.utilService.concat(this.compareCache.controllingUnits, response.ControllingUnit);
		this.utilService.concat(this.compareCache.addresses, response.Address);
		this.utilService.concat(this.compareCache.paymentTerms, response.PaymentTerm);
		this.utilService.concat(this.compareCache.prcItemStatus, response.PrcItemStatus);
	}

	protected override processResponse(response: ICompareItemTreeResponse) {

	}

	protected override loadTreeSuccess(loaded: ICompareItemTreeResponse[]) {

	}
}