/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { IBilHeaderEntity, IDocumentEntity } from '@libs/sales/interfaces';

@Injectable({
    providedIn: 'root'
})
/**
 * Sales Billing document data service
 */
export class SalesBillingDocumentDataService extends DocumentDataLeafService<IDocumentEntity, IBilHeaderEntity, BilHeaderComplete> {

    public constructor(dataService: SalesBillingBillsDataService) {
        const options: IDataServiceOptions<IDocumentEntity> = {
            apiUrl: 'sales/billing/document',
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
            roleInfo: <IDataServiceChildRoleOptions<IDocumentEntity, IBilHeaderEntity, BilHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'Document',
                parent: dataService
            }
        };

        super(options);
    }

    public override getSavedEntitiesFromUpdate(complete: BilHeaderComplete): IDocumentEntity[] {
        if (complete && complete.DocumentsToSave) {
            return complete.DocumentsToSave;
        }
        return [];
    }

}