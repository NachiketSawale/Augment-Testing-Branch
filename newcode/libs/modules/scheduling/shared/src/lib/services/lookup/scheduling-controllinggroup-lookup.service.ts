/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class SchedulingControllingGroupLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'controlling/structure/lookup/', endPointRead: 'controllinggroupdetail',usePostForRead:true },
			filterParam: true,
			prepareListFilter: context => {
				return {
					controllinggroupFk: 0,
				};
			}
		}, {
			uuid: '',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true
					}
				]
			}
		});
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		return  'controllinggroupFk=0';
	}

}