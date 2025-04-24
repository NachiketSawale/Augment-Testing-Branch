/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEmployeeDocumentEntityGenerated extends IEntityBase {

  /**
   * Barcode
   */
  Barcode?: string | null;

  /**
   * Date
   */
  Date?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk: number;

  /**
   * EmployeeDocumentTypeFk
   */
  EmployeeDocumentTypeFk: number;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * FileArchiveDocFk
   */
  FileArchiveDocFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsHiddenInPublicApi
   */
  IsHiddenInPublicApi: boolean;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * Url
   */
  Url?: string | null;
}
