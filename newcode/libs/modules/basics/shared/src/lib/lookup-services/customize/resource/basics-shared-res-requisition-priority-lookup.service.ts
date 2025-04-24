/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResRequisitionPriorityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResRequisitionPriorityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResRequisitionPriorityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResRequisitionPriorityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resrequisitionpriority/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '16158d888a644e77b7346bff454e6b6f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResRequisitionPriorityEntity) => x.DescriptionInfo),
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
