/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable,inject } from '@angular/core';
import { IPrcSubreferenceEntity,ProcurementCommonSubcontractorBehaviorService} from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import { ProcurementContractSubcontractorDataService } from '../services/procurement-contract-subcontractor-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractSubcontractorBehaviorService extends ProcurementCommonSubcontractorBehaviorService<IPrcSubreferenceEntity,  IConHeaderEntity, ContractComplete>{
	public constructor() {
		super(inject(ProcurementContractSubcontractorDataService));
	}
}
