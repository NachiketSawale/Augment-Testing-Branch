/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, ConcreteMenuItem, FieldType, FormRow, IFieldValueChangeInfo, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorHelper } from './action-editor-helper.class';
import { IBaseColumn } from '../../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { StandardViewGridConfig } from '../../types/standard-view-configuration.type';
import { Injector } from '@angular/core';
import { EditorViewConfigBase } from './editor-view-config-base.class';
import { PropertyType, Translatable } from '@libs/platform/common';
import { ActionParamDefaultValueConfig } from '../../types/default-action-params.type';
import { DomainControlContext } from '../expandable-domain-control/domain-control-context.class';
import { ExpandableDomainControlItemConfig } from '../../types/expandable-domain-control/expandable-domain-control-item-config.type';
import { EXPANDABLE_DOMAIN_CONTROL_PARENT_TOKEN, ExpandableDomainControlParentConfig } from '../../types/expandable-domain-control/expandable-domain-control-parent-config.type';
import { ExpandableDomainControlParentComponent } from '../../../components/action-editors/expandable-domain-control-parent/expandable-domain-control-parent.component';
import { IGridProperties } from '../../interfaces/action-editor/grid-view-properties.interface';
import { IWorkflowActionEditor } from '../../interfaces/workflow-action-editor.interface';


/**
 * Provides base functionalities for common action editors.
 */
export abstract class IWorkflowCommonActionEditorBase<ColumnDef extends IBaseColumn = IBaseColumn> extends EditorViewConfigBase<IActionParam, IWorkflowAction, ColumnDef> implements IWorkflowActionEditor {

	/**
	 * Provides workflowaction to action editors.
	 * @param workflowAction
	 */
	public constructor(workflowAction: IWorkflowAction, protected actionService: BasicsWorkflowActionDataService, protected injector: Injector) {
		super(workflowAction);
	}

	/**
	 * Retrieves the form configuration for an action editor
	 */
	public abstract getFormConfig(): IFormConfig<IWorkflowAction>;

	/**
	 * Gets toolbar items for the component.
	 */
	public getToolbarItems?: () => ConcreteMenuItem[];

	/**
	 * Retrieves the form configuration for an action editor
	 */
	protected defaultValues: ActionParamDefaultValueConfig = [];

	/**
	 * Used to set default values to action parameters
	 */
	public setDefaultValues() {
		this.defaultValues.forEach((defaultValue)=>{
			//Setting default value to context object
			const contextObj = this.getActionObj(defaultValue.actionParamKey, defaultValue.parameterType);
			if (!contextObj.value || contextObj.value === '') {
				(contextObj.value as unknown as PropertyType) = defaultValue.value ;
			}
		});
	}

	/**
	 * Get the model of workflow action for formrow
	 * @param key the key value in workflow action object.
	 * @param parameterType Input or output parameter
	 * @returns
	 */
	protected getModel(key: string, parameterType: ParameterType): string {
		return ActionEditorHelper.setModelProperty(this.parentEntity, key, parameterType);
	}

	/**
	 * Get the workflow action object
	 * @param key the key value in workflow action object.
	 * @param parameterType Input or output parameter.
	 * @returns
	 */
	protected getActionObj(key: string, parameterType: ParameterType, workflowAction?: IWorkflowAction): IActionParam {
		return ActionEditorHelper.findOrAddProperty(workflowAction ?? this.parentEntity, key, parameterType);
	}

	protected setChangeTrackerToGrid<ColumnDef extends IBaseColumn>(itemGetter: (gridContent: ColumnDef[]) => void, standardviewGridConfig: StandardViewGridConfig<IActionParam, IWorkflowAction, ColumnDef>): (gridContent: ColumnDef[]) => void {
		const actionObj = this.getActionObj(standardviewGridConfig.formRowId, standardviewGridConfig.formGroupId!);
		const model = this.getModel(standardviewGridConfig.formRowId, standardviewGridConfig.formGroupId!);
		 return (gridContent: ColumnDef[]) => {
			itemGetter(gridContent);

			//Compare value with original property
			this.actionService.setFieldModified(model, actionObj.value);
		};
	}

	protected setChangeTrackerToForm(model: string): (changeInfo: IFieldValueChangeInfo<IWorkflowAction, PropertyType>) => void {
		return (changeInfo: IFieldValueChangeInfo<IWorkflowAction, PropertyType>) => {
			this.actionService.setFieldModified(model, changeInfo.newValue);
		};
	}

	/**
	 * Returns the form row configuration required to render a domain control in an accordion.
	 * @param actionParamKey key property of the input/output parameter
	 * @param parameterType type of paramter - input/output
	 * @param label - label of the accordion
	 * @returns FormRow<IWorkflowAction>
	 */
	protected getAccordionEditor(actionParamKey: string, parameterType: ParameterType, label: Translatable): FormRow<IWorkflowAction> {
		const controlContext = new DomainControlContext<IWorkflowAction>({
			fieldId: '',
			readonly: false,
			validationResults: [],
			entityContext: { totalCount: 0 },
			actionService: this.actionService,
			entity: this.parentEntity,
			propertyPath: this.getModel(actionParamKey, parameterType)
		});
		const domainControlItem: ExpandableDomainControlItemConfig<IWorkflowAction> = {
			fieldType: FieldType.Script,
			controlContext: controlContext,
			additionalOptions: {
				editorOptions: {
					enableLineNumbers: true,
					languageMode: CodemirrorLanguageModes.JavaScript,
					multiline: true,
					readOnly: false,
					enableBorder: true,
					isInputOutput: true
				}
			}
		};
		const domainControlParent: ExpandableDomainControlParentConfig<IWorkflowAction> = {
			groupId: parameterType, header: label, open: true, item: domainControlItem
		};

		return {
			id: actionParamKey,
			type: FieldType.CustomComponent,
			groupId: parameterType,
			componentType: ExpandableDomainControlParentComponent,
			providers: [{provide: EXPANDABLE_DOMAIN_CONTROL_PARENT_TOKEN, useValue: domainControlParent}]
		};
	}

	protected override setGridProperties(standardviewGridConfig: StandardViewGridConfig<IActionParam, IWorkflowAction, ColumnDef>): IGridProperties<IActionParam, ColumnDef> {
		const actionObj = this.getActionObj(standardviewGridConfig.formRowId, standardviewGridConfig.formGroupId!);
		const defaultSetter = (gridInput: IActionParam): ColumnDef[] => {
			return (gridInput.value as string).split(';').map((item, index) => {
				return {
					Id: index,
					Key: item
				} as ColumnDef;
			}).filter(item => item.Key !== '');
		};

		const defaultGetter = (gridContent: ColumnDef[]) => {
			let stringContent = '';
			if (gridContent) {
				stringContent = gridContent.map((item) => item.Key ?? '').join(';');
			}
			actionObj.value = stringContent;
		};

		const gridConfiguration: IGridConfiguration<ColumnDef> = {
			uuid: '77bdb2bc27c84a47a45e867e4ff80659',
			columns: [
				{
					id: 'key',
					model: 'Key',
					sortable: true,
					label: { key: 'basics.workflow.action.key' },
					type: FieldType.Description,
					visible: true,
				},
			],
			skipPermissionCheck: true
		};

		return {
			gridConfiguration,
			itemGetter: defaultGetter,
			itemSetter: defaultSetter,
			enableToolbarActions: true
		};
	}
}