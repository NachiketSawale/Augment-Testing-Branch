/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import {IDocumentOrphan} from '../model/entities/document-import.interface';
import {ItemType} from '@libs/ui/common';
import {DocumentsImportDataService} from '../service/documents-import-data.service';
export const DOCUMENT_IMPORT_BEHAVIOR_TOKEN = new InjectionToken<DocumentsInportBehavior>('documentsInportBehavior');

@Injectable({
    providedIn: 'root',
})
export class DocumentsInportBehavior implements IEntityContainerBehavior<IGridContainerLink<IDocumentOrphan>, IDocumentOrphan> {
    private readonly dataService = inject(DocumentsImportDataService);
    
    public onCreate(containerLink: IGridContainerLink<IDocumentOrphan>): void {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
        containerLink.uiAddOns.toolbar.addItems([
            {
                caption: { key: 'documents.import.assignment' },
                hideItem: false,
                iconClass: 'tlb-icons ico-import',
                id: 'assignment',
                disabled: () => {
                    if(this.dataService.getList()){
                        return this.dataService.getList().length === 0;
                    }
                    return true;
                },
                fn: () => {
                    return this.dataService.assignment();
                },
                type: ItemType.Item,
                sort : 1
            },
        ]);
    }

}
