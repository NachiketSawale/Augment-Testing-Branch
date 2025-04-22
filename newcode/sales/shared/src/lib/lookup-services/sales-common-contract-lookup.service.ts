/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IOrdHeaderEntity } from '../model/entities/ord-header-entity.interface';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales common contract Lookup Service
 */
export class SalesCommonContractLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IOrdHeaderEntity, TEntity> {
	public constructor() {
		super('SalesContract', {
			uuid: 'ed07fe8d5d4b4c1f8fe0bbe97ee9a8a7',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{id: 'Code', model: 'Code', type: FieldType.Description, label: {text: 'Code'}, sortable: true, visible: true, readonly: true},
					{id: 'Description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true}
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Sales Contract'
				}
			},
			showDialog: true,
			showGrid: false,
		});
	}
}