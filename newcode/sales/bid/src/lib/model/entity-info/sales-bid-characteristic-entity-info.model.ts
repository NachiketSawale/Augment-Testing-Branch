/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory} from '@libs/basics/shared'; 
import { SalesBidBidsDataService } from '../../services/sales-bid-bids-data.service';

/**
 * Sales Bid characteristic entity info
 */
export const SALES_BID_CHARACTERISTIC_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'cff858f883ac47919f261c269eb84261',
	sectionId: BasicsCharacteristicSection.SalesBid,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesBidBidsDataService);
	}
});