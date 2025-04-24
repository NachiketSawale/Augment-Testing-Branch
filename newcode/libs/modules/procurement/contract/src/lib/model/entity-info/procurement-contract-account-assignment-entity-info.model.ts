/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonAccountAssignmentEntityInfo } from '@libs/procurement/common';
import { ProcurementContractAccountAssignmentDataService } from '../../services/procurement-contract-account-assignment-data.service';
import { IConAccountAssignmentEntity } from '../entities/con-account-assignment-entity.interface';
import { IConHeaderEntity } from '../entities';
import { ContractComplete } from '../contract-complete.class';
import { ProcurementContractAccountAssignmentValidationService } from '../../services/procurement-contract-account-assignment-validation.service';
import { ProcurementContractAccountAssignmentLayoutService } from '../../services/procurement-contract-account-assignment-layout.service';

export const PROCUREMENT_CONTRACT_ACCOUNT_ASSIGNMENT_ENTITY_INFO = ProcurementCommonAccountAssignmentEntityInfo.create<IConAccountAssignmentEntity, IConHeaderEntity, ContractComplete>({
	permissionUuid: '1c5e0a69e0a343eeb3e9f9e700f171eb',
	formUuid: '41536bfcb3804f9db46e1373af41f561',
	dataServiceToken: ProcurementContractAccountAssignmentDataService,
	validationServiceToken: ProcurementContractAccountAssignmentValidationService,
	moduleSubModule: 'Procurement.Contract',
	typeName: 'ConAccountAssignmentDto',
	layoutServiceToken:ProcurementContractAccountAssignmentLayoutService
});
