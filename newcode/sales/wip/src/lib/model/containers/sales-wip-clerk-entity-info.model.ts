/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { SalesWipWipsDataService } from '../../services/sales-wip-wips-data.service';


export const SALES_WIP_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	//todo-grid options behavior needs to be added, and the goto button should be hidden by default
	permissionUuid: '689e0886de554af89aadd7e7c3b46f25',
	gridContainerUuid: '4f128b28d5164036bf7f29adcb08dd90',
	gridTitle: 'sales.wip.clerk.entityClerk',
	formContainerUuid: 'a92e365456954db0a4d7cf20d566bed2',
	formTitle: 'sales.wip.clerk.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'sales.wip.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(SalesWipWipsDataService);
		},
	},
});