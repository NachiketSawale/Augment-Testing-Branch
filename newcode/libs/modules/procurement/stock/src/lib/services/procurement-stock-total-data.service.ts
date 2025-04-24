/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IFilterResult, ISearchPayload, ISearchResult } from '@libs/platform/common';
import { IStockTotalVEntity, StockComplete } from '../model';
import { MainDataDto } from '@libs/basics/shared';
import { ProcurementStockHeaderDataService } from './procurement-stock-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTotalDataService extends DataServiceFlatRoot<IStockTotalVEntity, StockComplete> {
	private stockHeaderFilterDataService = inject(ProcurementStockHeaderDataService);

	public constructor() {
		super({
			apiUrl: 'procurement/stock/stocktotal',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IStockTotalVEntity>>{
				role: ServiceRole.Root,
				itemName: 'StockTotalV',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		});
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IStockTotalVEntity> {
		const dto = new MainDataDto<IStockTotalVEntity>(loaded);
		this.updateFiltering(dto.Main);
		return {
			dtos: dto.Main,
			FilterResult: dto.getValueAs<IFilterResult>('FilterResult')!,
		};
	}

	protected override onCreateSucceeded(created: object): IStockTotalVEntity {
		const entity = created as IStockTotalVEntity;
		return entity;
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		return {
			PrjStockIds: this.stockHeaderFilterDataService.getFilteredStockHeaderIds(),
			IsRefresh: false,
			...payload,
		};
	}

	public override createUpdateEntity(modified: IStockTotalVEntity | null): StockComplete {
		return new StockComplete();
	}

	private updateFiltering(stockTotals: IStockTotalVEntity[]) {
		const stockIds = new Set(stockTotals.map((m) => m.PrjStockFk));
		this.stockHeaderFilterDataService.updateFilter(stockIds);
	}

	/**
	 * React on the check state of stock header change
	 */
	public onStockHeaderCheckChanged() {
		if (this.stockHeaderFilterDataService.getFilteredStockHeaderIds().length > 0) {
			this.refreshAllLoaded();
		} else {
			this.setList([]);
		}
	}
}
