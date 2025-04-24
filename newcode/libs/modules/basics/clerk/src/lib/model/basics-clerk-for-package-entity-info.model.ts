/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkForPackageDataService } from '../services/basics-clerk-for-package-data.service';
import { BasicsClerkForPackageValidationService } from '../services/basics-clerk-for-package-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkForPackageEntity } from '@libs/basics/interfaces';

export const BASICS_CLERK_FOR_PACKAGE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkForPackageTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkForPackageTitle' },
		containerUuid:'f8e0f47316db4f628e0f3c394e0bda2f'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkForPackageDataService),
	validationService: (ctx) => ctx.injector.get(BasicsClerkForPackageValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkForPackageDto' },
	permissionUuid: '4fefcbe307f14fb09e7371b5726e8b85',
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
} as IEntityInfo<IBasicsClerkForPackageEntity>);