/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonMileStoneEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionMileStoneDataService } from '../../services/procurement-requisition-mile-stone-data.service';

/**
 * Entity info for procurement requisition milestone
 */
export const PROCUREMENT_REQUISITION_MILE_STONE_ENTITY_INFO = ProcurementCommonMileStoneEntityInfo.create({
	permissionUuid: '7c83fc5cea7a4c8396d47877ae72b4b4',
	formUuid: '0bb47dca70154864908d62c04bb5357a',
	dataServiceToken: ProcurementRequisitionMileStoneDataService,
});
