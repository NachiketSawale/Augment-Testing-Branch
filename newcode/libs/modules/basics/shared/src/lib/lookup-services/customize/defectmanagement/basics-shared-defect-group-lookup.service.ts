/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefectGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefectGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefectGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefectGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/defectgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3dcb1d63e1c54226a30b3f74907c1786',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDefectGroupEntity) => x.DescriptionInfo),
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
