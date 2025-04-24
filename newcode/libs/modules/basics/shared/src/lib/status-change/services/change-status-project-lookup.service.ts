/*
 * Copyright(c) RIB Software GmbH
 */

import {FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IProjectEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ChangeStatusProjectLookupService<TEntity extends object> extends UiCommonLookupTypeDataService <IProjectEntity, TEntity> {
	public constructor() {
		super('project', {
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'ProjectNo',
			showGrid: true,
			showDialog: true,
			gridConfig: {
				columns: [
					{
						id: 'ProjectNo',
						type: FieldType.Code,
						label: {text: 'Project No', key: 'cloud.common.entityProjectNo'},
						model: 'ProjectNo',
						visible: true,
						readonly: true,
						sortable: true
					},
					{
						id: 'ProjectName',
						type: FieldType.Description,
						label: {text: 'Project Name', key: 'cloud.common.entityProjectName'},
						model: 'ProjectName',
						visible: true,
						readonly: true,
						sortable: true
					}

				]
			},
			uuid: 'f89661753e6a4d4ba095adf78ccd8a25',
		});
		this.paging.enabled = true;
		this.paging.pageCount = 200;
	}
}


