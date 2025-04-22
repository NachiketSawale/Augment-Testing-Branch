/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { WorkflowTemplate } from '@libs/workflow/interfaces';
import { inject } from '@angular/core';
import { BasicsWorkflowTemplateDataService } from '../../../services/basics-workflow-template-data.service';

@Injectable({
	providedIn: 'root'
})
export class WorkflowTemplateEntityLookup<T extends object = WorkflowTemplate>
	extends UiCommonLookupEndpointDataService<T> {
	private readonly templateDataService = inject(BasicsWorkflowTemplateDataService);
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<T, object> = {
			httpRead: { route: 'basics/workflow/template/', endPointRead: 'byentity', usePostForRead: false},
			filterParam: true,
			prepareListFilter: () => {
				return 'entityNameOrId=' + (this.templateDataService.getSelection() as WorkflowTemplate[])[0].EntityId;
			}
		};
		super(lookupEndpointConfig, {
			uuid: 'eb9f50d284b64120b467df5d097d0eb1',
			displayMember: 'Description',
			valueMember: 'Id'
		});
	}
}