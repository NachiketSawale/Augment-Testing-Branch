/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcDocumentTypeEntity } from './prc-document-type-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcDocumentEntityGenerated extends IEntityBase {

  /**
   * CanDownload
   */
  CanDownload: boolean;

  /**
   * CanUpload
   */
  CanUpload: boolean;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate?: string | null;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk: number;

  /**
   * FileArchiveDocFk
   */
  FileArchiveDocFk?: number | null;

  /**
   * FileSize
   */
  FileSize?: string | null;

  /**
   * FileSizeInByte
   */
  FileSizeInByte?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * PrcDocumentStatusFk
   */
  PrcDocumentStatusFk?: number | null;

  /**
   * PrcDocumentTypeEntity
   */
  PrcDocumentTypeEntity?: IPrcDocumentTypeEntity | null;

  /**
   * PrcDocumentTypeFk
   */
  PrcDocumentTypeFk?: number | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * Url
   */
  Url?: string | null;
}
