/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkForScheduleDataService } from '../services/basics-clerk-for-schedule-data.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkForScheduleEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_FOR_SCHEDULE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkForScheduleTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkForScheduleTitle' },
		containerUuid:'be18520a1fb34649bf3c4ebcd6da2eea'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkForScheduleDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkForScheduleDto' },
	permissionUuid: 'e84e703543fd4cb2b8d9bd8e48ecce94',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Clerk2Fk','ClerkRoleFk','CommentText']
			}
		],
		overloads: {
			Clerk2Fk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Clerk2Fk: {key: 'entityClerk'},
				ClerkRoleFk: {key: 'entityClerkRole'},
				CommentText: {key: 'entityComment'},
			})
		},
	},
} as IEntityInfo<IBasicsClerkForScheduleEntity>);
