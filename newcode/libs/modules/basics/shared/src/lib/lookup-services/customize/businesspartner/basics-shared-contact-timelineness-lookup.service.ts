/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeContactTimelinenessEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeContactTimelinenessEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedContactTimelinenessLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeContactTimelinenessEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/contacttimelineness/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b8ab77a4070e4c9caf9b4aafbdd28246',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeContactTimelinenessEntity) => x.DescriptionInfo),
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
