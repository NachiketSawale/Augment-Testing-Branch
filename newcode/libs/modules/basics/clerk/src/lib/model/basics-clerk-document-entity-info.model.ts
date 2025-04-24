/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { IBasicsClerkDocumentEntity } from '@libs/basics/interfaces';
import { BasicsClerkDocumentDataService } from '../services/basics-clerk-document-data.service';
import { BasicsClerkDocumentValidationService } from '../services/basics-clerk-document-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const BASICS_CLERK_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'basics.clerk.documentContainerGridTitle'},
		behavior: ctx => new DocumentsSharedBehaviorService<IBasicsClerkDocumentEntity>(ctx.injector.get(BasicsClerkDocumentDataService), ctx.injector),
	},
	form: {
		title: {key: 'basics.clerk.documentDetailTitle' },
		containerUuid:'76a09b0b774e4626a3d5cf6a1c05e276'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkDocumentDataService),
	validationService: (ctx) => ctx.injector.get(BasicsClerkDocumentValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'Clerk2documentDto' },
	permissionUuid: 'fbbf119ec03b442b87dcc3de1029c440',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['DocumentTypeFk','ClerkDocumentTypeFk','OriginFileName','DocumentDate','Description']
			}
		],
		overloads: {
			OriginFileName: {readonly: true},
			ClerkDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkDocumentTypeLookupOverload(true),
			DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'entityDescription'},
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				DocumentTypeFk: {key: 'documnetType'},
				ClerkDocumentTypeFk: {key: 'clerkdocumenttype'},
				OriginFileName: {key: 'originfilename'},
				DocumentDate: {key: 'documentdate'},
			})
		}
	},
} as IEntityInfo<IBasicsClerkDocumentEntity>);