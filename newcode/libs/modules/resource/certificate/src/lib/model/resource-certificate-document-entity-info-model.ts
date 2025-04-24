/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ResourceCertificateDocumentDataService } from '../services/resource-certificate-document-data.service';
import { ICertificateDocumentEntity } from '@libs/resource/interfaces';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';


export const RESOURCE_CERTIFICATE_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<ICertificateDocumentEntity> ({
	grid: {
		title: {key:'resource.certificate' + '.resourceCertificateDocumentListTitle'},
		behavior: ctx => new DocumentsSharedBehaviorService<ICertificateDocumentEntity>(ctx.injector.get(ResourceCertificateDocumentDataService), ctx.injector),
	},
	form: {
		title: {key:'resource.certificate' + '.resourceCertificateDocumentDetailTitle' },
		containerUuid:'dd6a8c4970bd4f4fb46a6114c68ccd95'
	},
	dataService: (ctx) => ctx.injector.get(ResourceCertificateDocumentDataService),
	dtoSchemeId: { moduleSubModule: 'Resource.Certificate', typeName: 'CertificateDocumentDto' },
	permissionUuid: '3b4a2a670db2438da5deb4b9782547b5',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['DocumentTypeFk','CertificateDocumentTypeFk','Date','BarCode'/*,'FileArchiveDocFk'*/],
			}
		],
		overloads: {
			DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantDocumentTypeLookupOverload(true),
			CertificateDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantCertificateDocumentTypeLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('basics.customize.', {
				DocumentTypeFk: {key: 'documenttype'}
			}),
			...prefixAllTranslationKeys('resource.certificate.', {
				/*FileArchiveDocFk: {key: 'entityFileArchiveDoc'}*/
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CertificateDocumentTypeFk: {key: 'entityType'},
				Date: {key: 'entityDate'},
				BarCode: {key: 'entityBarcode'},
			})

		}
	},

});