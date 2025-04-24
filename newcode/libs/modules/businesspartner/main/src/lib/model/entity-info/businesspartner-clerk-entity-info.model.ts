/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';

export const BUSINESS_PARTNER_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '1a3e4d47049242e58f149208e9732d8f',
	gridContainerUuid: '1a3e4d47049242e58f149208e9732d8f',
	gridTitle: 'businesspartner.main.businesspartner.entityClerk',
	formContainerUuid: '24178473693143239dbbffe71d098496',
	formTitle: 'businesspartner.main.businesspartner.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'businesspartner.main.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(BusinesspartnerMainHeaderDataService);
		},
	},
});
