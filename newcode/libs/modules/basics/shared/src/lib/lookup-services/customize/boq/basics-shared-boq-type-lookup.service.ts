/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/boqtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '79ad046495e64b279ffeb0b54975c4b0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBoqTypeEntity) => x.DescriptionInfo),
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
						id: 'StructureFk',
						model: 'StructureFk',
						type: FieldType.Quantity,
						label: { text: 'StructureFk' },
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
						id: 'LineitemcontextFk',
						model: 'LineitemcontextFk',
						type: FieldType.Quantity,
						label: { text: 'LineitemcontextFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
