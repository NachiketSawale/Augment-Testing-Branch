/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsClerkAbsenceDataService } from '../services/basics-clerk-absence-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkAbsenceEntity } from '@libs/basics/interfaces';
import { BasicsClerkAbsenceValidationService } from '../services/basics-clerk-absence-validation.service';


export const BASICS_CLERK_ABSENCE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.listAbsenceTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkAbsenceTitle' },
		containerUuid:'6122eee3bf1a41ce994e0f1e5c165850'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkAbsenceDataService),
	validationService: (ctx) => ctx.injector.get(BasicsClerkAbsenceValidationService),
	dtoSchemeId: {moduleSubModule: 'Basics.Clerk', typeName: 'ClerkAbsenceDto'},
	permissionUuid: 'dde598002bbf4a2d96c82dc927e3e578',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkFk','AbsenceFrom','AbsenceTo','Description'],
			}
		],
		overloads: {
			ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'entityDescription'},
				ClerkFk: {key: 'entityClerk'}
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				AbsenceFrom: {key: 'absencefrom'},
				AbsenceTo: {key: 'absenceto'},
			})
		},
	},
} as IEntityInfo<IBasicsClerkAbsenceEntity>);