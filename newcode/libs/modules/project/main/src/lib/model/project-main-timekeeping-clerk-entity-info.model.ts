/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainTimekeepingClerkDataService } from '../services/project-main-timekeeping-clerk-data.service';
import { ITimekeeping2ClerkEntity } from '@libs/project/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainTimekeepingClerkValidationService } from '../services/project-main-timekeeping-clerk-validation.service';


export const PROJECT_MAIN_TIMEKEEPING_CLERK_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeeping2ClerkEntity>({
	grid: {
		title: {key: 'project.main.timekeeping2ClerkAuthListTitle'},
	},
	form: {
		title: {key: 'project.main.timekeeping2ClerkAuthDetailTitle'},
		containerUuid: 'c9902287755c4d51bacc15895b8fcb83',
	},
	dataService: ctx => ctx.injector.get(ProjectMainTimekeepingClerkDataService),
	validationService: ctx => ctx.injector.get(ProjectMainTimekeepingClerkValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'Timekeeping2ClerkDto'},
	permissionUuid: 'f15717298ad24cf0a7891b3a4a6900ba',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [/*'JobFk',*/ 'ClerkFk', 'ClerkRoleFk', 'CommentText']}
		],
		overloads: {
			// TODO: JobFk
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job.', {
				JobFk: { key: 'entityJob'},
			}),
			...prefixAllTranslationKeys('cloud.common.',{
				ClerkFk:{ key: 'entityClerk'},
				ClerkRoleFk:{ key: 'entityClerkRole'},
				CommentText: {key: 'entityComment'}
			}),
		}
	},
});