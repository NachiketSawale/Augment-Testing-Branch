/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostGrpRuleEntity } from './est-cost-grp-rule-entity.interface';
import { IEstRuleSourceEntity } from './est-rule-source-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstRuleSrc2CostGroupRuleEntityGenerated extends IEntityBase {

/*
 * EstCostGroupRuleFk
 */
  EstCostGroupRuleFk?: number | null;

/*
 * EstCostGrpRuleEntity
 */
  EstCostGrpRuleEntity?: IEstCostGrpRuleEntity | null;

/*
 * EstRuleSourceEntity
 */
  EstRuleSourceEntity?: IEstRuleSourceEntity | null;

/*
 * EstRuleSourceFk
 */
  EstRuleSourceFk?: number | null;

/*
 * Id
 */
  Id?: number | null;
}
