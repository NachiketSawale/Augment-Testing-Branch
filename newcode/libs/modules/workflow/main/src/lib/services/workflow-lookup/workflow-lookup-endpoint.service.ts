/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { /*FieldType, ILookupConfig,*/ UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowKind } from '@libs/workflow/shared';

@Injectable({
	providedIn: 'root'
})
export class WorkflowLookupEndpoint<TEntity extends object> extends UiCommonLookupEndpointDataService<IWorkflowKind, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'basics/workflow/kind/', endPointRead: 'list' }};
		const config = {
			uuid: '22ac8586a5a642280278e50a46d8a9c2',
			valueMember: 'code',
			displayMember: 'description',
		};
		// TODO: Is gridConfig still required?
		/*
		const gridConfig: ILookupConfig<IWorkflowKind, TEntity> = {
			uuid: '22ac8586a5a642280278e50a46d8a9c2',
			valueMember: 'code',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{id: 'code', model: 'Code', type: FieldType.Code, label: {text: 'Code', key: 'cloud.common.entityCode'}, sortable: true, visible: true, readonly: true},
					{id: 'description', model: 'Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true},
				]
			},
			//Custom filter calls on click on search icon
			clientSideFilter: {
				execute: (item, context)=>{
					console.log(item);
					console.log(context);
					return true;
				}
			},
			showDialog: true
		};*/
		super(endpoint, config);
	}
}
