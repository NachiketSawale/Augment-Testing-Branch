/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import {IIdentificationData} from '@libs/platform/common';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity, IOrdTransactionEntity } from '@libs/sales/interfaces';

@Injectable({
    providedIn: 'root'
})

export class SalesContractTransactionDataService extends DataServiceFlatLeaf<IOrdTransactionEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

    public constructor(salesContractContractsDataService: SalesContractContractsDataService) {
        const options: IDataServiceOptions<IOrdTransactionEntity> = {
            apiUrl: 'sales/contract/transaction',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false,
                prepareParam: (ident: IIdentificationData) => {
                    return {mainItemId: ident.pKey1};
                },
            },
            createInfo:{
                prepareParam: ident => {
                    const selection = salesContractContractsDataService.getSelection()[0];
                    return { id: 0, pKey1 : selection.Id};
                }
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: 'multidelete'
            },
            roleInfo: <IDataServiceChildRoleOptions<IOrdTransactionEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'OrdCertificate',
                parent: salesContractContractsDataService
            }
        };

        super(options);
    }

    public override registerByMethod(): boolean {
        return true;
    }
}