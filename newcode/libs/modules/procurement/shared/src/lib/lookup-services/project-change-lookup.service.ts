/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';

/*
 * Change
 * TODO - We should reuse project lookup from change module in future. Temporary define here
 */

export interface IProjectChangeEntity {
	Id: number,
	Description: string,
	Code: string,
	ProjectFk: number,
	ChangeStatusFk: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementShareProjectChangeLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProjectChangeEntity, TEntity> {
	public constructor() {
		super('ProjectChange', {
			uuid: '0e595980078340cabf462b7ae6b002f3',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '0e595980078340cabf462b7ae6b002f3',
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'ProjectNo', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: {text: 'ProjectNo', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}]
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Project Change',
					key: 'change.main.prjChange'
				}
			},
			showDialog: true
		});
	}
}