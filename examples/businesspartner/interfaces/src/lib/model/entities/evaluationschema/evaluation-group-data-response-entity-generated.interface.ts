/*
 * Copyright(c) RIB Software GmbH
 */
import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';
import { IEvaluationGroupIconEntity } from './evaluation-group-icon-entity.interface';

export interface IEvaluationGroupDataResponseEntityGenerated {

  /**
   * GroupIcons
   */
  GroupIcons?: IEvaluationGroupIconEntity[] | null;

  /**
   * dtos
   */
  dtos?: IEvaluationGroupDataEntity[] | null;
}
