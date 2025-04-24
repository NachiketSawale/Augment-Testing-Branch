/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEvaluationSubgroupEntityGenerated extends IEntityBase {

  /**
   * CommentTextInfo
   */
  CommentTextInfo?: IDescriptionInfo | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EvaluationGroupFk
   */
  EvaluationGroupFk: number;

  /**
   * Formula
   */
  Formula?: string | null;

  /**
   * GroupOrder
   */
  GroupOrder?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsEditable
   */
  IsEditable: boolean;

  /**
   * IsMultiSelect
   */
  IsMultiSelect: boolean;

  /**
   * IsOptional
   */
  IsOptional: boolean;

  /**
   * PointsMinimum
   */
  PointsMinimum: number;

  /**
   * PointsPossible
   */
  PointsPossible: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * Weighting
   */
  Weighting: number;

  /**
   * FormFieldFk
   */
  FormFieldFk?: number | null;
}
