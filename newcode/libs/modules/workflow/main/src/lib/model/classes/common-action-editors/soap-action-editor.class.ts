/*
 * Copyright(c) RIB Software GmbH
 */

import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { SoapActionEditorParam } from '../../enum/actions/soap-action-editor-param.enum';

/**
 * SOAP Action editor class.
 */
export class SoapActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const contentEditor = {
			enableLineNumbers: true,
			languageMode: CodemirrorLanguageModes.Xml,
			multiline: true,
			readOnly: false,
			enableBorder: true,
			isInputOutput: true
		};

		const optionsEditor = {
			enableLineNumbers: true,
			languageMode: CodemirrorLanguageModes.Xml,
			multiline: false,
			readOnly: false,
			enableBorder: true,
			isInputOutput: true
		};

		this.createField(FieldType.Url, SoapActionEditorParam.Url, ParameterType.Input, 'basics.workflow.action.customEditor.soapAction.url', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SoapActionEditorParam.Action, ParameterType.Input, 'basics.workflow.action.customEditor.soapAction.action', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, SoapActionEditorParam.Content, ParameterType.Input, 'basics.workflow.action.customEditor.soapAction.content', contentEditor);
		this.createField(FieldType.Script, SoapActionEditorParam.Options, ParameterType.Input, 'basics.workflow.action.customEditor.soapAction.options', optionsEditor);
		this.createField(FieldType.Comment, SoapActionEditorParam.Response, ParameterType.Output, 'basics.workflow.action.customEditor.soapAction.response', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SoapActionEditorParam.ResponseStatus, ParameterType.Output, 'basics.workflow.action.customEditor.soapAction.responseStatus', {} as ICodemirrorEditorOptions);
	}
}
