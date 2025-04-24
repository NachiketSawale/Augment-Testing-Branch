/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticCardDocumentDataService } from '../services/logistic-card-document-data.service';
import { ILogisticCardDocumentEntity } from '@libs/logistic/interfaces';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { LogisticCardDocumentValidationService } from '../services/logistic-card-document-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const LOGISTIC_CARD_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCardDocumentEntity>({
	grid: {
		title: {key: 'logistic.card.cardDocumentListTitle'},
		behavior: ctx => new DocumentsSharedBehaviorService<ILogisticCardDocumentEntity>(ctx.injector.get(LogisticCardDocumentDataService), ctx.injector),
	},
	form: {
		title: {key: 'logistic.card.cardDocumentDetailTitle'},
		containerUuid: '4e3220847fe74ca6a726677f31ed9f05',
	},
	dataService: ctx => ctx.injector.get(LogisticCardDocumentDataService),
	validationService: ctx => ctx.injector.get(LogisticCardDocumentValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Card', typeName: 'JobCardDocumentDto'},
	permissionUuid: '7e1c27a578c1483386e2594f24bab0bc',
	layoutConfiguration: context => {
		const customizeLayout = {
			groups: [
				{
					gid: 'basicDocData',
					attributes: ['DescriptionInfo', 'JobCardDocTypeFk', 'DocumentTypeFk', 'Date', 'Barcode', 'OriginFileName', 'Url'],
				}
			],
			overloads: {
				JobCardDocTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardDocumentTypeLookupOverload(false),
				DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(false),
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Date: {key: 'entityDate'},
					OriginFileName: {key: 'documentOriginFileName'},
				}),
				...prefixAllTranslationKeys('logistic.card.', {
					JobCardDocTypeFk: {key: 'entityJobCardDocTypeFk'},
					DocumentTypeFk: {key: 'entityDocumentTypeFk'},
					Barcode: {key: 'entityBarcode'},
					Url: {key: 'Url'},
				}),
			}
		};
		return context.injector.get(DocumentBasicLayoutService).generateLayout<ILogisticCardDocumentEntity>(customizeLayout);
	}
});
