/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import {IDescriptionInfo} from '@libs/platform/common';

export class RfqStatusEntity {
	public constructor(
		public Id: number,
		public IsReadonly: boolean
	) {

	}

	/**
	 * description info
	 */
	public DescriptionInfo?: IDescriptionInfo;
}

/**
 * Rfq Status Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class PrcRfqStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<RfqStatusEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('RfqStatus', {
            uuid: '',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Description'
        });
    }
}