/*
 * Copyright(c) RIB Software GmbH
 */

import { IStock2matPriceverEntity } from './stock-2-mat-pricever-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IMaterial2ProjectStockEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * IsLotManagement
   */
  IsLotManagement: boolean;

  /**
   * MasterDataContextFk
   */
  MasterDataContextFk: number;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * MaxQuantity
   */
  MaxQuantity: number;

  /**
   * MinQuantity
   */
  MinQuantity: number;

  /**
   * ProjectStockFk
   */
  ProjectStockFk: number;

  /**
   * ProvisionPercent
   */
  ProvisionPercent: number;

  /**
   * ProvisionPeruom
   */
  ProvisionPeruom: number;

  /**
   * StandardCost
   */
  StandardCost: number;

  /**
   * Stock2matPriceverToDelete
   */
  Stock2matPriceverToDelete?: IStock2matPriceverEntity[] | null;

  /**
   * Stock2matPriceverToSave
   */
  Stock2matPriceverToSave?: IStock2matPriceverEntity[] | null;

  /**
   * StockLocationFk
   */
  StockLocationFk?: number | null;

	/**
	 * ProjectFk
	 */
	ProjectFk?: number;
}
