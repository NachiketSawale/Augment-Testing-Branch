import {EntityInfo} from '@libs/ui/business-base';
import {IQtoDetailDocumentEntity} from '../model/entities/qto-detail-document-entity.interface';
import {QtoMainDetailDocumentDataService} from './qto-main-detail-document-data.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {BasicsSharedCustomizeLookupOverloadProvider} from '@libs/basics/shared';
import {DocumentsSharedBehaviorService} from '@libs/documents/shared';
import {QtoMainDetailDocumentValidationService} from './qto-main-detail-document-validation.service';

export const QTO_MAIN_DETAIL_DOCUMENT_ENTITY_INFO : EntityInfo = EntityInfo.create<IQtoDetailDocumentEntity>({
    grid: {
        title: {text: 'Qto Detail  Documents'},
        behavior: ctx =>new DocumentsSharedBehaviorService<IQtoDetailDocumentEntity>(ctx.injector.get(QtoMainDetailDocumentDataService), ctx.injector),
    },
    dataService: ctx => ctx.injector.get(QtoMainDetailDocumentDataService),
    validationService: ctx => ctx.injector.get(QtoMainDetailDocumentValidationService),
    dtoSchemeId: {moduleSubModule: 'Qto.Main', typeName: 'QtoDetailDocumentDto'},
    permissionUuid: '886f9059992f46d3864d2Cbe173bd251',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['DocumentDescription','QtoDetailDocumentTypeFk','DocumentTypeFk','DocumentDate','OriginFileName']
        }],
        labels:{
            ...prefixAllTranslationKeys('qto.main.', {
                'DocumentDescription': {
                    'key': 'documentDescription',
                    'text': 'Description',
                },
                'QtoDetailDocumentTypeFk': {
                    'key': 'qtoDetailDocumentTypeFk',
                    'text': 'Qto Detail Document Type',
                },
                'DocumentTypeFk': {
                    'key': 'documentTypeFk',
                    'text': 'Type',
                },
                'DocumentDate': {
                    'key': 'documentDate',
                    'text': 'Document Date',
                },
                'OriginFileName': {
                    'key': 'originFileName',
                    'text': 'Origin File Name',
                }
            }),
        },
        overloads:{
            DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(false)
            //QtoDetailDocumentTypeFk TODD Wait for support
        }
    }
});