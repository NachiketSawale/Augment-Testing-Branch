/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedSatusHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementQuoteStatusHistoryDataService } from '../../services/procurement-quote-status-history-data.service';

export const QUOTE_STATUS_HISTORY_ENTITY_INFO = BasicsSharedSatusHistoryEntityInfo.create({
	dataServiceToken: ProcurementQuoteStatusHistoryDataService,
});