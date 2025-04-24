/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';


/**
 * TimekeepingEmployeePaymentGroupLookupService lookup servicenx
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeePaymentGroupLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService< TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		const endpoint = { httpRead: { route: 'timekeeping/paymentgroup/', endPointRead: 'all' } };
		const config: ILookupConfig<TEntity, object> = {
			uuid: 'efae4d9755834726b31ad7cbdf09d41f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			showGrid: true,
			gridConfig:{
				columns: [
					{
						id: 'Description',
						model: 'DescriptionInfo',
						label: {key: 'cloud.common.entityDescription'},
						type: FieldType.Translation,
						width: 300,
						sortable: true
					}
				]
			}
		};
		super(endpoint, config);
	}
}