/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { ContactDataService } from '../../services/contact-data.service';


/**
 * Contact Clerk Entity.
 */
export const CONTACT_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '75af61c378494d838df091d217d8eb30',
	gridContainerUuid: '75af61c378494d838df091d217d8eb30',
	gridTitle: 'businesspartner.main.contact.entityClerk',
	formContainerUuid: '482a021367f24d129930afbd1e8e1f18',
	formTitle: 'businesspartner.main.contact.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'businesspartner.contact.clerk',
		instanceId: 'businesspartner.contact.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ContactDataService);
		},
	},
});
