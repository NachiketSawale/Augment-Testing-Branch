/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPrjBoq2EstRuleEntity } from './prj-boq-2est-rule-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import {IEstRuleSrc2CostGroupRuleEntity} from './est-rule-src-2cost-group-rule-entity.interface';

export interface IEstRuleSourceEntityGenerated extends IEntityBase {

/*
 * EstActivity2estRuleFk
 */
  EstActivity2estRuleFk?: number | null;

/*
 * EstAssembly2estRuleFk
 */
  EstAssembly2estRuleFk?: number | null;

/*
 * EstBoq2estRuleFk
 */
  EstBoq2estRuleFk?: number | null;

/*
 * EstCtu2estRuleFk
 */
  EstCtu2estRuleFk?: number | null;

/*
 * EstHeader2estRuleFk
 */
  EstHeader2estRuleFk?: number | null;

/*
 * EstLineitem2estRuleFk
 */
  EstLineitem2estRuleFk?: number | null;

/*
 * EstPrcStruc2estRuleFk
 */
  EstPrcStruc2estRuleFk?: number | null;

/*
 * EstPrjLoc2estRuleFk
 */
  EstPrjLoc2estRuleFk?: number | null;

/*
 * EstRuleSrc2CostGroupRuleEntities
 */
  EstRuleSrc2CostGroupRuleEntities?: IEstRuleSrc2CostGroupRuleEntity[] | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PrjBoq2estRuleEntity
 */
  PrjBoq2estRuleEntity?: IPrjBoq2EstRuleEntity | null;

/*
 * PrjBoq2estRuleFk
 */
  PrjBoq2estRuleFk?: number | null;
}
