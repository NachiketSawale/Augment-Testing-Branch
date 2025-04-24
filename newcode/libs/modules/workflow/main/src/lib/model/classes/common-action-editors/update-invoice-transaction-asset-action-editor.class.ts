/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UpdateInvoiceTransactionAssetActionEditorParams } from '../../enum/actions/update-invoice-transaction-asset-action-editor-params.enum';

export class UpdateInvoiceTransactionAssetActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionAssetActionEditorParams.InvTransactionId, ParameterType.Input, 'basics.workflow.action.customEditor.invTransactionId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionAssetActionEditorParams.AssetNo, ParameterType.Input, 'basics.workflow.action.customEditor.assetNo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionAssetActionEditorParams.AssetDescription, ParameterType.Input, 'basics.workflow.action.customEditor.assetDescription', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateInvoiceTransactionAssetActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}