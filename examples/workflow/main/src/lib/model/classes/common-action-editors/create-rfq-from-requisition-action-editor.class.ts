/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CreateRfqFromRequisitionActionParamsEnum } from '../../enum/actions/create-rfq-from-requisition-action-editor-params.enum';

export class CreateRfqFromRequisitionActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, CreateRfqFromRequisitionActionParamsEnum.ReqHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.requisitionId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Boolean, CreateRfqFromRequisitionActionParamsEnum.AutoCopyBidder, ParameterType.Input, 'basics.workflow.action.customEditor.autoCopyBidder', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateRfqFromRequisitionActionParamsEnum.BusinessPartnerIds, ParameterType.Input, 'basics.workflow.action.customEditor.bpIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateRfqFromRequisitionActionParamsEnum.ContactIds, ParameterType.Input, 'basics.workflow.action.customEditor.contactIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateRfqFromRequisitionActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}