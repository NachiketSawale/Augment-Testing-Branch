/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectUnitSubTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectUnitSubTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectUnitSubTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectUnitSubTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/objectunitsubtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '14594747adda411bb3db4cc597019863',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeObjectUnitSubTypeEntity) => x.DescriptionInfo),
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
						id: 'UnittypeFk',
						model: 'UnittypeFk',
						type: FieldType.Quantity,
						label: { text: 'UnittypeFk' },
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
