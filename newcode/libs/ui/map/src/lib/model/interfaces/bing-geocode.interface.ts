/**
 * Copyright(c) RIB Software GmbH
 */

import { IBingGeocodeAddress } from './bing-geocode-address.interface';
import { IBingGeocodeLocation } from './bing-geocode-location.interface';

/**
 * An interface that stores bing geocode object.
 */
export interface IBingGeocode{

    /**
     * Address.
     */
    address:IBingGeocodeAddress;

    /**
     * Location.
     */
    location:IBingGeocodeLocation;
}