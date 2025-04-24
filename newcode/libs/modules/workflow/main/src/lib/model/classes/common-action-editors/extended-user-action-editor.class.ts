/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, FormRow, IFormConfig } from '@libs/ui/common';
import { IWorkflowCommonActionEditorBase } from './common-action-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ExtendedUserActionParams } from '../../enum/actions/extended-user-action-params.enum';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { ActionParamDefaultValueConfig } from '../../types/default-action-params.type';

/**
 * Custom action editor for extended user action
 */
export class ExtendedUserActionEditor extends IWorkflowCommonActionEditorBase {

	public getFormConfig(): IFormConfig<IWorkflowAction> {
		return {
			groups: [
				{
					groupId: ParameterType.Input,
					header: { key: 'basics.workflow.action.input.containerHeader' },
					open: true
				},
				{
					groupId: ParameterType.Output,
					header: { key: 'basics.workflow.action.output.containerHeader' },
					open: true
				}],
			rows: this.getRows(),
			showGrouping: true,
			formId: 'external-sql-action-editor'
		};
	}

	private getRows(): FormRow<IWorkflowAction>[] {
		return [
			//HTML
			this.getAccordionEditor(ExtendedUserActionParams.Html, ParameterType.Input, { key: 'basics.workflow.action.html.containerHeader' }),
			//Javascript
			this.getAccordionEditor(ExtendedUserActionParams.Script, ParameterType.Input, { key: 'basics.workflow.action.script.containerHeader' }),
			//Context
			{
				model: this.getModel(ExtendedUserActionParams.Context, ParameterType.Input),
				type: FieldType.Script,
				editorOptions: {
					enableLineNumbers: true,
					languageMode: CodemirrorLanguageModes.Json,
					multiline: true,
					readOnly: false,
					enableBorder: true,
					isInputOutput: true
				},
				id: ExtendedUserActionParams.Context,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.context' }
			},
			//Title
			{
				model: this.getModel(ExtendedUserActionParams.Title, ParameterType.Input),
				type: FieldType.Description,
				id: ExtendedUserActionParams.Title,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.extendedUser.extendedTitle' }
			},
			//Subtitle
			{
				model: this.getModel(ExtendedUserActionParams.Subtitle, ParameterType.Input),
				type: FieldType.Description,
				id: ExtendedUserActionParams.Subtitle,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.extendedUser.extendedSubtitle' }
			},
			//Dialog Config
			{
				model: this.getModel(ExtendedUserActionParams.DialogConfig, ParameterType.Input),
				type: FieldType.Script,
				editorOptions: {
					enableLineNumbers: true,
					languageMode: CodemirrorLanguageModes.Json,
					multiline: true,
					readOnly: false,
					enableBorder: true,
					isInputOutput: true
				},
				id: ExtendedUserActionParams.DialogConfig,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.extendedUser.extendedDialogConfig' }
			},
			//View mode
			this.getViewModeConfig([
				//IsPopup
				{
					formRowId: ExtendedUserActionParams.IsPopupUp,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					formGroupId: ParameterType.Input,
					row: {
						model: this.getModel(ExtendedUserActionParams.IsPopupUp, ParameterType.Input),
						type: FieldType.Boolean,
						id: ExtendedUserActionParams.IsPopupUp,
						label: { key: 'basics.workflow.action.customEditor.isPopUp' }
					},
				},
				//EvaluateProxy
				{
					formRowId: ExtendedUserActionParams.EvaluateProxy,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					formGroupId: ParameterType.Input,
					row: {
						model: this.getModel(ExtendedUserActionParams.EvaluateProxy, ParameterType.Input),
						type: FieldType.Boolean,
						id: ExtendedUserActionParams.EvaluateProxy,
						label: { key: 'basics.workflow.action.customEditor.EvaluateProxy' }
					},
				},
				//Disable refresh
				{
					formRowId: ExtendedUserActionParams.DisableRefresh,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					formGroupId: ParameterType.Input,
					row: {
						model: this.getModel(ExtendedUserActionParams.DisableRefresh, ParameterType.Input),
						type: FieldType.Boolean,
						id: ExtendedUserActionParams.DisableRefresh,
						label: { key: 'basics.workflow.action.customEditor.DisableRefresh' }
					},
				},
				//Allow reassign
				{
					formRowId: ExtendedUserActionParams.AllowReassign,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					formGroupId: ParameterType.Input,
					row: {
						model: this.getModel(ExtendedUserActionParams.AllowReassign, ParameterType.Input),
						type: FieldType.Boolean,
						id: ExtendedUserActionParams.AllowReassign,
						label: { key: 'basics.workflow.action.customEditor.AllowReassign' }
					},
				},
			]),

			//Output - Context
			{
				model: this.getModel(ExtendedUserActionParams.Context, ParameterType.Output),
				type: FieldType.Description,
				id: ExtendedUserActionParams.Context + ParameterType.Output,
				groupId: ParameterType.Output,
				label: { key: 'basics.workflow.action.customEditor.context' }
			}
		];
	}

	public override defaultValues: ActionParamDefaultValueConfig = [
		{ actionParamKey: ExtendedUserActionParams.Context, parameterType: ParameterType.Input, value: '{{Context}}' }
	];
}