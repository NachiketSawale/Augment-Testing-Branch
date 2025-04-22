/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcGeneralsEntity, ProcurementCommonGeneralsValidationService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { inject, Injectable } from '@angular/core';
import { ProcurementContractGeneralsDataService } from './procurement-contract-generals-data.service';


/**
 * Generals validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractGeneralsValidationService extends ProcurementCommonGeneralsValidationService<IPrcGeneralsEntity, IConHeaderEntity, ContractComplete> {

    public constructor() {
        const dataService = inject(ProcurementContractGeneralsDataService);
        super(dataService);
    }
}