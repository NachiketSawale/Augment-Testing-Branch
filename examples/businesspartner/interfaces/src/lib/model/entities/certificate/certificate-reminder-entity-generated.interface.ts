/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICertificateReminderEntityGenerated extends IEntityBase {

  /**
   * BatchDate
   */
  BatchDate: Date | string;

  /**
   * BatchId
   */
  BatchId: string;

  /**
   * CertificateFk
   */
  CertificateFk: number;

  /**
   * CertificateStatusFk
   */
  CertificateStatusFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Telefax
   */
  Telefax?: string | null;
}
