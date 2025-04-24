/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ISplitterLayout} from './splitter-layout.interface';
import {IContainerGroupLayout} from './container-group-layout.interface';

/**
 * Represents a layout of containers in a view.
 */
export interface IContainerLayout {

	/**
	 * The container groups in the layout.
	 */
	readonly groups: IContainerGroupLayout[];

	/**
	 * The saved splitter settings.
	 */
	readonly splitterDef: ISplitterLayout[]; // Assigned array

	/**
	 * Identifies the basic layout.
	 */
	readonly layoutId: string;
}