/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ILgmJobFormDataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * Id
   */
  Id: number;
}
