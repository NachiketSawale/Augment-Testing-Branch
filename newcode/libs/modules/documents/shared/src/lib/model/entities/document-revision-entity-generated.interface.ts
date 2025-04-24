/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IDocumentRevisionEntityGenerated extends IEntityBase {
  /*
   * DocumentTypeFk
   */
  DocumentTypeFk:number | null;
/*
 * Barcode
 */
  Barcode?: string | null;

/*
 * CanWriteStatus
 */
  CanWriteStatus?: boolean | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DatengutFileId
 */
  DatengutFileId?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk?: number | null;

/*
 * FileSize
 */
  FileSize?: string | null;

/*
 * FileSizeInByte
 */
  FileSizeInByte?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * ItwoSiteId
 */
  ItwoSiteId?: number | null;

/*
 * JobLoggingMessage
 */
  JobLoggingMessage?: string | null;

/*
 * ModelJobState
 */
  ModelJobState?: number | null;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;

/*
 * PreviewModelFk
 */
  PreviewModelFk?: number | null;

/*
 * PrjDocumentFk
 */
  PrjDocumentFk?: number | null;

/*
 * Revision
 */
  Revision?: number | null;
}
