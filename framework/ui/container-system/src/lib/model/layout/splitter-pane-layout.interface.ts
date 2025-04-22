/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents settings for the panes of a splitter in a container layout.
 */
export interface ISplitterPaneLayout {

	/**
	 * Indicates whether the pane is collapsed or not.
	 */
	readonly collapsed: boolean;

	/**
	 * Indicates the percentage of the available space occupied by the pane (formatted as a number with a trailing percent sign).
	 */
	readonly size: string;
}