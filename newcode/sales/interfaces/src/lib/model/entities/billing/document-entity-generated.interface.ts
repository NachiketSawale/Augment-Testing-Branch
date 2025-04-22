/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IDocumentEntityGenerated extends IEntityBase {

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  //DocumentDate: Date | string;
  DocumentDate: string;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk: number;

  /**
   * FileArchiveDocFk
   */
  FileArchiveDocFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * SalesDocumentTypeFk
   */
  SalesDocumentTypeFk: number;
}
