/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLink2ClerkEntityInfoFactory, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROCUREMENT_STRUCTURE_CLERK_ENTITY_INFO = BasicsSharedLink2ClerkEntityInfoFactory.create({
	permissionUuid: '7c0a01cb2d6e44c2b16b4ce92d06b8ac',
	gridContainerUuid: '7c0a01cb2d6e44c2b16b4ce92d06b8ac',
	gridTitle: 'cloud.common.entityClerk',
	formContainerUuid: '54a8d3ae2b594e70a7478c58edaa0815',
	formTitle: 'cloud.common.entityClerkForm',
	link2clerkDataServiceCreateContext: {
		qualifier: 'basics.procurementstructure.clerk',
		instanceId: 'basics.procurementstructure.clerk',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(BasicsProcurementStructureDataService);
		},
	},
	customizeLayoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['ContextFk', 'ClerkFk', 'ClerkRoleFk', 'CommentText'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.common.', {
				ClerkFk: { key: 'entityClerk', text: 'Clerk' },
				ClerkRoleFk: { key: 'entityClerkRole', text: 'ClerkRole' },
				CommentText: { key: 'entityCommentText', text: 'Comment Text' },
			}),
			...prefixAllTranslationKeys('basics.procurementstructure.', {
				ContextFk: { key: 'configuration' },
			}),
		},
		overloads: {
			ContextFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationHeaderLookupOverload(false), 
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'basics.clerk.clerkdesc'), 
			ClerkRoleFk:
			 {
				...BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
				...{
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							singleRow: true,
						},
					],
				} 
			},
		},
	},
});
