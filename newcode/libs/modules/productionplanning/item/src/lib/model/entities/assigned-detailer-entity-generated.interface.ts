/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItem2ClerkEntity } from './pps-item-2clerk-entity.interface';

export interface IAssignedDetailerEntityGenerated {

/*
 * Detailers
 */
  Detailers?: IPPSItem2ClerkEntity[] | null;

/*
 * IsLogEnable
 */
  IsLogEnable?: boolean | null;

/*
 * UpdateReason
 */
  UpdateReason?: number | null;

/*
 * UpdateRemark
 */
  UpdateRemark?: string | null;
}
