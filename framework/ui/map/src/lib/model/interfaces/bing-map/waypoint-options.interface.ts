/**
 * Copyright(c) RIB Software GmbH
 */

import { IWaypointLocation } from './waypoint-location.interface';

/**
 * An interface that stores waypoint options object.
 */
export interface IWaypointOptions{
    /**
     * Waypoint location.
     */
    location:IWaypointLocation;

    /**
     * Address.
     */
    address:string;
}