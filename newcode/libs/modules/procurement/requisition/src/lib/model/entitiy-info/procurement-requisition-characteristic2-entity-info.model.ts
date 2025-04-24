/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementRequisitionHeaderDataService } from '../../services/requisition-header-data.service';

/**
 * Entity info for procurement requisition characteristic 2
 */
export const PROCUREMENT_REQUISITION_CHARACTERISTIC2_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '50bfc783c3ec4a41b49efe8cc15d7f51',
	sectionId: BasicsCharacteristicSection.RequisitionCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementRequisitionHeaderDataService);
	}
});