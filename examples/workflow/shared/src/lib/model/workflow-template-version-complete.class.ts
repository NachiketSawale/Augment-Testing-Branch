/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IWorkflowTemplateVersion } from '@libs/workflow/interfaces';

/**
 * Workflow template version complete
 */
export class WorkflowTemplateVersionComplete extends CompleteIdentification<IWorkflowTemplateVersion> {

	public constructor(templateVersion: IWorkflowTemplateVersion | undefined | null) {
		super();
		if (templateVersion !== null && templateVersion !== undefined) {
			this.TemplateVersionsToSave.push(templateVersion);
		}
	}

	public TemplateVersionsToSave: IWorkflowTemplateVersion[] = [];
}