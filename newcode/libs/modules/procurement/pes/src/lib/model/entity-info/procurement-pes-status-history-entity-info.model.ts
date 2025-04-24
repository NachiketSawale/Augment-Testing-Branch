/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedSatusHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementPesStatusHistoryDataService } from '../../services/procurement-pes-status-history-data.service';

export const PES_STATUS_HISTORY_ENTITY_INFO = BasicsSharedSatusHistoryEntityInfo.create({
	dataServiceToken: ProcurementPesStatusHistoryDataService,
});
