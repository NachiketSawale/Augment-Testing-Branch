/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import {IDocumentOrphan} from '../entities/document-import.interface';
import {DocumentsImportDataService} from '../../service/documents-import-data.service';
import {DocumentsImportLayoutService} from '../../service/documents-import-layout.service';
import {DOCUMENT_IMPORT_BEHAVIOR_TOKEN} from '../../behavior/documents-inport-behavior.service';

export const DOCUMENTS_IMPORT_ENTITY_INFO = EntityInfo.create<IDocumentOrphan>({
    grid: {
        title: { text: 'Document Import', key: 'documents.import.headertitle' },
        behavior : DOCUMENT_IMPORT_BEHAVIOR_TOKEN
    },
    dataService: ctx => ctx.injector.get(DocumentsImportDataService),
    dtoSchemeId: { moduleSubModule: 'Documents.Import', typeName: 'DocumentorphanDto' },
    permissionUuid: '6880a128218d40cfb161194f4ac696da',
    layoutConfiguration: context => {
        return context.injector.get(DocumentsImportLayoutService).generateConfig();
    }
});