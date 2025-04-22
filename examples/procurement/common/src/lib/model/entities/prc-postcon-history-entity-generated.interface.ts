/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcPostconHistoryEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerName1
   */
  BusinessPartnerName1?: string | null;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk?: number | null;

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
   * PrcCommunicationChannelFk
   */
  PrcCommunicationChannelFk: number;

  /**
   * PrjDocumentDescription
   */
  PrjDocumentDescription?: string | null;

  /**
   * PrjDocumentFk
   */
  PrjDocumentFk: number;

  /**
   * PrjDocumentTypeFk
   */
  PrjDocumentTypeFk?: number | null;

  /**
   * PrjProjectFk
   */
  PrjProjectFk?: number | null;

  /**
   * ProjectName
   */
  ProjectName?: string | null;

  /**
   * ProjectNo
   */
  ProjectNo?: string | null;
}
