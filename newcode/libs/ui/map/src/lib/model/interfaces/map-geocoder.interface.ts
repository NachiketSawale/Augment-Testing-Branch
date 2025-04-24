/**
 * Copyright(c) RIB Software GmbH
 */

import { IGeocoderAddressComponent } from './google-map/geocoder-address-componets.interface';
import { IGeocoderGeometry } from './google-map/geocoder-geometry.interface';

/**
 * An interface that stores map Geocoder object.
 */
export interface IMapGeocoder{

  /**
   * Formatted address.
   */
  formatted_address: string;

  /**
   * Address.
   */
  address_components: IGeocoderAddressComponent[];

  /**
   * geometry.
   */
  geometry: IGeocoderGeometry
}