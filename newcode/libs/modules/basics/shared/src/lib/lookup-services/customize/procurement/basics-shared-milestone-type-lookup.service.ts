/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMilestoneTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMilestoneTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMilestoneTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMilestoneTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/milestonetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '282ebd286cd64136816c2f980d02c634',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMilestoneTypeEntity) => x.DescriptionInfo),
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
						id: 'Iscritical',
						model: 'Iscritical',
						type: FieldType.Boolean,
						label: { text: 'Iscritical' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isinformationonly',
						model: 'Isinformationonly',
						type: FieldType.Boolean,
						label: { text: 'Isinformationonly' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
