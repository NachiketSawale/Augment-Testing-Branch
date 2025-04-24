/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {QtoMainProjectDocumentDataService} from './qto-main-project-document-data.service';
import {DocumentProjectEntityInfoService} from '@libs/documents/shared';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';

export const QTO_MAIN_PROJECT_DOCUMENT_ENTITY_INFO = DocumentProjectEntityInfoService.create<IQtoMainHeaderGridEntity>('Qto.Main', QtoMainProjectDocumentDataService);
