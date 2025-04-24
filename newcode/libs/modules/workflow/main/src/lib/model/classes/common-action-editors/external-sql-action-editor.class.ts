/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ExternalSqlActionEditorParams } from '../../enum/actions/external-sql-action-editor-params.enum';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { SqlActionEditor } from './sql-action-editor.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';

/**
 * Configuration class for sql action editor.
 */
export class ExternalSqlActionEditor extends SqlActionEditor {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, ExternalSqlActionEditorParams.Database, ParameterType.Input, 'basics.workflow.action.customEditor.database', {} as ICodemirrorEditorOptions, undefined, undefined, true);
		this.createField(FieldType.Comment, ExternalSqlActionEditorParams.Server, ParameterType.Input, 'basics.workflow.action.customEditor.server', {} as ICodemirrorEditorOptions, undefined, undefined, true);
	}

}