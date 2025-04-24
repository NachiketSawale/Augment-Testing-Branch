/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IMaterialGroupLookupEntity } from '@libs/basics/interfaces';
import { FieldType, IGridConfiguration, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 * Material group lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialGroupLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IMaterialGroupLookupEntity, TEntity> {
	/**
	 * Grid configuration
	 */
	public configuration!: IGridConfiguration<IMaterialGroupLookupEntity>;

	/**
	 * The constructor
	 */
	public constructor() {
		super('MaterialGroup', {
			uuid: '851543aa3bd24948badc4206924f768c',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				treeConfiguration: {
					parent: (entity: IMaterialGroupLookupEntity) => {
						if (entity.MaterialGroupFk) {
							return this.configuration.items?.find((item) => item.Id === entity.MaterialGroupFk) || null;
						}
						return null;
					},
					children: (entity: IMaterialGroupLookupEntity) => entity.ChildItems ?? [],
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
						model: 'DescriptionInfo.Translated',
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