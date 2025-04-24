/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ReportActionsBase } from './report-actions-base.class';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ReportActionEditorParams } from '../../enum/actions/report-action-editor.enum';
import { WorkflowReportExportTypeLookup } from '../../../services/workflow-lookup/action-editors/workflow-report-export-type-lookup.service';

export class ReportActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const reportBase = new ReportActionsBase(workflowAction, actionService, injector);
		//Input
		this.createField(FieldType.Lookup, ReportActionEditorParams.ExportType, ParameterType.Input, 'basics.workflow.action.customEditor.exportType', {} as ICodemirrorEditorOptions, WorkflowReportExportTypeLookup);
		this.createField(FieldType.Text, ReportActionEditorParams.Filename, ParameterType.Input, 'basics.workflow.action.customEditor.fileName', {} as ICodemirrorEditorOptions);
		this.createFieldByForm(reportBase.getReportGridRow());
		//Output
		this.createField(FieldType.Text, ReportActionEditorParams.DocumentId, ParameterType.Output, 'basics.workflow.action.customEditor.fileName', {} as ICodemirrorEditorOptions);

	}
}