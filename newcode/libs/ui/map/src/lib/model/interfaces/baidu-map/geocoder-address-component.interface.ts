/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores geocoder address component object.
 */

export interface IGeocoderAddressComponent{
    /**
     * City.
     */
    city: string;

    /**
     * District.
     */
    district:string;

    /**
     * Province.
     */
    province:string;
    
    /**
     * Street.
     */
    street:string;

    /**
     * Street number.
     */
    streetNumber: string;
}