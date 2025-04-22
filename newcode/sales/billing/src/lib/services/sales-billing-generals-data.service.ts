/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { IBilHeaderEntity, IGeneralsEntity } from '@libs/sales/interfaces';


@Injectable({
    providedIn: 'root'
})

/**
 * Sales billing Generals data service
 */
export class SalesBillingGeneralsDataService extends DataServiceFlatLeaf<IGeneralsEntity, IBilHeaderEntity, BilHeaderComplete> {

    public constructor(dataService: SalesBillingBillsDataService) {
        const options: IDataServiceOptions<IGeneralsEntity> = {
            apiUrl: 'sales/billing/generals',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listByParent',
                usePost: true
            },
            createInfo:{
                prepareParam: ident => {
                    const selection = dataService.getSelection()[0];
                    return { pKey1 : selection.Id };
                }
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: 'multidelete'
            },
            roleInfo: <IDataServiceChildRoleOptions<IGeneralsEntity, IBilHeaderEntity, BilHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'Generals',
                parent: dataService
            }
        };

        super(options);
    }
}