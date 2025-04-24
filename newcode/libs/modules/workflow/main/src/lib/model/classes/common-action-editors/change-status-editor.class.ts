/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, FormRow, IFormConfig, ILookupEvent, createLookup } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IWorkflowCommonActionEditorBase } from './common-action-editor.class';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { ChangeStatusActionEditorParams } from '../../enum/actions/change-status-editor-params.enum';
import { WorkflowEntityStatusNameLookup } from '../../../services/workflow-lookup/workflow-entity-status-name-lookup.service';
import { WorkflowEntityStatusLookup } from '../../../services/workflow-lookup/workflow-entity-status-lookup.service';
import { IEntityStatusName } from '../../interfaces/workflow-entity-status-name.interface';
import { ActionParamDefaultValueConfig } from '../../types/default-action-params.type';

/**
 * Action editor for change status.
 */
export class ChangeStatusEditor extends IWorkflowCommonActionEditorBase {

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
		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		const statusLookupService = this.injector.get(WorkflowEntityStatusLookup);
		const statusParamRef = this.getActionObj(ChangeStatusActionEditorParams.statusName, ParameterType.Input);
		const statusIdParamRef = this.getActionObj(ChangeStatusActionEditorParams.newStatusId, ParameterType.Input);
		return [
			{
				type: FieldType.Script,
				id: ChangeStatusActionEditorParams.objectId,
				editorOptions,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.objectId' },
				model: this.getModel(ChangeStatusActionEditorParams.objectId, ParameterType.Input)
			},
			{
				type: FieldType.Script,
				id: ChangeStatusActionEditorParams.remark,
				editorOptions,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.remark' },
				model: this.getModel(ChangeStatusActionEditorParams.remark, ParameterType.Input)
			},
			this.getViewModeConfig([
				{
					formRowId: ChangeStatusActionEditorParams.statusName,
					formGroupId: ParameterType.Input,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					row: {
						id: ChangeStatusActionEditorParams.statusName,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: WorkflowEntityStatusNameLookup,
							events: [
								{
									name: 'onSelectedItemChanged', handler(e: ILookupEvent<IEntityStatusName, IWorkflowAction>) {
										//Returning if value hasn't changed
										if (statusParamRef.value == (e.selectedItem as IEntityStatusName).StatusName) {
											return;
										}
										//Assigning updated statusname to use for retrieval of status ids
										statusParamRef.value = (e.selectedItem as IEntityStatusName).StatusName;
										//Resetting value to the default value doesn't trigger a change in the child lookup if the value of the child lookup is already default, hence setting garbage value.
										(statusIdParamRef.value as unknown as number) = 999;
										statusLookupService.resetLookup(e.context);
									},
								}
							],
						}),
						model: this.getModel(ChangeStatusActionEditorParams.statusName, ParameterType.Input),
						label: { key: 'basics.workflow.action.customEditor.statusName' }
					}
				},
				{
					formRowId: ChangeStatusActionEditorParams.newStatusId,
					formGroupId: ParameterType.Input,
					standardViewFieldType: StandardViewFieldType.DomainControl,
					row: {
						id: ChangeStatusActionEditorParams.newStatusId,
						label: { key: 'basics.workflow.action.customEditor.newStatus' },
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: WorkflowEntityStatusLookup
						}),
						model: this.getModel(ChangeStatusActionEditorParams.newStatusId, ParameterType.Input)
					},
					expertViewFormConfig: {
						rows: [{
							type: FieldType.Script,
							id: ChangeStatusActionEditorParams.newStatusId,
							editorOptions,
							groupId: ParameterType.Input,
							label: { key: 'basics.workflow.action.customEditor.newStatusId' },
							model: this.getModel(ChangeStatusActionEditorParams.newStatusId, ParameterType.Input)
						}]
					}
				}
			]),
			{
				type: FieldType.Boolean,
				id: ChangeStatusActionEditorParams.checkValidate,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.checkValidate' },
				model: this.getModel(ChangeStatusActionEditorParams.checkValidate, ParameterType.Input)
			},
			{
				type: FieldType.Boolean,
				id: ChangeStatusActionEditorParams.runDependentWorkflow,
				groupId: ParameterType.Input,
				label: { key: 'basics.workflow.action.customEditor.runDependentWorkflow' },
				model: this.getModel(ChangeStatusActionEditorParams.runDependentWorkflow, ParameterType.Input)
			},
			{
				type: FieldType.Script,
				id: ChangeStatusActionEditorParams.newStatusId + ParameterType.Output,
				editorOptions,
				groupId: ParameterType.Output,
				label: { key: 'basics.workflow.action.customEditor.newStatus' },
				model: this.getModel(ChangeStatusActionEditorParams.newStatusId, ParameterType.Output)
			}
		];
	}

	public override defaultValues: ActionParamDefaultValueConfig = [
		{ actionParamKey: ChangeStatusActionEditorParams.checkValidate, parameterType: ParameterType.Input, value: true }
	];
}