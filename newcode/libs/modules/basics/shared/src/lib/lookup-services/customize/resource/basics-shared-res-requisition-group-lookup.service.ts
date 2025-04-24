/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResRequisitionGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResRequisitionGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResRequisitionGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResRequisitionGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resrequisitiongroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1b3cc507923d4dc0b0e6a4454c4b70bf',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResRequisitionGroupEntity) => x.DescriptionInfo),
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
						id: 'DispatcherGroupFk',
						model: 'DispatcherGroupFk',
						type: FieldType.Quantity,
						label: { text: 'DispatcherGroupFk' },
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
