/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { GetDocumentsByRfqIdActionParamsEnum } from '../../enum/actions/get-documents-by-rfq-id-action-editor-params.enum';

export class GetDocumentsByRfqIdActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, GetDocumentsByRfqIdActionParamsEnum.RfqId, ParameterType.Input, 'basics.workflow.action.customEditor.rfqId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, GetDocumentsByRfqIdActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}