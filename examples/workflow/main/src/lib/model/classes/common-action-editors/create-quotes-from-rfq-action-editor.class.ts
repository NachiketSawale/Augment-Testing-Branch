/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CreateQuotesFromRfqActionParamsEnum } from '../../enum/actions/create-quotes-from-rfq-action-editor.params.enum';
import { WorkflowEntityStatusLookup } from '../../../services/workflow-lookup/workflow-entity-status-lookup.service';

export class CreateQuotesFromRfqActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, CreateQuotesFromRfqActionParamsEnum.RfqHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.rfqHeaderId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateQuotesFromRfqActionParamsEnum.BidderId, ParameterType.Input, 'basics.workflow.action.customEditor.bidderId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Lookup, CreateQuotesFromRfqActionParamsEnum.QtnStatusId, ParameterType.Input, 'basics.workflow.action.customEditor.newStatus', {} as ICodemirrorEditorOptions, WorkflowEntityStatusLookup);
		this.createField(FieldType.Boolean, CreateQuotesFromRfqActionParamsEnum.ExceptionStopped, ParameterType.Input, 'basics.workflow.action.customEditor.exceptionStopped', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateQuotesFromRfqActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CreateQuotesFromRfqActionParamsEnum.Error, ParameterType.Output, 'basics.workflow.action.customEditor.outputError', {} as ICodemirrorEditorOptions);
	}
}