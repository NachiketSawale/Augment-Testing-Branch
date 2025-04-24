/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalEntityInfo } from '@libs/procurement/common';
import { ProcurementContractTotalDataService } from '../../services/procurement-contract-total-data.service';
import { ProcurementContractTotalValidationService } from '../../services/procurement-contract-total-validation.service';
import { ProcurementContractTotalBehavior } from '../../behaviors/procurement-contract-total-behavior.service';
import { ProcurementModule } from '@libs/procurement/shared';

export const PROCUREMENT_CONTRACT_TOTAL_ENTITY_INFO = ProcurementCommonTotalEntityInfo.create({
	permissionUuid: 'b19c1f681eee490ebb3ac023854db68d',
	formUuid: '2060a0f87a74486da566831ac64c8be6',
	dataServiceToken: ProcurementContractTotalDataService,
	validationServiceToken: ProcurementContractTotalValidationService,
	behavior: ProcurementContractTotalBehavior,
	dtoSchemeConfig: { moduleSubModule: ProcurementModule.Contract, typeName: 'ConTotalDto' },
});
