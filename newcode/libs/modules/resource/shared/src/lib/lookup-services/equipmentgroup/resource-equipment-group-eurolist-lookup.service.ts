/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEquipmentGroupEurolistEntityGenerated } from '@libs/resource/interfaces';
import {Injectable} from '@angular/core';

/**
 * Resource Wot Plant Filter Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentGroupEurolistLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEquipmentGroupEurolistEntityGenerated, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'resource/equipmentgroup/eurolist/', endPointRead: 'listbyparent' },
			filterParam: 'plantFk',
			dataProcessors : [],
		}, {
			uuid: '86319aad82644c3abbfd1d4d51bf6743',
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
					}
				]
			},
		});
	}
}