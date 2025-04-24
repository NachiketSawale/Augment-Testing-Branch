/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IPsdActivityEntity } from './psd-activity-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPsdActivityFormDataEntityGenerated extends IEntityBase {

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
   * PsdActivityEntity
   */
  PsdActivityEntity?: IPsdActivityEntity | null;
}
