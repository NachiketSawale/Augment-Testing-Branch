/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCountryEntity } from '@libs/basics/interfaces';
/**
 * Country Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCountryLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCountryEntity, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'basics/country/', endPointRead: 'lookuplist' }
		}, {
			uuid: '0922edfc4eb04333a01a6bf20e5391ac',
			valueMember: 'Id',
			displayMember: 'Iso2',
			gridConfig: {
				columns: [
					{
						id: 'Iso2',
						model: 'Iso2',
						type: FieldType.Code,
						label: { text: 'Iso2', key: 'cloud.common.entityISO2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}