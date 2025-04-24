/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePackagingTypesEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePackagingTypesEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPackagingTypesLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePackagingTypesEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/packagingtypes/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd1e68fd7c6724a20a8a195746d2c4281',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePackagingTypesEntity) => x.DescriptionInfo),
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
						id: 'IsFreeCapacity',
						model: 'IsFreeCapacity',
						type: FieldType.Boolean,
						label: { text: 'IsFreeCapacity' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DefaultCapacity',
						model: 'DefaultCapacity',
						type: FieldType.Quantity,
						label: { text: 'DefaultCapacity' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsMandatoryCapacity',
						model: 'IsMandatoryCapacity',
						type: FieldType.Boolean,
						label: { text: 'IsMandatoryCapacity' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
