/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedHistoricalPriceForItemEntityInfo } from '@libs/basics/shared';
import { ProcurementPesHistoricalPriceForItemDataService } from '../../services/procurement-pes-historical-price-for-item-data.service';

/**
 * Entity info for procurement pes historical price for item
 */
export const PROCUREMENT_PES_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO = BasicsSharedHistoricalPriceForItemEntityInfo.create({
	permissionUuid: '5f97bc54e649465ca7736c2bb9fdfdb3',
	dataServiceToken: ProcurementPesHistoricalPriceForItemDataService,
});