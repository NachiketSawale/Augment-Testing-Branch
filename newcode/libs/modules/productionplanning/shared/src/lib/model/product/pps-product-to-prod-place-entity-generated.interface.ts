/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsProductToProdPlaceEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * PositionX
 */
  PositionX?: number | null;

/*
 * PositionY
 */
  PositionY?: number | null;

/*
 * PositionZ
 */
  PositionZ?: number | null;

/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;

/*
 * PpsProductionPlaceFk
 */
  PpsProductionPlaceFk?: number | null;

/*
 * SlabNumber
 */
  SlabNumber?: string | null;

/*
 * Timestamp
 */
  Timestamp?: string | null;
}
