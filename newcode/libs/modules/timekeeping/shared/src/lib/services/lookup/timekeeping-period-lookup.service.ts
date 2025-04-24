/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * Lookup Service for TimekeepingPeriodLookupService
 */

@Injectable({
	providedIn: 'root'
})

export class  TimekeepingPeriodLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'timekeeping/period/', endPointRead: 'listbycontext',usePostForRead:false  }
		}, {
			uuid: 'ba40bcfe64c64f31b51ede0153a5a0f0',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key:'cloud.common.entityCode' },
						sortable: true,
						visible: true,
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo', key:'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
					}
				]
			}
		});
	}
}
