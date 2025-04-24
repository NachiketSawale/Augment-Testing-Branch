/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsClaimStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsClaimStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsClaimStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsClaimStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticsclaimstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd40dd591535c49acb91a2dd79227e975',
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
						id: 'IsAccepted',
						model: 'IsAccepted',
						type: FieldType.Boolean,
						label: { text: 'IsAccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRejected',
						model: 'IsRejected',
						type: FieldType.Boolean,
						label: { text: 'IsRejected' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFixed',
						model: 'IsFixed',
						type: FieldType.Boolean,
						label: { text: 'IsFixed' },
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
