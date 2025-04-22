/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { SendCalenderEventActionEditorParams } from '../../enum/actions/send-calendar-event-action-editor-params.enum';
import { WorkflowCalenderEventImportanceLookup } from '../../../services/workflow-lookup/action-editors/workflow-calender-event-importence-lookup.service';
import { WorkflowCalenderEventSensitivityLookup } from '../../../services/workflow-lookup/action-editors/workflow-calender-event-sensitivity-lookup.service';

/**
 * Configuration class for Send Calender Event action editor.
 */
export class SendCalenderEventActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		const editorOptionsScript = {
			enableLineNumbers: true,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: true,
			readOnly: false,
			enableBorder: true
		};
		this.createField(FieldType.Comment, SendCalenderEventActionEditorParams.ReceiverId, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.receiverId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SendCalenderEventActionEditorParams.Subject, ParameterType.Input, 'basics.workflow.action.customEditor.mail.subject', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, SendCalenderEventActionEditorParams.Body, ParameterType.Input, 'basics.workflow.action.customEditor.mail.body', editorOptionsScript);
		this.createField(FieldType.Comment, SendCalenderEventActionEditorParams.Start, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.startTime', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SendCalenderEventActionEditorParams.End, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.endTime', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Lookup, SendCalenderEventActionEditorParams.Importance, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.importance', {} as ICodemirrorEditorOptions, WorkflowCalenderEventImportanceLookup);
		this.createField(FieldType.Lookup, SendCalenderEventActionEditorParams.Sensitivity, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.sensitivity', {} as ICodemirrorEditorOptions, WorkflowCalenderEventSensitivityLookup);
		this.createField(FieldType.Comment, SendCalenderEventActionEditorParams.ReminderMinutesBeforeStart, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.reminderMinutes', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, SendCalenderEventActionEditorParams.IsReminderOn, ParameterType.Input, 'basics.workflow.action.customEditor.calendarEvent.isReminderOn', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, SendCalenderEventActionEditorParams.IsHTML, ParameterType.Input, 'basics.workflow.action.customEditor.mail.isHtml', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SendCalenderEventActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.calendarEvent.result', {} as ICodemirrorEditorOptions);
	}
}