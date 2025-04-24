/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf, ServiceRole,  IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions
} from '@libs/platform/data-access';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { IBasicsStockTotalEntity } from '@libs/basics/shared';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { MaterialComplete } from '../model/complete-class/material-complete.class';

/**
 * The Basics Material Stock Total data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialStockTotalDataService extends DataServiceFlatLeaf<IBasicsStockTotalEntity, IMaterialEntity, MaterialComplete> {
	public constructor(private parentService: BasicsMaterialRecordDataService) {
		const options: IDataServiceOptions<IBasicsStockTotalEntity> = {
			apiUrl: 'procurement/stock/stocktotal',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyMaterial',
				usePost: false
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false
			},
			roleInfo: <IDataServiceRoleOptions<IBasicsStockTotalEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Material2ProjectStockVDto',
				parent: parentService
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				materialId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent Material record to load the Stock total data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IBasicsStockTotalEntity[] {
		return loaded as IBasicsStockTotalEntity[];
	}
	public override registerByMethod(): boolean {
		return true;
	}
	public override registerModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: IBasicsStockTotalEntity[], deleted: IBasicsStockTotalEntity[]): void {

	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IBasicsStockTotalEntity): boolean {
		return entity.PrjStockFk === parentKey.Id;
	}
}