/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';

export interface IUpdateParentCalculationResultRequestGenerated {

  /**
   * GroupData
   */
  GroupData?: IEvaluationGroupDataEntity | null;

  /**
   * SubGroupData
   */
  SubGroupData?: IEvaluationGroupDataEntity[] | null;
}
