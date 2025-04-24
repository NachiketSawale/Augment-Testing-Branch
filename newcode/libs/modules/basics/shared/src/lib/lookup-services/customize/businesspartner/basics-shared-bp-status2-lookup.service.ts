/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpStatus2Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpStatus2Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpStatus2LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpStatus2Entity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpstatus2/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '758df93892ee4510b9a07194298f740f',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
