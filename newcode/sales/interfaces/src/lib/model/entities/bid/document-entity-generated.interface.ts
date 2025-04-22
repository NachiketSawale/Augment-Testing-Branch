/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IDocumentEntityGenerated extends IEntityBase {

  /**
   * BidHeaderEntity
   */
  BidHeaderEntity?: IBidHeaderEntity | null;

  /**
   * BidHeaderFk
   */
  BidHeaderFk: number;

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
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * SalesDocumentTypeFk
   */
  SalesDocumentTypeFk: number;
}
