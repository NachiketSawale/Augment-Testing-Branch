/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IResResourceEntity } from './res-resource-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IResResourceFormdataEntityGenerated extends IEntityBase {

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
   * ResResourceEntity
   */
  ResResourceEntity?: IResResourceEntity | null;
}
