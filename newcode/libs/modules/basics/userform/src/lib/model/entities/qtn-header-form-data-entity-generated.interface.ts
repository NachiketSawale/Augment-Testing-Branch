/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IQtnHeaderEntity } from './qtn-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IQtnHeaderFormDataEntityGenerated extends IEntityBase {

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
   * QtnHeaderEntity
   */
  QtnHeaderEntity?: IQtnHeaderEntity | null;
}
