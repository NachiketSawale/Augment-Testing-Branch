/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeKeyFigureEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeKeyFigureEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedKeyFigureLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeKeyFigureEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/keyfigure/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'eb85025eafb3443997532ecb58e718ab',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
					},
					{
						id: 'Iscurrency',
						model: 'Iscurrency',
						type: FieldType.Boolean,
						label: { text: 'Iscurrency' },
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
						id: 'Isvisible',
						model: 'Isvisible',
						type: FieldType.Boolean,
						label: { text: 'Isvisible' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
