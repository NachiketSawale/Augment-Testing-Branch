/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { IBilHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
    providedIn: 'root',
})
export class SalesBillingDocumentProjectDataService extends DocumentProjectDataRootService<IBilHeaderEntity> {
    protected readonly parentService: SalesBillingBillsDataService;

    public constructor() {
        const parentDataService = inject(SalesBillingBillsDataService);
        super(parentDataService);
        this.parentService = parentDataService;
    }

    protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
        const salesBillingBillSelected = this.parentService.getSelectedEntity();
        if (salesBillingBillSelected) {
            return {
                BilHeaderFk: salesBillingBillSelected.Id
            };
        }
        return {};
    }

    public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
        const salesBillingBillSelected = this.parentService.getSelectedEntity();
        if (salesBillingBillSelected) {
            created.BilHeaderFk = salesBillingBillSelected.Id;			
        }
        return created;
    }

}
