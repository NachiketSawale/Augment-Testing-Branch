/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ICostCodesRefrenceEntity } from '@libs/basics/interfaces';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';

/**
 * Todo.. Reference Stack Details Lookup, this class have dynamic lookup & depends on various entities comes from different modules
 */

/**
 * Basics Cost Codes Reference Details Stack Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesReferenceDetailsStackLookupService<TEntity extends object = object> extends UiCommonLookupTypeDataService<ICostCodesRefrenceEntity, TEntity> {
	public constructor() {
		super('basicsCostcodesDetailsStackLookup', {
			uuid: '9d0d91dd571b442c9896cbe196e8d7e2',
			idProperty: 'Id',
			valueMember: 'Code',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'assemblycode',
						model: 'AssemblyCode', // Todo
						type: FieldType.Code,
						label: { text: 'Assembly Code', key: 'Assembly Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'assemblydescription',
						model: 'AssemblyDescription', // Todo
						type: FieldType.Description,
						label: { text: 'Assembly Description', key: 'Assembly Description' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			},
			showDialog: false,
			showGrid: true
		});
	}
}
