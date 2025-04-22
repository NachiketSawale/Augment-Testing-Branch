/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEvaluationSchemaIconEntityGenerated extends IEntityBase {

  /**
   * EvaluationSchemaFk
   */
  EvaluationSchemaFk: number;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PointsFrom
   */
  PointsFrom: number;

  /**
   * PointsTo
   */
  PointsTo: number;
}
