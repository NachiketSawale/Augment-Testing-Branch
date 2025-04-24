/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectStockTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectStockTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectStockTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectStockTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectstocktype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3570516d26244c7ba3b1c489804c0309',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectStockTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
						id: 'Comment',
						model: 'Comment',
						type: FieldType.Comment,
						label: { text: 'Comment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowProcurement',
						model: 'AllowProcurement',
						type: FieldType.Boolean,
						label: { text: 'AllowProcurement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowDispatching',
						model: 'AllowDispatching',
						type: FieldType.Boolean,
						label: { text: 'AllowDispatching' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowWorkspace',
						model: 'AllowWorkspace',
						type: FieldType.Boolean,
						label: { text: 'AllowWorkspace' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowResourceRequisition',
						model: 'AllowResourceRequisition',
						type: FieldType.Boolean,
						label: { text: 'AllowResourceRequisition' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowApprovedMaterial',
						model: 'AllowApprovedMaterial',
						type: FieldType.Boolean,
						label: { text: 'AllowApprovedMaterial' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
