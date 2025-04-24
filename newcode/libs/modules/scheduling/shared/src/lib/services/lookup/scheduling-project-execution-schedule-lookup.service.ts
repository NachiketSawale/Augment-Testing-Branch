/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingProjectExecutionScheduleLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'scheduling/schedule/', endPointRead: 'execution',usePostForRead:false },
			filterParam: true,
			prepareListFilter: context => {
				return {
					projectId: 0,
				};
			}
		}, {
			uuid: 'e9c76a097e164156b99c65a5ef3a1c48',
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
		//const filterValue = get(request.additionalParameters, 'filterValue');
		return  'projectId=0';
	}

}