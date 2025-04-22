/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IColumnFormatterOptions, IColumnSortOptions, IGridConfiguration } from '@libs/ui/common';
import { PropertyIdentifier } from "@libs/platform/common";

export interface ISlickColumn {
	/**
	 * Unique id of column
	 * Preserved column names (atm marker, tree and indicator) must not be used
	 */
	id: string;

	/**
	 * Column Title Name to be displayed
	 * Will be initialized or overwritten by translation provided in name$tr property
	 */
	name: string;

	/**
	 * Tooltip that will be shown on column header
	 */
	toolTip: string;

	/**
	 * Field property name to use from the dataset that is used to display the column data.
	 * For example: { id: 'firstName', field: 'firstName' }
	 *
	 * NOTE: a field with dot notation (.) will be considered a complex object.
	 * For example: { id: 'Users', field: 'user.firstName' }
	 */
	field?: PropertyIdentifier<object>;

	/**
	 * Field type of column
	 */
	type?: FieldType;

	/**
	 * CSS class to add to the column cell
	 * */
	cssClass: string;

	/**
	 * Domain type of editor or creator function that returns an editor for the cell value
	 * If domain type is provided, string value will be replaced by creator function
	 * and original value will be saved in editorDomain property
	 */
	editor?: any;

	/**
	 * Editor options which will be provided to editor instance
	 */
	editorOptions?: object;

	/**
	 * Domain type of editor or creator function that returns an editor for the cell value
	 * If domain type is provided, string value will be replaced by creator function
	 * and original value will be saved in editorDomain property
	 */
	formatter?: any;

	/**
	 * Formatter options which will be provided to formatter function
	 */
	formatterOptions?: IColumnFormatterOptions;

	sortOptions?: IColumnSortOptions;

	/**
	 * Configuration used by grouping
	 */
	grouping?: {
		title: string;
		getter: string;
		aggregators: [];
		aggregateCollapsed: boolean;
		generic: boolean;
	};

	/**
	 * Configuration of keyboard navigation
	 */
	keyboard: {
		enter: boolean,
		tab: boolean,
	},

	/**
	 * Is the column required?
	 */
	required: boolean;

	/**
	 * Is the column sortable?
	 */
	sortable: boolean;

	/**
	 * Is the column searchable?
	 */
	searchable: boolean;

	/**
	 * Is the column read only?
	 */
	readonly: boolean;

	/**
	 * Column is pinned
	 */
	pinned: boolean;

	/**
	 * Column is not shown
	 */
	hidden: boolean;

	/**
	 * Width of the column in pixels
	 * Default: 100
	 */
	width: number;

	/**
	 * Minimal width of the column in pixels
	 * Optional
	 */
	minWidth?: number;

	/**
	 * Is column resizeable
	 * Default: true
	 */
	resizable?: boolean;

	/**
	 * Is column printable
	 * Default: true
	 */
	printable?: boolean;

	/**
	 * Max length of input field, if supported by domain type
	 */
	maxLength?: number;

	/**
	 *
	 */
	sort?: boolean;

	/**
	 *
	 */
	columnFilterString?: string;

	/**
	 *
	 */
	behavior?: string;

	/**
	 *
	 */
	configuration?: IGridConfiguration<object>;

	/**
	 * Show a checkbox in the header. True - yes, False, null - no
	 */
	headerChkbox?: boolean;
}
