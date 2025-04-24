/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {  FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ITimekeepingSettlementItemEntity } from '@libs/timekeeping/interfaces';

/**
 * Lookup Service for TimekeepingSettlementItemLookupService
 */

@Injectable({
	providedIn: 'root'
})

export class  TimekeepingSettlementItemLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ITimekeepingSettlementItemEntity,TEntity> {
	public constructor() {
		const endpoint = {httpRead: {route: 'timekeeping/settlement/item/', endPointRead: 'listbysettlement'}};
		const config: ILookupConfig<ITimekeepingSettlementItemEntity> = {
			uuid: '2a6ce68774414203a75edff0b6c07b3d',
			valueMember: 'Id',
			displayMember: 'Id',
			showGrid: true,
			gridConfig: {
				columns: [
					{
						id: 'Id',
						model: 'Id',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true
					},
				]
			}
		};
		super(endpoint, config);
	}
}