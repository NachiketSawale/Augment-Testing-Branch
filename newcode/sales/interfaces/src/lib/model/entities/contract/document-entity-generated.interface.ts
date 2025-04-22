/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IDocumentEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate: Date | string;

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
   * OrdHeaderEntity
   */
  OrdHeaderEntity?: IOrdHeaderEntity | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk: number;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * SalesDocumentTypeFk
   */
  SalesDocumentTypeFk: number;
}
