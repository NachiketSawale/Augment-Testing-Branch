/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ISplitterPaneLayout} from './splitter-pane-layout.interface';

/**
 * Stores layout settings for a splitter in a container layout.
 */
export interface ISplitterLayout {

	/**
	 * Identifies the pane in the layout.
	 */
	readonly selectorName: string;

	/**
	 * The panes of the splitter.
	 */
	readonly panes: ISplitterPaneLayout[];
}