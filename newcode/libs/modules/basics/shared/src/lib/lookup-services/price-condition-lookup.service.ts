/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import {PriceConditionEntity} from './entities/price-condition-entity.class';


/**
 * Price Condition Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedPriceConditionLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<PriceConditionEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('PrcPriceCondition', {
            uuid: '7486ff094fde4bd09785e038f5eef083',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            showClearButton: true
        });
    }
}