/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRiskRegisterEntity } from './risk-register-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstRiskRegisterUserChoicesEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsMax
 */
  IsMax?: boolean | null;

/*
 * IsMean
 */
  IsMean?: boolean | null;

/*
 * IsMin
 */
  IsMin?: boolean | null;

/*
 * IsSpread
 */
  IsSpread?: boolean | null;

/*
 * IsStdDev
 */
  IsStdDev?: boolean | null;

/*
 * IsX
 */
  IsX?: boolean | null;

/*
 * MaxValue
 */
  MaxValue?: number | null;

/*
 * MeanValue
 */
  MeanValue?: number | null;

/*
 * MinValue
 */
  MinValue?: number | null;

/*
 * RiskEventFk
 */
  RiskEventFk?: number | null;

/*
 * RiskRegisterEntity
 */
  RiskRegisterEntity?: IRiskRegisterEntity | null;

/*
 * StdDevValue
 */
  StdDevValue?: number | null;

/*
 * UseCalculation
 */
  UseCalculation?: boolean | null;

/*
 * XValue
 */
  XValue?: number | null;
}
