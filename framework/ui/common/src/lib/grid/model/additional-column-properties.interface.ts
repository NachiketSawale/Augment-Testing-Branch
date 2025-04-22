/*
 * Copyright(c) RIB Software GmbH
 */

import { SortDirection } from '@libs/platform/common';
import { IColumnGroupingProperties } from './column-grouping.interface';
import { IColumnFormatterOptions } from './column-formatter-options.interface';

/**
 * Additional column configuration properties that are not part of ConcreteField
 */
export interface IAdditionalColumnProperties {

	/**
	 * CSS class to add to the column cell
	 * */
	cssClass?: string;

	/**
	 * Configuration used by grouping
	 */
	grouping?: IColumnGroupingProperties;

	/**
	 * Configuration of keyboard navigation
	 */
	keyboard?: {
		enter: boolean,
		tab: boolean,
	};

	/**
	 * Is the column sortable?
	 */
	sortable: boolean;

	/**
	 * Is the column searchable?
	 */
	searchable?: boolean;

	/**
	 * Column is pinned
	 */
	pinned?: boolean;

	/**
	 * Min Width of the column in pixels
	 * Default: 30
	 */
	minWidth?: number;

	/**
	 * Saved column filter string
	 */
	columnFilterString?: string;

	/**
	 * Width of the column in pixels
	 * Default: 100
	 */
	width?: number;

	/**
	 * Sort Direction of the column. None if sort is currently not active
	 */
	sort?: SortDirection;

	/**
	 * Formatter options
	 */
	formatterOptions?: IColumnFormatterOptions;

	/**
	 * Show a checkbox in the header. True - yes, False, null - no
	 */
	headerChkbox?: boolean;
}

/**
 * Lists the names of properties that may be supplied for grid columns in addition to regular
 * field settings.
 */
export const ADDITIONAL_COLUMN_PROP_NAMES = [
	'cssClass',
	'grouping',
	'keyboard',
	'sortable',
	'searchable',
	'pinned',
	'minWidth',
	'columnFilterString',
	'width',
	'sort',
	'formatterOptions'
];
