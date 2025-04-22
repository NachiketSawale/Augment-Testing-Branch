/**
 * Copyright(c) RIB Software GmbH
 */
import { ISearchAddressResponse } from './search-address-response.interface';

/**
 * An interface that stores click event response object.
 */
export interface IMapClickEvent{
    /**
     * Lat lng info.
     */
    latlng:ISearchAddressResponse
}