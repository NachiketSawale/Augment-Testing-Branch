/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICrbPriceconditionEntity } from './crb-pricecondition-entity.interface';

export interface ICrbPriceconditionScopeEntityGenerated extends IEntityBase {

/*
 * CostgroupKagFk
 */
  CostgroupKagFk?: number | null;

/*
 * CostgroupOglFk
 */
  CostgroupOglFk?: number | null;

/*
 * CrbPriceconditionFk
 */
  CrbPriceconditionFk: number;

/*
 * Id
 */
  Id: number;

/*
 * Pricecondition
 */
  Pricecondition?: ICrbPriceconditionEntity | null;
}
