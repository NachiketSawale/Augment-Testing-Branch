/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { AiActionParamsEnum } from '../../enum/actions/ai-action-editor-params.enum';
import { WorkflowAiConfigurationModelLookup } from '../../../services/workflow-lookup/action-editors/workflow-ai-configuration-model-lookup.service';

export class AiActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Lookup, AiActionParamsEnum.ModelCaseId, ParameterType.Input, 'basics.workflow.action.customEditor.modelCase', {} as ICodemirrorEditorOptions,WorkflowAiConfigurationModelLookup);
		this.createField(FieldType.Comment, AiActionParamsEnum.AIInputData, ParameterType.Input, 'basics.workflow.action.customEditor.aiInputData', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, AiActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}