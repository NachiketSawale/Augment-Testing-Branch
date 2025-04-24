/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainSaleLookupService<IEntity extends object > extends UiCommonLookupEndpointDataService < IEntity >{
	public constructor(){
		super(
			{
				httpRead: { route: 'project/main/sale/', endPointRead: 'list', usePostForRead:false }
			},
			{
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig:{
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: {text: 'Code', key:'cloud.common.entityCode'},
							visible: true,
							readonly: true,
							sortable: true,
							width: 100

						},
						{
							id: 'Description',
							model: 'Description',
							type :FieldType.Translation,
							label :{text: 'Description', key:'cloud.common.entityDescription'},
							visible: true,
							readonly: true,
							sortable: true,
							width : 150

						}
					]
				},
				uuid: 'f7d2b2184b754eecae7d33d36d9994c5',
			});
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const projectId = get(request.additionalParameters, 'ProjectId');
		return 'projectId=' + projectId;
	}
}