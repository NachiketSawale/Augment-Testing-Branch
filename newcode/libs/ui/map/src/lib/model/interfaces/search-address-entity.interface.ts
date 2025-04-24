/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores search address entity object.
 */
export interface ISearchAddressEntity{
    /**
     * Address.
     */
    Address:string;

    /**
     * AddressModified flag.
     */
    AddressModified:boolean;

    /**
     * City.
     */
    City?:string;

    /**
     * CountryCodeISO2.
     */
    CountryCodeISO2?:string;

    /**
     * CountryFk.
     */
    CountryFk?:number;

    /**
     * County.
     */
    Country?:string;

    /**
     * Street.
     */
    Street?:string;

    /**
     * ZipCode.
     */
    ZipCode?:string
}