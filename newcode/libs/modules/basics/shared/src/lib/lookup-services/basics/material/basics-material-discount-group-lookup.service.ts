/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IMaterialDiscountGroupLookupEntity } from '@libs/basics/interfaces';
import { FieldType, IGridConfiguration, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 * Material discount group lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialDiscountGroupLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IMaterialDiscountGroupLookupEntity, TEntity> {
	/**
	 * Grid configuration
	 */
	public configuration!: IGridConfiguration<IMaterialDiscountGroupLookupEntity>;

	/**
	 * The constructor
	 */
	public constructor() {
		super('materialdiscountgroup', {
			uuid: '99b28b2d4b68456ab98c3cc2f719d696',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				treeConfiguration: {
					parent: (entity: IMaterialDiscountGroupLookupEntity) => {
						if (entity.MaterialDiscountGroupFk) {
							return this.configuration.items?.find((item) => item.Id === entity.MaterialDiscountGroupFk) || null;
						}
						return null;
					},
					children: (entity: IMaterialDiscountGroupLookupEntity) => entity.ChildItems ?? [],
					collapsed: false
				},
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						width: 100,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						width: 120,
						visible: true,
						sortable: false,
						readonly: true
					}
				]
			}
		});
	}
}