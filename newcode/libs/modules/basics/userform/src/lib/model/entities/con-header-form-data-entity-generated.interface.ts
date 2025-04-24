/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from './con-header-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IConHeaderFormDataEntityGenerated extends IEntityBase {

  /**
   * ConHeaderEntity
   */
  ConHeaderEntity?: IConHeaderEntity | null;

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
