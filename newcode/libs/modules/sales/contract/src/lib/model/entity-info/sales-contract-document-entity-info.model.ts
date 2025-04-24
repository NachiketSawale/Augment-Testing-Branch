/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { SalesContractDocumentDataService } from '../../services/sales-contract-document-data.service';
import { IDocumentEntity } from '@libs/sales/interfaces';
export const SALES_CONTRACT_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IDocumentEntity>({
	grid: {
		title: {key: 'sales.contract.document.grid'},
		behavior: ctx => new DocumentsSharedBehaviorService<IDocumentEntity>(ctx.injector.get(SalesContractDocumentDataService), ctx.injector),
	},
	form: {
		title: {key: 'sales.contract.document.detail'},
		containerUuid: 'ff6a0d7a144e441e87fe63855418619b'
	},
	dataService: ctx => ctx.injector.get(SalesContractDocumentDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'DocumentDto'},
	permissionUuid: 'ef3fc9fd941340a6bd61cda5683c2398',
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