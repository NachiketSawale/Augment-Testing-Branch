/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, FormRow, ICodemirrorEditorOptions, IFieldValueChangeInfo, IFormConfig, IGridConfiguration, ILookupReadonlyDataService, ISelectItem } from '@libs/ui/common';
import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { IWorkflowCommonActionEditorBase } from './common-action-editor.class';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { IBaseColumn } from '../../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { StandardViewConfig, StandardViewGridConfig } from '../../types/standard-view-configuration.type';
import { ProviderToken, signal, WritableSignal } from '@angular/core';
import { isArray } from 'lodash';
import { Subject } from 'rxjs';

/**
 * Columns rendered in grid for standard view of params property.
 */
export type ActionEditorGridColumns = IBaseColumn & {
	Key: string,
	Value: string
}

/**
 * Base class for action editor.
 */
export abstract class ActionEditorBase<ColumnDef extends IBaseColumn = IBaseColumn> extends IWorkflowCommonActionEditorBase<ColumnDef> {

	protected editorConfig: FormRow<IWorkflowAction>[] = [];
	public $config: WritableSignal<IFormConfig<IWorkflowAction>> = signal({} as IFormConfig<IWorkflowAction>);
	public radioChange$: Subject<IFieldValueChangeInfo<IWorkflowAction>> = new Subject<IFieldValueChangeInfo<IWorkflowAction>>();

	/**
	 * Add field to the action parameter container
	 * @param actionParam
	 * @param paramTyp
	 * @param translationPath
	 * @param onlyKey
	 */
	public createEditorMode(actionParam: string, paramTyp: ParameterType, translationPath: string, onlyKey: boolean = false) {
		this.editorConfig.push(this.getViewModeConfig([this.getParameterViewConfiguration(actionParam, paramTyp, translationPath, onlyKey)]));
	}

	/**
	 * Add field to the action parameter container
	 * @param actionParam
	 * @param paramTyp
	 * @param translationPath
	 * @param token
	 */
	public createLookupEditorMode<LookupItemType extends object>(actionParam: string, paramTyp: ParameterType, translationPath: string, token: ProviderToken<ILookupReadonlyDataService<LookupItemType, object>>) {
		this.editorConfig.push(this.getViewModeConfig([this.getLookupViewConfiguration<LookupItemType, ColumnDef>(actionParam, paramTyp, translationPath, token)]));
	}

	/**
	 * Add field by FormRow to the action parameter container
	 * @param form
	 */
	public createFieldByForm(form: FormRow<IWorkflowAction> | FormRow<IWorkflowAction>[]) {
		this.editorConfig.push(...(isArray(form) ? form : [form]));
	}

	/**
	 * Add Field to the end of the group if onTop is false(default).
	 */
	public createField<LookupItemType extends object>(fieldType: string, fieldId: string, paramType: ParameterType, label: string, codeMirrorObject: ICodemirrorEditorOptions, token?: ProviderToken<ILookupReadonlyDataService<LookupItemType, IWorkflowAction>>, gridConfiguration?: IGridConfiguration<{
		id: string | number
	}>, onTop: boolean = false, radioSelectOptions?: ISelectItem<number>[]) {
		let field: FormRow<IWorkflowAction>;
		switch (fieldType) {
			case FieldType.Lookup:
				field = {
					type: FieldType.Lookup,
					id: `row_${paramType}_${fieldId}`,
					model: this.getModel(fieldId, paramType),
					lookupOptions: createLookup({
						dataServiceToken: token,
					}),
					groupId: paramType,
					label: {key: label}
				};
				break;
			case FieldType.Grid:
				field = {
					type: FieldType.Grid,
					id: `row_${paramType}_${fieldId}`,
					// model: this.getModel(fieldId, paramType),
					model: {
						getValue(obj: IWorkflowAction): [] | undefined {
							let count: number = 0;
							const index: number = obj.input.indexOf(obj.input.find((item) => {
								return item.key == fieldId;
							}) as IActionParam);
							const gridValue: { id: number, Id: number }[] = JSON.parse(obj.input[index].value !== '' ? obj.input[index].value : '[]');
							if (gridValue) {
								gridValue.forEach(item => {
									item.id = item.Id = count++;
								});
							}
							return gridValue as [];
						},
						//not used at the moment
						// setValue(obj: IWorkflowAction, value: [] | undefined) {
						//
						// }
					},
					configuration: {
						...gridConfiguration as IGridConfiguration<object>,
					},
					height: 200,
					groupId: paramType,
					label: {key: label},
					readonly: false
				};
				break;
			case FieldType.Script:
				field = {
					type: FieldType.Script,
					id: `row_${paramType}_${fieldId}`,
					editorOptions: codeMirrorObject,
					model: this.getModel(fieldId, paramType),
					groupId: paramType,
					label: {key: label}
				};
				break;
			case FieldType.Boolean:
				field = {
					type: FieldType.Boolean,
					id: `row_${paramType}_${fieldId}`,
					model: this.getModel(fieldId, paramType),
					groupId: paramType,
					label: {key: label}
				};
				break;
			case FieldType.Url:
				field = {
					type: FieldType.Url,
					id: `row_${paramType}_${fieldId}`,
					model: this.getModel(fieldId, paramType),
					groupId: paramType,
					label: {key: label},
				};
				break;
			case FieldType.Composite:
				field = {
					type: FieldType.Composite,
					id: `row_${paramType}_${fieldId}`,
					//model: this.getModel(fieldId, paramType),
					groupId: paramType,
					label: {key: label},
					composite: [
						{
							type: FieldType.Lookup,
							id: `row_${paramType}_${fieldId}`,
							model: this.getModel(fieldId, paramType),
							lookupOptions: createLookup({
								dataServiceToken: token,
							}),
						},
						{
							type: FieldType.Description,
							id: `row_${paramType}1_${fieldId}1`,
							model: this.getModel(fieldId, paramType),
							readonly: true
						}
					],

				};
				break;
			case FieldType.Radio:
				field = {
					type: FieldType.Radio,
					id: `row_${paramType}_${fieldId}`,
					groupId: paramType,
					label: {key: label},
					model: this.getModel(fieldId, paramType),
					itemsSource: {
						items: radioSelectOptions || []
					},
					change: changeInfo => {
						this.radioChange$.next(changeInfo);
					},
				};
				break;
			case FieldType.Text:
				field = {
					type: FieldType.Text,
					id: `row_${paramType}_${fieldId}`,
					groupId: paramType,
					label: {key: label},
					model: this.getModel(fieldId, paramType),
				};
				break;

			default:
				field = {
					type: FieldType.Comment,
					id: `row_${paramType}_${fieldId}`,
					model: this.getModel(fieldId, paramType),
					groupId: paramType,
					label: {key: label},
				};
		}
		if (onTop) {
			const temporaryEditorConfig: FormRow<IWorkflowAction>[] = [];
			temporaryEditorConfig.push(field);
			temporaryEditorConfig.push(...this.editorConfig);
			this.editorConfig = temporaryEditorConfig;
		} else {
			this.editorConfig.push(field);
		}
	}

	public showInputGroup: boolean = true;
	public showOutputGroup: boolean = true;

	public removeRowFromConfig(rowId: string) {
		const index = this.getFormConfig().rows.findIndex(r => r.id === rowId);
		if (index > -1) {
			this.getFormConfig().rows.splice(index, 1);
		}
	}

	public getFormConfig(): IFormConfig<IWorkflowAction> {
		const formConfiguration: IFormConfig<IWorkflowAction> = {
			groups: [],
			rows: this.getRows(),
			showGrouping: true,
			formId: 'action-editor'
		};
		if (this.showInputGroup) {
			formConfiguration.groups?.push({
				groupId: ParameterType.Input,
				header: {key: 'basics.workflow.action.input.containerHeader'},
				open: true
			});
		}
		if (this.showOutputGroup) {
			formConfiguration.groups?.push({
				groupId: ParameterType.Output,
				header: {key: 'basics.workflow.action.output.containerHeader'},
				open: true
			});
		}
		this.$config.set(formConfiguration);
		return formConfiguration;
	}

	protected getRows(): FormRow<IWorkflowAction>[] {
		return this.editorConfig;
	}

	protected getLookupViewConfiguration<LookupItemType extends object, ColumnDef extends IBaseColumn = IBaseColumn>(actionParam: string, paramTyp: ParameterType, paramLabel: string, token: ProviderToken<ILookupReadonlyDataService<LookupItemType, object>>): StandardViewConfig<IActionParam, IWorkflowAction, ColumnDef> {
		return {
			formRowId: actionParam,
			standardViewFieldType: StandardViewFieldType.DomainControl,
			formGroupId: paramTyp,
			row: {
				type: FieldType.Lookup,
				id: actionParam,
				lookupOptions: createLookup({
					dataServiceToken: token
				}),
				groupId: paramTyp,
				label: {key: paramLabel},
				model: this.getModel(actionParam, paramTyp)
			}
		};
	}


	private getParameterViewConfiguration(actionParam: string, paramTyp: ParameterType, paramLabel: string, onlyColumnKey: boolean = false): StandardViewGridConfig<IActionParam, IWorkflowAction, ColumnDef> {
		const viewModeConfig: StandardViewGridConfig<IActionParam, IWorkflowAction, ColumnDef> = {
			entity: this.getActionObj(actionParam, paramTyp),
			model: this.getModel(actionParam, paramTyp),
			formRowId: actionParam,
			label: paramLabel,
			formGroupId: paramTyp,
			standardViewFieldType: StandardViewFieldType.Grid,
		};

		return viewModeConfig;
	}

}