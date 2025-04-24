/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowTemplateReduced } from '../../model/interfaces/workflow-template-reduced.interface';

/**
 * Lookup used to popupate escalation workflows.
 */
@Injectable({
	providedIn: 'root'
})
export class EscalationWorkflowLookup<T extends object> extends UiCommonLookupEndpointDataService<IWorkflowTemplateReduced, T> {
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<IWorkflowTemplateReduced, T> = {
			httpRead: { route: 'basics/workflow/v2/template/', endPointRead: 'listreduced' }
		};
		super(lookupEndpointConfig, {
			uuid: '14d5f58009ff11e5a6c01697f925ec7b',
			displayMember: 'Description',
			valueMember: 'Id'
		});
	}
}