/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IWorkflowCommonActionEditorBase } from './common-action-editor.class';
import { CodemirrorLanguageModes, FieldType, FormRow, ICodemirrorEditorOptions, IFormConfig } from '@libs/ui/common';
import { PropertyType } from '@libs/platform/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';

/**
 * Default action editor configuration for actions with no action editors.
 */
export class DefaultActionEditor extends IWorkflowCommonActionEditorBase {

	/**
	 * Prepares the form configuration used to render codemirror form fields.
	 * @param workflowAction: IWorkflowAction
	 * @returns IFormConfig<IActionInputField>
	 */
	public getFormConfig(): IFormConfig<IWorkflowAction> {
		const codeMirrorEditorOptions: ICodemirrorEditorOptions = { readOnly: false, multiline: false, languageMode: CodemirrorLanguageModes.JavaScript, enableLineNumbers: false, enableBorder: true };
		const formConfig: IFormConfig<IWorkflowAction> = {
			formId: 'workflow-input-parameters-form',
			showGrouping: true,
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
				}
			],
			rows: []
		};

		// Requires a reference to this object.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		this.parentEntity.input?.forEach((inputItem, index) => {
			const formRow: FormRow<IWorkflowAction> = {
				id: `${ParameterType.Input}${index}`,
				label: inputItem.key,
				type: FieldType.Script,
				model: {
					getValue(obj: IWorkflowAction) {
						return obj.input[index].value;
					},
					setValue(obj: IWorkflowAction, value?: PropertyType) {
						if(value && typeof value === 'string') {
							obj.input[index].value = value;
						}
					}
				},
				editorOptions: codeMirrorEditorOptions,
				groupId: ParameterType.Input,
				change(changeInfo) {
					self.actionService.setFieldModified(self.getModel(inputItem.key, ParameterType.Input), changeInfo.newValue);
				},
			};
			formConfig.rows.push(formRow);
		});

		this.parentEntity.output?.forEach((outputItem, index) => {
			const formRow: FormRow<IWorkflowAction> = {
				id: `${ParameterType.Output}${index}`,
				label: outputItem.key,
				type: FieldType.Script,
				model: {
					getValue(obj: IWorkflowAction) {
						return obj.output[index].value;
					},
					setValue(obj: IWorkflowAction, value?: PropertyType) {
						if(value && typeof value === 'string') {
							obj.output[index].value = value;
						}
					}
				},
				editorOptions: codeMirrorEditorOptions,
				groupId: ParameterType.Output,
				change(changeInfo) {
					self.actionService.setFieldModified(self.getModel(outputItem.key, ParameterType.Output), changeInfo.newValue);
				},
			};
			formConfig.rows.push(formRow);
		});

		return formConfig;
	}
}