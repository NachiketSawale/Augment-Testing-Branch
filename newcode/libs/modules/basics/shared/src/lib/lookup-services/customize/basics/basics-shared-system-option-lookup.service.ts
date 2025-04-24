/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSystemOptionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSystemOptionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSystemOptionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSystemOptionEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/systemoption/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ec6fe50f2a51496f9782ff0f46f86215',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSystemOptionEntity) => x.DescriptionInfo),
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
						id: 'ParameterValue',
						model: 'ParameterValue',
						type: FieldType.Comment,
						label: { text: 'ParameterValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Remark,
						label: { text: 'Remark' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
