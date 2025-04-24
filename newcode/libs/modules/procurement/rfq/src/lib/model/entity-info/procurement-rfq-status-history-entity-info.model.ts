/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedSatusHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementRfqStatusHistoryDataService } from '../../services/procurement-rfq-status-history-data.service';

export const RFQ_STATUS_HISTORY_ENTITY_INFO = BasicsSharedSatusHistoryEntityInfo.create({
	dataServiceToken: ProcurementRfqStatusHistoryDataService,
});