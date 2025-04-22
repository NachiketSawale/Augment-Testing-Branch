/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores route distance object.
 */
export interface IRouteDistance{
    /**
     * Distance unit.
     */
    unitInfo:string;

    /**
     * Distance.
     */
    distances:string[]

}