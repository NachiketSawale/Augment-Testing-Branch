/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectChangeContributionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectChangeContributionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectChangeContributionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectChangeContributionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectchangecontributiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c9f23116e1fc4c3884989ec5368c47a7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectChangeContributionTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
