/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores geocoder address entity object.
 */

export interface IGeocoderAddressComponent{

    /**
     * Short_name.
     */
    short_name: string;

    /**
     * Long_name.
     */
    long_name: string;

    /**
     * Postcode_localities.
     */
    postcode_localities: string[];

    /**
     * Types.
     */
    types: string[]
}