/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { ICosParameterLookupEntity } from '@libs/constructionsystem/shared';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICosParameterLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('CosParameter', {
			uuid: '61bb59c068f54c0ebec7ef8c15fcc1a3',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showDialog: false,
			gridConfig: {
				columns: [
					{
						id: 'description',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Translation,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription',
						},
						visible: true,
						sortable: false,
						width: 100,
					},
					{
						id: 'variablename',
						model: 'VariableName',
						type: FieldType.Description,
						label: {
							text: 'Variable Name',
							key: 'constructionsystem.master.entityVariableName',
						},
						visible: true,
						sortable: false,
						width: 100,
					},
					{
						id: 'propertyname',
						model: 'PropertyName',
						type: FieldType.Description,
						label: {
							text: 'Property Name',
							key: 'constructionsystem.master.entityPropertyName',
						},
						visible: true,
						sortable: false,
						width: 100,
					},
				],
			},
		});
	}
	public override getList(): Observable<ICosParameterLookupEntity[]> {
		return new Observable((observer) => {
			const items = this.cache.getList();
			observer.next(items);
		});
	}
}
