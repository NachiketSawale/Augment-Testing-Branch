/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IAgreementEntityGenerated extends IEntityBase {

  /**
   * AgreementTypeFk
   */
  AgreementTypeFk: number;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CanDownload
   */
  CanDownload: boolean;

  /**
   * CanUpload
   */
  CanUpload: boolean;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate?: Date | string | null;

  /**
   * DocumentName
   */
  DocumentName?: string | null;

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
   * Reference
   */
  Reference?: string | null;

  /**
   * ReferenceDate
   */
  ReferenceDate: Date | string;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: Date | string | null;

  /**
   * ValidTo
   */
  ValidTo?: Date | string | null;
}
