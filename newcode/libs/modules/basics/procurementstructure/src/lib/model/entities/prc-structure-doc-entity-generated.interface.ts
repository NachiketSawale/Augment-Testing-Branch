/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcStructureDocEntityGenerated extends IEntityBase {

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
   * PrcDocumentTypeFk
   */
  PrcDocumentTypeFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * Url
   */
  Url?: string | null;
}
