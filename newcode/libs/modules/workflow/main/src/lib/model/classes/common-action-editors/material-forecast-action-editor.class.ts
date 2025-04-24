/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { MaterialForecastActionParams } from '../../enum/actions/material-forecast-action-params.enum';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';

export class MaterialForecastActionEditor extends CommonColumnEditor {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions = {
			enableLineNumbers: true,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: true,
			readOnly: false,
			enableBorder: true
		};

		//Input
		this.createField(FieldType.Text, MaterialForecastActionParams.EmailCount, ParameterType.Input, 'basics.workflow.action.customEditor.emailCount', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Text, MaterialForecastActionParams.Subject, ParameterType.Input, 'basics.workflow.action.customEditor.mail.subject', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, MaterialForecastActionParams.Body, ParameterType.Input, 'basics.workflow.action.customEditor.body', editorOptions);
		this.createField(FieldType.Text, MaterialForecastActionParams.Sender, ParameterType.Input, 'basics.workflow.action.customEditor.sender', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Password, MaterialForecastActionParams.Password, ParameterType.Input, 'basics.workflow.action.customEditor.password', {} as ICodemirrorEditorOptions);
		//Output
		this.createField(FieldType.Text, MaterialForecastActionParams.ResultCode, ParameterType.Output, 'basics.workflow.action.customEditor.teams.resultCode', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Text, MaterialForecastActionParams.ResultMessage, ParameterType.Output, 'basics.workflow.action.customEditor.teams.resultMessage', {} as ICodemirrorEditorOptions);
	}
}