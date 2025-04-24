/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { ILocationInfoEntity } from './location-info-entity.interface';

export interface ILocationInfoEntityGenerated {

/*
 * Children
 */
  Children?: ILocationInfoEntity[] | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * LocID
 */
  LocID?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;
}
