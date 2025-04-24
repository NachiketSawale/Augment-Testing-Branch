/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class  SchedulingBaselineSpecificationLookup<T extends object = object> extends UiCommonLookupEndpointDataService<T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/baselinespec/', endPointRead: 'list', usePostForRead: true },
		}, {
			uuid: 'b24d9b7e49e8456b99dd87a9789a1e52',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
