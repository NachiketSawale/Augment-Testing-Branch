/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridConfiguration } from '@libs/ui/common';
import { IBaseViewProperties } from './base-view-properties.interface';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { IBaseColumn } from '../../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { Translatable } from '@libs/platform/common';

export interface IGridProperties<Entity, ColumnDef extends IBaseColumn> {
	/**
	 * Gets content from the standard view grid every time the grid goes through any change.
	 * Can be used to do some custom update logic against the entity that will be set to the grid.
	 * @param gridContent The items in the grid.
	 * @returns void
	 * @optional
	 */
	itemGetter: (gridContent: ColumnDef[]) => void;

	/**
	 * Sets items into standard view grid when grid is loaded.
	 * @param gridInput Current entity that is bound against the grid.
	 * @returns Items to be set into the grid.
	 * @optional
	 */
	itemSetter: (gridInput: Entity) => ColumnDef[];

	/**
	 * Grid configuration used to render the standard view grid.
	 * @optional
	 */
	gridConfiguration: IGridConfiguration<ColumnDef>;

	/**
	 * Enable add/remove toolbar actions
	 * @optional
	 */
	enableToolbarActions: boolean;
}

/**
 * Additional properties required for standard grid view.
 */
export interface IGridViewProperties<Entity, ColumnDef extends IBaseColumn> {
	/**
	 * Field type of standard view.
	 */
	standardViewFieldType: StandardViewFieldType.Grid;

	/**
	 * Grid properties required for standard grid view.
	 * @optional
	 */
	gridProperties: IGridProperties<Entity, ColumnDef>

	/**
	 * The label that will be displayed against the view.
	 */
	label: Translatable;

	/**
	 * The entity/object that will be set to the standard view control.
	 */
	entity: Entity;
}

/**
 * Properties required to render a grid in standard view.
 */
export type IGridView<Entity extends object, ColumnDef extends IBaseColumn, ParentEntity extends object = object> = IBaseViewProperties<Entity, ParentEntity> & IGridViewProperties<Entity, ColumnDef>;