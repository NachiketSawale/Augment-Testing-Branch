/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IRfqBusinesspartnerStatusEntity } from '../lookup-services/entities/rfq-businesspartner-status-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementSharedRfqBusinesspartnerStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IRfqBusinesspartnerStatusEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('RfqBusinessPartnerStatus', {
			uuid: 'bc0190b0876044228d812afe182ab958',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}