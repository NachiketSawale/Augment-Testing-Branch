/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { INavbarConfigEntity } from '../../model/entities/navbar-config-entity.interface';

@Injectable({
	providedIn: 'root',
})

/**
 * Basics Config Navbar System lookup Service.
 */
export class BasicsConfigNavbarSystemLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<INavbarConfigEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/config/baritem', endPointRead: 'lookup', usePostForRead: false },
			},
			{
				uuid: '38bc5c95272949fc8c0beb27b1e1cf56',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Translationkey',
				gridConfig: {
					columns: [
						{
							id: 'Name',
							model: 'Name',
							type: FieldType.Description,
							label: {
								text: 'Item Name',
								key: 'basics.config.barItemFk',
							},
							sortable: true,
							readonly: true,
						},
					],
				},
			},
		);
	}
}
