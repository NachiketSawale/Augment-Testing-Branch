/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { WorkflowEntityService } from '../workflow-entity/workflow-entity.service';
import { IDataEntityFacade } from '@libs/workflow/interfaces';

/**
 * Local type used to set values for lookup
 */
type IDataEntityFacadeLookup = Omit<IDataEntityFacade, 'Id'> & {
	Id: number;
	UUID: string;
};

/**
 * Lookup used for retrieve kind of workflow
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityLookup<TEntity extends object> extends UiCommonLookupItemsDataService<IDataEntityFacadeLookup, TEntity> {

	public constructor(dataEntityFacadeService: WorkflowEntityService) {

		const items: IDataEntityFacadeLookup[] = dataEntityFacadeService.entityFacades.map(
			function (item, index): IDataEntityFacadeLookup {
				return { ...item, Id: index, UUID: item.Id };
			}
		);

		super(items, {
			uuid: '14d5f58009ff11e5a6c01697f925ec7b',
			displayMember: 'EntityName',
			valueMember: 'UUID',
			showGrid: true,
			gridConfig: {
				columns: [
					{id: 'entityName', model: 'EntityName', type: FieldType.Description, label: {text: 'EntityName'}, sortable: true, visible: true, readonly: true},
					{id: 'moduleName', model: 'ModuleName', type: FieldType.Description, label: {text: 'ModuleName'}, sortable: true, visible: true, readonly: true},
					{id: 'Id', type: FieldType.Integer, model: 'UUID',  label: {text: 'Id', key: 'Id'}, sortable: true, readonly: true, visible: true}
				],
				skipPermissionCheck: true
			},
			showDialog: true
		});
	}
}
