/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLink2ClerkEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';

export const PROCUREMENT_PACKAGE_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: 'b6d298c07cf14196912cc4a9d2688189',
	gridContainerUuid: 'b6d298c07cf14196912cc4a9d2688189',
	gridTitle: 'procurement.package.listClerkTitle',
	formContainerUuid: '7ffe4fc3ba3342ddace997d43f8d68e5',
	formTitle: 'procurement.package.detailClerkTitle',
	link2clerkDataServiceCreateContext: {
		qualifier: 'procurement.package.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ProcurementPackageHeaderDataService);
		},
	},
});
