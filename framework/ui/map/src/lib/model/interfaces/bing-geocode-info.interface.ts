/**
 * Copyright(c) RIB Software GmbH
 */

import { IBingGeocode } from './bing-geocode.interface';

/**
 * An interface that stores bing geocode info object.
 */
export interface IBingGeocodeInfo{
    /**
     * Geocode information.
     */
    results:IBingGeocode[];
}