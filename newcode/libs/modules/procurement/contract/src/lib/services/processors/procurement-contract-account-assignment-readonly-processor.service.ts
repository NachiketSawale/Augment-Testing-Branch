/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '../../model/entities';
import { ReadonlyFunctions } from '@libs/basics/shared';
import { IConAccountAssignmentEntity } from '../../model/entities/con-account-assignment-entity.interface';
import { ProcurementCommonAccountAssignmentReadonlyProcessor } from '@libs/procurement/common';
import { ProcurementContractAccountAssignmentDataService } from '../procurement-contract-account-assignment-data.service';
import { ContractComplete } from '../../model/contract-complete.class';

/**
 * Procurement Account assignment entity readonly processor
 */
export class ProcurementContractAccountAssignmentReadonlyProcessor extends ProcurementCommonAccountAssignmentReadonlyProcessor<IConAccountAssignmentEntity, IConHeaderEntity, ContractComplete> {


	public constructor(protected accountAssignmentDataService: ProcurementContractAccountAssignmentDataService) {
		super(accountAssignmentDataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IConAccountAssignmentEntity> {
		return {
			...super.generateReadonlyFunctions(),
			PsdActivityFk: (e) => !e.item.PsdScheduleFk,
		};
	}
}
