/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IFormEntity } from './form-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IRubricEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * FormDataEntities
   */
  FormDataEntities?: IFormDataEntity[] | null;

  /**
   * FormEntities
   */
  FormEntities?: IFormEntity[] | null;

  /**
   * Id
   */
  Id: number;
}
