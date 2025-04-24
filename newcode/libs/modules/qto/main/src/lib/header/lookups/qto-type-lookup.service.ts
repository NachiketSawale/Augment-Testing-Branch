/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {IQtoMainHeaderGridEntity} from '../../model/qto-main-header-grid-entity.class';

/**
 * qto type lookup
 */
@Injectable({
    providedIn: 'root'
})
export class QtoTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IQtoMainHeaderGridEntity, TEntity> {
    public constructor() {
        super('QtoType', {
            uuid: 'a4cc03889298406495178b513a0b8ead',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated'
        });
    }
}