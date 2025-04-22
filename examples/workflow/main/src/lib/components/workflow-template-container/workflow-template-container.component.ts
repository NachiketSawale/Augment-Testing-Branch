/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnDestroy } from '@angular/core';
import { WorkflowTemplate } from '@libs/workflow/interfaces';
import { ISearchPayload } from '@libs/platform/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { BasicsWorkflowTemplateDataService } from '../../services/basics-workflow-template-data.service';

/**
 * Component used to render workflow template details
 */
@Component({
	selector: 'workflow-main-template-container',
	templateUrl: './workflow-template-container.component.html',
	styleUrls: ['./workflow-template-container.component.scss']
})
export class WorkflowTemplateContainerComponent extends ContainerBaseComponent implements OnDestroy {

	/**
	 * Holds details of all loaded workflow templates
	 */
	public templateList: WorkflowTemplate[] = [];

	/**
	 * Initializes the component with workflow template data service and ui addons
	 * @param templateService
	 */
	public constructor(private templateService: BasicsWorkflowTemplateDataService) {
		super();
		this.loadTemplates();
	}

	private loadTemplates(): void {
		const searchPayload: ISearchPayload = {
			executionHints: false,
			filter: '',
			includeNonActiveItems: false,
			isReadingDueToRefresh: false,
			pageNumber: 0,
			pageSize: 100,
			pattern: 'benjamin',
			pinningContext: [],
			projectContextId: null,
			useCurrentClient: true
		};

		this.templateService.filter(searchPayload).then(data => {
			this.templateList = data.dtos;
		});
	}

	/**
	 * Unsubscribes to all subscriptions
	 */
	public override ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/**
	 * Select current template to render
	 * @param template
	 */
	public selectTemplate(template: WorkflowTemplate): void {

	}
}
