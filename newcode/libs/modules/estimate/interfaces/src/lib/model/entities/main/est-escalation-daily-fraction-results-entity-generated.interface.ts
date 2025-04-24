/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasScurveEntity } from './bas-scurve-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstEscalationDailyFractionResultsEntityGenerated extends IEntityBase {

/*
 * BasScurveEntity
 */
  BasScurveEntity?: IBasScurveEntity | null;

/*
 * BeginDuration
 */
  BeginDuration?: number | null;

/*
 * Bin
 */
  Bin?: number | null;

/*
 * BinFinish
 */
  BinFinish?: number | null;

/*
 * BinStart
 */
  BinStart?: number | null;

/*
 * DailyFraction
 */
  DailyFraction?: number | null;

/*
 * Date
 */
  Date?: string | null;

/*
 * EndDuration
 */
  EndDuration?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemEntity
 */
  EstLineItemEntity?: IEstLineItemEntity | null;

/*
 * EstLineitemFk
 */
  EstLineitemFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * ScurveFk
 */
  ScurveFk?: number | null;
}
