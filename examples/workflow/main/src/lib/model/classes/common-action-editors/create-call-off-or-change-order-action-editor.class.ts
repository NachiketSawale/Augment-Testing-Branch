/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CreateCallOffOrChangeOrderActionParamsEnum } from '../../enum/actions/create-call-off-or-change-order-action-editor-params.enum';

export class CreateCallOffOrChangeOrderActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, CreateCallOffOrChangeOrderActionParamsEnum.BasisContractId, ParameterType.Input, 'basics.workflow.action.customEditor.basisContractId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateCallOffOrChangeOrderActionParamsEnum.ProjectChangeId, ParameterType.Input, 'basics.workflow.action.customEditor.projectChangeId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateCallOffOrChangeOrderActionParamsEnum.Code, ParameterType.Input, 'basics.workflow.action.customEditor.code', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateCallOffOrChangeOrderActionParamsEnum.Description, ParameterType.Input, 'basics.workflow.action.customEditor.description', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateCallOffOrChangeOrderActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}