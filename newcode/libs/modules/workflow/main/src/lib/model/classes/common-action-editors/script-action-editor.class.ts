/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, IFormConfig } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';

/**
 * Configuration class for sql action editor.
 */
export class ScriptActionEditor extends CommonColumnEditor {


	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Script, 'script', ParameterType.Input, 'basics.workflow.action.script.containerHeader', {
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: true,
			readOnly: false,
			enableLineNumbers: true
		});
	}

	public override getFormConfig(): IFormConfig<IWorkflowAction> {
		return {
			rows: this.getRows(),
			showGrouping: true,
			formId: 'script-action-editor'
		};
	}
}