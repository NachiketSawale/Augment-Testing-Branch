/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import { BasicsSharedBillingSchemaBehaviorService, ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementContractBillingSchemaDataService } from '../services/procurement-contract-billing-schema-data.service';

/**
 * Procurement contract billing schema behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractBillingSchemaBehavior extends BasicsSharedBillingSchemaBehaviorService<ICommonBillingSchemaEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementContractBillingSchemaDataService));
	}
}