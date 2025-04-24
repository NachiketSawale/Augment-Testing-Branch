/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { INamedItemEntity } from '@libs/platform/common';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * Basics Common Log Level Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCommonLogLevelLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<INamedItemEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/common/loglevel/', endPointRead: 'list' },
			},
			{
				uuid: '3595383ee7a34bab8165eccbef2dac32',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo',
				gridConfig: {
					columns: [
						{
							id: 'DescriptionInfo',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
	}
}
