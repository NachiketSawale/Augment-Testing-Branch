/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IPpsItemEntity } from './pps-item-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPpsItemFormdataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

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

  /**
   * PpsItemEntity
   */
  PpsItemEntity?: IPpsItemEntity | null;
}
