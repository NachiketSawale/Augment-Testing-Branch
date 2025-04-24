/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingMainClerkDataService } from '../services/scheduling-main-clerk-data.service';
import { IActivityClerkEntity } from '@libs/scheduling/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const SCHEDULING_MAIN_CLERK_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityClerkEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.entityClerk'},
	},
	form: {
		title: { key: 'basics.clerk.detailClerkTitle' },
		containerUuid: '13c7ff9d5fb24b96a2274507fa453422',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainClerkDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityClerkDto'},
	permissionUuid: 'cdb0ea3d378846ab81bde1020e62f32f',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['ClerkFk','ClerkRoleFk','Remark','ValidFrom']
			}
		],
		overloads: {
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkRoleFk: BasicsSharedLookupOverloadProvider.provideClerkRoleLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('scheduling.main.', {
				ClerkFk:{key:'entityClerk'},
				ClerkRoleFk:{key: 'entityRole'},
				Remark:{key:'entityRemark'},
				ValidFrom:{key:'entityValidFrom'}
			}),
		}
	}
});