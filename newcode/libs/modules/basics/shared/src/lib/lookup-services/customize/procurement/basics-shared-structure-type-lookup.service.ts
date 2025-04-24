/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeStructureTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeStructureTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedStructureTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeStructureTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/structuretype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e238babfbc044840b4f58c705240f5ec',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeStructureTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon1',
						model: 'Icon1',
						type: FieldType.Quantity,
						label: { text: 'Icon1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon2',
						model: 'Icon2',
						type: FieldType.Quantity,
						label: { text: 'Icon2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isticketsystem',
						model: 'Isticketsystem',
						type: FieldType.Boolean,
						label: { text: 'Isticketsystem' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
