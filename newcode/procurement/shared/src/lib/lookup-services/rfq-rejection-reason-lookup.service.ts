/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IRfqRejectionReasonEntity } from '../lookup-services/entities/rfq-rejection-reason-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementSharedRfqRejectionReasonLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IRfqRejectionReasonEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('RfqRejectionReason', {
			uuid: '173ec3aedaf949c1853ee0fa1c77d4ae',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}