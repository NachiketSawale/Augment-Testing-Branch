/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelUomMappingEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelUomMappingEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelUomMappingLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelUomMappingEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modeluommapping/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f0e3e5709967402c98f63581376e6ad5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelUomMappingEntity) => x.DescriptionInfo),
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
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
