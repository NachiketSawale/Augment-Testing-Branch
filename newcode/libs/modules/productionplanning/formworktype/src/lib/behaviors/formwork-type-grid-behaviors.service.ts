import { Injectable } from '@angular/core';

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ISearchPayload } from '@libs/platform/common';

import { FormworkTypeEntity } from '../model/entities/formwork-type-entity.class';

@Injectable({
    providedIn: 'root',
})
export class FormworkTypeGridBehavior implements IEntityContainerBehavior<IGridContainerLink<FormworkTypeEntity>, FormworkTypeEntity> {
    private searchPayload: ISearchPayload = {
        executionHints: false,
        filter: '',
        includeNonActiveItems: false,
        isReadingDueToRefresh: false,
        pageNumber: 0,
        pageSize: 100,
        pattern: '',
        pinningContext: [],
        projectContextId: null,
        useCurrentClient: true
    };

    public onCreate(containerLink: IGridContainerLink<FormworkTypeEntity>) {
    }
}
