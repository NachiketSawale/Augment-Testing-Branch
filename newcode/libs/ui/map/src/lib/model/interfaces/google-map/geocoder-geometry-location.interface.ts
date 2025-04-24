/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores geocoder geometry entity object.
 */

export interface IGeocoderGeometryLocation{
    /**
     * Longitude.
     * @returns number | null
     */
    lng:()=>number | null;

    /**
     * Latitude.
     * @returns number | null
     */
    lat:()=>number | null;
}