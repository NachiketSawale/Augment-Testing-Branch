/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IUserFormEntity } from './user-form-entity.interface';

export interface IFormFieldEntityGenerated extends IEntityBase {

  /**
   * DataSource
   */
  DataSource?: string | null;

  /**
   * FieldName
   */
  FieldName?: string | null;

  /**
   * FieldType
   */
  FieldType: number;

  /**
   * FormEntity
   */
  FormEntity?: IUserFormEntity | null;

  /**
   * FormFk
   */
  FormFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * LookupQualifier
   */
  LookupQualifier?: string | null;

  /**
   * ProcessingType
   */
  ProcessingType: number;

  /**
   * SqlQuery
   */
  SqlQuery?: string | null;

  /**
   * VisibleName
   */
  VisibleName?: string | null;
}
