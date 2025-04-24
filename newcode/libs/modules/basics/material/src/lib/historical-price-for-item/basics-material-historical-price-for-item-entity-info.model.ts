/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsMaterialHistoricalPriceForItemDataService } from './basics-material-historical-price-for-item-data.service';
import { BasicsSharedHistoricalPriceForItemEntityInfo } from '@libs/basics/shared';

export const BASICS_MATERIAL_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO = BasicsSharedHistoricalPriceForItemEntityInfo.create({
	permissionUuid: 'ca7d3a0de6794cf288a9283f5601d861',
	dataServiceToken: BasicsMaterialHistoricalPriceForItemDataService,
});
