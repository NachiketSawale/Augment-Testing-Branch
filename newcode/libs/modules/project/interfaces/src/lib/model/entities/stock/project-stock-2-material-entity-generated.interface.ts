/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectStock2MaterialEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * IsLotManagement
 */
  IsLotManagement: boolean;

/*
 * LoadingCostPercent
 */
  LoadingCostPercent: number;

/*
 * MasterDataContextFk
 */
  MasterDataContextFk: number;

/*
 * MaterialCatalogFk
 */
  MaterialCatalogFk: number;

/*
 * MaterialFk
 */
  MaterialFk: number;

/*
 * MaxQuantity
 */
  MaxQuantity: number;

/*
 * MinQuantity
 */
  MinQuantity: number;

/*
 * ProjectStockFk
 */
  ProjectStockFk: number;

/*
 * ProvisionPercent
 */
  ProvisionPercent: number;

/*
 * ProvisionPeruom
 */
  ProvisionPeruom: number;

/*
 * StandardCost
 */
  StandardCost: number;

/*
 * Stock2MaterialStatusFk
 */
  Stock2MaterialStatusFk: number;

/*
 * StockLocationFk
 */
  StockLocationFk: number | null;
}
