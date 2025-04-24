/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SalesBidBidsDataService } from '../../services/sales-bid-bids-data.service';


/**
 * Entity info for Sales bid characteristic 2
 */
export const SALES_BID_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '314a70890a4e4cdc83c66906aabfed04',
	sectionId: BasicsCharacteristicSection.SalesBid,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesBidBidsDataService);
	}
});