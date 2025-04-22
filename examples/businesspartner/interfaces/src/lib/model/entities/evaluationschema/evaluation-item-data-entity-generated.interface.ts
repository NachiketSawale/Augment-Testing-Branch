/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEvaluationItemDataEntityGenerated extends IEntityBase {

  /**
   * EvaluationItemFk
   */
  EvaluationItemFk: number;

  /**
   * EvaluationSubGroupDataFk
   */
  EvaluationSubGroupDataFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsTicked
   */
  IsTicked: boolean;

  /**
   * Points
   */
  Points: number;

  /**
   * Remark
   */
  Remark?: string | null;
}
