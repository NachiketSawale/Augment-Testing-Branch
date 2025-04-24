/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { DeleteProjectDocumentsActionParamsEnum } from '../../enum/actions/delete-project-documents-action-editor-params.enum';

export class DeleteProjectDocumentsActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, DeleteProjectDocumentsActionParamsEnum.ProjectDocumentIds, ParameterType.Input, 'basics.workflow.action.customEditor.ProjectDocumentIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, DeleteProjectDocumentsActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}