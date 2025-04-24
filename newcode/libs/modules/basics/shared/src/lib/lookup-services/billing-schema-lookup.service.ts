/*
 * Copyright(c) RIB Software GmbH
 */

import {LookupSimpleEntity, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {Injectable} from '@angular/core';

/**
 * Address Type Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedBillingSchemaLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<LookupSimpleEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('billingschema', {
            uuid: '',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Description'
        });
    }
}