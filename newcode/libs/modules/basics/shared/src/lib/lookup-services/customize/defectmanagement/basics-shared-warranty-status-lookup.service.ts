/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWarrantyStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWarrantyStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWarrantyStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWarrantyStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/warrantystatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '27f3b69132ca4a6e957ed5e0fd584c68',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWarrantyStatusEntity) => x.DescriptionInfo),
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
						id: 'Iscovered',
						model: 'Iscovered',
						type: FieldType.Boolean,
						label: { text: 'Iscovered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Islimitedcovered',
						model: 'Islimitedcovered',
						type: FieldType.Boolean,
						label: { text: 'Islimitedcovered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isexpired',
						model: 'Isexpired',
						type: FieldType.Boolean,
						label: { text: 'Isexpired' },
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
