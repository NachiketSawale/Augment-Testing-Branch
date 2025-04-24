/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ProcurementStockHeaderDataService } from './procurement-stock-header-data.service';
import { IStockHeaderVEntity, StockComplete } from '../model';
import { get } from 'lodash';
import { IPrcStockAccrualEntity } from '../model/entities/prc-stock-accrual-entity.interface';

/**
 * Procurement Stock Accrual Data Service.
 */
@Injectable({
	providedIn: 'root'
})

export class ProcurementStockAccrualDataService extends DataServiceFlatLeaf<IPrcStockAccrualEntity,IStockHeaderVEntity, StockComplete >{

	public constructor(private parentDataService:ProcurementStockHeaderDataService) {
		const options: IDataServiceOptions<IPrcStockAccrualEntity>  = {
			apiUrl: 'procurement/stock/accrual',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcStockAccrualEntity,IStockHeaderVEntity, StockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'StockAccrual',
				parent: parentDataService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
        const selection = this.parentDataService.getSelectedEntity();
        return {
            mainItemId: selection?.Id
        };
    }

    protected override onLoadSucceeded(loaded: object): IPrcStockAccrualEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }
}








