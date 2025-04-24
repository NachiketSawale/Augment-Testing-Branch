/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobCardGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobCardGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobCardGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobCardGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/jobcardgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a33315b1133b4c0aaa8515939168913c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeJobCardGroupEntity) => x.DescriptionInfo),
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
						id: 'DivisionFk',
						model: 'DivisionFk',
						type: FieldType.Quantity,
						label: { text: 'DivisionFk' },
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
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
