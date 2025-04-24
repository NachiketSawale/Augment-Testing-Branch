/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEvaluationItemEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EvaluationSubGroupFk
   */
  EvaluationSubGroupFk: number;

  /**
   * Formula
   */
  Formula?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Points
   */
  Points: number;

  /**
   * RemarkInfo
   */
  RemarkInfo?: IDescriptionInfo | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * FormFieldFk
   */
  FormFieldFk?: number | null;
}
