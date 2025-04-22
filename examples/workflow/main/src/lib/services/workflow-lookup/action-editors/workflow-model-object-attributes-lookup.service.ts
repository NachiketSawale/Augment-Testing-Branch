/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';


export interface IModelObjectEntity{
	id: number | string,
}

@Injectable({
	providedIn: 'root'
})
export class ModelObjectAttributesLookup<T extends object = object> extends UiCommonLookupTypeDataService<IModelObjectEntity,T> {
	public constructor() {
		super('propertykey', {
			uuid: '0191e4fbaae174daa7535864c1d522f6',
			displayMember: 'PropertyName',
			valueMember: 'Id',
			idProperty: 'Id',
			dialogOptions: {
				headerText: {
					text: 'Select Attribute',
				}
			},
			showDialog: true,
			//inputSearchMembers : [],
			//selectableCallback: (item) => item.id < 0,
			gridConfig: {
				uuid: 'a4cc03889298406495178b513a0b8eaa',
				columns: [
					{
						id: 'PropertyName',
						model: 'PropertyName',
						type: FieldType.Description,
						label: {text: 'PropertyName', key: 'Name'},
						sortable: true,
						visible: true,
						readonly: true,
						width: 240,
					}, {
						id: 'ValueTypeDto.Code',
						model: 'ValueTypeDto.Code',
						type: FieldType.Description,
						label: {text: 'ValueTypeDto.Code', key: 'Type Code'},
						sortable: true,
						visible: true,
						readonly: true,
						width: 120,
					}, {
						id: 'ValueTypeDto.DescriptionInfo.Translated',
						model: 'ValueTypeDto.DescriptionInfo.Translated',
						type: FieldType.Description,
						label: {text: 'ValueTypeDto.DescriptionInfo.Translated', key: 'Type Name'},
						sortable: true,
						visible: true,
						readonly: true,
						width: 120,
					},
				],
			},
		});
	}
}