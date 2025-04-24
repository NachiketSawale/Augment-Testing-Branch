/**
 * Copyright(c) RIB Software GmbH
 */

import { IEventTarget } from './event-target.interface';
import { IWaypointLocation } from './waypoint-location.interface';

/**
 * An interface that stores bing event handler object.
 */
export interface IEventHandler{

    /**
     * Target.
     */
    target:IEventTarget;

    /**
     * Message.
     */
    message:string;

    /**
     * Location.
     */
    location:IWaypointLocation;
}