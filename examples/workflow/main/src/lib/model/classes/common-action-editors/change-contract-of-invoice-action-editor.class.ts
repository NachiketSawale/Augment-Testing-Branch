/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ChangeContractOfInvoiceActionParamsEnum } from '../../enum/actions/change-contract-of-invoice-action-editor-params.enum';

export class ChangeContractOfInvoiceActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, ChangeContractOfInvoiceActionParamsEnum.InvoiceId, ParameterType.Input, 'basics.workflow.action.customEditor.invoiceId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, ChangeContractOfInvoiceActionParamsEnum.ContractId, ParameterType.Input, 'basics.workflow.action.customEditor.contractId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, ChangeContractOfInvoiceActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}