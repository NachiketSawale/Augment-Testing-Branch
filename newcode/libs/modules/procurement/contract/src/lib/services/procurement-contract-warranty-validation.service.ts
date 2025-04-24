/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcWarrantyEntity, ProcurementCommonWarrantyValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementContractWarrantyDataService } from './procurement-contract-warranty-data.service';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';

/**
 * Contract warranty validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractWarrantyValidationService extends ProcurementCommonWarrantyValidationService<IPrcWarrantyEntity, IConHeaderEntity, ContractComplete> {
	public constructor() {
		const dataService = inject(ProcurementContractWarrantyDataService);
		super(dataService);
	}

}