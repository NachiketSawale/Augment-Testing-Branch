/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEvaluationGroupEntityGenerated extends IEntityBase {

  /**
   * CommentTextInfo
   */
  CommentTextInfo?: IDescriptionInfo | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EvaluationSchemaFk
   */
  EvaluationSchemaFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsOptional
   */
  IsOptional: boolean;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * Weighting
   */
  Weighting: number;
}
