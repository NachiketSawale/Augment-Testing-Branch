/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStockClerkDataService, ProjectStockClerkValidationService } from '@libs/project/stock';
import { IProjectStock2ClerkEntity } from '@libs/project/interfaces';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const projectStockClerkEntityInfo: EntityInfo = EntityInfo.create<IProjectStock2ClerkEntity>({
	grid: {
		title: {key: 'project.stock.clerkListContainerTitle'},
	},
	form: {
		title: {key: 'project.stock.clerkDetailContainerTitle'},
		containerUuid: '02fdd0c53fe6408c9baf85931f707a6a',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockClerkDataService),
	validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockClerkValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Stock', typeName: 'ProjectStock2ClerkDto'},
	permissionUuid: 'c032155470ec4b67873c8d59887e0590',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ValidFrom', 'ValidTo', 'Comment', 'BasClerkFk', 'BasClerkRoleFk'],
			}
		],
		overloads: {
			BasClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			BasClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'entityDescription'},
				BasClerkFk: {key: 'entityClerk'},
				BasClerkRoleFk: {key: 'entityClerkRole'},
				Comment: {key: 'entityComment'},

			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				ValidFrom: {key: 'entityValidFrom'},
				ValidTo: {key: 'entityValidTo'}
			})
		},
	},
});