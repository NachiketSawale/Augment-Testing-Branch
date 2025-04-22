/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcItemInfoBLEntityGenerated extends IEntityBase {

  /**
   * BasClobsFk
   */
  BasClobsFk?: number | null;

  /**
   * BasUomFk
   */
  BasUomFk: number;

  /**
   * Brief
   */
  Brief?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcItemFk
   */
  PrcItemFk: number;

  /**
   * PriceMaterial
   */
  PriceMaterial: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityMaterial
   */
  QuantityMaterial: number;

  /**
   * Reference
   */
  Reference?: string | null;
}
