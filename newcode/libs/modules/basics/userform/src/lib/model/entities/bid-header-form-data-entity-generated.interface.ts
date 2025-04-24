/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBidHeaderFormDataEntityGenerated extends IEntityBase {

  /**
   * BidHeaderEntity
   */
  BidHeaderEntity?: IBidHeaderEntity | null;

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
}
