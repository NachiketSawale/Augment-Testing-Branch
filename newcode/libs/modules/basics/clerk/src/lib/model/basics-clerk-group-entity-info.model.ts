/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkGroupDataService } from '../services/basics-clerk-group-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkGroupEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkGroupTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkGroupTitle' },
		containerUuid:'008843fcaa8246faa41f620a0742b3ae'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkGroupDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkGroupDto' },
	permissionUuid: '82bb9ecf97e94aadab3d30f79cba2c02',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkGroupFk','Department']
			}
		],
		overloads: {
			ClerkGroupFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Department: {key: 'entityDepartment'},
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				ClerkGroupFk: {key: 'entityClerkGroup'},
			})
		},
	},
} as IEntityInfo<IBasicsClerkGroupEntity>);