/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEvaluationSchemaEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EvaluationMotiveFk
   */
  EvaluationMotiveFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * FormFk
   */
  FormFk?: number | null;
}
