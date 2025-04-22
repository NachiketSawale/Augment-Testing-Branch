/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { SalesBidBidsDataService } from '../../services/sales-bid-bids-data.service';

/**
 * Represent sales bid clerk entity info
 */
export const SALES_BID_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '7001204d7fb04cf48d8771c8971cc1e5',
	gridContainerUuid: '3b5b0d89fb2744f6b3c97b3b2bcf817e',
	gridTitle: 'sales.bid.clerk.entityClerk',
	formContainerUuid: '2ae3555db27a40988a21c8e42336e42a',
	formTitle: 'sales.bid.clerk.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'sales.bid.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(SalesBidBidsDataService);
		},
	},
});