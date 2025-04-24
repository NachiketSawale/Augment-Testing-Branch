/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReqTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReqTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReqTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReqTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/reqtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6d3f9025758b437b83bd618cb2b2e8c1',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeReqTypeEntity) => x.DescriptionInfo),
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
