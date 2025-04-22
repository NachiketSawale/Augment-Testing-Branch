/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import {ProcurementContractTotalDataService} from '../services/procurement-contract-total-data.service';
import { ProcurementCommonTotalBehavior} from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

export const PROCUREMENT_CONTRACT_TOTAL_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractTotalBehavior>('procurementContractTotalBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractTotalBehavior extends ProcurementCommonTotalBehavior<IPrcCommonTotalEntity,  IConHeaderEntity, ContractComplete>{
	public constructor() {
		super(inject(ProcurementContractTotalDataService));
	}
}
