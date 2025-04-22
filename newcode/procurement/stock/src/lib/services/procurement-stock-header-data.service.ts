/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { IStockHeaderVEntity, StockComplete } from '../model';
import { MainDataDto } from '@libs/basics/shared';
import { ProcurementStockTotalDataService } from './procurement-stock-total-data.service';

/**
 * procurement stock header data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockHeaderDataService extends DataServiceFlatRoot<IStockHeaderVEntity, StockComplete> {
	private http = inject(PlatformHttpService);

	/**
	 * The constructor
	 */
	public constructor() {
		const options: IDataServiceOptions<IStockHeaderVEntity> = {
			apiUrl: 'procurement/stock/header',
			readInfo: <IDataServiceEndPointOptions>{
				usePost: false,
				endPoint: 'allitems',
			},
			roleInfo: <IDataServiceRoleOptions<IStockHeaderVEntity>>{
				role: ServiceRole.Root,
				itemName: 'StockHeader',
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};
		super(options);
		this.processor.addProcessor([
			{
				process: this.addCheckedProcess.bind(this),
				revertProcess() {},
			}
		]);
	}

	/**
	 * Load data
	 */
	public async load(): Promise<IStockHeaderVEntity[]> {
		const res = await this.http.get('procurement/stock/header/allitems');
		const dto = new MainDataDto<IStockHeaderVEntity>(res);
		const stockHeaders = dto.Main;
		this.processor.process(stockHeaders);
		this.setList(stockHeaders);
		return stockHeaders;
	}

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IStockHeaderVEntity | null): StockComplete {
		return new StockComplete();
	}

	private addCheckedProcess(item: IStockHeaderVEntity): void {
		if (item) {
			item.IsChecked = false;
		}
	}

	/**
	 * Gather checked stock header ids
	 */
	public getFilteredStockHeaderIds(): number[] {
		return (
			this.getList()
				.filter((e) => e.IsChecked)
				.map((e) => e.Id) || []
		);
	}

	/**
	 * Update stock header check status
	 * @param stockHeaderIds
	 */
	public updateFilter(stockIds: Set<number>) {
		this.getList().forEach((e) => (e.IsChecked = stockIds.has(e.Id)));
	}

	/**
	 * Triggers when the checked state of a stock header item changes.
	 * @param stockHeader
	 * @param newValue
	 */
	public fireStockHeaderCheckedChanged(stockHeader: IStockHeaderVEntity, newValue: boolean) {
		stockHeader.IsChecked = newValue;
		const stockTotalDataService = ServiceLocator.injector.get(ProcurementStockTotalDataService);
		stockTotalDataService.onStockHeaderCheckChanged();
	}
}
