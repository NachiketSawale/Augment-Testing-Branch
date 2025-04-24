/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonCallOffAgreementValidationService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { inject, Injectable } from '@angular/core';
import { IProcurementContractCallOffAgreementEntity } from '../model/entities/con-call-off-agreement-entity.interface';
import { ProcurementContractCallOffAgreementDataService } from './procurement-contract-call-off-agreement-data.service';

/**
 * Account CallOffAgreement validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractCallOffAgreementValidationService extends ProcurementCommonCallOffAgreementValidationService<IProcurementContractCallOffAgreementEntity, IConHeaderEntity, ContractComplete> {
	public constructor() {
		const dataService = inject(ProcurementContractCallOffAgreementDataService);
		super(dataService);
	}
}
