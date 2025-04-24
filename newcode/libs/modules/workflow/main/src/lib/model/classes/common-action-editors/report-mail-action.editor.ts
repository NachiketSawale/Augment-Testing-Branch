/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ReportActionsBase } from './report-actions-base.class';
import { ActionEditorBase } from './action-editor-base.class';
import { MailActionEditorParams } from '../../enum/actions/mail-action-editor-params.enum';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';


export class ReportMailActionEditor extends ActionEditorBase {//IWorkflowCommonActionEditorBase<IReportParameterForClient> {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const reportBase = new ReportActionsBase(workflowAction, actionService, injector);
		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		//Report Grid
		this.createFieldByForm(reportBase.getReportGridRow());

		//Classic mail fields
		this.createField(FieldType.Script, MailActionEditorParams.From, ParameterType.Input, 'basics.workflow.action.customEditor.mail.from', editorOptions);
		this.createField(FieldType.Script, MailActionEditorParams.Subject, ParameterType.Input, 'basics.workflow.action.customEditor.mail.subject', editorOptions);
		this.createField(FieldType.Script, MailActionEditorParams.Body, ParameterType.Input, 'basics.workflow.action.customEditor.mail.body', editorOptions);
		this.createEditorMode(MailActionEditorParams.Receivers, ParameterType.Input, 'basics.workflow.action.customEditor.mail.receivers', true);
		this.createEditorMode(MailActionEditorParams.Cc, ParameterType.Input, 'basics.workflow.action.customEditor.mail.cc', true);
		this.createEditorMode(MailActionEditorParams.Bcc, ParameterType.Input, 'basics.workflow.action.customEditor.mail.bcc', true);
		this.createEditorMode(MailActionEditorParams.Attachements, ParameterType.Input, 'basics.workflow.action.customEditor.mail.attachements', true);
		this.createEditorMode(MailActionEditorParams.ReplyToList, ParameterType.Input, 'basics.workflow.action.customEditor.mail.replyToList', true);
		this.createField(FieldType.Boolean, MailActionEditorParams.Html, ParameterType.Input, 'basics.workflow.action.customEditor.mail.isHtml', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, MailActionEditorParams.SaveMail, ParameterType.Input, 'basics.workflow.action.customEditor.mail.saveMail', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, MailActionEditorParams.UseDefaultCredentials, ParameterType.Input, 'basics.workflow.action.customEditor.mail.useDefaultCredentials', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, MailActionEditorParams.DocId, ParameterType.Output, 'basics.workflow.action.customEditor.mail.documentId', editorOptions);
	}
}