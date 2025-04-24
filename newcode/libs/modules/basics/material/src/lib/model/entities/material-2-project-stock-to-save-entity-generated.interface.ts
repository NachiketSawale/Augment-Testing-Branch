/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterial2ProjectStockEntity } from './material-2-project-stock-entity.interface';
import { IStock2matPriceverEntity } from './stock-2-mat-pricever-entity.interface';

export interface IMaterial2ProjectStockToSaveEntityGenerated {

  /**
   * Material2ProjectStock
   */
  Material2ProjectStock?: IMaterial2ProjectStockEntity | null;

  /**
   * Stock2matPriceverToDelete
   */
  Stock2matPriceverToDelete?: IStock2matPriceverEntity[] | null;

  /**
   * Stock2matPriceverToSave
   */
  Stock2matPriceverToSave?: IStock2matPriceverEntity[] | null;
}
