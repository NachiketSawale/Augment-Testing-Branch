/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import {
    DataServiceFlatLeaf,
    IDataServiceOptions,
    ServiceRole,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions
} from '@libs/platform/data-access';
import { IEstLineItemQuantityEntity } from '@libs/estimate/interfaces';
import { LineItemBaseComplete } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';


export const ESTIMATE_MAIN_LINE_ITEM_QUANTITY_DATA_TOKEN = new InjectionToken<EstimateMainLineItemQuantityDataService>('estimateMainLineItemQuantityDataToken');

@Injectable({
    providedIn: 'root'
})

/**
 * Estimate Main LineItem Quantity container data service
 */
export class EstimateMainLineItemQuantityDataService extends DataServiceFlatLeaf<IEstLineItemQuantityEntity, IEstLineItemEntity, LineItemBaseComplete> {

    public constructor(estimateMainService: EstimateMainService) {
        const options: IDataServiceOptions<IEstLineItemQuantityEntity> = {
            apiUrl: 'estimate/main/lineitemquantity',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'filteredlist',
                usePost: false
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: '//TODO: Add deleteInfo endpoint here'
            },
            //TODO Update functionality needs to add here from estimate/lineitem/update
            roleInfo: <IDataServiceChildRoleOptions<IEstLineItemQuantityEntity, IEstLineItemEntity, LineItemBaseComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'EstLineItemQuantity',
                parent: estimateMainService
            }
        };

        super(options);
    }
}








