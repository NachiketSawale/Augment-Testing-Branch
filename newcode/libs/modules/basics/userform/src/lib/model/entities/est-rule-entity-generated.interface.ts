/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleEntity } from './est-rule-entity.interface';
import { IEstRuleFormDataEntity } from './est-rule-form-data-entity.interface';
import { IFormEntity } from './form-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstRuleEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * EstEvaluationsequenceFk
   */
  EstEvaluationsequenceFk: number;

  /**
   * EstRuleEntities_EstRuleFk
   */
  EstRuleEntities_EstRuleFk?: IEstRuleEntity[] | null;

  /**
   * EstRuleEntity_EstRuleFk
   */
  EstRuleEntity_EstRuleFk?: IEstRuleEntity | null;

  /**
   * EstRuleExecutionTypeFk
   */
  EstRuleExecutionTypeFk: number;

  /**
   * EstRuleFk
   */
  EstRuleFk?: number | null;

  /**
   * EstRuleFormdataEntities
   */
  EstRuleFormdataEntities?: IEstRuleFormDataEntity[] | null;

  /**
   * FormEntity
   */
  FormEntity?: IFormEntity | null;

  /**
   * FormFk
   */
  FormFk?: number | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsForBoq
   */
  IsForBoq: boolean;

  /**
   * IsForEstimate
   */
  IsForEstimate: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * MdcLineitemcontextFk
   */
  MdcLineitemcontextFk: number;

  /**
   * Operand
   */
  Operand?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
