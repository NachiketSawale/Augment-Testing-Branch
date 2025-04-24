/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IStock2matPriceverEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * MdcMatPriceverFk
   */
  MdcMatPriceverFk: number;

  /**
   * MdcMaterialCatalogFk
   */
  MdcMaterialCatalogFk: number;

  /**
   * PriceListDescription
   */
  PriceListDescription?: string | null;

  /**
   * PrjStockFk
   */
  PrjStockFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;
}
