/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5bbfd15f7f04465e8a35d16a03cad210',
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
						id: 'IsOptionalDownwards',
						model: 'IsOptionalDownwards',
						type: FieldType.Boolean,
						label: { text: 'IsOptionalDownwards' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsOptionalUpwards',
						model: 'IsOptionalUpwards',
						type: FieldType.Boolean,
						label: { text: 'IsOptionalUpwards' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MessageInfo',
						model: 'MessageInfo',
						type: FieldType.Translation,
						label: { text: 'MessageInfo' },
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
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor02Fk',
						model: 'AccessrightDescriptor02Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor02Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor03Fk',
						model: 'AccessrightDescriptor03Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor03Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor04Fk',
						model: 'AccessrightDescriptor04Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor04Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSapCreated',
						model: 'IsSapCreated',
						type: FieldType.Quantity,
						label: { text: 'IsSapCreated' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EditName',
						model: 'EditName',
						type: FieldType.Boolean,
						label: { text: 'EditName' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsApproved',
						model: 'IsApproved',
						type: FieldType.Boolean,
						label: { text: 'IsApproved' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
