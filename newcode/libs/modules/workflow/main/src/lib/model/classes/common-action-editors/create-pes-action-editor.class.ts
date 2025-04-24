/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CreatePesActionEditorParams } from '../../enum/actions/create-pes-action-editor-params.enum';

/**
 * Configuration class for mail action editor.
 */
export class CreatePesActionEditor extends ActionEditorBase {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, CreatePesActionEditorParams.ContractId, ParameterType.Input, 'basics.workflow.action.customEditor.Contract', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreatePesActionEditorParams.IncludeNonContractedItemInPreviousPes, ParameterType.Input, 'basics.workflow.action.customEditor.IncludeNonContractedItemInPreviousPes', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreatePesActionEditorParams.ResultCode, ParameterType.Output, 'basics.workflow.action.customEditor.ResultCode', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreatePesActionEditorParams.ResultMessage, ParameterType.Output, 'basics.workflow.action.customEditor.ResultMessage', {} as ICodemirrorEditorOptions);
	}
}