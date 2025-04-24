/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModuleTabView } from './module-tab-view.interface';
import { IEntityBase } from '@libs/platform/common';

/**
 * Represent the module tab info.
 */
export interface IModuleTab extends IEntityBase {
	/**
	 * Tab Id
	 */
	Id: number;

	/**
	 * Tab belong to module
	 */
	BasModuleFk: number;

	/**
	 * Tab description
	 */
	Description: string | null;

	/**
	 * Tab description translation field
	 */
	DescriptionTr: number | null;

	/**
	 * Tab sorting number
	 */
	Sorting: number;

	/**
	 * Tab visible
	 */
	Isvisible: boolean;

	/**
	 * Visibility number
	 */
	Visibility: number;

	/**
	 * Tab views.
	 */
	Views: IModuleTabView[];

	/**
	 * Latest
	 */
	Latest: boolean;

	/**
	 *  State
	 */
	State: string | null;

	/**
	 * Tab is hidden or not.
	 */
	hidden?: boolean;

	/**
	 * The groups of the views.
	 */
	grouped: IModuleTabView[][];

	/**
	 * Tab width.
	 */
	width?: number;

	/**
	 * Represent the current activated view in the tab.
	 */
	activeView?: IModuleTabView;
}