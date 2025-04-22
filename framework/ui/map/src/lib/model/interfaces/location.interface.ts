/**
 * Copyright(c) RIB Software GmbH
 */
import { ISearchAddressEntity } from './search-address-entity.interface';

/**
 * An interface that stores location object.
 */
export interface ILocation{
    /**
     * Address latitude.
     */
    latitude:number;

    /**
     * Address longitude.
     */
    longitude:number;

    /**
     * Address entity.
     */
    addressEntity:ISearchAddressEntity;

    /**
     * Address.
     */
    address?:string;
}