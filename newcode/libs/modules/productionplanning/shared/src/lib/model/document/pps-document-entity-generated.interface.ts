/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsDocumentEntityGenerated extends IEntityBase {

/*
 * Barcode
 */
  Barcode?: string | null;

/*
 * CanDownload
 */
  CanDownload?: boolean | null;

/*
 * CanUpload
 */
  CanUpload?: boolean | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DbId
 */
  DbId?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk: number;

/*
 * EngDrawingFk
 */
  EngDrawingFk?: number | null;

/*
 * EngDrwRevisionFk
 */
  EngDrwRevisionFk?: number | null;

/*
 * EngTaskFk
 */
  EngTaskFk?: number | null;

/*
 * EngTmplRevisionFk
 */
  EngTmplRevisionFk?: number | null;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk?: number | null;

/*
 * FullName
 */
  FullName?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * ItemFk
 */
  ItemFk?: number | null;

/*
 * MntActivityFk
 */
  MntActivityFk?: number | null;

/*
 * MntReportFk
 */
  MntReportFk?: number | null;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;

/*
 * PpsDocumentTypeFk
 */
  PpsDocumentTypeFk?: number | null;

/*
 * PpsItemFk
 */
  PpsItemFk?: number | null;

/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;

/*
 * ProductDescriptionFk
 */
  ProductDescriptionFk?: number | null;

/*
 * Revision
 */
  Revision: number;
}
