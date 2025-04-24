/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodeEntity } from './cost-code-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICostCode2ResTypeEntityGenerated extends IEntityBase {

/*
 * CostCodeEntity
 */
  CostCodeEntity?: ICostCodeEntity | null;

/*
 * CostCodeFk
 */
  CostCodeFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ResTypeFk
 */
  ResTypeFk?: number | null;

/*
 * ResourceContextFk
 */
  ResourceContextFk?: number | null;
}
