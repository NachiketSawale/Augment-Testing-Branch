/*
 * Copyright(c) RIB Software GmbH
 */

import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ReportActionsBase } from './report-actions-base.class';


/**
 * Configuration class for report client action editor.
 */
export class ReportClientActionEditor extends ActionEditorBase {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const reportBase = new ReportActionsBase(workflowAction, actionService, injector);

		this.createFieldByForm(reportBase.getAllReportRows());
	}
}