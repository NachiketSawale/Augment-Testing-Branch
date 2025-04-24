/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPesShipmentinfoEntityGenerated extends IEntityBase {

  /**
   * BasCountryFk
   */
  BasCountryFk?: number | null;

  /**
   * Carrierlink
   */
  Carrierlink?: string | null;

  /**
   * Carriername
   */
  Carriername?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsPesReadOnly
   */
  IsPesReadOnly: boolean;

  /**
   * Logistics
   */
  Logistics?: string | null;

  /**
   * Packinglistnumber
   */
  Packinglistnumber?: string | null;

  /**
   * Shipmentnumber
   */
  Shipmentnumber?: string | null;

  /**
   * Totaldimension
   */
  Totaldimension?: string | null;

  /**
   * Totalweight
   */
  Totalweight?: string | null;

  /**
   * Trackingnumber
   */
  Trackingnumber?: string | null;
}
