/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IFormFieldEntity } from './form-field-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IFormDataDetailEntityGenerated extends IEntityBase {

  /**
   * FieldValue
   */
  FieldValue?: string | null;

  /**
   * FieldValueJson
   */
  FieldValueJson?: string | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * FormFieldFk
   */
  FormFieldFk: number;

  /**
   * FormdataEntity
   */
  FormdataEntity?: IFormDataEntity | null;

  /**
   * FormfieldEntity
   */
  FormfieldEntity?: IFormFieldEntity | null;

  /**
   * Id
   */
  Id: number;
}
