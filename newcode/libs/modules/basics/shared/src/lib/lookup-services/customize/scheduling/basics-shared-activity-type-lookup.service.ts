/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeActivityTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeActivityTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedActivityTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeActivityTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/activitytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '02da69064c5a436eb7de174fa03a4ba4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeActivityTypeEntity) => x.DescriptionInfo),
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
