/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingActivity2modelobjectLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'scheduling/main/ojectmodelsimulation/', endPointRead: 'list' , usePostForRead:false},
			filterParam: 'mainItemId=0',
		}, {
			uuid: 'bezkddae9d814189815420abba2f0a9a',
			valueMember: 'Id',
			displayMember: 'Id',
			gridConfig: {
				columns: [
					{
						id: 'Id',
						model: 'Id',
						type: FieldType.Integer,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		return 'mainItemId=0';
	}

}