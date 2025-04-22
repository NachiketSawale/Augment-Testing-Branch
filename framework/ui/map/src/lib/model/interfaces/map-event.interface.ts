/**
 * Copyright(c) RIB Software GmbH
 */

import { IRouteLegEndLocation } from './google-map/route-leg-end-location.interface';

/**
 * An interface that stores map event object.
 */
export interface IMapEvent{
    /**
     * LatLng.
     */
    latLng:IRouteLegEndLocation
}