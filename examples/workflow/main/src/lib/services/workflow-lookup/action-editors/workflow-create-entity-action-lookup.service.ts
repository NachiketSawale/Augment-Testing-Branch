/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowEntityActionsLookupItem } from '../../../model/interfaces/workflow-entity-actions-lookup-item.interface';

@Injectable({
	providedIn: 'root'
})
export class WorkflowCreateEntityActionLookup<T extends object> extends UiCommonLookupEndpointDataService<IWorkflowEntityActionsLookupItem, T> {
	public constructor() {
		const endpoint: ILookupEndpointConfig<IWorkflowEntityActionsLookupItem, T> = {
			httpRead: {route: 'basics/workflow/entity/create/', endPointRead: 'list'},
			dataProcessors: [{
				processItem: dataItem => {
					dataItem.DisplayValue = dataItem.EntityName + (dataItem.ModuleName ? ' - ' + dataItem.ModuleName.toLowerCase() : '');
				}
			}]
		};
		super(endpoint, {
			uuid: '18b5cf99031f4b01b3fa2cb3a9453020',
			displayMember: 'DisplayValue',
			valueMember: 'Id'
		});
	}
}