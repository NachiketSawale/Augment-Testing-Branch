/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {UomEntity} from './entity/uom.entity';

/**
 * Uom lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class ModelSharedUomLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<UomEntity, TEntity> {
    public constructor() {
        super('uom', {
            uuid: '',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Unit'
        });
    }
}