/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IHsqChecklistEntity } from './hsq-checklist-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IHsqChecklist2formEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

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
   * HsqChecklistEntity
   */
  HsqChecklistEntity?: IHsqChecklistEntity | null;

  /**
   * Id
   */
  Id: number;
}
