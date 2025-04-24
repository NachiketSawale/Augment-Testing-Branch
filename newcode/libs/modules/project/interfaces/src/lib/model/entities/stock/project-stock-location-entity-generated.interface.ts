/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectStockLocationEntity } from './project-stock-location-entity.interface';
import { IEntityBase, IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IProjectStockLocationEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo: IDescriptionInfo | null;

/*
 * StockFk
 */
  StockFk: number;

/*
 * StockLocationFk
 */
  StockLocationFk: number | null;

/*
 * SubLocations
 */
  SubLocations?: IProjectStockLocationEntity[] | null;
}
