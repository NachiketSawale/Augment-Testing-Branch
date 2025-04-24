/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchActionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchActionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchActionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchActionEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/dispatchaction/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1b7e8855dbef4b878c5b258564774477',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDispatchActionEntity) => x.DescriptionInfo),
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
						id: 'DivisionFk',
						model: 'DivisionFk',
						type: FieldType.Quantity,
						label: { text: 'DivisionFk' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
