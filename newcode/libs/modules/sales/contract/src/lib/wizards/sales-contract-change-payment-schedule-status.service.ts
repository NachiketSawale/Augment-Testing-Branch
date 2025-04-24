import { inject, Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {
    BasicsSharedChangeStatusService,
    IStatusChangeOptions,
    StatusIdentificationData
} from '@libs/basics/shared';
import { IOrdHeaderEntity, IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';
import { SalesContractPaymentScheduleDataService } from '../services/sales-contract-payment-schedule-data.service';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';

@Injectable({
    providedIn: 'root'
})
export class SalesContractChangePaymentScheduleStatusWizardService extends BasicsSharedChangeStatusService<IOrdPaymentScheduleEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

    /**
     * The entrance of the wizard
     * @param context
     */
    public static execute(context: IInitializationContext): void {
        context.injector.get(SalesContractChangePaymentScheduleStatusWizardService).changePaymentScheduleStatus();
    }

    protected readonly dataService = inject(SalesContractPaymentScheduleDataService);
    protected readonly statusConfiguration: IStatusChangeOptions<IOrdHeaderEntity, SalesContractContractsComplete> = {
        title: 'Change contract Status',
        isSimpleStatus: false,
        statusName: 'salescontractpaymentschedule',
        checkAccessRight: true,
        statusField: 'OrdPsStatusFk',
        getEntityCodeFn: this.getCode,
        getEntityDescFn: this.getDescription
    };

    public changePaymentScheduleStatus() {
        this.startChangeStatusWizard();
    }

    public override convertToStatusIdentification(selection: IOrdPaymentScheduleEntity[]): StatusIdentificationData[] {
        return selection.map(item => {
            return {
                id: item.Id,
                ordHeaderId: item.OrdHeaderFk ?? undefined
            };
        });
    }

    public override afterStatusChanged() {

    }

    private getCode(entity:object){
        const contract = entity as IOrdPaymentScheduleEntity;
        return contract.Code ?? '';
    }

    private  getDescription(entity:object){
        const contract = entity as IOrdPaymentScheduleEntity;
        return contract.DescriptionInfo?.Description;
    }

}