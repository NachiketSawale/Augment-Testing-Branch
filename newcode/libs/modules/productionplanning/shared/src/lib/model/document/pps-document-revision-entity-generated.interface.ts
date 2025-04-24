/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsDocumentRevisionEntityGenerated extends IEntityBase {

/*
 * Barcode
 */
  Barcode?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk?: number | null;

/*
 * EngDrwRevisionFk
 */
  EngDrwRevisionFk?: number | null;

/*
 * EngTmplRevisionFk
 */
  EngTmplRevisionFk?: number | null;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;

/*
 * PpsDocumentFk
 */
  PpsDocumentFk: number;

/*
 * Revision
 */
  Revision: number;
}
