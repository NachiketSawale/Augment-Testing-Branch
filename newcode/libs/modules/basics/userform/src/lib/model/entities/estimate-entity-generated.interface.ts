/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstimateFormDataEntity } from './estimate-form-data-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstimateEntityGenerated extends IEntityBase {

  /**
   * EstHeaderFk
   */
  EstHeaderFk: number;

  /**
   * EstimateFormdataEntities
   */
  EstimateFormdataEntities?: IEstimateFormDataEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;
}
