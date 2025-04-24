/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCompanyTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCompanyTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCompanyTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCompanyTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/companytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7cb0af99e06b42de88308cf2a8e7cb67',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCompanyTypeEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'MaxCodeLength',
						model: 'MaxCodeLength',
						type: FieldType.Quantity,
						label: { text: 'MaxCodeLength' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
