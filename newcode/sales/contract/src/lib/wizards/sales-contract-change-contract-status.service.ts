import { inject, Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {
    BasicsSharedChangeStatusService,
    IStatusChangeOptions,
    StatusIdentificationData
} from '@libs/basics/shared';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

@Injectable({
    providedIn: 'root'
})
export class SalesContractChangeContractStatusWizardService extends BasicsSharedChangeStatusService<IOrdHeaderEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

    /**
     * The entrance of the wizard
     * @param context
     */
    public static execute(context: IInitializationContext): void {
        context.injector.get(SalesContractChangeContractStatusWizardService).changeContractStatus();
    }

    protected readonly dataService = inject(SalesContractContractsDataService);
    protected readonly statusConfiguration: IStatusChangeOptions<IOrdHeaderEntity, SalesContractContractsComplete> = {
        title: 'Change contract Status',
        isSimpleStatus: false,
        statusName: 'salescontract',
        checkAccessRight: true,
        statusField: 'ConStatusFk',
        getEntityCodeFn: this.getCode,
        getEntityDescFn: this.getDescription
    };

    public changeContractStatus() {
        this.startChangeStatusWizard();
    }

    public override convertToStatusIdentification(selection: IOrdHeaderEntity[]): StatusIdentificationData[] {
        return selection.map(item => {
            return {
                id: item.Id,
                projectId: item.ProjectFk ?? undefined
            };
        });
    }

    public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }

    private getCode(entity:object){
        const contract = entity as IOrdHeaderEntity;
        return contract.Code ?? '';
    }

    private  getDescription(entity:object){
        const contract = entity as IOrdHeaderEntity;
        return contract.DescriptionInfo?.Description;
    }

}