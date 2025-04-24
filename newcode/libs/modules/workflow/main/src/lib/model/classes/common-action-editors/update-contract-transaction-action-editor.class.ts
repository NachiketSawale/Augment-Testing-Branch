/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UpdateContractTransactionActionParamsEnum } from '../../enum/actions/update-contract-transaction-action-editor-params.enum';

export class UpdateContractTransactionActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.Code, ParameterType.Input, 'basics.workflow.action.customEditor.code', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.ContractId, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.contractId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, UpdateContractTransactionActionParamsEnum.IsSuccess, ParameterType.Input, 'basics.workflow.action.customEditor.isSuccess', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.HandOverId, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.handOverId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.ReturnValue, ParameterType.Input, 'basics.workflow.action.customEditor.returnValue', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.OrderNo, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.orderNo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.Userdefined1, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.userDefined1', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.Userdefined2, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.userDefined2', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.Userdefined3, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.userDefined3', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.ConTransactionIds, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.conTransactionIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdateContractTransactionActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}