/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions, StatusIdentificationData } from '@libs/basics/shared';
import { IBidHeaderEntity } from '@libs/sales/interfaces';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';
import { SalesBidBidsDataService } from '../services/sales-bid-bids-data.service';
@Injectable({
    providedIn: 'root',
})
/**
 * Change Sales bid bid Status Wizard Service
 */
export class SalesBidChangeBidStatusWizardService extends BasicsSharedChangeStatusService<IBidHeaderEntity, IBidHeaderEntity, BidHeaderComplete> {
    protected readonly dataService = inject(SalesBidBidsDataService);
    protected statusConfiguration: IStatusChangeOptions<IBidHeaderEntity, BidHeaderComplete> = {
        title: 'sales.bid.wizardCSChangeBidStatus',
        guid: '30cccc5ae6f34808aac013b72cd1d361',
        isSimpleStatus: false,
        statusName: 'bid',
        checkAccessRight: true,
        statusField: 'BidStatusFk',
        rootDataService: this.dataService,
        updateUrl: 'sales/bid/changestatus',
        getEntityCodeFn: this.getCode,
        getEntityDescFn: this.getDescription
    };

    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }

    public override convertToStatusIdentification(selection: IBidHeaderEntity[]): StatusIdentificationData[] {
        return selection.map(item => {
            return {
                id: item.Id,
                projectId: item.ProjectFk ?? undefined
            };
        });
    }

    private getCode(entity:object){
        const bid = entity as IBidHeaderEntity;
        return bid.Code ?? '';
    }

    private  getDescription(entity:object){
        const bid = entity as IBidHeaderEntity;
        return bid.DescriptionInfo?.Description;
    }
}