/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Sidebar } from './sidebar.class';

/**
 * class to hold sidebar extra information.
 */
export class SidebarOptions extends Sidebar{
    /**
     * Holds the pin status.
     */
    public isPinned=false;

    /**
     * Holds the expanded status of sidebar tab.
     */
    public isExpanded=false;

    /**
     * Holds the ID of the last tab opened.
     */
    public lastButtonId='';

	/**
	 * Holds the maximized status of sidebar tab
	 */
	public isMaximized = false;


}