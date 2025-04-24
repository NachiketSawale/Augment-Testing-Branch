/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IUserFormEntity } from '@libs/basics/shared';
import { ILookupConfig, ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';


@Injectable({
  providedIn: 'root'
})

/**
 * Userform lookup service for workflow.
 */
export class WorkflowUserformLookupService extends UiCommonLookupEndpointDataService<IUserFormEntity, IWorkflowAction> {

 public constructor() {
	const endpointConfig: ILookupEndpointConfig<IUserFormEntity, IWorkflowAction> = {
		httpRead: {
			route: 'basics/userform/',
			endPointRead: 'list'
		}
	};
	const lookupConfig: ILookupConfig<IUserFormEntity, IWorkflowAction> = {
		uuid: '', displayMember: '', valueMember: 'Id', formatter: {
			format(dataItem) {
				return dataItem.DescriptionInfo.Translated;
			},
		}
	};
	super(endpointConfig, lookupConfig);
 }

}
