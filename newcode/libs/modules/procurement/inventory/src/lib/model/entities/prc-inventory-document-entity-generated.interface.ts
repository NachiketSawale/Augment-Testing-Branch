/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IPrcInventoryHeaderEntity } from './prc-inventory-header-entity.interface';

export interface IPrcInventoryDocumentEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate: string;

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
   * PrcInventoryHeaderEntity
   */
  PrcInventoryHeaderEntity?: IPrcInventoryHeaderEntity | null;

  /**
   * PrcInventoryHeaderFk
   */
  PrcInventoryHeaderFk: number;
}
