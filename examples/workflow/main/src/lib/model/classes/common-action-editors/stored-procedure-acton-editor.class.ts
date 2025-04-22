/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { StoredProcedureActionEditorParams } from '../../enum/actions/stored-procedure-editor-params.enum';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';

/**
 * Configuration class for stored procedure action editor.
 */
export class StoredProcedureActionEditor extends CommonColumnEditor {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, StoredProcedureActionEditorParams.StoredProcedureName, ParameterType.Input, 'basics.workflow.action.customEditor.storedProcedureName', {} as ICodemirrorEditorOptions);
		this.createEditorMode(StoredProcedureActionEditorParams.Params, ParameterType.Input, 'basics.workflow.action.customEditor.params');
		this.createField(FieldType.Comment, StoredProcedureActionEditorParams.Output, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}