/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { StockComplete } from '../model/stock-complete.class';
import { ProcurementStockHeaderDataService } from './procurement-stock-header-data.service';
import { IStockHeaderVEntity } from '../model/entities/stock-header-ventity.interface';
import { get } from 'lodash';
import { IProjectStockDownTimeEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProcurementStockDownTimeDataService extends DataServiceFlatLeaf<IProjectStockDownTimeEntity,IStockHeaderVEntity, StockComplete >{
	public constructor() {
		const options: IDataServiceOptions<IProjectStockDownTimeEntity>  = {
			apiUrl: 'project/stock/downtime',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectStockDownTimeEntity, IStockHeaderVEntity, StockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProjectStockDownTime',
				parent: inject(ProcurementStockHeaderDataService),
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                mainItemId: parentSelection.Id
            };
        } else {
            throw new Error('There should be a selected stock header to load the stock downtime data');
        }
    }


    protected override onLoadSucceeded(loaded: object): IProjectStockDownTimeEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }
}