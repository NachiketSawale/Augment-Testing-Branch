/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDesktopPageEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDesktopPageEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDesktopPageLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDesktopPageEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/desktoppage/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f8989ac23b9048fd9a000864313a983e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDesktopPageEntity) => x.DescriptionInfo),
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
