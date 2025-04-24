/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResourceSkillGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResourceSkillGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResourceSkillGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResourceSkillGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resourceskillgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5adfa2ac2f5445edb4b811f63c0f41cc',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResourceSkillGroupEntity) => x.DescriptionInfo),
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
						id: 'SkillgroupFk',
						model: 'SkillgroupFk',
						type: FieldType.Quantity,
						label: { text: 'SkillgroupFk' },
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
