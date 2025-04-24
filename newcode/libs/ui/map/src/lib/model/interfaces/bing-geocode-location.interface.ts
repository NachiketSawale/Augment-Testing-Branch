/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores bing geocode location object.
 */

export interface IBingGeocodeLocation{
    /**
     * Location altitude.
     */
    altitude:number;

    /**
     * Location altitudeReference.
     */
    altitudeReference:number;

    /**
     * Location latitude.
     */
    latitude:number;

    /**
     * Location longitude.
     */
    longitude:number;

    /**
     * Location name.
     */
    name:string
}