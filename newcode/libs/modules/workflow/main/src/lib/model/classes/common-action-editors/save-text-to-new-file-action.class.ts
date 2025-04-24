/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { SaveTextToNewFileActionEditorParams } from '../../enum/actions/save-text-to-new-file-action-editor-params.enum';

/**
 * Configuration class for save text to new file action editor.
 */
export class SaveTextToNewFileActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions = {
			enableLineNumbers: true,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: true,
			readOnly: false,
			enableBorder: true
		};

		this.createField(FieldType.Boolean, SaveTextToNewFileActionEditorParams.AppendToExistingFile, ParameterType.Input, 'basics.workflow.action.customEditor.appendToExistingFile', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SaveTextToNewFileActionEditorParams.Filename, ParameterType.Input, 'basics.workflow.action.customEditor.fileName', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SaveTextToNewFileActionEditorParams.SavePath, ParameterType.Input, 'basics.workflow.action.customEditor.savePath', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, SaveTextToNewFileActionEditorParams.Content, ParameterType.Input, 'basics.workflow.action.customEditor.content', editorOptions);
		this.createField(FieldType.Comment, SaveTextToNewFileActionEditorParams.Response, ParameterType.Output, 'basics.workflow.action.customEditor.outputClientPost', {} as ICodemirrorEditorOptions);
	}
}