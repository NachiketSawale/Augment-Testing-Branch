/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementPackageHistoricalPriceForItemDataService } from '../../services/procurement-package-historical-price-for-item-data.service';
import { BasicsSharedHistoricalPriceForItemEntityInfo } from '@libs/basics/shared';

export const PACKAGE_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO = BasicsSharedHistoricalPriceForItemEntityInfo.create({
	permissionUuid: 'fc8250bdaf8e41f2822a3c400487f21e',
	dataServiceToken: ProcurementPackageHistoricalPriceForItemDataService,
});
