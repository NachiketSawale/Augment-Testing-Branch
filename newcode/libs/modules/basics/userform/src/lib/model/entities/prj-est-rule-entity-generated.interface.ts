/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormEntity } from './form-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IPrjEstRuleFormDataEntity } from './prj-est-rule-form-data-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrjEstRuleEntityGenerated extends IEntityBase {

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
   * EstRuleExecutionTypeFk
   */
  EstRuleExecutionTypeFk: number;

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
   * PrjEstRuleEntities_PrjEstRuleFk
   */
  PrjEstRuleEntities_PrjEstRuleFk?: IPrjEstRuleEntity[] | null;

  /**
   * PrjEstRuleEntity_PrjEstRuleFk
   */
  PrjEstRuleEntity_PrjEstRuleFk?: IPrjEstRuleEntity | null;

  /**
   * PrjEstRuleFk
   */
  PrjEstRuleFk?: number | null;

  /**
   * PrjEstRuleFormdataEntities
   */
  PrjEstRuleFormdataEntities?: IPrjEstRuleFormDataEntity[] | null;

  /**
   * PrjProjectFk
   */
  PrjProjectFk: number;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCatagoryFk
   */
  RubricCatagoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
