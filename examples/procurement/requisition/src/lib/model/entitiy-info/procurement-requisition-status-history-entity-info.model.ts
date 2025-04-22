/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedSatusHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementRequisitionStatusHistoryDataService } from '../../services/procurement-requisition-status-history-data.service';

export const REQUISITION_STATUS_HISTORY_ENTITY_INFO = BasicsSharedSatusHistoryEntityInfo.create({
	dataServiceToken: ProcurementRequisitionStatusHistoryDataService,
});