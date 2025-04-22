/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { SalesBillingBillsDataService } from '../../services/sales-billing-bills-data.service';
/**
 * Represent sales billing clerk entity info
 */
export const SALES_BILLING_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '39608924dc884afea59fe04cb1434543',
	gridContainerUuid: 'a150506f9acb4ffcbaee544f346dacbd',
	gridTitle: 'sales.billing.clerk.entityClerk',
	formContainerUuid: '55864c62d8524096b5f7d48bd3641579',
	formTitle: 'sales.billing.clerk.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'sales.bil.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(SalesBillingBillsDataService);
		},
	},
});