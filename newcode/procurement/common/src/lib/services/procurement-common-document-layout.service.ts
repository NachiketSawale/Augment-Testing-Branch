/*
 * Copyright(c) RIB Software GmbH
 */

import {IPrcDocumentEntity} from '../model/entities';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {inject, Injectable, Injector} from '@angular/core';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {
	BasicsSharedDocumentTypeLookupService,
	BasicsSharedProcurementDocumentStatusLookupService,
	BasicsSharedProcurementDocumentTypeLookupService
} from '@libs/basics/shared';

/**
 * Common procurement document layout service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementCommonDocumentLayoutService {
    private readonly injector = inject(Injector);

    public async generateLayout<T extends IPrcDocumentEntity>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['DocumentTypeFk', 'PrcDocumentTypeFk', 'Description', 'DocumentDate', 'OriginFileName', 'Url', 'PrcDocumentStatusFk', 'FileSize']
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('procurement.common.', {
                    DocumentTypeFk: {text: 'File Type', key: 'document.prcFileType'},
                    PrcDocumentTypeFk: {text: 'Document Type', key: 'document.prcDocumentType'},
                    Description: {text: 'Description', key: 'documentDescription'},
                    DocumentDate: {text: 'Date', key: 'entityDate'},
                    OriginFileName: {text: 'Origin File Name', key: 'documentOriginFileName'},
                    Url: {text: 'Url', key: 'entityUrl'},
                    PrcDocumentStatusFk: {text: 'Status', key: 'entityPrcDocumentStatusFk'},
                    FileSize: {text: 'File Size', key: 'entityFileSize'},
                })
            },
            overloads: {
                DocumentTypeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedDocumentTypeLookupService
                    })
                },
                PrcDocumentTypeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedProcurementDocumentTypeLookupService
                    })
                },
                PrcDocumentStatusFk:{
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedProcurementDocumentStatusLookupService
                    })
                }
            }
        };
    }
}