/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostBudgetConfigEntity } from './est-cost-budget-config-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstCostBudgetAssignEntityGenerated extends IEntityBase {

/*
 * EstCostBudgetConfigEntity
 */
  EstCostBudgetConfigEntity?: IEstCostBudgetConfigEntity | null;

/*
 * EstCostBudgetConfigFk
 */
  EstCostBudgetConfigFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;
}
