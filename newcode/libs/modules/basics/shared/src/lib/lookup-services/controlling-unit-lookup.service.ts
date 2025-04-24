/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import { IControllingUnitEntity } from './entities/controlling-unit-entity';

/*
 * Controlling Unit
 * Todo - Obsolete, please use ControllingSharedControllingUnitLookupProviderService instead, this one should deleted later.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsShareControllingUnitLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IControllingUnitEntity, TEntity> {
	public constructor() {
		super('controllingunit', {
			uuid: '47783c48d2834cada2b45f5d8b176701',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '47783c48d2834cada2b45f5d8b176701',
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'quantity',
						model: 'Quantity',
						type: FieldType.Integer,
						label: {text: 'Quantity', key: 'cloud.common.entityQuantity'},
						sortable: true,
						visible: true,
						readonly: true
					},
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Controlling Unit',
					key: 'cloud.common.controllingCodeTitle'
				}
			},
			showDialog: true
		});
	}
}