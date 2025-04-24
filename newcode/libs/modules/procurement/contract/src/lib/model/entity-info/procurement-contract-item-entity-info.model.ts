/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonItemEntityInfo } from '@libs/procurement/common';
import { ProcurementContractItemDataService } from '../../services/procurement-contract-item-data.service';
import { ProcurementContractItemValidationService } from '../../services/procurement-contract-item-validation.service';
import { ProcurementContractItemBehavior } from '../../behaviors/procurement-contract-item-behavior.service';

export const PROCUREMENT_CONTRACT_ITEM_ENTITY_INFO = ProcurementCommonItemEntityInfo.create({
	permissionUuid: 'def60cc8fa044fe08ff72b773af9d7ef',
	formUuid: '32bd7dde490a449ebad0395ff8effd1e',
	dataServiceToken: ProcurementContractItemDataService,
	validationServiceToken: ProcurementContractItemValidationService,
	behavior: ProcurementContractItemBehavior
});