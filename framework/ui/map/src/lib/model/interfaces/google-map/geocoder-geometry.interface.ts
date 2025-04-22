/**
 * Copyright(c) RIB Software GmbH
 */

import { IGeocoderGeometryLocation } from './geocoder-geometry-location.interface';

/**
 * An interface that stores geocoder geometry object.
 */
export interface IGeocoderGeometry{
    /**
     * location info.
     */
    location:IGeocoderGeometryLocation;
    
}