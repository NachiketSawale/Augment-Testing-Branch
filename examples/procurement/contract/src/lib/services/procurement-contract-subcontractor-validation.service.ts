/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcSubreferenceEntity, ProcurementCommonSubcontractorValidationService} from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { inject } from '@angular/core';
import { ProcurementContractSubcontractorDataService } from './procurement-contract-subcontractor-data.service';

/**
 * Contract subcontractor validation service
 */
export class ProcurementContractSubcontractorValidationService extends ProcurementCommonSubcontractorValidationService<IPrcSubreferenceEntity, IConHeaderEntity, ContractComplete> {

	public constructor() {
		const dataService = inject(ProcurementContractSubcontractorDataService);
		super(dataService);
	}

}