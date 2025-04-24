/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {
    DocumentProjectDataRootService,
    IDocumentFilterForeignKeyEntity
} from '@libs/documents/shared';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';

import {inject, Injectable} from '@angular/core';
import {QtoMainHeaderGridDataService} from '../header/qto-main-header-grid-data.service';

@Injectable({
    providedIn: 'root',
})
export class QtoMainProjectDocumentDataService extends DocumentProjectDataRootService<IQtoMainHeaderGridEntity> {
    protected readonly parentService: QtoMainHeaderGridDataService;
    public constructor() {
        const parentDataService = inject(QtoMainHeaderGridDataService);
        super(parentDataService);
        this.parentService = parentDataService;
    }

    protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
        const qtoSelected = this.parentService.getSelectedEntity();
        if (qtoSelected) {
            return {
                QtoHeaderFk: qtoSelected.Id
            };
        }
        return {};
    }
}