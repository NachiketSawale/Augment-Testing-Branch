/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UpdateInvoiceHeaderActionParamsEnum } from '../../enum/actions/update-invoice-header-action-editor-params.enum';

export class UpdateInvoiceHeaderActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Code, ParameterType.Input, 'basics.workflow.action.customEditor.code', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.InvoiceId, ParameterType.Input, 'basics.workflow.action.customEditor.invoiceId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.NewCode, ParameterType.Input, 'basics.workflow.action.customEditor.newCode', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Remark, ParameterType.Input, 'basics.workflow.action.customEditor.remark', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Userdefined1, ParameterType.Input, 'basics.workflow.action.detail.userDefined1', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Userdefined2, ParameterType.Input, 'basics.workflow.action.detail.userDefined2', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Userdefined3, ParameterType.Input, 'basics.workflow.action.detail.userDefined3', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Userdefined4, ParameterType.Input, 'basics.workflow.action.detail.userDefined4', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Userdefined5, ParameterType.Input, 'basics.workflow.action.detail.userDefined5', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceHeaderActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}