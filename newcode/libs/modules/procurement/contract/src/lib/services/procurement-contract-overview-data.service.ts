/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	IProcurementCommonOverviewEntity, ProcurementCommonOverviewDataHelperService,
	ProcurementCommonOverviewDataService, ProcurementOverviewSearchlevel
} from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';
import {ProcurementModule} from '@libs/procurement/shared';
import { CompleteIdentification } from '@libs/platform/common';


export const PROCUREMENT_CONTRACT_OVERVIEW_DATA_TOKEN = new InjectionToken<ProcurementContractOverviewDataService>('procurementContractOverviewDataService');


/**
 * Overview service in contract
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementContractOverviewDataService extends ProcurementCommonOverviewDataService<IProcurementCommonOverviewEntity,CompleteIdentification<IProcurementCommonOverviewEntity>,IConHeaderEntity, ContractComplete> {
    /**
     * The constructor
     */
    public constructor() {
        const parentService = inject(ProcurementContractHeaderDataService);
	     const moduleInfoEntities = new ProcurementCommonOverviewDataHelperService();
        super(parentService,{
			  moduleName:ProcurementModule.Contract.toLowerCase(),
	        entityInfo:moduleInfoEntities.getContractOverviewContainerList(),
	        searchLevel:ProcurementOverviewSearchlevel.RootContainer
        });
    }
}