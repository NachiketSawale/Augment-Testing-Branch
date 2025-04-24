/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkForWicDataService } from '../services/basics-clerk-for-wic-data.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkForWicEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_FOR_WIC_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkForWicTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkForWicTitle' },
		containerUuid:'6042e0bf1d66478da8042b3a207d77bf'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkForWicDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkForWicDto' },
	permissionUuid: '9f5b6cfd39114a25b04b7ea69ef0ddc7',
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
} as IEntityInfo<IBasicsClerkForWicEntity>);