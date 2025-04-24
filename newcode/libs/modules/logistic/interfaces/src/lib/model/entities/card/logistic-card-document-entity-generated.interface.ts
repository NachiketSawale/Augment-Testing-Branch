/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ILogisticCardDocumentEntityGenerated extends IEntityBase {

/*
 * Barcode
 */
  Barcode?: string | null;

/*
 * Date
 */
  Date: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk: number;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * JobCardDocTypeFk
 */
  JobCardDocTypeFk: number;

/*
 * JobCardFk
 */
  JobCardFk: number;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;

/*
 * Url
 */
  Url?: string | null;
}
