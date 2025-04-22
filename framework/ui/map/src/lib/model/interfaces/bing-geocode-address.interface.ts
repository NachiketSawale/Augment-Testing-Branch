/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores bing geocode address object.
 */

export interface IBingGeocodeAddress{

    /**
     * location addressLine.
     */
    addressLine:string;

    /**
     * location adminDistrict.
     */
    adminDistrict:string;

    /**
     * location countryRegion.
     */
    countryRegion:string;

    /**
     * location countryRegionISO2.
     */
    countryRegionISO2:string;

    /**
     * location district.
     */
    district:string;

    /**
     * location formattedAddress.
     */
    formattedAddress:string;

    /**
     * location locality.
     */
    locality:string;

    /**
     * location postalCode.
     */
    postalCode:string;
}