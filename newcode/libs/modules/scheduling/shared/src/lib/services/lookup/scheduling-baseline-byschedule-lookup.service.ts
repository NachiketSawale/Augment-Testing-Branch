/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class SchedulingBaselineByscheduleLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
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
			uuid: '421dd8124ad2489499451e33c54048aa',
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

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		//const filterValue = get(request.additionalParameters, 'filterValue');
		return  'PsdScheduleFk=0';
	}

}