/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions, StatusIdentificationData } from '@libs/basics/shared';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
@Injectable({
    providedIn: 'root',
})
/**
 * Change Sales billing Bill Status Wizard Service
 */
export class SalesBillingChangeBillStatusWizardService extends BasicsSharedChangeStatusService<IBilHeaderEntity, IBilHeaderEntity, BilHeaderComplete> {
    protected readonly dataService = inject(SalesBillingBillsDataService);
    protected statusConfiguration: IStatusChangeOptions<IBilHeaderEntity, BilHeaderComplete> = {
        title: 'sales.billing.wizardCSChangeBilStatus',
        guid: 'df04a23b847f46a9ad9e9d174dbe7c80',
        isSimpleStatus: false,
        statusName: 'billing',
        checkAccessRight: true,
        statusField: 'BilStatusFk',
        rootDataService: this.dataService,
        updateUrl: 'sales/billing/changestatus',
        getEntityCodeFn: this.getBillNo,
        getEntityDescFn: this.getDescription
    };

    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }

    public override convertToStatusIdentification(selection: IBilHeaderEntity[]): StatusIdentificationData[] {
        return selection.map(item => {
            return {
                id: item.Id,
                projectId: item.ProjectFk ?? undefined
            };
        });
    }

    private getBillNo(entity:object){
        const bill = entity as IBilHeaderEntity;
        return bill.BillNo ?? '';
    }

    private  getDescription(entity:object){
        const bill = entity as IBilHeaderEntity;
        return bill.DescriptionInfo?.Description;
    }
}