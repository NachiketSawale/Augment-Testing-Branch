/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonSubcontractorEntityInfo } from '@libs/procurement/common';
import { ProcurementContractSubcontractorDataService } from '../../services/procurement-contract-subcontractor-data.service';
import { ProcurementContractSubcontractorValidationService } from '../../services/procurement-contract-subcontractor-validation.service';
import { ProcurementContractSubcontractorBehaviorService } from '../../behaviors/procurement-contract-subcontractor-behavior.service';

export const PROCUREMENT_CONTRACT_SUBCONTRACTOR_ENTITY_INFO = ProcurementCommonSubcontractorEntityInfo.create({
	permissionUuid: '2a7e35d3fddc41a0abb141dc2d868ebd',
	formUuid: '3c851039b52b493fbb86f7ae4a459ec0',
	validationServiceToken: ProcurementContractSubcontractorValidationService,
	behavior: ProcurementContractSubcontractorBehaviorService,
	dataServiceToken: ProcurementContractSubcontractorDataService,
});