/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';

export const BUSINESS_PARTNER_MAIN_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: 'fbed0a3bb7c94d6a8301f99c8c9c86c7',
	gridContainerUuid: 'fbed0a3bb7c94d6a8301f99c8c9c86c7',
	gridTitle: 'businesspartner.main.businesspartner.entityClerkAlt',
	formContainerUuid: '7eb431f3037440f2a5d0a7af9f70a380',
	formTitle: 'businesspartner.main.businesspartner.entityClerkAltDetail',
	link2clerkDataServiceCreateContext: {
		qualifier: 'businesspartner.main.clerkalt',
		parentServiceFn: (ctx) => {
			/**
			 * TODO: Need to check code implementation done for clerk list into mainheader service
			 */
			return ctx.injector.get(BusinesspartnerMainHeaderDataService);
		},
		
	},
});
