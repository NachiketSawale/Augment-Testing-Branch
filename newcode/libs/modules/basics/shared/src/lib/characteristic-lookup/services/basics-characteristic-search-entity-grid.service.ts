
/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ColumnDef, FieldType } from '@libs/ui/common';
import { ICharacteristicEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BasicsCharacteristicSearchEntityGridService {
	public generateGridConfig(): ColumnDef<ICharacteristicEntity>[] {
		return [
			{
				id: 'code',
				model: 'Code',
				label: {
					text:'Code',
					key: 'cloud.common.entityCode'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				readonly: true,
				width: 100,
			},
			{
				id: 'description',
				model: 'DescriptionInfo.Translated',
				label: {
					text:'Description',
					key: 'cloud.common.entityDescription'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				readonly:true,
				width: 120
			},
		];
	}
}