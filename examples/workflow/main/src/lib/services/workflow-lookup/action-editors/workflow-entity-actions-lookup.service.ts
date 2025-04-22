/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowEntityActionsLookupItem } from '../../../model/interfaces/workflow-entity-actions-lookup-item.interface';

@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityActionsLookup<T extends object> extends UiCommonLookupEndpointDataService<IWorkflowEntityActionsLookupItem, T> {
	public constructor() {
		const endpoint: ILookupEndpointConfig<IWorkflowEntityActionsLookupItem, T> = {
			httpRead: {route: 'basics/workflow/entity/', endPointRead: 'list'},
			dataProcessors: [{
				processItem: dataItem => {
					dataItem.DisplayValue = dataItem.EntityName + (dataItem.ModuleName ? ' - ' + dataItem.ModuleName.toLowerCase() : '');
				}
			}]
		};
		super(endpoint, {
			uuid: '6fc2df04f4c54ad8877a3a446aac389c',
			displayMember: 'DisplayValue',
			valueMember: 'Id'
		});
	}
}