/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonGeneralsEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionGeneralsDataService } from '../../services/procurement-requisition-generals-data.service';
import { ProcurementRequisitionGeneralsValidationService } from '../../services/validations/procurement-requisition-generals-validation.service';

/**
 * Entity info for procurement requisition Generals
 */
export const PROCUREMENT_REQUISITION_GENERALS_ENTITY_INFO = ProcurementCommonGeneralsEntityInfo.create({
	permissionUuid: 'd3873514781444dc9f62255ca041e394',
	formUuid: 'aaa310c6ef324cfba4c90e4333d1efb2',
	dataServiceToken: ProcurementRequisitionGeneralsDataService,
	validationServiceToken:ProcurementRequisitionGeneralsValidationService
});