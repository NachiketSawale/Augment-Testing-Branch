/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonSubcontractorEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionSubcontractorValidationService } from '../../services/validations/procurement-requisition-subcontractor-validation.service';
import { ProcurementRequisitionSubcontractorDataService } from '../../services/procurement-requisition-subcontractor-data.service';
/**
 * Entity info for procurement requisition subcontractor
 */
export const PROCUREMENT_REQUISITION_SUBCONTRACTOR_ENTITY_INFO = ProcurementCommonSubcontractorEntityInfo.create({
	permissionUuid: 'b5431f508a644c73ae29cc90b8e6073b',
	formUuid: '21676554d0e7405eb6ec6ef75d4bd6df',
	validationServiceToken: ProcurementRequisitionSubcontractorValidationService,
	dataServiceToken: ProcurementRequisitionSubcontractorDataService,
});