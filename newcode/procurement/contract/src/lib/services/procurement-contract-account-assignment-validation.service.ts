/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonAccountAssignmentValidationService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { inject, Injectable } from '@angular/core';
import { IConAccountAssignmentEntity } from '../model/entities/con-account-assignment-entity.interface';
import { ProcurementContractAccountAssignmentDataService } from './procurement-contract-account-assignment-data.service';
import { ContractComplete } from '../model/contract-complete.class';

/**
 * Account Assignment validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractAccountAssignmentValidationService extends ProcurementCommonAccountAssignmentValidationService<IConAccountAssignmentEntity, IConHeaderEntity, ContractComplete> {
	public constructor() {
		const dataService = inject(ProcurementContractAccountAssignmentDataService);
		super(dataService);
	}
}
