/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})

export class BasicsSharedProcurementStrategyLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

    /**
     * constructor
     */
    public constructor() {
        super('basics.lookup.prcstrategy', {
            displayMember: 'Description',
            uuid: '526e4a52807549cc885ac54bb18a8fa0',
            valueMember: 'Id',
            showClearButton: true
        });
    }
}
