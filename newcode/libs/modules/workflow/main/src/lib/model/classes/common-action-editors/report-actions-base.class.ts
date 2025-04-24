/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowCommonActionEditorBase } from './common-action-editor.class';
import { IReportParameterForClient } from '../../types/report-parameter.type';
import { CodemirrorLanguageModes, createLookup, FieldType, FormRow, IFormConfig, IGridConfiguration, ILookupEvent } from '@libs/ui/common';
import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { StandardViewGridConfig } from '../../types/standard-view-configuration.type';
import { isEmpty } from 'lodash';
import { ReportClientActionParams } from '../../enum/actions/report-client-action-params.enum';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { WorkflowReportUtilService } from '../../../services/workflow-report-util.service';
import { ParameterView } from '../../types/parameter-view-mode.type';
import { WorkflowReportTypeLookup } from '../../../services/workflow-lookup/action-editors/workflow-report-type-lookup.service';
import { WorkflowReportLookup } from '../../../services/workflow-lookup/action-editors/workflow-report-lookup.service';
import { IReport } from '../../interfaces/workflow-report.interface';
import { IGridViewProperties } from '../../interfaces/action-editor/grid-view-properties.interface';

export class ReportActionsBase extends IWorkflowCommonActionEditorBase<IReportParameterForClient> {

	/**
	 * Get form config with all report rows.
	 */
	public getFormConfig(): IFormConfig<IWorkflowAction> {
		return {
			rows: this.getAllReportRows(),
			formId: 'report-client-action-editor',
			groups: [
				{
					groupId: ParameterType.Input,
					header: {key: 'basics.workflow.action.input.containerHeader'},
					open: true
				},
				{
					groupId: ParameterType.Output,
					header: {key: 'basics.workflow.action.output.containerHeader'},
					open: true
				}],
			showGrouping: true
		};
	}

	/**
	 * Get all report rows
	 */
	public getAllReportRows(): FormRow<IWorkflowAction>[] {
		return [this.getReportTypeIdRow(), ...this.getReportTypeRow(), this.getReportGridRow()];
	}

	/**
	 * Get report grid and selection
	 */
	public getReportGridRow(): FormRow<IWorkflowAction> {
		const reportUtilService = this.injector.get(WorkflowReportUtilService);
		const reportParamRef = this.getActionObj(ReportClientActionParams.ReportId, ParameterType.Input);
		const standardViewConfigurations: ParameterView<IActionParam, IReportParameterForClient, IWorkflowAction>[] = [];
		const parametersRef = this.getActionObj(ReportClientActionParams.Parameters, ParameterType.Input);
		return this.getViewModeConfig([{
			formRowId: ReportClientActionParams.ReportId,
			standardViewFieldType: StandardViewFieldType.DomainControl,
			formGroupId: ParameterType.Input,
			row: {
				type: FieldType.Lookup,
				id: ReportClientActionParams.ReportId,
				lookupOptions: createLookup({
					dataServiceToken: WorkflowReportLookup,
					events: [
						{
							name: 'onSelectedItemChanged', async handler(e: ILookupEvent<IReport, IWorkflowAction>) {
								//Returning if value hasn't changed
								if ((reportParamRef.value as unknown as number) === (e.selectedItem as IReport).Id) {
									return;
								}
								const items = await reportUtilService.getParameters((e.selectedItem as IReport).Id);
								(standardViewConfigurations[1] as IGridViewProperties<IActionParam, IReportParameterForClient>).gridProperties.gridConfiguration = {
									...(standardViewConfigurations[1] as IGridViewProperties<IActionParam, IReportParameterForClient>).gridProperties.gridConfiguration,
									items: items
								};
								parametersRef.value = JSON.stringify(items);
							}
						}
					]
				}),
				groupId: ParameterType.Input,
				label: {key: 'basics.workflow.action.customEditor.report'},
				model: this.getModel(ReportClientActionParams.ReportId, ParameterType.Input)
			}
		}, this.getParameterGridConfig()], standardViewConfigurations);
	}

	/**
	 * Get report type row and evaluate proxy checkbox
	 */
	public getReportTypeRow(): FormRow<IWorkflowAction>[] {
		return [this.getViewModeConfig({
			formRowId: ReportClientActionParams.PreviewMode,
			standardViewFieldType: StandardViewFieldType.DomainControl,
			formGroupId: ParameterType.Input,
			row: {
				type: FieldType.Lookup,
				id: ReportClientActionParams.PreviewMode,
				lookupOptions: createLookup({
					dataServiceToken: WorkflowReportTypeLookup
				}),
				groupId: ParameterType.Input,
				label: {key: 'basics.workflow.action.customEditor.reportType'},
				model: this.getModel(ReportClientActionParams.PreviewMode, ParameterType.Input)
			}
		}),
			//Evaluate Proxy
			{
				type: FieldType.Boolean,
				id: ReportClientActionParams.EvaluateProxy,
				groupId: ParameterType.Input,
				label: {key: 'basics.workflow.action.customEditor.EvaluateProxy'},
				model: this.getModel(ReportClientActionParams.EvaluateProxy, ParameterType.Input)
			}];
	}

	/**
	 * Get report type id row
	 */
	public getReportTypeIdRow(): FormRow<IWorkflowAction> {
		return {
			type: FieldType.Script,
			id: ReportClientActionParams.ReportId + ParameterType.Output,
			editorOptions: {
				enableLineNumbers: false,
				languageMode: CodemirrorLanguageModes.JavaScript,
				multiline: false,
				readOnly: false,
				enableBorder: true
			},
			groupId: ParameterType.Output,
			label: {key: 'basics.workflow.action.customEditor.reportId'},
			model: this.getModel(ReportClientActionParams.ReportId, ParameterType.Output)
		};
	}

	private getParameterGridConfig(): StandardViewGridConfig<IActionParam, IWorkflowAction, IReportParameterForClient> {
		const itemSetter = (gridInput: IActionParam) => {

			let items: IReportParameterForClient[] = [];
			if (!isEmpty(gridInput.value)) {
				if (typeof gridInput.value === 'string') {
					items = JSON.parse(gridInput.value);
				} else {
					items = gridInput.value as IReportParameterForClient[];
				}
			}

			items = items.map((item, index) => {
				return {
					...item, Id: index
				};
			});
			return items;
		};

		const itemGetter = (gridContent: IReportParameterForClient[]) => {
			this.getActionObj(ReportClientActionParams.Parameters, ParameterType.Input).value = JSON.stringify(gridContent);
		};

		const gridConfiguration: IGridConfiguration<IReportParameterForClient> = {
			uuid: '77bdb2bc27c84a47a45e867e4ff80659',
			columns: [
				{
					id: 'Name',
					model: 'Name',
					sortable: true,
					label: {key: 'basics.reporting.entityParameterName'},
					type: FieldType.Description,
					visible: true,
					readonly: true
				},
				{ //TODO: Add context when hint is available
					id: 'ParamValue',
					model: 'ParamValue',
					sortable: true,
					label: {key: 'basics.reporting.entityParameterValue'},
					type: FieldType.Description,
					visible: true,
				},
				{
					id: 'ParamValueType',
					model: 'ParamValueType',
					sortable: true,
					label: {key: 'basics.reporting.entityDatatype'},
					type: FieldType.Description,
					visible: true,
					readonly: true
				},
			],
			skipPermissionCheck: true
		};
		return {
			model: this.getModel(ReportClientActionParams.Parameters, ParameterType.Input),
			entity: this.getActionObj(ReportClientActionParams.Parameters, ParameterType.Input),
			formRowId: ReportClientActionParams.Parameters,
			standardViewFieldType: StandardViewFieldType.Grid,
			formGroupId: ParameterType.Input,
			label: 'basics.workflow.action.customEditor.params',
			gridProperties: {
				itemSetter,
				itemGetter,
				gridConfiguration,
				enableToolbarActions: false
			}
		};
	}
}