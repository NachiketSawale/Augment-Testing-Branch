/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedHistoricalPriceForItemEntityInfo } from '@libs/basics/shared';
import { ProcurementPriceComparisonHistoricalPriceForItemDataService } from '../../services/data/item/historical-price-for-item-data.service';

export const HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO = BasicsSharedHistoricalPriceForItemEntityInfo.create({
	permissionUuid: '1499239c009b4f33b7821484657c02d1',
	dataServiceToken: ProcurementPriceComparisonHistoricalPriceForItemDataService
});