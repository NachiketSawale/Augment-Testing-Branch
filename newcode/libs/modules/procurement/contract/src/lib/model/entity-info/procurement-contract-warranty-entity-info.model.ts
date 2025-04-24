/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonWarrantyEntityInfo } from '@libs/procurement/common';
import { ProcurementContractWarrantyDataService } from '../../services/procurement-contract-warranty-data.service';
import { ProcurementContractWarrantyValidationService } from '../../services/procurement-contract-warranty-validation.service';

export const PROCUREMENT_CONTRACT_WARRANTY_ENTITY_INFO = ProcurementCommonWarrantyEntityInfo.create({
	permissionUuid: '96ad9514b39e48a697354249640402cd',
	formUuid: 'f3cc0860a2ef422ea60cbe978490a02d',
	dataServiceToken: ProcurementContractWarrantyDataService,
	validationServiceToken:ProcurementContractWarrantyValidationService
});

