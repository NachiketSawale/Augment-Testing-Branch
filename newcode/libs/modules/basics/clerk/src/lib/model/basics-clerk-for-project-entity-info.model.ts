/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkForProjectDataService } from '../services/basics-clerk-for-project-data.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkForProjectEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_FOR_PROJECT_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkForProjectTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkForProjectTitle' },
		containerUuid:'5af6320d446b4945a1d4f7daa9eb1013'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkForProjectDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkForProjectDto' },
	permissionUuid: '81de3f7a458942018890cd82b2333e5b',
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
	}
} as IEntityInfo<IBasicsClerkForProjectEntity>);