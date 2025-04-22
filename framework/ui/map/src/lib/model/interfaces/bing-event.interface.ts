/**
 * Copyright(c) RIB Software GmbH
 */

import { IWaypointLocation } from './bing-map/waypoint-location.interface';

/**
 * An interface that stores bing event object.
 */

export interface IBingEvent{

    /**
     * Event targetType.
     */
    targetType:string;

    /**
     * Event location.
     */
    location:IWaypointLocation
}