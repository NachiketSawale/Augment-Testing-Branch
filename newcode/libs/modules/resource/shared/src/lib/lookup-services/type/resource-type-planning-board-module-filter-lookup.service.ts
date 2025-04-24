/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IPlanningBoardFilterEntity } from '@libs/resource/interfaces';
import {Injectable} from '@angular/core';

/**
 * Resource Type Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceTypePlanningBoardModuleFilterLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IPlanningBoardFilterEntity, TEntity> {

	public constructor() {
		super({
			httpRead: {route: 'resource/type/planningboardfilter/', endPointRead: 'modules'}
		},
			{
				uuid: '21bcdc4a42ac4574a1c5a989c50f8965',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				gridConfig: {
					columns: [
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description', key: 'cloud.common.entityDescription'},
							sortable: true,
							visible: true,
							readonly: true
						},
						{
							id: 'InternalName',
							model: 'InternalName',
							type: FieldType.Translation,
							label: {text: 'Internal Name', key: 'basics.config.entityInternalName'},
							sortable: true,
							visible: true
						}
					]
				}
			});
	}
}