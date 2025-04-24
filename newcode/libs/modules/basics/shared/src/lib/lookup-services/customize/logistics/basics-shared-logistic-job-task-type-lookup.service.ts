/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticJobTaskTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticJobTaskTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticJobTaskTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticJobTaskTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticjobtasktype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4a105c3ea6a64844b641c9122b8f150b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticJobTaskTypeEntity) => x.DescriptionInfo),
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
