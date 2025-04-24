/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormEntity } from './form-entity.interface';
import { IFormDataDetailEntity } from './form-data-detail-entity.interface';
import { IEntityBase } from '@libs/platform/common';

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
  FormEntity?: IFormEntity | null;

  /**
   * FormFk
   */
  FormFk: number;

  /**
   * FormdatadetailEntities
   */
  FormdatadetailEntities?: IFormDataDetailEntity[] | null;

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
