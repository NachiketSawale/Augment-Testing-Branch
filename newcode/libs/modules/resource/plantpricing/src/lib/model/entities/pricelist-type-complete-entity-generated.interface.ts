/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstPricelistEntity } from './est-pricelist-entity.interface';
import { IPricelistTypeEntity } from './pricelist-type-entity.interface';
import { IPricelistEntity } from './pricelist-entity.interface';


export interface IPricelistTypeCompleteEntityGenerated {

/*
 * EstPricelistsToDelete
 */
  EstPricelistsToDelete?: IEstPricelistEntity[] | null;

/*
 * EstPricelistsToSave
 */
  EstPricelistsToSave?: IEstPricelistEntity[] | null;

/*
 * PricelistTypeId
 */
  PricelistTypeId?: number | null;

/*
 * PricelistTypes
 */
  PricelistTypes?: IPricelistTypeEntity[] | null;

/*
 * PricelistsToDelete
 */
  PricelistsToDelete?: IPricelistEntity[] | null;

/*
 * PricelistsToSave
 */
  PricelistsToSave?: IPricelistEntity[] | null;
}
