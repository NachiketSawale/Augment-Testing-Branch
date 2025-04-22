/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, FormRow, IFormConfig, ILookupEvent } from '@libs/ui/common';
import { IWorkflowCommonActionEditorBase } from './common-action-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { UserformEditorParams } from '../../enum/actions/userform-editor-params.enum';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { WorkflowUserformLookupService } from '../../../services/workflow-lookup/workflow-userform-lookup.service';
import { IUserFormEntity } from '@libs/basics/shared';

/**
 * Userform action editor class
 */
export class UserformActionEditor extends IWorkflowCommonActionEditorBase {
	public override getFormConfig(): IFormConfig<IWorkflowAction> {
		return {
			rows: this.getRows(),
			groups: [{
				groupId: ParameterType.Input,
				header: { key: 'basics.workflow.action.input.containerHeader' },
				open: true
			}, {
				groupId: ParameterType.Output,
				header: { key: 'basics.workflow.action.output.containerHeader' },
				open: true
			}],
			showGrouping: true
		};
	}

	private getRows(): FormRow<IWorkflowAction>[] {
		const formRef = this.getActionObj(UserformEditorParams.formId, ParameterType.Input);
		const formDataRef = this.getActionObj(UserformEditorParams.formDataId, ParameterType.Output);
		return [
			{
				type: FieldType.Description,
				id: UserformEditorParams.context,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.context' },
				model: this.getModel(UserformEditorParams.context, ParameterType.Input)
			},
			{
				id: UserformEditorParams.description,
				groupId: ParameterType.Input,
				type: FieldType.Description,
				label: { key: 'basics.workflow.action.customEditor.description' },
				model: this.getModel(UserformEditorParams.description, ParameterType.Input)
			},
			this.getViewModeConfig([
				{
					formRowId: UserformEditorParams.formId,
					formGroupId: ParameterType.Input,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					row: {
						id: UserformEditorParams.formId,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: WorkflowUserformLookupService,
							events: [
								{
									name: 'onSelectedItemChanged', async handler(e: ILookupEvent<IUserFormEntity, IWorkflowAction>) {
										if ((formRef.value as unknown as number) === (e.selectedItem as IUserFormEntity).Id) {
											return;
										}
										formDataRef.value = (e.selectedItem as IUserFormEntity).Id as unknown as string;
									}
								}
							]
						}),

						model: this.getModel(UserformEditorParams.formId, ParameterType.Input),
						label: { key: 'basics.workflow.action.customEditor.userForm' }
					},
					expertViewFormConfig: {
						rows: [{
							id: UserformEditorParams.formId,
							groupId: ParameterType.Input,
							type: FieldType.Integer,
							label: { key: 'basics.workflow.action.customEditor.userformId' },
							model: this.getModel(UserformEditorParams.formId, ParameterType.Input)
						}]
					}
				},
			]),
			{
				id: UserformEditorParams.formDataId,
				groupId: ParameterType.Output,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: WorkflowUserformLookupService,
					events: [
						{
							name: 'onSelectedItemChanged', async handler(e: ILookupEvent<IUserFormEntity, IWorkflowAction>) {
								if ((formDataRef.value as unknown as number) === (e.selectedItem as IUserFormEntity).Id) {
									return;
								}
								formDataRef.value = (e.selectedItem as IUserFormEntity).Id as unknown as string;
							}
						}
					]
				}),
				label: { key: 'basics.workflow.action.customEditor.userformData' },
				model: this.getModel(UserformEditorParams.formDataId, ParameterType.Output)
			}
		];
	}


}
