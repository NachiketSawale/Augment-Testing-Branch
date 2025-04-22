/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UpdatePesTransactionActionParamsEnum } from '../../enum/actions/update-pes-transaction-action-editor-params.enum';

export class UpdatePesTransactionActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.Code, ParameterType.Input, 'basics.workflow.action.customEditor.code', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.PesId, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.pesId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.HandOverId, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.handOverId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, UpdatePesTransactionActionParamsEnum.IsSuccess, ParameterType.Input, 'basics.workflow.action.customEditor.isSuccess', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.ReturnValue, ParameterType.Input, 'basics.workflow.action.customEditor.returnValue', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.PesNo, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.pesNo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.Userdefined1, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.userDefined1', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.Userdefined2, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.userDefined2', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.Userdefined3, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.userDefined3', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.PesTransactionIds, ParameterType.Input, 'basics.workflow.action.customEditor.updateContract.pesTransactionIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, UpdatePesTransactionActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}