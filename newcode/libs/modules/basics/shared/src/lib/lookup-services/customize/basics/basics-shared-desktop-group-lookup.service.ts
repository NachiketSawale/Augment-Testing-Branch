/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDesktopGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDesktopGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDesktopGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDesktopGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/desktopgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '81ee1eca69734309a99a2d87b6e07210',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDesktopGroupEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
