/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UpdateInvoiceTransactionActionParamsEnum } from '../../enum/actions/update-invoice-transaction-action-editor-params.enum';

export class UpdateInvoiceTransactionActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.Code, ParameterType.Input, 'basics.workflow.action.customEditor.code', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.InvoiceId, ParameterType.Input, 'basics.workflow.action.customEditor.invoiceId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.IsSuccess, ParameterType.Input, 'basics.workflow.action.customEditor.isSuccess', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.IsCanceled, ParameterType.Input, 'basics.workflow.action.customEditor.isCanceled', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.ReturnValue, ParameterType.Input, 'basics.workflow.action.customEditor.returnValue', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.DocumentNo, ParameterType.Input, 'basics.workflow.action.customEditor.documentNo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.AssetNo, ParameterType.Input, 'basics.workflow.action.customEditor.assetNo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.InvTransactionIds, ParameterType.Input, 'basics.workflow.action.customEditor.invTransactionIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}