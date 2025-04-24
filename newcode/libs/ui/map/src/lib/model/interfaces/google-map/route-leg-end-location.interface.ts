/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores route leg end location object.
 */
export interface IRouteLegEndLocation{
    /**
     * End location latitude.
     * @returns number.
     */
    lat:()=>number;

    /**
     * End location longitude.
     * @returns number.
     */
    lng:()=>number;
}