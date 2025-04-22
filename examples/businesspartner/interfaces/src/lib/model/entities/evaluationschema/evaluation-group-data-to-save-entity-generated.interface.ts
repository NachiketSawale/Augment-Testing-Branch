/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsClerkEntity } from '@libs/basics/shared';
import { IEvaluationItemDataEntity } from './evaluation-item-data-entity.interface';
import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';

export interface IEvaluationGroupDataToSaveEntityGenerated {

  /**
   * EvalGroupData2ClerkToDelete
   */
  EvalGroupData2ClerkToDelete?: IBasicsClerkEntity[] | null;

  /**
   * EvalGroupData2ClerkToSave
   */
  EvalGroupData2ClerkToSave?: IBasicsClerkEntity[] | null;

  /**
   * EvaluationGroupData
   */
  //EvaluationGroupData?: IEvaluationGroupDataEntity | null;
  EvaluationGroupData?: IEvaluationGroupDataEntity;

  /**
   * EvaluationItemDataToSave
   */
  EvaluationItemDataToSave?: IEvaluationItemDataEntity[] | null;

  /**
   * IsEvaluationSubGroupData
   */
  IsEvaluationSubGroupData: boolean;

  /**
   * MainItemId
   */
  MainItemId: number;
}
