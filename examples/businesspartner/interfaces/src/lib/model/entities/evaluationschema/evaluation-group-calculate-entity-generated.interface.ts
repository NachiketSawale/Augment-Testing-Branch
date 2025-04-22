/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';

export interface IEvaluationGroupCalculateEntityGenerated {

  /**
   * Evaluation
   */
  Evaluation?: IEvaluationEntity | null;

  /**
   * FormulaSQLField
   */
  FormulaSQLField?: string | null;

  /**
   * Groups
   */
  Groups?: IEvaluationGroupDataEntity[] | null;
}
