/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ProcessInventoryActionParamsEnum } from '../../enum/actions/process-inventory-action-editor-params.enum';

export class ProcessInventoryActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, ProcessInventoryActionParamsEnum.InventoryHeaderIds, ParameterType.Input, 'basics.workflow.action.customEditor.InventoryHeaderIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, ProcessInventoryActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}