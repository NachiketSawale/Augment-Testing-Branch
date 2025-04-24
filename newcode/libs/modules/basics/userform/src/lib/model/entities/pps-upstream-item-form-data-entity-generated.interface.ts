/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IPpsUpstreamItemEntity } from './pps-upstream-item-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPpsUpstreamItemFormDataEntityGenerated extends IEntityBase {

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
   * PpsUpstreamItemEntity
   */
  PpsUpstreamItemEntity?: IPpsUpstreamItemEntity | null;
}
