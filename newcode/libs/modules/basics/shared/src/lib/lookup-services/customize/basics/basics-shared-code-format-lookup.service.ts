/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCodeFormatEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCodeFormatEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCodeFormatLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCodeFormatEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/codeformat/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4aea0865723c4ec9a194cc532589e288',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCodeFormatEntity) => x.DescriptionInfo),
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
						id: 'CodeformattypeFk',
						model: 'CodeformattypeFk',
						type: FieldType.Quantity,
						label: { text: 'CodeformattypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Startvalue',
						model: 'Startvalue',
						type: FieldType.Code,
						label: { text: 'Startvalue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Prefix',
						model: 'Prefix',
						type: FieldType.Code,
						label: { text: 'Prefix' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Suffix',
						model: 'Suffix',
						type: FieldType.Code,
						label: { text: 'Suffix' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Increment',
						model: 'Increment',
						type: FieldType.Quantity,
						label: { text: 'Increment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Minlength',
						model: 'Minlength',
						type: FieldType.Quantity,
						label: { text: 'Minlength' },
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
