/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelMarkerTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelMarkerTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelMarkerTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelMarkerTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelmarkertype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '38bc01226c9e464e82d1661e9a46249b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelMarkerTypeEntity) => x.DescriptionInfo),
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
						id: 'Color',
						model: 'Color',
						type: FieldType.Quantity,
						label: { text: 'Color' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
