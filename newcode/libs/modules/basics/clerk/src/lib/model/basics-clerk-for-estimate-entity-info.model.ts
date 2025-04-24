/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkForEstimateEntity } from '@libs/basics/interfaces';
import { BasicsClerkForEstimateDataService } from '../services/basics-clerk-for-estimate-data.service';

export const BASICS_CLERK_FOR_ESTIMATE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkForEstimateTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkForEstimateTitle' },
		containerUuid:'874e6bfd2cad48bca4a578699a51ee81'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkForEstimateDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkForEstimateDto' },
	permissionUuid: 'd0919db314094f058b6eca179f017e6d',
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
} as IEntityInfo<IBasicsClerkForEstimateEntity>);