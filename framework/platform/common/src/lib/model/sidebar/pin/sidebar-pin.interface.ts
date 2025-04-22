/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


/**
 * An interface for objects that stores sidebar pin status 
 * and active sidebar tab id.
 */
export interface ISidebarPin{
    /**
     * Holds sidebar pin status.
     */
    active:boolean;

    /**
     * Holds active tab id.
     */
    lastButtonId:string;
}