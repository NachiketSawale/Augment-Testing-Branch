/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalValidationService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { inject, Injectable } from '@angular/core';
import { ProcurementContractTotalDataService } from './procurement-contract-total-data.service';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Contract total validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractTotalValidationService extends ProcurementCommonTotalValidationService<IPrcCommonTotalEntity, IConHeaderEntity, ContractComplete> {
	protected checkUniqueTotalTypeRoute: string = 'procurement/contract/total/';

	public constructor() {
		const dataService = inject(ProcurementContractTotalDataService);

		super(dataService);
	}

}