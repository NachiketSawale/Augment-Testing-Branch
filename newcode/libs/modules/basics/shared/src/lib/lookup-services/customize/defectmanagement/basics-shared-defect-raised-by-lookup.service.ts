/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefectRaisedByEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefectRaisedByEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefectRaisedByLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefectRaisedByEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/defectraisedby/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '64cb10eeea714ec0bbc66094e23b7bfa',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDefectRaisedByEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
