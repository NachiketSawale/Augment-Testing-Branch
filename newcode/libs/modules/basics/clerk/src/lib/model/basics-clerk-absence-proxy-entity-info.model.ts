/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkAbsenceProxyDataService } from '../services/basics-clerk-absence-proxy-data.service';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkAbsenceProxyEntity } from '@libs/basics/interfaces';
import { BasicsClerkAbsenceProxyValidationService } from '../services/basics-clerk-absence-proxy-validation.service';

export const BASICS_CLERK_ABSENCE_PROXY_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listClerkAbsenceProxyTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkAbsenceProxyTitle' },
		containerUuid:'dcb1b0d146af4bec84d574de19a9f01b'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkAbsenceProxyDataService),
	validationService: (ctx) => ctx.injector.get(BasicsClerkAbsenceProxyValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkAbsenceProxyDto' },
	permissionUuid: 'b5f01723e4c34b8d8f5b90262d7f0288',
	layoutConfiguration: {
		//TODO: project lookup is missing
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkRoleFk','CommentText','ClerkFk','CompanyFk'/*,'ProjectFk'*/]
			}
		],
		overloads: {
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
			CompanyFk:{
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
				})
			}
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				ClerkRoleFk: {key: 'entityClerkRole'},
				CommentText: {key: 'entityComment'},
				ClerkFk: {key: 'entityClerk'},
				CompanyFk: {key: 'entityCompany'},
				ProjectFk: {key: 'entityProject'},
			})
		},
	},
} as IEntityInfo<IBasicsClerkAbsenceProxyEntity>);