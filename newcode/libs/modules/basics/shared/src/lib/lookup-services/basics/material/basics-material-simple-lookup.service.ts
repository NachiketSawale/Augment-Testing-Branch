/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IMaterialSimpleLookupEntity } from '@libs/basics/interfaces';
import { BasicsSharedUomLookupService } from '../../basics-uom-lookup.service';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';

/**
 * Material simple lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialSimpleLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IMaterialSimpleLookupEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		super('materialRecord', {
			uuid: 'd1ad6aa0adb54bf3b4d642db17e2f984',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						width: 100,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 150,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'uom',
						model: 'BasUomFk',
						type: FieldType.Lookup,
						label: { text: 'UoM', key: 'cloud.common.entityUoM' },
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedUomLookupService
						}),
						width: 150,
						visible: true,
						sortable: false,
						readonly: true
					}
				]
			}
		});
	}
}