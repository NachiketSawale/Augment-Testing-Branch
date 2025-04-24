/**
 * Copyright(c) RIB Software GmbH
 */

import { IGeocoderAddressComponent } from './geocoder-address-component.interface';

/**
 * An interface that stores geocoder result object.
 */

export interface IGeocoderResult{
    /**
     * Address.
     */
    address:string;

    /**
     * addressComponents
     */
    addressComponents:IGeocoderAddressComponent;

}