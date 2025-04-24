/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkRoleDefaultValueDataService } from '../services/basics-clerk-role-default-value-data.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkRoleDefaultValueEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_ROLE_DEFAULT_VALUE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkRoleDefaultValueTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkRoleDefaultValueTitle' },
		containerUuid:'88bddfa6b18e4f6c81960df2fc0e6744'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkRoleDefaultValueDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkRoleDefaultValueDto' },
	permissionUuid: '087f9e6948a2416e936e7e88f33e46df',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkRoleDefValTypeFk', 'ClerkRoleFk']
			}
		],
		overloads:{
			ClerkRoleDefValTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleDefaultValueTypeLookupOverload(true),
			ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				ClerkRoleFk: {key: 'entityClerkRole'},
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				ClerkRoleDefValTypeFk: {key: 'clerkRoleDefValType'},
			}),
		}
	},
} as IEntityInfo<IBasicsClerkRoleDefaultValueEntity>);