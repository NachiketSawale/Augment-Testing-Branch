/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCoSysDefaultTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCoSysDefaultTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCoSysDefaultTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCoSysDefaultTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/cosysdefaulttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '57209eef70854a94bf1289886e4516d8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCoSysDefaultTypeEntity) => x.DescriptionInfo),
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
