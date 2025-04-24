/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Type } from '@angular/core';
import { ACTION_EDITOR_FORM_CONFIG_MAP, ActionEditor, CUSTOM_ACTION_EDITOR_ID_MAP } from '../../constants/workflow-action-editor-id';
import { IWorkflowActionEditor } from '../../model/interfaces/workflow-action-editor.interface';
import { CommonActionEditorComponent } from '../../components/action-editors/common-action-editor/common-action-editor.component';
import { DefaultActionEditor } from '../../model/classes/common-action-editors/default-action-editor.class';

/**
 * Service to register/retrieve information of custom components/form configurations for worfklow action editors.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowActionEditorRegistryService {

	private customActionEditorMap: Map<string, Type<ActionEditor>>;
	private commonActionEditorFormConfigMap: Map<string, Type<IWorkflowActionEditor>>;
	public constructor() {
		this.customActionEditorMap = new Map<string, Type<ActionEditor>>(CUSTOM_ACTION_EDITOR_ID_MAP);
		this.commonActionEditorFormConfigMap = new Map<string, Type<IWorkflowActionEditor>>(ACTION_EDITOR_FORM_CONFIG_MAP);
	}

	/**
	 * Gets type action editor for current selected action.
	 * @param actionId Action id
	 * @returns Component that should be rendered for the selected action
	 */
	public getActionEditorType(actionId: string): Type<ActionEditor> {
		//First check if custom action editor
		const customActionEditor = this.customActionEditorMap.get(actionId);

		//Next check if common action editor
		if (customActionEditor) {
			return customActionEditor;
		}

		return CommonActionEditorComponent;
	}

	/**
	 * Gets form configuration for common action editors
	 * @param actionId Action id
	 * @returns Form configuration of action parameters for the selected action
	 */
	public getCommonActionEditorFormConfig(actionId: string): Type<IWorkflowActionEditor> {
		const actionEditorConfig = this.commonActionEditorFormConfigMap.get(actionId);
		if(actionEditorConfig) {
			return actionEditorConfig;
		}
		return DefaultActionEditor;
	}
}