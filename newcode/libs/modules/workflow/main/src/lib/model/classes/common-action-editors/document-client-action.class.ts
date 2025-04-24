/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { DocumentClientActionEditorParams } from '../../enum/actions/document-client-action-editor-params.enum';

export class DocumentClientActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.showOutputGroup = false;
		//ToDo check if hardcoded names(like in old client) should be used or the existing
		this.createField(FieldType.Comment, DocumentClientActionEditorParams.DocumentId, ParameterType.Input, 'basics.workflow.modalDialogs.documentId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, DocumentClientActionEditorParams.EvaluateProxy, ParameterType.Input, 'basics.workflow.action.customEditor.EvaluateProxy', {} as ICodemirrorEditorOptions);

	}
}