/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ProcessBusinessPartnerUpdateRequestActionEditorParams } from '../../enum/actions/process-business-partner-update-request-action-editor-params.enum';

export class ProcessBusinessPartnerUpdateRequestActionEditor extends CommonColumnEditor {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Text, ProcessBusinessPartnerUpdateRequestActionEditorParams.BusinessPartnerId, ParameterType.Input, 'basics.workflow.action.customEditor.businessPartnerId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Text, ProcessBusinessPartnerUpdateRequestActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}