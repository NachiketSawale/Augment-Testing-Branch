/*
 * Copyright(c) RIB Software GmbH
 */

import { IBlobStringEntity } from '@libs/basics/shared';
import { IEntityBase } from '@libs/platform/common';

export interface IActivityEntityGenerated extends IEntityBase {

  /**
   * ActivityDate
   */
  ActivityDate?: Date | string | null;

  /**
   * ActivityTypeFk
   */
  ActivityTypeFk: number;

  /**
   * BlobsFk
   */
  BlobsFk?: number | null;

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
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk?: number | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

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
   * FromDate
   */
  FromDate?: Date | string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsFinished
   */
  IsFinished: boolean;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ReminderCycleFk
   */
  ReminderCycleFk?: number | null;

  /**
   * ReminderEndDate
   */
  ReminderEndDate?: Date | string | null;

  /**
   * ReminderFrequency
   */
  ReminderFrequency?: number | null;

  /**
   * ReminderNextDate
   */
  ReminderNextDate?: Date | string | null;

  /**
   * ReminderStartDate
   */
  ReminderStartDate?: Date | string | null;

  /**
   * TextBlob
   */
  TextBlob?: IBlobStringEntity | null;
}
