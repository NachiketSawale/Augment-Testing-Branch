/*
 * Copyright(c) RIB Software GmbH
 */

import { DocumentMainProviderEntityInfoService } from './document-main-provider-entity-info.model';
import { ProcurementModule } from '@libs/procurement/shared';
import { DocumentsMainDataService } from '../../services/documents-main-data.service';

export const DOCUMENTS_MAIN_ENTITY_INFO = DocumentMainProviderEntityInfoService.create<object>(ProcurementModule.Invoice, DocumentsMainDataService);
