/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IRequisitionDocumentEntityGenerated extends IEntityBase {

  /**
   * Barcode
   */
  Barcode?: string | null;

  /**
   * Date
   */
  Date: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

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
   * RequisitionFk
   */
  RequisitionFk: number;

  /**
   * Url
   */
  Url?: string | null;
}
