/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
    IPrcMilestoneEntity,
    ProcurementCommonMileStoneDataService
} from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';
import {ProcurementModule} from '@libs/procurement/shared';


export const PROCUREMENT_CONTRACT_MILE_STONE_DATA_TOKEN = new InjectionToken<ProcurementContractMileStoneDataService>('procurementContractMileStoneDataService');


/**
 * MileStone service in contract
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementContractMileStoneDataService extends ProcurementCommonMileStoneDataService<IPrcMilestoneEntity,IConHeaderEntity, ContractComplete> {
    /**
     * The constructor
     */
    public constructor() {
        const parentService = inject(ProcurementContractHeaderDataService);
        super(parentService);
    }

    protected getMainItemId(parent:IConHeaderEntity){
        return parent.PrcHeaderFk;
    }
    protected getProjectId(parent:IConHeaderEntity){
        return parent.ProjectFk!;
    }

    protected getModuleName(): string {
        return ProcurementModule.Contract.toLowerCase();
    }

    public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcMilestoneEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}