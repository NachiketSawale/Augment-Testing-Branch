/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonOverviewEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteOverviewDataService } from '../../services/procurement-quote-overview-data.service';

/**
 * Entity info for procurement Quote overview
 */
export const PROCUREMENT_QUOTE_OVERVIEW_ENTITY_INFO = ProcurementCommonOverviewEntityInfo.create({
	permissionUuid: 'ECE3FC134A304FE78FCEFBD0E38DA4CE',
	dataServiceToken: ProcurementQuoteOverviewDataService,
});