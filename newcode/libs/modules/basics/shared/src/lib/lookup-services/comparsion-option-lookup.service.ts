/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';

/**
 * Comparison Option Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedComparisonOptionLookupService {
    private lookupFactory = inject(UiCommonLookupDataFactoryService);

    public createLookupService(useValueAsKey: boolean = true) {
        return this.lookupFactory.fromItems(
            [
                {
                    id: 0,
                    value: '=',
                },
                {
                    id: 1,
                    value: '>',
                },
                {
                    id: 2,
                    value: '>=',

                },
                {
                    id: 3,
                    value: '<',
                },
                {
                    id: 4,
                    value: '<=',

                },], {
                uuid: '',
                valueMember: useValueAsKey ? 'value' : 'id',
                displayMember: 'value'
            });

    }
}