/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UpdateInvoiceGeneralsActionParamsEnum } from '../../enum/actions/update-invoice-generals-action-editor-params.enum';

export class UpdateInvoiceGeneralsActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, UpdateInvoiceGeneralsActionParamsEnum.InvId, ParameterType.Input, 'basics.workflow.action.customEditor.invId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceGeneralsActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}