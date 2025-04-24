/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLineItemContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLineItemContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLineItemContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLineItemContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/lineitemcontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bbdefe641fe747ae893fff5297efa449',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLineItemContextEntity) => x.DescriptionInfo),
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
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HeaderFk',
						model: 'HeaderFk',
						type: FieldType.Quantity,
						label: { text: 'HeaderFk' },
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
						id: 'HeaderPlantFk',
						model: 'HeaderPlantFk',
						type: FieldType.Quantity,
						label: { text: 'HeaderPlantFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
