/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstLineitemFormDataEntityGenerated extends IEntityBase {

  /**
   * Context1Fk
   */
  Context1Fk: number;

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EstLineItemEntity
   */
  EstLineItemEntity?: IEstLineItemEntity | null;

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
