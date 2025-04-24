/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasScurveEntity } from './bas-scurve-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstEscalationScurveResultsEntityGenerated extends IEntityBase {

/*
 * BasScurveEntity
 */
  BasScurveEntity?: IBasScurveEntity | null;

/*
 * Bin
 */
  Bin?: number | null;

/*
 * Dailyspend
 */
  Dailyspend?: number | null;

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
 * Percentage
 */
  Percentage?: number | null;

/*
 * ScurveFk
 */
  ScurveFk?: number | null;

/*
 * Weight
 */
  Weight?: number | null;
}
