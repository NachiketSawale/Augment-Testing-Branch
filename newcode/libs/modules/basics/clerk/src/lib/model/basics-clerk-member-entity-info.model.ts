/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkMemberDataService } from '../services/basics-clerk-member-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkMemberEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_MEMBERE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkMemberTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkMemberTitle' },
		containerUuid:'6723baf728274de9a7b455bd518c0a79'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkMemberDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkGroupDto' },
	permissionUuid: '1e606c28d2244e6587965611e602244d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkFk','FirstName']
			}
		],
		overloads: {
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				ClerkFk: {key: 'entityClerk'},
				FirstName: {key: 'entityFirstName'}
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				FirstName: {key: 'entityFirstName'}
			})
		}
	},
} as IEntityInfo<IBasicsClerkMemberEntity>);