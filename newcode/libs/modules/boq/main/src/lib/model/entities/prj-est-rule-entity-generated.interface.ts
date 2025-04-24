/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPrjEstRuleEntityGenerated extends IEntityBase {

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk: number;

/*
 * Code
 */
  Code: string;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstEvaluationSequenceFk
 */
  EstEvaluationSequenceFk: number;

/*
 * EstRuleExecutionTypeFk
 */
  EstRuleExecutionTypeFk: number;

/*
 * Icon
 */
  Icon: number;

/*
 * Id
 */
  Id: number;

/*
 * IsForBoq
 */
  IsForBoq?: boolean | null;

/*
 * IsForEstimate
 */
  IsForEstimate?: boolean | null;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * MainId
 */
  MainId?: number | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk: number;

/*
 * Operand
 */
  Operand?: number | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting: number;
}
