/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEntityCalculationResultEntity } from './entity-calculation-result-entity.interface';
import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';

export interface IRecalculateAllResponseGenerated {

  /**
   * Evaluation
   */
  Evaluation?: IEvaluationEntity | null;

  /**
   * Groups
   */
  Groups?: IEvaluationGroupDataEntity[] | null;

  /**
   * Results
   */
  Results?: Map<number, IEntityCalculationResultEntity> | null;
}
