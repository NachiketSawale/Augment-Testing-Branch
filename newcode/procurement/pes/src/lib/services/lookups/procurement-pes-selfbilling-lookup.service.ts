/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import { IPesSelfBillingEntity } from '../../model/entities/pes-self-billing-entity.interface';


/**
 * Procurement Pes Selfbilling Lookup Service.
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementPesSelfbillingLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPesSelfBillingEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('SbhStatusFk', {
            uuid: '',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            showClearButton: true
        });
    }
}