/**
 * Copyright(c) RIB Software GmbH
 */

import { IClickEventPoint } from './click-event-point.interface';

/**
 * An interface that stores baidu map click event object.
 */
export interface IMapClickEvent {
    /**
     * Click event point.
     */
    point:IClickEventPoint;
}