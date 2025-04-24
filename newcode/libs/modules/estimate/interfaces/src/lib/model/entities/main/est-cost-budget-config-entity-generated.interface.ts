/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostBudgetAssignEntity } from './est-cost-budget-assign-entity.interface';
import { IEstCostBudgetTypeEntity } from './est-cost-budget-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstCostBudgetConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstCostBudgetAssignEntities
 */
  EstCostBudgetAssignEntities?: IEstCostBudgetAssignEntity[] | null;

/*
 * EstCostBudgetTypeEntities
 */
  EstCostBudgetTypeEntities?: IEstCostBudgetTypeEntity[] | null;

/*
 * Factor
 */
  Factor?: number | null;

/*
 * Id
 */
  Id: number;
}
