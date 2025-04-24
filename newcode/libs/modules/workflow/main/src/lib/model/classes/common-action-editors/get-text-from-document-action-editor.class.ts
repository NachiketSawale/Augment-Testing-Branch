/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ActionEditorBase } from './action-editor-base.class';
import { GetTextFromDocumentActionEditorParams } from '../../enum/actions/get-text-from-document-action-editor-params.enum';

/**
 * Configuration class for get text from document action first object editor.
 */
export class GetTextFromDocumentActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createField(FieldType.Comment,GetTextFromDocumentActionEditorParams.DocRef, ParameterType.Input, 'basics.workflow.action.customEditor.docRef',{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment,GetTextFromDocumentActionEditorParams.Text, ParameterType.Output, 'basics.workflow.action.customEditor.outputTextDocu',{} as ICodemirrorEditorOptions);
	}

}