/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { BusinesspartnerContactDataService } from '../../services/businesspartner-contact-data.service';

export const BUSINESS_PARTNER_CONTACT_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '75af61c378494d838df091d217d8eb30',
	gridContainerUuid: 'cae393de7edc4d67b528e3ed8f5d90f3',
	gridTitle: 'businesspartner.main.contact.entityClerk',
	formContainerUuid: 'ac7e9c5ab92b46189fca366e4b818b88',
	formTitle: 'businesspartner.main.contact.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'businesspartner.contact.clerk',
		instanceId: 'businesspartner.contact.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(BusinesspartnerContactDataService);
		},
	},
});
