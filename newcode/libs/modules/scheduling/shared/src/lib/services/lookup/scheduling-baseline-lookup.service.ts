/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class SchedulingBaselineLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'scheduling/main/baseline/', endPointRead: 'list',usePostForRead:false },
			filterParam: true,
			prepareListFilter: context => {
				return {
					PsdScheduleFk: 0,
				};
			}
		}, {
			uuid: 'fb2d7ea8c3c641889d5083ed68864b2c',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Translation,
						label: { text: 'Id', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true
					}
				]
			}
		});
	}
}