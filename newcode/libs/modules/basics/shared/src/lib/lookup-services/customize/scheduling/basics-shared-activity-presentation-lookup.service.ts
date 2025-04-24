/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeActivityPresentationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeActivityPresentationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedActivityPresentationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeActivityPresentationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/activitypresentation/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b8f19e3dc96e4bd093fef4d95fce2b73',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeActivityPresentationEntity) => x.DescriptionInfo),
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
