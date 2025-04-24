/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IInvHeaderFormDataEntityGenerated extends IEntityBase {

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
   * InvHeaderEntity
   */
  InvHeaderEntity?: IInvHeaderEntity | null;
}
