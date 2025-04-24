/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonWarrantyEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionWarrantyDataService } from '../../services/procurement-requisition-warranty-data.service';
import { ProcurementRequisitionWarrantyValidationService } from '../../services/validations/procurement-requisition-warranty-validation.service';

/**
 * Entity info for procurement Requisition Warranty
 */
export const PROCUREMENT_REQUISITION_WARRANTY_ENTITY_INFO = ProcurementCommonWarrantyEntityInfo.create({
	permissionUuid: 'ae65ccbf11c64125ad436d6b16ed22a2',
	formUuid: 'b6b389737d624dff8be324430daeb6b1',
	dataServiceToken: ProcurementRequisitionWarrantyDataService,
	validationServiceToken: ProcurementRequisitionWarrantyValidationService
});
