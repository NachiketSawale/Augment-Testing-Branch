/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcStructureDocEntity } from '../model/entities/prc-structure-doc-entity.interface';
import { BasicsSharedCustomizeLookupOverloadProvider} from '@libs/basics/shared';

/**
 * Common procurement document layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureDocumentLayoutService {

	//TODO: need to find a way to reuse the procurement common layout. It share most of the fields.
	public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructureDocEntity>> {
		return <ILayoutConfiguration<IPrcStructureDocEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['DocumentTypeFk', 'PrcDocumentTypeFk', 'Description', 'DocumentDate', 'OriginFileName', 'Url', 'FileSize'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					DocumentTypeFk: { text: 'File Type', key: 'document.prcFileType' },
					PrcDocumentTypeFk: { text: 'Document Type', key: 'document.prcDocumentType' },
					Description: { text: 'Description', key: 'documentDescription' },
					DocumentDate: { text: 'Date', key: 'entityDate' },
					OriginFileName: { text: 'Origin File Name', key: 'documentOriginFileName' },
					Url: { text: 'Url', key: 'entityUrl' },
					FileSize: { text: 'File Size', key: 'entityFileSize' },
				}),
			},
			overloads: {
				DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(false),
				PrcDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementDocumentTypeLookupOverload(false), 
				PrcDocumentStatusFk:BasicsSharedCustomizeLookupOverloadProvider.provideProcurementDocumentStatusLookupOverload(false), 
			},
		};
	}
}
