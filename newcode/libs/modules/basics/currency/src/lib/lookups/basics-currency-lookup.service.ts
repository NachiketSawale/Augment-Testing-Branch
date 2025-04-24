/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCurrencyEntity } from '@libs/basics/interfaces';



/**
 * Basics Currency Lookup Service
 */

@Injectable({
	providedIn: 'root'
})

export class BasicsCurrencyLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCurrencyEntity, TEntity> {
	public constructor() {
		super({
			httpRead: {route: 'basics/currency/', endPointRead: 'list'}
		}, {
			uuid: 'e4938ef1c6744c348a1265db2354a8d0',
			valueMember: 'Id',
			displayMember: 'Currency',
			gridConfig: {
				columns: [
					{
						id: 'Currency',
						model: 'Currency',
						type: FieldType.Description,
						label: {text: 'Currency', key: 'cloud.common.entityCurrency'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
				]
			}
		});
	}
}
