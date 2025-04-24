/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CheckVatNoActionParamsEnum } from '../../enum/actions/check-vat-no-action-editor-params.enum';

export class CheckVatNoActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, CheckVatNoActionParamsEnum.VatNo, ParameterType.Input, 'basics.workflow.action.customEditor.vatNo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CheckVatNoActionParamsEnum.Response, ParameterType.Output, 'basics.workflow.action.customEditor.outputCheckVatResponse', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, CheckVatNoActionParamsEnum.Valid, ParameterType.Output, 'basics.workflow.action.customEditor.outputCheckVatValid', {} as ICodemirrorEditorOptions);
	}
}