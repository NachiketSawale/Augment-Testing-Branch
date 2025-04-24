/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectInstallmentAgreementStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectInstallmentAgreementStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectInstallmentAgreementStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectInstallmentAgreementStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectinstallmentagreementstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6faec109210e4baea8c27870cd82e410',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsBilled',
						model: 'IsBilled',
						type: FieldType.Boolean,
						label: { text: 'IsBilled' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
