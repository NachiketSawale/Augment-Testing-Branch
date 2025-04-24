/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEstBoq2EstRuleEntity } from './est-boq-2est-rule-entity.interface';
import { IEstCostGrpRuleEntity } from './est-cost-grp-rule-entity.interface';
import { IEstCtu2EstRuleEntity } from './est-ctu-2est-rule-entity.interface';
import { IEstHeader2EstRuleEntity } from './est-header-2est-rule-entity.interface';
import { IEstLineItem2EstRuleEntity } from './est-line-item-2est-rule-entity.interface';
import { IEstLineItem2MdcRuleEntity } from './est-line-item-2mdc-rule-entity.interface';
import { IEstPrcStruc2EstRuleEntity } from './est-prc-struc-2est-rule-entity.interface';
import { IEstPrjLoc2EstRuleEntity } from './est-prj-loc-2est-rule-entity.interface';
import { IPrjBoq2EstRuleEntity } from './prj-boq-2est-rule-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import {IEstActivity2EstRuleEntity} from './est-activity-2est-rule-entity.interface';
import {IEstAssembly2EstRuleEntity} from './est-assembly-2est-rule-entity.interface';
import {IEstAssembly2MdcRuleEntity} from './est-assembly-2mdc-rule-entity.interface';

export interface IEstEvaluationSequenceEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstActivity2EstRuleEntities
 */
  EstActivity2EstRuleEntities?: IEstActivity2EstRuleEntity[] | null;

/*
 * EstAssembly2EstRuleEntities
 */
  EstAssembly2EstRuleEntities?: IEstAssembly2EstRuleEntity[] | null;

/*
 * EstAssembly2MdcRuleEntities
 */
  EstAssembly2MdcRuleEntities?: IEstAssembly2MdcRuleEntity[] | null;

/*
 * EstBoq2EstRuleEntities
 */
  EstBoq2EstRuleEntities?: IEstBoq2EstRuleEntity[] | null;

/*
 * EstCostgrpRuleEntities
 */
  EstCostgrpRuleEntities?: IEstCostGrpRuleEntity[] | null;

/*
 * EstCtu2EstRuleEntities
 */
  EstCtu2EstRuleEntities?: IEstCtu2EstRuleEntity[] | null;

/*
 * EstHeader2EstRuleEntities
 */
  EstHeader2EstRuleEntities?: IEstHeader2EstRuleEntity[] | null;

/*
 * EstLineItem2EstRuleEntities
 */
  EstLineItem2EstRuleEntities?: IEstLineItem2EstRuleEntity[] | null;

/*
 * EstLineitem2MdcRuleEntities
 */
  EstLineitem2MdcRuleEntities?: IEstLineItem2MdcRuleEntity[] | null;

/*
 * EstPrcStruc2EstRuleEntities
 */
  EstPrcStruc2EstRuleEntities?: IEstPrcStruc2EstRuleEntity[] | null;

/*
 * EstPrjLoc2EstRuleEntities
 */
  EstPrjLoc2EstRuleEntities?: IEstPrjLoc2EstRuleEntity[] | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Ischangeable
 */
  Ischangeable?: boolean | null;

/*
 * Isdefault
 */
  Isdefault?: boolean | null;

/*
 * PrjBoq2estRuleEntities
 */
  PrjBoq2estRuleEntities?: IPrjBoq2EstRuleEntity[] | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
