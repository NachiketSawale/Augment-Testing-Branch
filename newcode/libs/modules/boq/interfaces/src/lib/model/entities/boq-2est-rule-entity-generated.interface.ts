/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoq2estRuleEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemEntity
 */
  BoqItemEntity?: IBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * EstEvaluationSequenceFk
 */
  EstEvaluationSequenceFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsExecution
 */
  IsExecution: boolean;

/*
 * Operand
 */
  Operand?: number | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk: number;

/*
 * Sorting
 */
  Sorting?: number | null;
}
