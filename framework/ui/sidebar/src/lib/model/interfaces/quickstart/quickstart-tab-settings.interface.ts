/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
export interface IQuickstartTabSettings{
    /**
     * Quickstart settings;
     */
    quickstartSettings:{[key:string]:IQuickstartSystem}
    
    /**
     * sidebar settings
     */
    sidebarSettings:{[key:string]:object[]};
}

/**
 * Quickstart system settings
 */
interface IQuickstartSystem{  
	/**
	 * show pages available.
	 */
    showPages: boolean;

    /**
	 * show tabs available.
	 */
    showTabs: boolean;

    /**
     * Values changed.
     */
    changed: boolean;
}