/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEmployeeEntity } from '@libs/timekeeping/interfaces';

/**
 * CrewLeader lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeCrewLeaderLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEmployeeEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: {route: 'timekeeping/employee/', endPointRead: 'lookupcrewleader'}};

		const config: ILookupConfig<IEmployeeEntity> =
			{
				uuid: '56dfe96f64f648a595f5747d42e1a7da',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo',
				gridConfig: {
					columns : [{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {key: 'cloud.common.entityCode'},
						sortable: true
					},
						{
							id: 'desc',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {key: 'cloud.common.entityDescription'},
							sortable: true
						}
						 ]
				}

			};
		super(endpoint, config);


	}

}