/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostBudgetConfigEntity } from './est-cost-budget-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstCostBudgetTypeEntityGenerated extends IEntityBase {

/*
 * ContextFk
 */
  ContextFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

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
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;
}
