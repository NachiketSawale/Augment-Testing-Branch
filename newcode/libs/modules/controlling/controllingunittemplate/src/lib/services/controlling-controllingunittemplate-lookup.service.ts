/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IControltemplateEntity } from '../model/models';

@Injectable({
	providedIn: 'root',
})

export class ControllingControllingunittemplateLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IControltemplateEntity, TEntity> {
	public constructor() {
		super({
			httpRead: {route: 'controlling/controllingunittemplate/', endPointRead: 'lookuplist', usePostForRead: false}
		}, {
			uuid: '2c2afe968f6f48ea9c638f289defa1a7',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						type: FieldType.Code,
						model: 'Code',
						label: {
							text: 'code',
							key: 'cloud.common.entityCode'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'description',
						type: FieldType.Description,
						model: 'DescriptionInfo',
						label: {
							text: 'description',
							key: 'cloud.common.entityDescription'
						},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
