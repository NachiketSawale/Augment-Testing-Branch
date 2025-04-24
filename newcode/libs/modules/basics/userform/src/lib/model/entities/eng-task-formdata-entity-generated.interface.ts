/*
 * Copyright(c) RIB Software GmbH
 */

import { IEngTaskEntity } from './eng-task-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEngTaskFormdataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EngTaskEntity
   */
  EngTaskEntity?: IEngTaskEntity | null;

  /**
   * FormDataEntity
   */
  FormDataEntity?: IFormDataEntity | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * Id
   */
  Id: number;
}
