/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodeEntity } from './cost-code-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICostcodeTypeEntityGenerated extends IEntityBase {

/*
 * CostCodeEntities
 */
  CostCodeEntities?: ICostCodeEntity[] | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DescriptionTr
 */
  DescriptionTr?: number | null;

/*
 * Icon
 */
  Icon?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsEstimateCc
 */
  IsEstimateCc?: boolean | null;

/*
 * IsRevenueCc
 */
  IsRevenueCc?: boolean | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
