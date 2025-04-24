/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { SqlActionToCSVEditorParams } from '../../enum/actions/sql-action-to-csv-editor-params.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ActionEditorBase } from './action-editor-base.class';

/**
 * Configuration class for sql action first object editor.
 */
export class SqlActionToCsvEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Script,
			SqlActionToCSVEditorParams.Sql,
			ParameterType.Input,
			'basics.workflow.action.customEditor.sql',
			{
				languageMode: CodemirrorLanguageModes.MsSQL,
				multiline: true,
				readOnly: false,
				enableLineNumbers: true,
				enableBorder: true
			});
		this.createEditorMode(SqlActionToCSVEditorParams.Params, ParameterType.Input, 'basics.workflow.action.customEditor.params');
		this.createField(FieldType.Comment,SqlActionToCSVEditorParams.FieldSeparator, ParameterType.Input, 'basics.workflow.action.customEditor.fieldSeparator',{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment,SqlActionToCSVEditorParams.FileName, ParameterType.Input, 'basics.workflow.action.customEditor.fileName',{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment,SqlActionToCSVEditorParams.DocId, ParameterType.Output, 'basics.workflow.action.customEditor.sqlActionOutput',{} as ICodemirrorEditorOptions);
	}

}