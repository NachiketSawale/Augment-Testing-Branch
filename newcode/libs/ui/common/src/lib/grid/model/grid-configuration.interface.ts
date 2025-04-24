/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef } from './column-def.type';
import { GridContainerType } from './grid-container-type.enum';
import { IGridTreeConfiguration } from './grid-tree-configuration.interface';
import { GridItemId } from './grid-item-id.type';
import { IReadOnlyEntityRuntimeDataRegistry } from '@libs/platform/data-access';

export type IdPropertyKeyOf<T> = {
	[K in keyof T]: T[K] extends GridItemId ? K : never
}[keyof T]

/**
 * All public accessible configuration parameters of grid component
 */
export interface IGridConfiguration<T extends object> {
	/**
	 * grid's uuid
	 */
	uuid?: string;

	/**
	 * Enables/disables indicator column.
	 * Default: enabled | true
	 */
	indicator?: boolean;

	/**
	 * Enables/disables marker column.
	 * Default: disabled | false
	 */
	marker?: boolean;

	/**
	 * Name of id property that will be used to make sure that data items are unique.
	 * Grid ensures uniqueness of items by comparing values of id properties.
	 * Default: 'Id'
	 */
	idProperty?: IdPropertyKeyOf<T>;

	/**
	 * icon class to be added to...
	 * Default: null / empty string
	 */
	iconClass?: string | null;

	/**
	 * Disables permission checks for grids where access rights are not assigned to grid uuid / container uuid.
	 * In most cases this flag is enabled for grids used in dialogues
	 * Default: disabled | false
	 */
	skipPermissionCheck?: boolean;

	/**
	 * Available / assigned grid columns
	 */
	columns?: ColumnDef<T>[];

	/**
	 * Data items to be shown
	 */
	items?: T[];

	/**
	 * Container type, will be set during grid initialization if not provided
	 */
	containerType?: GridContainerType;

	/**
	 * Configuration of tree column
	 * Enables tree column to be shown
	 * Optional, no default value
	 */
	treeConfiguration?: IGridTreeConfiguration<T>;

	/**
	 * Stores runtime data for the entities
	 */
	entityRuntimeData?: IReadOnlyEntityRuntimeDataRegistry<T>;

	/**
	 * Enables/disables saving of grid configuration.
	 * Default: enabled | true
	 */
	saveConfiguration?: boolean;

	/**
	 * Enables/disables drag drop support
	 * Default: disabled | false
	 */
	dragDropAllowed?: boolean;

	/**
	 * Enables/disables column sorting.
	 * Default: enabled | true
	 */
	enableColumnSort?: boolean;

	/**
	 * enables grouping
	 */
	enableDraggableGroupBy?: boolean;

	enableColumnReorder?: boolean;

	/**
	 * Enables/disables excel like copy/paste.
	 * Default: enabled | false
	 */
	enableCopyPasteExcel?: boolean;

	/**
	 * Enables copy selection if @link enableCopyPasteExcel is enabled
	 */
	allowCopySelection?: boolean;

	/**
	 * Static grid that doesn't use a saved configuration.
	 * All columns are shown with default / assigned width
	 * Default: false
	 */
	isStaticGrid?: boolean;

	/**
	 * Configuration will be saved as module configuration
	 * Normally used for configurable lookups
	 * Default: disabled | false
	 */
	enableModuleConfig?: boolean;

	/**
	 * Grid will use own editor lock, not global one
	 * Default: disabled | true
	 */
	globalEditorLock?: boolean;

	/**
	 * Allows row reorder (drag/drop)
	 * Default: disabled | false
	 */
	allowRowDrag?: boolean;

	/**
	 * Determines if main top search panel will be shown or not.
	 * Default: false
	 */
	showSearchPanel?: boolean;

	/**
	 * Determines if column search panel will be shown or not.
	 * Default: false
	 */
	showColumnSearchPanel?: boolean

	searchValue?: string;

	/**
	 * Enables/disables saving of search values.
	 * Default: enabled | true
	 */
	saveSearchValue?: boolean;

	showFooter?: boolean;

	renderHeaderRow?: boolean;

	defaultSortColumn?: string;

	defaultSortComparer?: (i1: T, i2: T) => number;

	/**
	 * Readonly fields are using 'Read Only Background Color' from application settings
	 */
	markReadonlyCells?: boolean;
}
