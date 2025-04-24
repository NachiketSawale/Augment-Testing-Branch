/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrrHeaderEntity } from './prr-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrrDocumentEntityGenerated extends IEntityBase {

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
   * Id
   */
  Id: number;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * PrrHeaderEntity
   */
  PrrHeaderEntity?: IPrrHeaderEntity | null;

  /**
   * PrrHeaderFk
   */
  PrrHeaderFk: number;
}
