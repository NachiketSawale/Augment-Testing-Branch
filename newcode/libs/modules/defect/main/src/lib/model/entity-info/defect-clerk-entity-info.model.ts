/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { DefectMainHeaderDataService } from '../../services/defect-main-header-data.service';

export const DEFECT_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '913B56330DAD4388BBAB12C54A5095BE',
	gridContainerUuid: '913B56330DAD4388BBAB12C54A5095BE',
	gridTitle: 'basics.clerk.listClerkAuthTitle',
	formContainerUuid: 'A7B3399B76BD47CAA1982394C7A6681D',
	formTitle: 'basics.clerk.detailClerkAuthTitle',
	link2clerkDataServiceCreateContext: {
		qualifier: 'defect.main.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(DefectMainHeaderDataService);
		},
		isParentReadonlyFn: (parentService) => {
			const service = parentService as DefectMainHeaderDataService;
			return service.getReadonlyStatus();
		},
		//todo: {"extendService": "defectClerkExtendService"} is still need?
	},
});
