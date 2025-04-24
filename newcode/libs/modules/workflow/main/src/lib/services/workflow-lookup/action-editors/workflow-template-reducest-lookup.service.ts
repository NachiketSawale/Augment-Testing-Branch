/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowTemplateReduced } from '../../../model/interfaces/workflow-template-reduced.interface';

@Injectable({
	providedIn: 'root'
})
export class WorkflowTemplateLookup<T extends object = IWorkflowTemplateReduced>
	extends UiCommonLookupEndpointDataService<T> {
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<T, object> = {
			httpRead: { route: 'basics/workflow/template/', endPointRead: 'listreduced'}
		};
		super(lookupEndpointConfig, {
			uuid: 'ee9f50d284b64120b367df5d094d0eb1',
			displayMember: 'Description',
			valueMember: 'Id'
		});
	}
}