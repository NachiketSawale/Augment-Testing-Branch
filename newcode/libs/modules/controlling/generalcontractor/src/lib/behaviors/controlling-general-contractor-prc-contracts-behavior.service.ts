import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';

import {Injectable, InjectionToken} from '@angular/core';
import {IPrcContractsEntity} from '../model/entities/prc-contracts-entity.interface';

export const CONTROLLING_GENERAL_CONTRACTOR_PRC_CONTRACTS_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorPrcContractsBehaviorService>('controllingGeneralContractorPrcContractsBehaviorService');
@Injectable({
    providedIn: 'root'
})

export class ControllingGeneralContractorPrcContractsBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPrcContractsEntity>, IPrcContractsEntity> {
    public onCreate(containerLink: IGridContainerLink<IPrcContractsEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IPrcContractsEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}

