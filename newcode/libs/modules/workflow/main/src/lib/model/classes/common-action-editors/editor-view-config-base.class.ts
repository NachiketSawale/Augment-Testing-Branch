/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType, Translatable } from '@libs/platform/common';
import { IBaseColumn } from '../../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { IDomainControlView } from '../../interfaces/action-editor/domain-control-view-properties.interface';
import { IGridProperties, IGridView } from '../../interfaces/action-editor/grid-view-properties.interface';
import { ParameterView } from '../../types/parameter-view-mode.type';
import { StandardViewConfig, StandardViewDomainConfig, StandardViewGridConfig } from '../../types/standard-view-configuration.type';
import { CodemirrorLanguageModes, FieldType, FormRow, IFieldValueChangeInfo, IFormConfig } from '@libs/ui/common';
import { isArray } from 'lodash';
import { EDITOR_ITEM_CONFIGURATION_INJECTION_TOKEN, ParameterViewModeComponent } from '../../../components/action-editors/parameter-view-mode/parameter-view-mode.component';

/**
 * Type of functions that are used to generate view configuration.
 */
type GenerateViewConfigFn<Entity extends object, ParentEntity extends object, ColumnDef extends IBaseColumn> = (standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>) => ParameterView<Entity, ColumnDef, ParentEntity>;


/**
 * Provides generic functionality to build standard/expert view configuration.
 * @Entity the entity to which standard view items are bound
 * @ParentEntity the entity to which the form is bound
 */
export abstract class EditorViewConfigBase<Entity extends object, ParentEntity extends object, ColumnDef extends IBaseColumn = IBaseColumn> {

	public constructor(protected parentEntity: ParentEntity) {

	}

	/**
	 * Function map that is used to call generate view configuration methods.
	 */
	private generateViewConfigFnMap: Record<StandardViewFieldType, GenerateViewConfigFn<Entity, ParentEntity, ColumnDef>> = {
		[StandardViewFieldType.Grid]: (standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>) => {
			return this.getGridViewDefaultConfiguration(standardViewConfig);
		},
		[StandardViewFieldType.DomainControl]: (standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>) => {
			return this.getDomainControlConfiguration(standardViewConfig);
		}
	};

	/**
	 * Sets the grid properties for this editor configuration
	 * @param standardviewGridConfig
	 */
	protected abstract setGridProperties(standardviewGridConfig: StandardViewGridConfig<Entity, ParentEntity, ColumnDef>): IGridProperties<Entity, ColumnDef>;

	/**
	 * Adds a tracker to track changes in the grid view of standard mode.
	 * @param itemGetter itemGetter function that gets items from the grid, whenever the grid goes through any change
	 * @param standardviewGridConfig the configuration of the grid object
	 */
	protected abstract setChangeTrackerToGrid(itemGetter: (gridContent: ColumnDef[]) => void, standardviewGridConfig: StandardViewGridConfig<Entity, ParentEntity, ColumnDef>): (gridContent: ColumnDef[]) => void;

	/**
	 * Adds a tracker to track changes in domain control, both in standard and expert view.
	 * @param model model of the form
	 * @param entity parentEntity attached to the form
	 */
	protected abstract setChangeTrackerToForm(model: string, entity: ParentEntity): (changeInfo: IFieldValueChangeInfo<ParentEntity, PropertyType>) => void;

	/**
	 * Prepares the required configuration for grid view in standard view mode.
	 * @param standardViewConfig Standard view configuration required to create the editor object for grid.
	 * @returns IGridView<IActionParam, ColumnDef, IWorkflowAction>
	 */
	private getGridViewDefaultConfiguration(standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>): IGridView<Entity, ColumnDef, ParentEntity> {
		if (!this.isGridControl(standardViewConfig)) {
			throw new Error('type doesn\'t match');
		}
		let gridProperties = this.setGridProperties(standardViewConfig);
		if(standardViewConfig.gridProperties) {
			gridProperties.itemSetter = standardViewConfig.gridProperties.itemSetter ?? gridProperties.itemSetter;
			gridProperties.itemGetter = standardViewConfig.gridProperties.itemGetter ?? gridProperties.itemGetter;
			gridProperties.gridConfiguration = standardViewConfig.gridProperties.gridConfiguration ?? gridProperties.gridConfiguration;
			gridProperties.enableToolbarActions = standardViewConfig.gridProperties.enableToolbarActions ?? gridProperties.enableToolbarActions;
		}
		const trackedGetter = this.setChangeTrackerToGrid(gridProperties.itemGetter, standardViewConfig);
		gridProperties = { ...gridProperties, itemGetter: trackedGetter };

		let expertViewFormConfig = this.getDefaultExpertViewFormConfig(standardViewConfig.label, standardViewConfig.model, standardViewConfig.formRowId);
		expertViewFormConfig = standardViewConfig.expertViewFormConfig ?? expertViewFormConfig;

		return {
			entity: standardViewConfig.entity,
			label: standardViewConfig.label,
			standardViewFieldType: StandardViewFieldType.Grid,
			gridProperties,
			expertViewFormConfig
		};
	}

	/**
	 * Prepares the required configuration for domain control in standard view mode.
	 * @param standardViewConfig Standard view configuration required to create the editor object for a domain control.
	 * @returns IDomainControlView<IActionParam, IWorkflowAction>
	 */
	private getDomainControlConfiguration(standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>): IDomainControlView<Entity, ParentEntity> {
		if (!this.isDomainControl(standardViewConfig)) {
			throw new Error('type doesn\'t match');
		}

		let expertViewFormConfig = this.getDefaultExpertViewFormConfig(standardViewConfig.row.label, standardViewConfig.row.model as string, standardViewConfig.formRowId);
		expertViewFormConfig = standardViewConfig.expertViewFormConfig ?? expertViewFormConfig;

		const change = this.setChangeTrackerToForm(standardViewConfig.row.model as string, this.parentEntity);

		const row: FormRow<ParentEntity> = {
			...standardViewConfig.row as FormRow<ParentEntity>,
			change
		};
		return {
			entity: this.parentEntity,
			standardViewFieldType: StandardViewFieldType.DomainControl,
			formConfig: { rows: [row] },
			expertViewFormConfig
		};
	}

	/**
	 * Prepares the default expert view configuration.
	 * @param label label of expert view
	 * @param model form model of the parent form.
	 * @param formRowId action key of the current action.
	 * @returns
	 */
	private getDefaultExpertViewFormConfig(label: Translatable | undefined, model: string, formRowId: string): IFormConfig<ParentEntity> {
		const change = this.setChangeTrackerToForm(model, this.parentEntity);
		return {
			rows: [{
				type: FieldType.Script,
				id: formRowId,
				model: model,
				label: label,
				editorOptions: {
					enableLineNumbers: false,
					languageMode: CodemirrorLanguageModes.JavaScript,
					multiline: false,
					readOnly: false,
					enableBorder: true
				},
				change
			}]
		};
	}

	/**
	 * Type guard to return domain configuration
	 * @param standardViewConfig StandardViewConfig<ColumnDef>
	 * @returns StandardViewDomainConfig
	 */
	private isDomainControl(standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>): standardViewConfig is StandardViewDomainConfig<ParentEntity> {
		return standardViewConfig.standardViewFieldType === StandardViewFieldType.DomainControl;
	}

	/**
	 * Type guard to return grid configuration
	 * @param standardViewConfig StandardViewConfig<ColumnDef>
	 * @returns StandardViewGridConfig<ColumnDef>
	 */
	private isGridControl(standardViewConfig: StandardViewConfig<Entity, ParentEntity, ColumnDef>): standardViewConfig is StandardViewGridConfig<Entity, ParentEntity, ColumnDef> {
		return standardViewConfig.standardViewFieldType === StandardViewFieldType.Grid;
	}

	/**
	 * Prepares formrow object with the required standard/expert view configuration for action editors.
	 * @param standardViewConfigs Standard view configurations.
	 * @returns FormRow<IWorkflowAction>
	 */
	public getViewModeConfig(standardViewConfigs: StandardViewConfig<Entity, ParentEntity, ColumnDef>[] | StandardViewConfig<Entity, ParentEntity, ColumnDef>, configs: ParameterView<Entity, ColumnDef, ParentEntity>[] = []): FormRow<ParentEntity> {
		//There's only one formrow returned, but subsequent form configurations are prepared for the standard view component.
		let id: string = '';
		let groupId: string | undefined;
		if (isArray(standardViewConfigs)) {
			standardViewConfigs.forEach((standardViewConfig) => {
				configs.push(this.generateViewConfigFnMap[standardViewConfig.standardViewFieldType](standardViewConfig));
			});
			id = standardViewConfigs[0].formRowId;
			groupId = standardViewConfigs[0].formGroupId;
		} else {
			configs.push(this.generateViewConfigFnMap[standardViewConfigs.standardViewFieldType](standardViewConfigs));
			id = standardViewConfigs.formRowId;
			groupId = standardViewConfigs.formGroupId;
		}

		return {
			type: FieldType.CustomComponent,
			id,
			componentType: ParameterViewModeComponent,
			providers: [{ provide: EDITOR_ITEM_CONFIGURATION_INJECTION_TOKEN, useValue: configs }],
			groupId
		};
	}
}