/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IQtoFormulaFormDataEntityGenerated extends IEntityBase {

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
   * QtoFormulaEntity
   */
  QtoFormulaEntity?: IQtoFormulaEntity | null;
}
