/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import { ProcurementContractPostConHistoryDataService } from '../services/procurement-contract-postcon-history-data.service';
import { BasicsSharedPostConHistoryBehavior, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';

export const PROCUREMENT_CONTRACT_POST_CON_HISTORY_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractPostConHistoryBehavior>('procurementContractPostConHistoryBehavior');

/**
 * Procurement PostCon History item behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPostConHistoryBehavior extends BasicsSharedPostConHistoryBehavior<IBasicsSharedPostConHistoryEntity, IConHeaderEntity,
	 ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementContractPostConHistoryDataService));
	}
}