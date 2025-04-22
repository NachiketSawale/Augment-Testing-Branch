
/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores search address response object.
 */
export interface ISearchAddressResponse{
    /**
     * Display_name.
     */
    display_name:string;
    
    /**
     * Latitude.
     */
    lat:number;

    /**
     * Longitude.
     */
    lon:number;

    /**
     * Longitude for click event.
     */
    lng:number;
}