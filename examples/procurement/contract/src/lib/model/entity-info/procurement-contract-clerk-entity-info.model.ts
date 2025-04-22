/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';

export const PROCUREMENT_CONTRACT_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	//todo-grid options behavior needs to be added, and the goto button should be hidden by default
	permissionUuid: '8559f4ea73e746c7a1f7cb718917b125',
	gridContainerUuid: '8559f4ea73e746c7a1f7cb718917b125',
	gridTitle: 'procurement.contract.contract.entityClerk',
	formContainerUuid: 'b5f7cdcc332d4297aefb909934eeceb4',
	formTitle: 'procurement.contract.contract.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'procurement.contract.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ProcurementContractHeaderDataService);
		},
	},
});
