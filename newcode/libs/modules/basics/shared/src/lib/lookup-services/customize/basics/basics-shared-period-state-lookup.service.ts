/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePeriodStateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePeriodStateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPeriodStateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePeriodStateEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/periodstate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b055235a1ab4403aa2b26a4ec29a338e',
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
						id: 'Isopen',
						model: 'Isopen',
						type: FieldType.Boolean,
						label: { text: 'Isopen' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isaccountpayablesopen',
						model: 'Isaccountpayablesopen',
						type: FieldType.Boolean,
						label: { text: 'Isaccountpayablesopen' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isaccountreceivablesopen',
						model: 'Isaccountreceivablesopen',
						type: FieldType.Boolean,
						label: { text: 'Isaccountreceivablesopen' },
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
					}
				]
			}
		});
	}
}
