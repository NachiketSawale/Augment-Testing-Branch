/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { BasicsSharedBillingSchemaBehaviorService, ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementPesBillingSchemaDataService } from '../services/procurement-pes-billing-schema-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

/**
 * Procurement pes billing schema behavior
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesBillingSchemaBehavior extends BasicsSharedBillingSchemaBehaviorService<ICommonBillingSchemaEntity, IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementPesBillingSchemaDataService));
	}
}
