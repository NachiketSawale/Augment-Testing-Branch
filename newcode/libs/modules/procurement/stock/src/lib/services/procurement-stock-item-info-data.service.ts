/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { ProcurementStockHeaderDataService } from './procurement-stock-header-data.service';

import { IStockItemInfoVEntity } from '../model/entities/stock-item-info-ventity.interface';
import { IStockHeaderVEntity, StockComplete } from '../model';
import { IStockItemInfoViewOptions } from '../components/item-info/item-info.component';

/**
 * procurement stock item info data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockItemInfoDataService extends DataServiceFlatLeaf<IStockItemInfoVEntity, IStockHeaderVEntity, StockComplete> {
	/**
	 * Property isOutStanding holds boolean value
	 */
	public isOutStanding!: boolean;

	/**
	 * Property isDelivered holds boolean value
	 */
	public isDelivered!: boolean;

	/**
	 * Property startDate
	 */
	public startDate: Date | undefined;

	/**
	 * Property endDate
	 */
	public endDate: Date | undefined;

	/**
	 * The constructor
	 */
	public constructor(public parentService: ProcurementStockHeaderDataService) {
		const options: IDataServiceOptions<IStockItemInfoVEntity> = {
			apiUrl: 'procurement/stock/iteminfo',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'infolist',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: '',
			},
			roleInfo: <IDataServiceChildRoleOptions<IStockItemInfoVEntity, IStockHeaderVEntity, StockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'StockItemInfoV',
				parent: parentService,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};
		super(options);
	}

	/**
	 * The provideLoadPayload function provides the payload
	 */
	protected override provideLoadPayload(): object {
		const selectItem = this.parentService.getSelectedEntity()!;
		return {
			PrjStockIds: [selectItem.Id],
			IsOutstanding: this.isOutStanding,
			IsDelivered: this.isDelivered,
			FromDate: this.startDate ?? null,
			ToDate: this.endDate ?? null,
			filter: '',
		};
	}

	/**
	 * Processes the loaded data from the server and returns it as an array of IStockItemInfoVEntity.
	 */
	protected override onLoadSucceeded(loaded: object): IStockItemInfoVEntity[] {
		return loaded as IStockItemInfoVEntity[];
	}

	/**
	 * Initializes the item info filter with the provided filter data.
	 */
	public initItemInfoFilter(filterData: IStockItemInfoViewOptions): void {
		this.isOutStanding = filterData.isOutStanding;
		this.isDelivered = filterData.isDelivered;
		this.startDate = filterData.startDate;
		this.endDate = filterData.endDate;
	}

	/**
	 * Retrieves the selected parent data from the parent service.
	 */
	public getParentData(): IStockHeaderVEntity[] {
		return this.parentService.getSelection();
	}
}
