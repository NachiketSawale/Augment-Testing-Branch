/*
 * Copyright(c) RIB Software GmbH
 */

import { IBaseColumn } from '../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { IGridProperties } from '../interfaces/action-editor/grid-view-properties.interface';
import { StandardViewGridConfig } from '../types/standard-view-configuration.type';
import { EditorViewConfigBase } from './common-action-editors/editor-view-config-base.class';
import { PropertyType } from '@libs/platform/common';
import { FieldType, IFieldValueChangeInfo, IGridConfiguration } from '@libs/ui/common';
import { IEntityLinkTypeConfig } from '../user-input-config.interface';

export class UserInputEditorViewModeConfigGenerator extends EditorViewConfigBase<IEntityLinkTypeConfig, IEntityLinkTypeConfig> {

	protected override setChangeTrackerToForm(model: string): (changeInfo: IFieldValueChangeInfo<IEntityLinkTypeConfig, PropertyType>) => void {
		return (changeInfo: IFieldValueChangeInfo<IEntityLinkTypeConfig, PropertyType>) => {
			//Change tracking will not take place in the form for user input
		};
	}

	protected override setChangeTrackerToGrid<ColumnDef extends IBaseColumn>(itemGetter: (gridContent: ColumnDef[]) => void, standardviewGridConfig: StandardViewGridConfig<IEntityLinkTypeConfig, IEntityLinkTypeConfig, ColumnDef>): (gridContent: ColumnDef[]) => void {
		return (gridContent: ColumnDef[]) => {
			itemGetter(gridContent);
			//Change tracking will not take place in the form for user input

			//standardviewGridConfig.entity - current grid entity
			//standardviewGridConfig.model - model of grid against parent entity
		};
	}

	public constructor(parentEntity: IEntityLinkTypeConfig) {
		super(parentEntity);
	}

	protected override setGridProperties<ColumnDef extends IBaseColumn>(standardviewGridConfig: StandardViewGridConfig<IEntityLinkTypeConfig, IEntityLinkTypeConfig, ColumnDef>): IGridProperties<IEntityLinkTypeConfig, ColumnDef> {
		const itemSetter = (gridInput: IEntityLinkTypeConfig): ColumnDef[] => {
			return (gridInput.displayText as string).split(';').map((item, index) => {
				return {
					Id: index,
					Key: item
				} as ColumnDef;
			}).filter(item => item.Key !== '');
		};

		const itemGetter = (gridContent: ColumnDef[]) => {
			let stringContent = '';
			if (gridContent) {
				stringContent = gridContent.map((item) => item.Key ?? '').join(';');
			}
			console.log(stringContent);
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
			itemSetter,
			itemGetter,
			gridConfiguration,
			enableToolbarActions: true
		};
	}

}