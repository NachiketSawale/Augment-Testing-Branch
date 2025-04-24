/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IIndexHeaderEntity } from './entities/index-header-entity.interface';
/**
 * Basics Index Header Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedIndexHeaderLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IIndexHeaderEntity, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'basics/characteristic/characteristic/', endPointRead: 'indexheaderlist' }
		}, {
			uuid: '041fd19366dc4197bca4e46b0256e282',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Index Header', key: 'cloud.common.entityIndexHeader' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}