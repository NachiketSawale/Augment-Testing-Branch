/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import {IDescriptionInfo} from '@libs/platform/common';

export class PrcInvoiceStatusEntity {
    public constructor(public Id: number) {

    }

    /**
     * description info
     */
    public DescriptionInfo?: IDescriptionInfo;

	 public IsReadOnly: boolean = false;

	 public Islive: boolean = true;

	 public ToBeVerifiedBL: boolean = false;

}

/**
 * invoice Status Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class PrcInvoiceStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<PrcInvoiceStatusEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('InvStatus', {
            uuid: '',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated'
        });
    }
}