/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { WorkflowTemplate, IWorkflowTemplateVersion, IWorkflowSubscribedEvent } from '@libs/workflow/interfaces';
import { WorkflowTemplateVersionComplete } from './workflow-template-version-complete.class';

/**
 * Complete dto class for workflow template
 */
export class WorkflowTemplateComplete implements CompleteIdentification<WorkflowTemplate> {

	public constructor(modified: WorkflowTemplate | null) {
		if (modified && modified !== null) {
			this.Templates.push(modified);
		}
	}

	public Templates: WorkflowTemplate[] = [];

	public TemplateVersionsComplete: WorkflowTemplateVersionComplete[] = [];

	public TemplateVersionsToDelete: IWorkflowTemplateVersion[] = [];

	public SubscribedEventsToSave: IWorkflowSubscribedEvent[] = [];

	public SubscribedEventsToDelete: IWorkflowSubscribedEvent[] = [];
	//TODO: Add subscribed events and approver config
}