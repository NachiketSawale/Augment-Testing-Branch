/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { IDocumentEntity } from '../entities/document-entity.interface';
import { SalesWipDocumentDataService } from '../../services/sales-wip-document-data.service';

export const SALES_WIP_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IDocumentEntity>({
	grid: {
		title: {key: 'Document'},
		behavior: ctx => new DocumentsSharedBehaviorService<IDocumentEntity>(ctx.injector.get(SalesWipDocumentDataService), ctx.injector),
	},
	form: {
		title: {key: 'Document Details'},
		containerUuid: '0988f39b5d8342f0ad6211c9fa2d434a'
	},
	dataService: ctx => ctx.injector.get(SalesWipDocumentDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Wip', typeName: 'DocumentDto'},
	permissionUuid: 'e741d2316c0245e1973a305b3f1c938b',
	layoutConfiguration: {
		groups: [
			{gid: 'Basic Data', attributes: ['Description', 'DocumentTypeFk', 'SalesDocumentTypeFk', 'DocumentDate', 'OriginFileName']},
		],
		overloads: {
			DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
			SalesDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesDocumentTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('sales.common.', {
				SalesDocumentTypeFk: {key: 'document.salesDocumentTypeFk'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				DocumentTypeFk: {key: 'entityType'},
				DocumentDate: {key: 'entityDate'},
				OriginFileName: {key: 'documentOriginFileName'},
				Description: {key : 'entityDescription'}
			})
		},
	}
});