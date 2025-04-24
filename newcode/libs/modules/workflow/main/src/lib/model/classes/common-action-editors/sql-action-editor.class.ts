/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { SqlActionEditorParams } from '../../enum/actions/sql-action-editor-params.enum';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';

/**
 * Configuration class for sql action editor.
 */
export class SqlActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Script,
			SqlActionEditorParams.Sql,
			ParameterType.Input,
			'basics.workflow.action.customEditor.sql',
			{
				languageMode: CodemirrorLanguageModes.MsSQL,
				multiline: true,
				readOnly: false,
				enableLineNumbers: true,
				enableBorder: true
			});
		this.createEditorMode(SqlActionEditorParams.Params, ParameterType.Input, 'basics.workflow.action.customEditor.params');
		this.createField(FieldType.Script,
			SqlActionEditorParams.Output,
			ParameterType.Output,
			'basics.workflow.action.customEditor.outputResult',
			{
				languageMode: CodemirrorLanguageModes.JavaScript,
				multiline: false,
				readOnly: false,
				enableLineNumbers: false,
				enableBorder: true
			});
	}
}