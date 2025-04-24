/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import {Injectable} from '@angular/core';

/**
 * Resource Wot Plant Type Filter Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceWotPlantTypeFilterLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IResourceWorkOperationTypeEntity, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'resource/wot/workoperationtype/', endPointRead: 'listbyplanttypewithcurrentwot' },
			filterParam: 'filters',
			dataProcessors : [],
			prepareSearchFilter: function (filters){
				// TODO: Add filter
				return '';
			}
		}, {
			uuid: 'cd866ee87ec14ba2bad444511cbc69a7',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						width: 180,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						width: 300,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
				]
			},
		});
	}
}