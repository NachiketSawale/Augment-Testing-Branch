/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { InventoryDocumentDataService } from '../services/inventory-document-data.service';
import { IPrcInventoryDocumentEntity } from './models';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';

export const INVENTORY_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPrcInventoryDocumentEntity> ({
    grid: {
        title: {key: 'procurement.inventory.document.documentGridTitle'},
        behavior: ctx => new DocumentsSharedBehaviorService<IPrcInventoryDocumentEntity>(ctx.injector.get(InventoryDocumentDataService), ctx.injector),
    },
    form: {
        title: { key: 'procurement.inventory.document.documentDetailTitle' },
        containerUuid: '2FB3CD3E924246328F450E317CF65581',
    },
    dataService: ctx => ctx.injector.get(InventoryDocumentDataService),
    dtoSchemeId: {moduleSubModule: 'Procurement.Inventory', typeName: 'PrcInventoryDocumentDto'},
    permissionUuid: '23297D263B684366BF16AF7DB11A039E',
    layoutConfiguration: context =>
		context.injector.get(DocumentBasicLayoutService).generateLayout<IPrcInventoryDocumentEntity>()
        
});