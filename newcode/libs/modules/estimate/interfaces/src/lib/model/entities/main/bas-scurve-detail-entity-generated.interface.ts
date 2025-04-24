/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasScurveEntity } from './bas-scurve-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBasScurveDetailEntityGenerated extends IEntityBase {

/*
 * BasScurveEntity
 */
  BasScurveEntity?: IBasScurveEntity | null;

/*
 * Bin
 */
  Bin?: number | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * Percentofcost
 */
  Percentofcost?: number | null;

/*
 * Percentoftime
 */
  Percentoftime?: number | null;

/*
 * ScurveFk
 */
  ScurveFk?: number | null;

/*
 * Weight
 */
  Weight?: number | null;
}
